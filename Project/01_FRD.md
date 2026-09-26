# Functional Requirements Document (FRD)

**Project (working title):** ClaimLens — YouTube Health & Finance Claim Verifier
**Event:** SerpApi India Hackathon 2026
**Track:** Knowledge & Public Interest
**Document owner:** Krish
**Version:** 1.0
**Status:** Ready for build

---

## 1. Executive Summary

ClaimLens takes a YouTube video URL and produces a timestamped, evidence-backed verdict on every factual health or financial claim made in the video. It combines SerpApi's YouTube Transcript, Scholar, Finance, and Search engines with Google's free Fact Check Tools API to answer one question a viewer cannot easily answer themselves: **"Is what this video just told me actually true?"**

The output is not a search-results dump. It is a scored, evidence-linked verdict — High Confidence / Contested / Unverified — attached to the exact moment in the video where the claim was made.

---

## 2. Problem Statement

Viral YouTube videos routinely make unverified or false claims — "this herb cures diabetes," "this stock will 10x by next year" — and reach millions of viewers before any professional fact-checker reviews them. Ordinary viewers have no practical way to check these claims in the moment; doing so manually means pausing the video, searching each claim by hand, and judging source credibility themselves. Nobody does this. The result is unchecked health and financial misinformation spreading at scale.

## 3. Goals & Objectives

| Goal | How it's measured |
|---|---|
| Verify factual claims in a YouTube video automatically | Every extracted claim receives a verdict with cited evidence |
| Make the tool genuinely useful, not just a demo | A viewer can paste any reasonably factual video and get a usable result |
| Make SerpApi materially load-bearing | Every verdict traces back to a SerpApi response, per the hackathon's "meaningful usage" rule |
| Stay inside the free-tier budget | Full build + demo dataset must fit within 250 SerpApi credits |
| Win Best in Track (Knowledge & Public Interest) at minimum | Track currently has zero showcased competitors — see prior competitive analysis |

## 4. Target Users

- **Primary:** An Indian YouTube viewer who watches health/wellness or personal-finance content and wants a fast trust check before acting on advice.
- **Secondary (framing for judges):** Journalists, students, and researchers doing quick claim verification as part of their work.

## 5. Scope

### 5.1 In scope (must exist for submission)
- Accept a YouTube video URL as input
- Retrieve the full transcript with timestamps
- Extract discrete, checkable factual claims from the transcript (health and financial claims prioritized)
- For each claim:
  - Check Google Fact Check Tools API first for an existing professional verdict
  - If none found, ground the claim using SerpApi (Scholar for health claims, Finance for financial claims, Search as general fallback)
  - Compute a Trust Score and assign a confidence label (High Confidence / Contested / Unverified)
- Display results as a timestamped claim ledger tied to the video
- Cache every SerpApi and Fact Check API response locally so the demo runs with zero live API calls

### 5.2 Out of scope (explicitly not built for the hackathon deadline)
- Real-time / live-stream claim checking
- Claims in languages other than English and Hindi (Hindi is a stretch goal, not required)
- User accounts, login, or saved history
- Claims outside health and finance categories (general claims fall back to a lower-confidence generic check only, not a priority)
- Mobile app — a web page/interface is sufficient
- The optional embedding-based claim-matching upgrade (see Technical Spec §5) — build with LLM-based matching first; only add if time remains

## 6. User Stories

1. *As a viewer*, I paste a YouTube link into the tool and see a list of claims made in the video, each marked trustworthy, contested, or unverified, so I can decide whether to trust the video's advice.
2. *As a viewer*, I click a flagged claim and see exactly what source disagrees with it and why, so I understand the disagreement instead of just seeing a red flag.
3. *As a judge evaluating the submission*, I can see, for any claim, the exact SerpApi (or Fact Check API) response that produced the verdict, so the "meaningful SerpApi usage" requirement is verifiably satisfied.

## 7. Functional Requirements

