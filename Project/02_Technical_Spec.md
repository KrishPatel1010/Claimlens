# Technical Architecture & Implementation Spec

Companion document to 01_FRD.md. This defines *what* each component must do, *what data* flows between them, and the confirmed implementation stack below.

---

## 0. Confirmed Tech Stack

| Layer | Choice | Role |
|---|---|---|
| Frontend | Next.js | Video URL input, timestamped claim ledger UI, embedded video player |
| Backend | Express (REST API) | Runs the Stage 1–7 pipeline; exposes endpoints the Next.js frontend calls |
| Structured storage | Supabase (Postgres) + Drizzle ORM | Source of truth for videos/claims/evidence/verdicts — what the UI renders from |
| Hot cache | Redis | Dedup layer: skip a live API call if the same claim/query was already answered; optional job queue (e.g., BullMQ) for streaming pipeline progress to the UI |
| Repo cache | `/data/cache/*.json` (flat files, committed to git) | Raw, untouched API responses — the judge-reviewable evidence trail |

**Four storage locations, four different jobs — never collapse them:**
1. **Redis** — "have I already answered this exact query right now?" (fast, ephemeral)
2. **Supabase** — the structured, queryable data the app actually runs on
3. **`/data/cache/`** — permanent raw proof of what each external API actually returned, for judges
4. **External APIs** (SerpApi + Fact Check Tools API) — only called when all three of the above miss

See §9 for the write-through rule and the finalized schema.

---

## 1. Pipeline Overview

```
YouTube URL
   │
   ▼
[Stage 1] Transcript Fetch  ──► SerpApi: youtube_video_transcript
   │
   ▼
[Stage 2] Claim Extraction  ──► LLM: pull discrete, checkable claims + timestamps
   │
   ▼
[Stage 3] Claim Classification ──► LLM or rules: Health / Financial / General
   │
   ▼
[Stage 4] Fact Check Lookup ──► Google Fact Check Tools API (claims:search)
   │             │
   │      match found?
   │        /        \
   │      YES          NO
   │       │            │
   │       ▼            ▼
   │  Use verdict   [Stage 5] SerpApi Grounding
   │  directly       (engine chosen by claim type)
   │       │            │
   │       └─────┬──────┘
   │             ▼
   │      [Stage 6] Scoring
   │             │
   │             ▼
   │      [Stage 7] Output: timestamped claim ledger
   ▼
Cache every raw response at each stage to disk, keyed by claim/video ID
```

## 2. Data Models

### 2.1 Claim object
```json
{
  "claim_id": "string",
  "video_id": "string",
  "timestamp_seconds": 154,
  "raw_text": "Turmeric cures diabetes within 30 days",
  "category": "health | financial | general",
  "status": "pending | resolved"
}
```

### 2.2 Evidence object
```json
{
  "claim_id": "string",
  "source_type": "fact_check_api | serpapi_scholar | serpapi_finance | serpapi_search",
  "source_url": "string",
  "source_domain": "string",
  "source_authority_score": 0.0,
  "matched_text": "string",
  "grounding_similarity": 0.0,
  "raw_response_cache_path": "string"
}
```

### 2.3 Verdict object
```json
{
  "claim_id": "string",
  "trust_score": 0.0,
  "confidence_label": "High Confidence | Contested | Unverified",
  "verified_claim_text": "string",
  "conflicting_claims": ["string"],
  "evidence": ["Evidence object", "..."]
}
```

## 3. API Integration Details

### 3.1 SerpApi — YouTube Video Transcript API (Stage 1)
- Engine: `youtube_video_transcript`
- Input: video ID parsed from the submitted URL
- Output needed: full transcript segments, each with start-time offset
- Cost: 1 credit per video

### 3.2 Google Fact Check Tools API (Stage 4) — NOT SerpApi, separate free quota
- Endpoint: `https://factchecktools.googleapis.com/v1alpha1/claims:search`
- Auth: free Google Cloud API key (separate from SerpApi key)
- Input: claim text as query string
- Output needed: `claimReview` array — publisher name, verdict (`textualRating`), review URL
- Cost: $0, does not touch SerpApi's 250-credit budget

