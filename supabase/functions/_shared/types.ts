/**
 * Shared types for DeaLo edge functions.
 *
 * These types define the internal data contract between edge functions
 * and the mobile app. The mobile app never talks to SerpApi directly —
 * it only sees these shapes.
 */

/**
 * A single normalized offer from any provider.
 * The `source` field tracks which upstream provider returned it,
 * making it easy to swap providers later without changing the app.
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

/**
 * Response from the search-offers edge function.
 */
export interface SearchOffersResponse {
  offers: Offer[]
  query: string
}

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

/**
 * Response from the scan-product edge function.
 */
export interface ScanProductResponse {
  bestMatch: {
    title: string
    image: string | null
    confidence: number
  } | null
  offers: Offer[]
  alternatives: string[]
  queriesUsed: string[]
}