Priority key: **P0** = required for a valid submission, **P1** = strongly improves scoring, **P2** = nice to have if time remains.

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | System accepts a YouTube URL and validates it before processing | P0 |
| FR-2 | System retrieves the video transcript with timestamps via SerpApi's YouTube Video Transcript API | P0 |
| FR-3 | System extracts a list of discrete factual claims from the transcript, each linked to its timestamp | P0 |
| FR-4 | System classifies each claim as Health, Financial, or General | P0 |
| FR-5 | For each claim, system queries Google Fact Check Tools API first | P0 |
| FR-6 | If no Fact Check API match, system grounds the claim via the appropriate SerpApi engine (Scholar / Finance / Search) | P0 |
| FR-7 | System computes a Grounding Score, Source Authority Score, and combined Trust Score per claim (see Technical Spec §4) | P0 |
| FR-8 | System assigns a confidence label per claim: High Confidence / Contested / Unverified | P0 |
| FR-9 | System displays results as a timestamped ledger the user can scan against the video | P0 |
| FR-10 | System caches every external API response so re-running a processed video costs zero additional API credits | P0 |
| FR-11 | System shows, per claim, the specific source(s) used and a one-line reason for the verdict | P1 |
| FR-12 | System allows clicking a timestamp to jump to that point in the embedded video | P1 |
| FR-13 | System displays an overall video-level summary (e.g., "6 claims checked — 2 unverified") | P1 |
| FR-14 | System supports a small pre-loaded demo set of videos for offline/no-credit demoing | P1 |
| FR-15 | System supports Hindi-language transcripts | P2 |
| FR-16 | System upgrades claim matching from LLM-based to embedding-based similarity | P2 |

## 8. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | Total SerpApi credit usage across development + final demo dataset must not exceed 250 credits (see API budget in Technical Spec §6) |
| NFR-2 | The demo video must run entirely off cached data — no live API calls during recording or judging |
| NFR-3 | Processing a new (uncached) video should complete in a reasonable time for a live walkthrough (target: under 60 seconds per video, excluding claim-extraction model latency) |
| NFR-4 | The system must degrade gracefully when a claim cannot be grounded (label it Unverified, never fabricate a verdict) |
| NFR-5 | All source attributions shown to the user must be real, traceable links — never a fabricated citation |

## 9. Success Metrics / Acceptance Criteria

A build is considered demo-ready when:
- [ ] At least 10 pre-processed videos exist in the cached demo set, spanning health and finance content
- [ ] At least 2 of those videos contain a claim that resolves to **Contested** or **Unverified** (a demo with only "everything checks out" is not compelling)
- [ ] At least 1 claim resolves via the Fact Check Tools API path (proves that integration works)
- [ ] At least 1 claim resolves via the SerpApi grounding fallback path (proves that integration works)
- [ ] The 3-minute demo video shows both an agreement case and a flagged/contradicted case
- [ ] Every verdict shown in the demo can be traced back to a cached raw API response in the repo

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Claim extraction misses claims or extracts non-claims (opinions, filler) | Constrain extraction prompt to only factual/numerical/checkable statements; manually review the curated demo set before recording |
| Chosen demo videos don't actually contain false/contested claims | Pre-screen candidate videos cheaply (1 credit search) before spending the full grounding budget on them |
| SerpApi credit budget runs out before demo set is finished | Follow the phased budget in Technical Spec §6 — dev/test spend capped, final dataset spend reserved separately |
| Fact Check Tools API has no coverage for niche Indian-language claims | This is expected and acceptable — system falls through to the SerpApi grounding path in that case, which is the designed behavior, not a failure |

## 11. Track & Submission Alignment

- **Track:** Knowledge & Public Interest (news literacy / accessibility category — explicitly named in the track description, currently zero showcased competitors)
- **Meaningful SerpApi usage:** YouTube Transcript API supplies the raw claims; Scholar/Finance/Search APIs supply the grounding evidence. Every verdict is traceable to a specific cached SerpApi response — this is the core deliverable, not an add-on.
- **Disclosure requirements to prepare for submission form:** list AI tools used in development, confirm this is a new project built for the hackathon (unless stated otherwise), select Knowledge & Public Interest as the track.

## 12. Open Questions for the Builder

- Final product name (working title "ClaimLens" — placeholder, rename freely)
- Whether to support Hindi transcripts (P2 — decide based on time remaining)
- Exact UI framework/stack — intentionally not specified in this FRD; see Technical Spec for API/data contracts only, implementation stack is the builder's choice