### 3.3 SerpApi — Google Scholar API (Stage 5, health claims)
- Engine: `google_scholar`
- Input: extracted core subject of the health claim (e.g., "turmeric diabetes clinical trial")
- Output needed: organic results — title, snippet, publication, link
- Cost: 1 credit per lookup

### 3.4 SerpApi — Google Finance API (Stage 5, financial claims)
- Engine: `google_finance`
- Input: the named stock/asset ticker or entity extracted from the claim
- Output needed: current price, historical trend data to check prediction plausibility
- Cost: 1 credit per lookup

### 3.5 SerpApi — Google Search API (Stage 5, general fallback + grounding)
- Engine: `google`
- Input: the claim text as a natural-language query
- Output needed: organic results for grounding comparison
- Cost: 1 credit per lookup (2 if an AI Overview follow-up is also needed — avoid this path unless specifically useful, to conserve budget)

## 4. Scoring Algorithm

### 4.1 Grounding Score (0–1)
Semantic similarity between the claim text and the best-matching sentence in the retrieved evidence source. Use an LLM-based comparison for v1 ("does this source support, contradict, or not address this claim — score 0 to 1") rather than building a custom similarity model. This is the recommended default per the earlier Layer 3 discussion — upgrade to an embedding model only if time remains.

### 4.2 Source Authority Score
Applied by domain tier:
- Fact Check API verdict from a recognized fact-checking org → **1.0**
- Government / official / peer-reviewed academic domain → **1.0**
- Established news or reference publisher → **0.7**
- Other indexed website → **0.4**
- No source / no citation → **0.1**

### 4.3 Trust Score
```
Trust Score = Grounding Score × Source Authority Score
```

### 4.4 Confidence Label logic
- **High Confidence** — two or more independently-sourced Trust Scores ≥ 0.7 agree on the same claim
- **Contested** — sources disagree, and at least one has a meaningfully higher Trust Score than the others → surface the highest-scoring claim as the likely-correct version, but show the disagreement
- **Unverified** — no source produces a Trust Score above a low threshold (e.g., 0.3) — system explicitly declines to assert an answer

## 5. Claim Matching (Fact Check API ↔ extracted claim)

**v1 approach (build this first):** Pass both the extracted claim and each candidate Fact Check API result to an LLM and ask directly whether they refer to the same underlying fact, and if so, whether they agree. This requires no additional infrastructure and is sufficient for a working demo.

**v2 optional upgrade (only if time remains):** Replace the LLM matching step with a local sentence-embedding model to cluster/match claims by cosine similarity. This is a "nice to have" for demonstrating deeper custom engineering — not required for a functioning submission. Do not start this until FR-1 through FR-10 in the FRD are fully working end to end.

## 6. SerpApi Credit Budget Plan

Total available: 250 credits/month (free tier).

| Phase | Allocation | Notes |
|---|---|---|
| Development & debugging | ~120 credits | Expect wasted calls while iterating — normal |
| Pre-screening candidate demo videos | ~20 credits | Cheap 1-credit searches to confirm a video's claims are checkable/interesting before full processing |
| Final curated demo dataset | ~110 credits | ~15–20 fully processed claims across ~10 videos |

**Mandatory practice:** cache every raw API response immediately, the moment it's received — see §9 for the exact write-through order across Redis, Supabase, and disk. Never re-fetch a claim already in the cache. The demo and the live app UI should both read from cache first and only call live APIs for genuinely new videos.

Redis dedup should key on a **normalized version of the claim text**, not just video ID — the same claim ("turmeric cures diabetes") appearing in two different videos should only ever cost one SerpApi/Fact Check API call, not two. This directly protects the 250-credit budget.

## 7. Error Handling Requirements

- No transcript available for a video → show a clear "cannot process this video" message, do not fail silently
- Claim extraction returns zero claims → show "no checkable factual claims found," not an empty broken screen
- Fact Check API and SerpApi both return nothing for a claim → label **Unverified**, never guess
- API call fails/times out → retry once, then fall back to Unverified with a visible "source unavailable" note

## 8. Repository Structure Recommendation (for judge reviewability)

