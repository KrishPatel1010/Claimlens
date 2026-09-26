# ClaimLens — YouTube Health & Finance Claim Verifier

[![SerpApi Hackathon 2026](https://img.shields.io/badge/SerpApi%20India%20Hackathon-2026-blue.svg)](https://serpapi.com)
[![Track](https://img.shields.io/badge/Track-Knowledge%20%26%20Public%20Interest-green.svg)](https://serpapi.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Zero--Any-blue.svg)](https://www.typescriptlang.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Mermaid%20C4-purple.svg)](./docs/architecture/README.md)

ClaimLens takes a YouTube video URL and produces a timestamped, evidence-backed verdict on every factual health or financial claim made in the video.

It combines **SerpApi's YouTube Transcript, Scholar, Finance, and Search engines** with **Google's Fact Check Tools API** to answer one critical question: **"Is what this video just told me actually true?"**

---

## Demo Video Walkthrough

> **Hackathon Submission Demo Video (Under 3 Minutes):**
> Demonstrating real-time claim extraction, YouTube player timestamp synchronization, side-by-side dispute surfacing, and 4-tier credit preservation.

[▶ **Watch Full Demo Video (`claimlens-demo-walkthrough.mp4`)**](./claimlens-demo-walkthrough.mp4)

<video src="./claimlens-demo-walkthrough.mp4" controls="controls" width="100%">
  Your browser does not support the video tag. You can <a href="./claimlens-demo-walkthrough.mp4">download and watch the demo video directly here</a>.
</video>

---

## 1. Project Overview

Viral YouTube videos routinely make unverified or false health and financial claims — *"this herb cures diabetes in 30 days,"* *"this stock will 10x by next year"* — reaching millions before professional fact-checkers review them. Viewers cannot practically pause videos and research academic literature or market reports for every claim.

ClaimLens solves this by generating a scored, evidence-linked claim ledger tied directly to the exact moment in the video where each claim was made.

---

## 2. Key Features

* **Timestamped Claim Ledger:** Claims extracted directly from the video transcript and synchronized with playback.
* **Dual-Path Verification Engine:**
  1. *Primary Check:* Google Fact Check Tools API for existing accredited fact-check verdicts (`claimReview`).
  2. *Grounding Fallback:* Category-specific SerpApi routing (Google Scholar for health claims, Google Finance for market claims, Google Search for general claims).
* **Explainable Trust Scoring:** Computes $\text{Trust Score} = \text{Grounding Score} \times \text{Source Authority Score}$ with transparent confidence labels (*High Confidence*, *Contested*, *Unverified*).
* **Four-Tier Credit Protection:** Redis hot cache + Supabase PostgreSQL + committed filesystem raw responses (`data/cache/*.json`) ensure that re-evaluating processed videos costs **zero external API credits**.
* **Judge Inspectability:** All raw external API responses are committed in the repository so hackathon evaluators can inspect verbatim API outputs without spinning up databases.

---

## 3. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | [Next.js](https://nextjs.org/) (App Router, React, TypeScript) | Responsive UI, video player synchronization, claim ledger |
| **Backend API** | [Express](https://expressjs.com/) (Node.js, TypeScript) | 7-stage pipeline orchestration, credit protection, REST endpoints |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) + [Drizzle ORM](https://orm.drizzle.team/) | Relational models (`videos`, `claims`, `evidence`, `verdicts`) |
| **Hot Cache** | [Redis](https://redis.io/) (In-Memory Key-Value) | Query deduplication by normalized claim hash |
| **Evidence Store** | Filesystem (`/data/cache/*.json`) | Raw, unedited external API responses committed to Git |
| **External APIs** | [SerpApi](https://serpapi.com/) + [Google Fact Check Tools API](https://toolbox.google.com/factcheck/apis) | Transcripts, Scholar, Finance, Search, and Fact-checking database |

---

## 4. Architecture Overview

ClaimLens follows an explicit, tiered architecture:

```text
                    ┌─────────────────┐
                    │    Frontend     │
                    │    Next.js      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Express API   │
                    │  7-Stage Pipeline
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Redis Cache │     │ Supabase DB  │     │ /data/cache/ │
│  (Hot Dedup) │     │ (PostgreSQL) │     │  (Raw Proof) │
└──────────────┘     └──────────────┘     └──────────────┘
                             │ (On Cache Miss Only)
                             ▼
              ┌─────────────────────────────┐
              │   External Service APIs     │
              │  SerpApi / Google Fact Check│
              └─────────────────────────────┘
```

See the [Visual Architecture Documentation](./docs/architecture/README.md) for full Mermaid C4 and sequence diagrams.

---

## 5. Repository & Directory Structure

```text
Claimlens/
├── apps/
│   ├── web/                     # Next.js frontend application
│   └── api/                     # Express REST API & verification pipeline
│
├── data/
│   ├── cache/                   # Committed raw external API responses (judge evidence)
│   └── demo-videos.json         # Pre-screened demo videos dataset
│
├── docs/
│   ├── architecture/            # Mermaid architecture diagrams (.mmd)
│   ├── decisions/               # Architecture Decision Records (ADRs)
│   ├── development/             # Setup, conventions, and workflow guides
│   └── README.md                # Documentation hub
│
├── Project/                     # Product requirements, tech spec, and demo plan
│   ├── 01_FRD.md
│   ├── 02_Technical_Spec.md
│   └── 03_Demo_and_Submission_Plan.md
│
├── AGENTS.md                    # AI agent operating instructions
├── rules.md                     # Global engineering rules (Zero-any, arrow functions, domain naming)
├── CHANGELOG.md                 # Project version history
└── README.md                    # Root project documentation (this file)
```

---

## 6. Visual Architecture Diagrams

All architectural diagrams are maintained in Mermaid format inside `docs/architecture/`:

* [01. System Context Diagram (C4 Level 1)](./docs/architecture/01-system-context.mmd)
* [02. Container Architecture Diagram (C4 Level 2)](./docs/architecture/02-container-architecture.mmd)
* [03. Component Architecture Diagram (C4 Level 3)](./docs/architecture/03-component-architecture.mmd)
* [04. End-to-End Data Flow Diagram](./docs/architecture/04-data-flow.mmd)
* [05. Authentication & Public Access Flow](./docs/architecture/05-authentication-flow.mmd)
* [06. Database Schema & ERD](./docs/architecture/06-database-erd.mmd)
* [07. API Interaction Flow](./docs/architecture/07-api-flow.mmd)
* [08. Deployment Architecture](./docs/architecture/08-deployment-architecture.mmd)

---

## 7. Architecture Decision Records (ADRs)

Key architectural choices are formally documented in `docs/decisions/`:

* [ADR-001: Next.js + Express REST API Monorepo](./docs/decisions/ADR-001-stack-selection.md)
* [ADR-002: Four-Tier Storage & Write-Through Caching](./docs/decisions/ADR-002-four-tier-storage-and-write-through-caching.md)
* [ADR-003: Claim Verification & Trust Scoring Strategy](./docs/decisions/ADR-003-claim-verification-scoring-strategy.md)
* [ADR-004: Anonymous Public Access Model (v1)](./docs/decisions/ADR-004-auth-strategy-v1.md)

---

## 8. Development Setup & Running Locally

### Prerequisites
* Node.js v20+ LTS
* Redis (local or cloud instance)
* PostgreSQL / Supabase account

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krish/Claimlens.git
   cd Claimlens
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Add your `SERPAPI_KEY`, `GOOGLE_FACT_CHECK_KEY`, `LLM_API_KEY`, `SUPABASE_URL`, and `REDIS_URL`.
4. **Push database schema:**
   ```bash
   npm run db:push
   ```
5. **Start development servers:**
   ```bash
   npm run dev
   ```
   * Web: `http://localhost:3000`
   * API: `http://localhost:4000`

For full details, see the [Development Setup Guide](./docs/development/setup.md).

---

## 9. Testing & Code Quality

* **Typecheck:** `npm run typecheck` (Enforces TypeScript strict mode with zero `any`)
* **Lint:** `npm run lint` (Enforces arrow function style and naming standards)
* **Unit Tests:** `npm run test` (Validates scoring formulas, claim normalization, and hashing)

---

## 10. Hackathon Submission & Judge Review

* **Track:** Knowledge & Public Interest
* **Demo Video:** [`claimlens-demo-walkthrough.mp4`](./claimlens-demo-walkthrough.mp4) (Full < 3 min end-to-end demonstration included directly in the repository).
* **Meaningful SerpApi Usage:**
  * YouTube Transcript API supplies the raw claims with timestamps.
  * Scholar, Finance, and Search APIs provide the grounding evidence.
  * Every verdict rendered in the app traces directly to a raw JSON file committed in [`data/cache/`](./data/cache/).
* **Offline Demo Guarantee:** The application runs completely off committed cached data with 0 live API calls required during evaluation.

---

## 11. Contributing & Conventions

Please review our [Engineering Conventions](./docs/development/conventions.md) and [Development Workflow](./docs/development/workflow.md) before submitting pull requests.
