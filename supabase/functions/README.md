# Supabase Edge Functions

This folder contains TypeScript edge functions for the DeaLo backend.

All paid API keys live here as Supabase secrets — never in the mobile app.

## Available Functions

### Core Scan Pipeline

- **`scan-product`** — Main entry point for camera scans.
  Accepts a base64 image, runs Vision API, builds multi-query search,
  calls search-offers, reranks candidates, applies confidence gate,
  optionally calls Gemini for AI analysis.
  ```
  POST { "imageBase64": "<base64>" }
  → {
      decision: "AUTO" | "PICK",
      bestMatch: { title, image, confidence } | null,
      offers: Offer[],
      candidates: ScoredCandidate[],  // for PICK mode
      queriesUsed: string[],
      analysis: { overview, strengths, weaknesses, verdict } | null,
      _debug: { signals, scoreBreakdown }
    }
  ```

- **`search-offers`** — Searches for product offers using the configured provider.
  Currently uses SerpApi Google Shopping. Swap the provider here and the
  mobile app keeps working — it only sees the normalized Offer shape.
  ```
  POST { "query": "JBL Clip 5" }
  → { offers: Offer[], query: string }
  ```

### Data Management

- `ingest-product` — Upsert product data into the products table.

### Shared Helpers (`_shared/`)

- `cors.ts` — CORS headers, JSON response helpers
- `types.ts` — Shared TypeScript types (Offer, ScoredCandidate, ScoreBreakdown, ProductAnalysis, etc.)
- `parse-price.ts` — Safe price/currency extraction
- `vision.ts` — Google Vision API call + signal extraction
- `query-builder.ts` — Multi-query generation + candidate reranking with score breakdowns
- `gemini.ts` — Optional Gemini AI product analysis (skips gracefully if no key)

## Secrets Required

```bash
# SerpApi — sign up at https://serpapi.com (100 free searches/month)
supabase secrets set SERPAPI_KEY=your_key_here

# Google Vision — use your Google Cloud API key with Vision API enabled
supabase secrets set GOOGLE_VISION_KEY=your_key_here

# Gemini AI — OPTIONAL, scan works without it
# Option A: Google AI Studio (free) → https://aistudio.google.com/apikey
# Option B: Google Cloud / Vertex AI (production)
supabase secrets set GEMINI_API_KEY=your_key_here
```

## Deploy

```bash
# Deploy a single function
supabase functions deploy search-offers
supabase functions deploy scan-product

# Deploy all
supabase functions deploy
```

## Local Development

```bash
supabase functions serve
```

## Architecture

```
Mobile App (no paid API keys)
  │
  POST /scan-product  { imageBase64 }
  │
  ├─ Step 1: Google Vision API  (GOOGLE_VISION_KEY)
  │   └─ WEB_DETECTION + TEXT_DETECTION + LOGO + LABEL + OBJECT
  │
  ├─ Step 2: Extract signals
  │   └─ OCR tokens, web entities, logos, labels, page titles
  │
  ├─ Step 3: Build 3-5 search queries (brand+model first)
  │
  ├─ Step 4: Progressive search (max 3 queries, early stop)
  │   └─ POST /search-offers  { query }
  │       └─ SerpApi Google Shopping  (SERPAPI_KEY)
  │           └─ ► SWAP POINT: replace with any provider
  │
  ├─ Step 5: Rerank candidates (text/brand/entity/consensus/noise)
  │   └─ Score 0-100, full breakdown in _debug
  │
  ├─ Step 6: Confidence gate
  │   ├─ AUTO (score ≥ 75, gap ≥ 8) → show best match
  │   └─ PICK (lower confidence) → show candidates for user to choose
  │
  └─ Step 7: Optional Gemini analysis (GEMINI_API_KEY)
      └─ ► SWAP POINT: replace with any LLM
```
