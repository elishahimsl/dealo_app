/**
 * Shared types for DeaLo edge functions.
 *
 * These types define the internal data contract between edge functions
 * and the mobile app. The mobile app never talks to SerpApi directly —
 * it only sees these shapes.
 *
 * Provider-agnostic: the `source` field on Offer tracks which upstream
 * returned it, so we can swap SerpApi → Rainforest / Keepa / direct
 * retailer APIs without changing the app.
 */

// ─── Offer ───────────────────────────────────────────────────────────

/**
 * A single normalized offer from any provider.
 */
export interface Offer {
  merchant: string | null
  title: string
  price: number | null
  currency: string | null
  url: string | null
  image: string | null
  rating: number | null
  reviewCount: number | null
  /** Which upstream provider returned this offer.
   *  Currently "serpapi". Later: "rainforest", "keepa", "retailer-direct", etc. */
  source: string
}

// ─── search-offers ───────────────────────────────────────────────────

/**
 * Response from the search-offers edge function.
 */
export interface SearchOffersResponse {
  offers: Offer[]
  query: string
}

// ─── Vision signals ──────────────────────────────────────────────────

/**
 * Signals extracted from a Vision API response.
 * Used by scan-product to build smart search queries.
 */
export interface VisionSignals {
  ocrText: string
  ocrTokens: string[]
  webEntities: { desc: string; score: number }[]
  bestGuessLabels: string[]
  pageTitles: string[]
  logos: string[]
  labels: string[]
  objectNames: string[]
}

// ─── Candidate (for PICK mode) ──────────────────────────────────────

/**
 * A scored candidate shown to the user when confidence is too low
 * for auto-selection. The mobile app renders these as a picker list.
 */
export interface ScoredCandidate {
  title: string
  image: string | null
  price: number | null
  merchant: string | null
  confidence: number
}

// ─── Score breakdown (debug) ─────────────────────────────────────────

/**
 * Per-candidate scoring detail, included in the debug payload so we
 * can tune weights without redeploying.
 */
export interface ScoreBreakdown {
  title: string
  textMatch: number
  brandMatch: number
  entityMatch: number
  consensus: number
  noisePenalty: number
  total: number
}

// ─── AI analysis (optional Gemini) ───────────────────────────────────

/**
 * AI-generated product analysis from Gemini.
 * Null when GEMINI_API_KEY is not set — the scan still succeeds.
 *
 * ── Provider swap point ──
 * Replace the Gemini call in _shared/gemini.ts with any LLM
 * (OpenAI, Claude, Llama, etc.) — this shape stays the same.
 */
export interface ProductAnalysis {
  overview: string
  strengths: string[]
  weaknesses: string[]
  verdict: string
}

// ─── scan-product response ───────────────────────────────────────────

/**
 * Response from the scan-product edge function.
 *
 * decision:
 *   "AUTO" — high confidence, bestMatch is reliable
 *   "PICK" — low/medium confidence, show candidates[] to the user
 */
export interface ScanProductResponse {
  decision: 'AUTO' | 'PICK'
  bestMatch: {
    title: string
    image: string | null
    confidence: number
  } | null
  offers: Offer[]
  candidates: ScoredCandidate[]
  queriesUsed: string[]
  analysis: ProductAnalysis | null
  /** Debug payload — included in development, can be stripped later */
  _debug?: {
    signals: {
      ocrTokenCount: number
      webEntityCount: number
      logos: string[]
      bestGuessLabels: string[]
      pageTitleCount: number
    }
    scoreBreakdown: ScoreBreakdown[]
  }
}