```
/apps/web/                → Next.js frontend
/apps/api/                → Express backend (Stage 1–7 pipeline)
/apps/api/src/pipeline/   → stages 1–7 implementation
/apps/api/src/scoring/    → scoring formulas (§4 of this doc)
/apps/api/src/cache/      → Redis client + write-through cache logic (§9)
/apps/api/src/db/         → Drizzle schema + Supabase client (§9)
/data/cache/               → every raw cached API response, per claim ID (committed to git)
/data/demo-videos.json     → curated list of demo video IDs + why each was chosen
/README.md                 → setup instructions + which SerpApi products are used and why
```

Keeping raw cached responses in the repo (not just derived scores in Supabase) is what lets a judge verify the "meaningful SerpApi usage" criterion directly from the repository, per the hackathon rules — Supabase alone isn't inspectable by a judge without running the app, but committed JSON files are.

## 9. Data Storage Architecture & Write-Through Rule

### 9.1 Write-through order (every external API call follows this sequence)

```
1. Check Redis   → hit? return cached result, done (0 additional cost)
2. Check Supabase → hit? return stored record, done (0 additional cost)
3. Call external API (SerpApi or Fact Check Tools API)
4. Write raw response → /data/cache/{claim_id}_{source_type}.json
5. Write structured row → Supabase (evidence table, with raw_response_cache_path pointing to step 4's file)
6. Set in Redis → keyed by normalized claim text, for fast future dedup
```

Redis is always a cache *of* Supabase + raw lookups — never the only copy of anything. If Redis is cleared, nothing is lost; Supabase and `/data/cache/` remain the source of truth.

### 9.2 Drizzle schema (Supabase / Postgres)

```ts
// videos
export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  youtubeUrl: text('youtube_url').notNull(),
  youtubeVideoId: text('youtube_video_id').notNull().unique(),
  title: text('title'),
  processedAt: timestamp('processed_at'),
});

// claims
export const claimCategory = pgEnum('claim_category', ['health', 'financial', 'general']);
export const claimStatus = pgEnum('claim_status', ['pending', 'resolved']);

export const claims = pgTable('claims', {
  id: uuid('id').primaryKey().defaultRandom(),
  videoId: uuid('video_id').references(() => videos.id).notNull(),
  timestampSeconds: integer('timestamp_seconds').notNull(),
  rawText: text('raw_text').notNull(),
  category: claimCategory('category').notNull(),
  status: claimStatus('status').notNull().default('pending'),
});

// evidence
export const sourceType = pgEnum('source_type', [
  'fact_check_api', 'serpapi_scholar', 'serpapi_finance', 'serpapi_search',
]);

export const evidence = pgTable('evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  claimId: uuid('claim_id').references(() => claims.id).notNull(),
  sourceType: sourceType('source_type').notNull(),
  sourceUrl: text('source_url'),
  sourceDomain: text('source_domain'),
  sourceAuthorityScore: real('source_authority_score').notNull(),
  matchedText: text('matched_text'),
  groundingSimilarity: real('grounding_similarity').notNull(),
  rawResponseCachePath: text('raw_response_cache_path').notNull(), // → /data/cache/*.json
});

// verdicts
export const confidenceLabel = pgEnum('confidence_label', [
  'high_confidence', 'contested', 'unverified',
]);

export const verdicts = pgTable('verdicts', {
  id: uuid('id').primaryKey().defaultRandom(),
  claimId: uuid('claim_id').references(() => claims.id).notNull().unique(),
  trustScore: real('trust_score').notNull(),
  confidenceLabel: confidenceLabel('confidence_label').notNull(),
  verifiedClaimText: text('verified_claim_text'),
  conflictingClaims: jsonb('conflicting_claims').$type<string[]>(),
});
```

This maps 1:1 onto the Claim / Evidence / Verdict objects in §2 — same fields, now with a proper relational home. `rawResponseCachePath` on the evidence row is the critical link: it lets any Supabase record be traced back to the exact committed file a judge can open, keeping the database and the repo evidence trail in sync.

### 9.3 Redis key design

- Dedup key: `claim:{normalized_claim_text_hash}` → cached Trust Score + verdict, TTL optional (data doesn't go stale during a 2-week hackathon)
- Optional job queue (BullMQ): one queue per video being processed, one job per claim, so the Next.js frontend can poll/stream per-claim progress instead of waiting on one long request
