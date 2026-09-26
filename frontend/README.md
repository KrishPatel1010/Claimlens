# ClaimLens Frontend

Next.js Application for ClaimLens — an automated YouTube claim verification application with an interactive video player and timestamp-synchronized claim ledger.

## Features
- **Interactive Video Player:** YouTube player with synced playback to verified claim timestamps.
- **Timestamp Ledger:** Categorized claims (Health, Finance, General) with Trust Scores.
- **Evidence Drawer:** Inspect source citations, Google Scholar links, Google Fact Check references, and raw SerpApi response payloads.
- **Audit Mode:** Deep-dive into scoring calculations ($ \text{Trust Score} = \text{Grounding Score} \times \text{Source Authority Score} $).

## Getting Started

### Prerequisites
- Node.js >= 20

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Development
```bash
npm run dev
```
