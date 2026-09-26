# Phase 5 Implementation Plan: Curated Demo Dataset, SerpApi Evidence Auditing & Submission Readiness

Complete the final pre-submission phase for the SerpApi India Hackathon 2026 (Track: Knowledge & Public Interest). This phase audits and solidifies the curated demo dataset, verifies raw external API response payloads committed to `/data/cache/`, structures a timed 3-minute video recording script, and executes the formal submission checklist.

---

## 1. Demo Dataset & Outcome Mix Validation

Ensure the curated dataset satisfies all conditions from Section 2 of `Project/03_Demo_and_Submission_Plan.md`:

| Requirement | Video ID | Verified Claim Example | Verdict Outcome | Resolution Path |
|---|---|---|---|---|
| **High Confidence** | `sample-factcheck-01` | "Vaccines undergo multi-phase clinical safety trials..." | High Confidence (0.98) | Google Fact Check Tools API |
| **High Confidence** | `sample-health-01` | "Daily 30-minute brisk walking improves insulin sensitivity..." | High Confidence (0.92) | SerpApi Google Scholar |
| **Contested** | `sample-health-01` | "Drinking fenugreek seed water completely eliminates insulin..." | Contested (0.28) | SerpApi Google Scholar (Dispute surfaced) |
| **Contested** | `sample-factcheck-01` | "Drinking boiled lemon water and baking soda alkalizes blood pH..." | Contested (0.15) | Google Fact Check Tools API (Snopes/AFP) |
| **Unverified** | `sample-finance-01` | "This small-cap semiconductor ETF has guaranteed 1000% return..." | Unverified (0.12) | SerpApi Google Finance (Declines to assert) |

---

## 2. Committed Evidence Audit

Verify that all raw external API payloads exist in [`data/cache/`](file:///c:/Users/krish/Claimlens/data/cache/) and [`backend/data/cache/`](file:///c:/Users/krish/Claimlens/backend/data/cache/):
- `clm_h01_01_google_scholar.json` (SerpApi Scholar meta-analysis)
- `clm_h01_02_google_scholar.json` (SerpApi Scholar clinical evaluation)
- `clm_h01_03_google_scholar.json` (SerpApi Scholar exercise trials)
- `clm_f01_01_google_finance.json` (SerpApi Finance ETF disclaimer)
- `clm_f01_02_google_finance.json` (SerpApi Finance historical returns)
- `clm_fc01_01_google_fact_check.json` (Google Fact Check AFP review)
- `clm_fc01_02_google_fact_check.json` (Google Fact Check WHO trials review)

---

## 3. Demo Video Script & Walkthrough Timing (Under 3 Minutes)

Structure the exact screen recording sequence per hackathon rules:

| Timestamp | Screen State / Audio Narration | Key Visual Elements |
|---|---|---|
| **0:00 – 0:25** | **The Problem:** Viral health & financial misinformation on YouTube reaches millions before fact-checkers see it. | App Header, Hackathon Track Badge, problem tagline. |
| **0:25 – 0:55** | **Live Ingestion:** Paste YouTube URL, show 7-stage pipeline progress indicator (Transcript $\rightarrow$ Claim Extraction $\rightarrow$ Fact Check $\rightarrow$ Grounding $\rightarrow$ Scoring). | VideoInputBar with pipeline loading animation. |
| **0:55 – 1:35** | **High Confidence vs. Contested:** Click `sample-health-01`. Expand fenugreek claim showing side-by-side dispute with PubMed/Scholar. Click brisk walking showing consensus. | ClaimLedger, Verdict Badges, EvidenceDrawer with citation links. |
| **1:35 – 2:10** | **Unverified Case & Financial Safety:** Click `sample-finance-01`. Show the 1000% guaranteed stock return flagged as Unverified (system declines to hallucinate an answer). | Coral Unverified badge, Google Finance grounding note. |
| **2:10 – 2:40** | **Audit Mode & 4-Tier Cache:** Click "Audit Math" on a claim to show Trust Score formula and zero-credit cache tier proof. Point out committed `/data/cache/*.json` files. | AuditModal, formula breakdown, disk cache path chips. |
| **2:40 – 3:00** | **Value Proposition & Wrap:** Viewers get an evidence-backed trust check in seconds; 250 SerpApi monthly budget preserved via 4-tier caching. | VideoTrustSummary strip, Footer attributions. |

---

## 4. Official Submission Checklist

- [ ] Public GitHub repository with clean structure and documentation.
- [ ] Root `README.md` documents all SerpApi engines used and reasons.
- [ ] `/data/cache/` flat JSON files committed so judges can inspect raw responses without databases.
- [ ] Track explicitly selected: **Knowledge & Public Interest**.
- [ ] Video recording under 3 minutes uploaded as unlisted YouTube or shareable Google Drive link (tested in incognito window).
- [ ] AI development tools disclosed honestly.
