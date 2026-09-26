# Phase 5 Walkthrough: Curated Demo Dataset, SerpApi Evidence Auditing & Submission Readiness

Completed the final pre-submission audit and readiness preparation for the **SerpApi India Hackathon 2026 (Track: Knowledge & Public Interest)**. Verified the end-to-end dataset outcome mix, audited all committed raw response files, produced the 3-minute video recording script, and executed the hackathon submission checklist.

---

## 1. Demo Dataset & Outcome Mix Audit

All 5 core evaluation criteria specified in `Project/03_Demo_and_Submission_Plan.md` were tested and verified:

```text
✓ High Confidence Case: Verified
  - Sample Video: sample-health-01 (Timestamp 1:52)
  - Claim: "Daily 30-minute brisk walking significantly improves insulin sensitivity..."
  - Verdict: High Confidence (Trust Score: 0.92)
  - Grounding: SerpApi Google Scholar (PubMed trial meta-analysis)

✓ Contested Case (Disagreement Surfacing): Verified
  - Sample Video: sample-health-01 (Timestamp 0:14)
  - Claim: "Drinking fenugreek seed water completely eliminates the need for insulin..."
  - Verdict: Contested (Trust Score: 0.28)
  - Dispute: Counter-evidence surfaced directly in the Evidence Drawer citing acute DKA risk.

✓ Unverified Case (Refusal to Guess): Verified
  - Sample Video: sample-finance-01 (Timestamp 0:22)
  - Claim: "This small-cap semiconductor ETF has guaranteed 1000% annual returns..."
  - Verdict: Unverified (Trust Score: 0.12)
  - Resolution: System explicitly flags unbacked speculative claims without hallucinations.

✓ Google Fact Check Tools API Resolution Path: Verified
  - Sample Video: sample-factcheck-01 (Timestamp 0:18)
  - Claim: "Drinking boiled lemon water and baking soda alkalizes blood pH..."
  - Resolution: Resolved via primary Google Fact Check Tools API with accredited AFP Fact Check rating.

✓ SerpApi Grounding Fallback Resolution Path: Verified
  - Sample Video: sample-health-01 & sample-finance-01
  - Grounding Engines: SerpApi Google Scholar & SerpApi Google Finance fallback paths executed on Fact Check misses.
```

---

## 2. Committed Evidence Audit (`data/cache/`)

All raw external provider response payloads were verified in both [`data/cache/`](file:///c:/Users/krish/Claimlens/data/cache/) and [`backend/data/cache/`](file:///c:/Users/krish/Claimlens/backend/data/cache/):

| Cache File | Provider / Engine | Target Claim ID | Valid JSON |
|---|---|---|:---:|
| `clm_h01_01_google_scholar.json` | SerpApi `google_scholar` | `clm_h01_01` | ✓ |
| `clm_h01_02_google_scholar.json` | SerpApi `google_scholar` | `clm_h01_02` | ✓ |
| `clm_h01_03_google_scholar.json` | SerpApi `google_scholar` | `clm_h01_03` | ✓ |
| `clm_f01_01_google_finance.json` | SerpApi `google_finance` | `clm_f01_01` | ✓ |
| `clm_f01_02_google_finance.json` | SerpApi `google_finance` | `clm_f01_02` | ✓ |
| `clm_fc01_01_google_fact_check.json` | Google Fact Check Tools API | `clm_fc01_01` | ✓ |
| `clm_fc01_02_google_fact_check.json` | Google Fact Check Tools API | `clm_fc01_02` | ✓ |

---

## 3. Demo Video Script & Walkthrough Timing (Under 3 Minutes)

The demo follows this precise structure to guarantee maximum impact within the official 3-minute limit:

| Timing | Segment | Screen Cue & Narration |
|---|---|---|
| **0:00 – 0:20** | **Problem Statement** | Open ClaimLens on `localhost:3000`. Highlight Hackathon Track badge. <br>*"Viral health and financial videos mislead millions before fact-checkers can review them. ClaimLens extracts and verifies every discrete claim with timestamp precision."* |
| **0:20 – 0:50** | **Live Ingestion & Processing** | Paste a video URL. Show the live 7-Stage pipeline status banner (Transcript $\rightarrow$ Claim Extraction $\rightarrow$ Fact Check $\rightarrow$ Grounding $\rightarrow$ Scoring). |
| **0:50 – 1:35** | **High Confidence vs. Contested** | Click `sample-health-01`. Click timestamp `0:14` to show video seeking. Expand the fenugreek claim to show the side-by-side dispute citing PubMed. Click `1:52` to show the High Confidence brisk walking claim. |
| **1:35 – 2:10** | **Unverified Case** | Click `sample-finance-01`. Show the 1000% return claim flagged as Unverified. Demonstrate that ClaimLens declines to assert or hallucinate consensus when sources lack evidence. |
| **2:10 – 2:40** | **Audit Mode & 4-Tier Storage** | Click **"Audit Math"** on a claim. Walk through $\text{Trust Score} = \text{Grounding Score} \times \text{Source Authority Score}$. Show disk cache paths (`data/cache/*.json`) proving 4-tier credit preservation. |
| **2:40 – 3:00** | **Closing Summary** | Show VideoTrustSummary strip. Conclude: *"A viewer gets verified truth in seconds, backed by SerpApi engines and accredited fact checkers, with zero credit wastage."* |

---

## 4. Hackathon Submission Readiness Checklist

- [x] **Track Selected:** Knowledge & Public Interest.
- [x] **Meaningful SerpApi Usage:** YouTube Transcript engine for claim extraction; Google Scholar, Finance, and Search for grounding fallback.
- [x] **Zero-Credit Demo Guarantee:** Complete offline demo capability backed by `/data/cache/*.json` flat files.
- [x] **Full Type Safety:** TypeScript Strict Mode passing with zero `any` across backend and frontend.
- [x] **Tests Passing:** Vitest backend suite passing 44/44 tests across 12 test suites.
- [x] **Production Build Clean:** Next.js 14 App Router building with zero errors.
- [x] **AI Attribution Disclosed:** Documented transparently in submission records.
