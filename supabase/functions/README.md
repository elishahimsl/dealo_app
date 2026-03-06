# Supabase Edge Functions

This folder contains TypeScript edge functions for the DeaLo backend.

All paid API keys live here as Supabase secrets — never in the mobile app.

## Available Functions

### Core Scan Pipeline

- **`scan-product`** — Main entry point for camera scans.
  Accepts a base64 image, calls Vision API, builds multi-query search,
  calls search-offers, reranks candidates, returns best match + offers.
  `POST { "image": "<base64>" }` → `{ bestMatch, offers, alternatives, queriesUsed }`

- **`search-offers`** — Searches for product offers using the configured provider.
  Currently uses SerpApi Google Shopping. Swap the provider here and the
  mobile app keeps working — it only sees the normalized Offer shape.
  `POST { "query": "JBL Clip 5" }` → `{ offers: Offer[], query }`

### Data Management

- `ingest-product` — Upsert product data into the products table.

### Shared Helpers (`_shared/`)

- `cors.ts` — CORS headers, JSON response helpers
- `types.ts` — Shared TypeScript types (Offer, VisionSignals, etc.)
- `parse-price.ts` — Safe price/currency extraction
- `vision.ts` — Google Vision API call + signal extraction
- `query-builder.ts` — Multi-query generation + candidate reranking

## Secrets Required

```bash
# SerpApi — sign up at https://serpapi.com (100 free searches/month)
supabase secrets set SERPAPI_KEY=your_key_here

# Google Vision — use your Google Cloud API key with Vision API enabled
supabase secrets set GOOGLE_VISION_KEY=your_key_here
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
  ├── POST /scan-product  { image: base64 }
  │     ├── Google Vision API  (GOOGLE_VISION_KEY secret)
  │     ├── Extract signals (OCR, logos, web entities, labels)
  │     ├── Build 3-5 search queries
  │     ├── POST /search-offers  { query: "..." }
  │     │     └── SerpApi Google Shopping  (SERPAPI_KEY secret)
  │     │         └── ► SWAP POINT: replace SerpApi with any provider
  │     ├── Rerank candidates against vision signals
  │     └── Return best match + offers + alternatives
  │
  └── Results page shows offers, AI analysis, etc.
```
