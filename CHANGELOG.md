# Changelog

All notable changes to the ClaimLens project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 2026-09-25

### Added
- **Curated Demo Dataset & Hackathon Submission Readiness (Phase 5):**
  - Full end-to-end dataset outcome audit verifying all target outcomes (*High Confidence*, *Contested*, *Unverified*).
  - Validated primary Google Fact Check Tools API and SerpApi multi-engine grounding fallback resolution paths.
  - Committed raw provider response JSON files in [`data/cache/*.json`](./data/cache/) and [`backend/data/cache/*.json`](./backend/data/cache/) for direct judge inspectability.
  - Formulated comprehensive 3-minute hackathon demo video recording script with scene-by-scene timing and cues ([`docs/walkthroughs/05-phase-5-submission-readiness-walkthrough.md`](./docs/walkthroughs/05-phase-5-submission-readiness-walkthrough.md)).
  - Executed SerpApi India Hackathon 2026 submission readiness checklist (Track: Knowledge & Public Interest).

---

## [0.2.0] - 2026-09-25

### Added
- **Backend 7-Stage Verification Pipeline (Phase 2):**
  - Drizzle ORM PostgreSQL relational models (`videos`, `claims`, `evidence`, `verdicts`).
  - SSRF URL security guard, SHA-256 claim deduplication hashing, and 4-tier write-through cache strategy.
  - Stage 1: SerpApi YouTube Video Transcript engine integration.
  - Stage 2: Discrete checkable claim extraction.
  - Stage 3: Claim classification (Health / Financial / General).
  - Stage 4: Primary lookup via Google Fact Check Tools API (`claims:search`).
  - Stage 5: Multi-engine SerpApi grounding fallback (`google_scholar`, `google_finance`, `google`).
  - Stage 6: Explainable Trust Score computation ($\text{Trust Score} = \text{Grounding Score} \times \text{Source Authority Score}$) with confidence labels.
  - Stage 7: Ledger persistence, disk write-through (`/data/cache/*.json`), and relational storage.
  - Express REST API endpoints (`POST /api/videos/process`, `GET /api/videos/:videoId`, `GET /api/health`).
  - 44 passing unit and integration tests across 12 test suites.
- **Next.js Web Frontend & Synchronized Ledger (Phase 3):**
  - Next.js App Router frontend with custom Vanilla CSS design system, obsidian dark mode, glassmorphism, and verdict tokens.
  - Interactive YouTube video player with timestamp synchronization and click-to-seek functionality.
  - Categorized Claim Ledger with real-time filtering (All, Health, Financial, General) and confidence pills.
  - Expandable Evidence Drawer displaying cited sources, domain authority ratings, and committed disk cache paths.
  - Mathematical Scoring Audit Modal explaining trust score calculations and cache tier savings.
  - 1-Click Quick Demo selector pre-configured with curated health, financial, and fact-checked videos for instant zero-credit evaluation.
  - Committed raw JSON cache evidence in `/data/cache/` for SerpApi hackathon judge inspectability.

---

## [0.1.0] - 2026-09-19

### Added
- **Architecture Foundation (Phase 1):**
  - C4 Level 1 System Context Diagram ([`01-system-context.mmd`](./docs/architecture/01-system-context.mmd)).
  - C4 Level 2 Container Architecture Diagram ([`02-container-architecture.mmd`](./docs/architecture/02-container-architecture.mmd)).
  - C4 Level 3 Component Architecture Diagram for backend API ([`03-component-architecture.mmd`](./docs/architecture/03-component-architecture.mmd)).
  - End-to-End Data Flow Sequence Diagram ([`04-data-flow.mmd`](./docs/architecture/04-data-flow.mmd)).
  - Authentication & Public Access Model Diagram ([`05-authentication-flow.mmd`](./docs/architecture/05-authentication-flow.mmd)).
  - Database Entity-Relationship Diagram ([`06-database-erd.mmd`](./docs/architecture/06-database-erd.mmd)).
  - API Interaction Sequence Diagram ([`07-api-flow.mmd`](./docs/architecture/07-api-flow.mmd)).
  - Deployment Architecture Diagram ([`08-deployment-architecture.mmd`](./docs/architecture/08-deployment-architecture.mmd)).
  - Visual Architecture Index ([`docs/architecture/README.md`](./docs/architecture/README.md)).
- **Architecture Decision Records (ADRs):**
  - [ADR-001](./docs/decisions/ADR-001-stack-selection.md): Next.js Frontend + Express REST API Monorepo.
  - [ADR-002](./docs/decisions/ADR-002-four-tier-storage-and-write-through-caching.md): Four-Tier Storage Architecture & Write-Through Caching.
  - [ADR-003](./docs/decisions/ADR-003-claim-verification-scoring-strategy.md): Claim Verification & Trust Scoring Strategy.
  - [ADR-004](./docs/decisions/ADR-004-auth-strategy-v1.md): Anonymous Public Access Model for Hackathon MVP.
- **Developer Guidelines & Documentation:**
  - Setup Guide ([`docs/development/setup.md`](./docs/development/setup.md)).
  - Engineering Conventions ([`docs/development/conventions.md`](./docs/development/conventions.md)).
  - 11-Step Change Management Workflow ([`docs/development/workflow.md`](./docs/development/workflow.md)).
  - Documentation Hub ([`docs/README.md`](./docs/README.md)).
- **AI Agent Operating Instructions:**
  - Standardized AI operating contract ([`AGENTS.md`](./AGENTS.md)).
  - Authoritative repository engineering rules ([`rules.md`](./rules.md)) enforcing strict Zero-any, modern arrow functions, domain-driven naming, and credit budget preservation.
- **Project Scaffold:**
  - Root [`README.md`](./README.md) with comprehensive architecture overview, tech stack, and hackathon evaluation details.
  - Initial directory scaffolding for `apps/web/`, `apps/api/`, `data/cache/`, and `data/demo-videos.json`.
