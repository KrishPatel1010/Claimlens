# Phase 4 Implementation Plan: Next.js Frontend UI & Interactive Video Claim Ledger

Build the responsive Next.js App Router user interface for ClaimLens, featuring synchronized YouTube playback with click-to-seek timestamp jumping, an evidence-backed claim ledger, an expandable citation drawer with committed raw response links, a mathematical scoring audit modal, and a 1-click curated demo selector.

---

## Core Rules & Guardrails
- **Vanilla CSS:** Bespoke design system utilizing dark obsidian tones (`#07090e`), glassmorphism, responsive grid layout, and tailored HSL verdict color tokens (Emerald, Amber, Coral). No TailwindCSS.
- **Zero `any` & Arrow Functions:** Strict TypeScript across all components, types, and services. All components and helpers declared as `const Component = () => {}`.
- **Domain-Driven Naming:** No single-letter or generic dummy variables (`verifiedClaims.map((claimEntry) => ...)`).
- **Offline Resilience:** Seamless fallback to pre-screened cached demo dataset when running without a live backend connection.

---

## UI Components & Architecture

1. **Layout & Branding**:
   - `components/layout/Header.tsx`: SerpApi Hackathon 2026 track badges and navigation identity.
   - `components/layout/Footer.tsx`: Attribution to SerpApi and Google Fact Check Tools API with 4-tier cache disclosures.
2. **Video Ingestion & Demo Selection**:
   - `components/video-input/VideoInputBar.tsx`: URL validation, SSRF domain prevention, and live pipeline stage animations.
   - `components/demo-selector/DemoVideoSelector.tsx`: 1-click test selector for curated health, financial, and accredited fact-check demo videos.
3. **Player & Claim Ledger**:
   - `components/video-player/VideoPlayer.tsx`: Embedded YouTube iframe with timestamp seek synchronization.
   - `components/summary/VideoTrustSummary.tsx`: Video-level aggregated metrics and 0-credit cache status indicator.
   - `components/claim-ledger/ClaimLedger.tsx`: Chronologically ordered, filterable ledger (`All`, `Health`, `Financial`, `General`) with confidence badges and trust progress meters.
4. **Evidence & Audit Modals**:
   - `components/evidence-drawer/EvidenceDrawer.tsx`: Expandable citation drawer displaying academic/official sources, authority scores, grounding similarities, and committed `/data/cache/*.json` audit paths.
   - `components/audit-modal/AuditModal.tsx`: Deep-dive modal explaining the mathematical trust formula ($\text{Trust Score} = \text{Grounding Score} \times \text{Source Authority Score}$) and the 4-tier credit preservation model.
5. **Data Layer & API Client**:
   - `services/video-api-service.ts`: Backend proxy with offline demo data fallback.
   - `lib/demo-data.ts`: Pre-screened verified ledgers and raw evidence references.
