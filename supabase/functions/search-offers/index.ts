/**
 * search-offers — DeaLo Edge Function
 *
 * Accepts a product query, calls the configured offer provider (currently
 * SerpApi Google Shopping), normalizes results into the internal Offer shape,
 * and returns them to the caller.
 *
 * The mobile app never touches SerpApi directly. This function is the single
 * gateway for all offer data — swap the provider here and the app keeps working.
 *
 * Secrets required (set via `supabase secrets set`):
 *   SERPAPI_KEY — your serpapi.com API key
 *
 * POST /search-offers
 * Body: { "query": "JBL Clip 5" }
 * Response: { "offers": Offer[], "query": string }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { jsonResponse, preflightResponse } from '../_shared/cors.ts'
import {
  parsePrice,
  parseCurrency,
  parseRating,
  parseReviewCount,
  safeString,
  safeUrl,
} from '../_shared/parse-price.ts'
import type { Offer, SearchOffersResponse } from '../_shared/types.ts'

// ─── Provider: SerpApi ───────────────────────────────────────────────
// To replace SerpApi later, implement a new fetchOffers* function and
// swap the call in the main handler. The Offer shape stays the same.
// ─────────────────────────────────────────────────────────────────────

/**
 * Call SerpApi's Google Shopping endpoint.
 * Returns the raw JSON response or throws on failure.
 */
async function fetchSerpApiShopping(
  query: string,
  apiKey: string,
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: query,
    api_key: apiKey,
    hl: 'en',
    gl: 'us',
    num: '20',
  })

  const url = `https://serpapi.com/search.json?${params.toString()}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(
        `SerpApi returned ${res.status}: ${body.slice(0, 200)}`,
      )
    }

    return (await res.json()) as Record<string, unknown>
  } catch (err: unknown) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('SerpApi request timed out after 15s')
    }
    throw err
  }
}

/**
 * Normalize raw SerpApi shopping_results into our internal Offer shape.
 *
 * Defensive rules:
 * - Never assume any field exists on a result item
 * - Skip items that are null, undefined, or not objects
 * - Skip items with no usable title (the one required field)
 * - Every optional field falls back to null, never throws
 * - Log skipped items count for debugging
 */
function normalizeSerpApiOffers(raw: Record<string, unknown>): Offer[] {
  // SerpApi returns shopping_results as the main array.
  // If it's missing or not an array, return empty — this is valid
  // (e.g. a query with no shopping results).
  // deno-lint-ignore no-explicit-any
  const items = (raw as any)?.shopping_results
  if (!Array.isArray(items)) {
    console.log('[search-offers] no shopping_results array in response')
    return []
  }

  const offers: Offer[] = []
  let skipped = 0

  for (let i = 0; i < items.length; i++) {
    try {
      const item = items[i]

      // Skip null/undefined/non-object entries
      if (item == null || typeof item !== 'object') {
        skipped++
        continue
      }

      // Title is the only required field — skip if missing
      const title = safeString(item.title)
      if (!title) {
        skipped++
        continue
      }

      // Price: prefer extracted_price (numeric), fall back to price (string)
      const price = parsePrice(item.extracted_price) ?? parsePrice(item.price)

      // Currency: prefer explicit currency field, infer from price string, default USD
      const currency = parseCurrency(item.currency) !== 'USD'
        ? parseCurrency(item.currency)
        : parseCurrency(item.price)

      // Merchant: SerpApi uses "source" for merchant name
      const merchant = safeString(item.source)

      // URL: SerpApi uses "link" for the product page, sometimes "product_link"
      const url = safeUrl(item.link) ?? safeUrl(item.product_link)

      // Image: SerpApi uses "thumbnail", sometimes "image"
      const image = safeUrl(item.thumbnail) ?? safeUrl(item.image)

      // Rating & review count: may be number or string
      const rating = parseRating(item.rating)
      const reviewCount = parseReviewCount(item.reviews)

      offers.push({
        merchant,
        title,
        price,
        currency,
        url,
        image,
        rating,
        reviewCount,
        source: 'serpapi',
      })
    } catch {
      // If any single item throws unexpectedly, skip it — don't fail the batch
      skipped++
    }
  }

  if (skipped > 0) {
    console.log(`[search-offers] skipped ${skipped} malformed items out of ${items.length}`)
  }

  return offers
}

// ─── Main handler ────────────────────────────────────────────────────

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return preflightResponse()
  }

  try {
    // ── Validate request ──────────────────────────────────────────
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed. Use POST.' }, 405)
    }

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON body.' }, 400)
    }

    const query =
      typeof body.query === 'string' ? body.query.trim() : ''
    if (!query) {
      return jsonResponse(
        { error: 'Missing required field: "query" (string).' },
        400,
      )
    }

    // ── Read secret ───────────────────────────────────────────────
    const serpApiKey = Deno.env.get('SERPAPI_KEY')
    if (!serpApiKey) {
      console.error('[search-offers] SERPAPI_KEY secret is not set.')
      return jsonResponse(
        { error: 'Offer search is not configured. Contact support.' },
        500,
      )
    }

    // ── Fetch + normalize ─────────────────────────────────────────
    console.log(`[search-offers] query="${query}"`)

    const rawJson = await fetchSerpApiShopping(query, serpApiKey)
    const offers = normalizeSerpApiOffers(rawJson)

    console.log(`[search-offers] got ${offers.length} offers for "${query}"`)

    const response: SearchOffersResponse = { offers, query }
    return jsonResponse(response)
  } catch (err: unknown) {
    // Never expose the API key in error messages
    const message =
      err instanceof Error ? err.message : 'Internal server error'
    console.error('[search-offers] error:', message)
    return jsonResponse({ error: message }, 500)
  }
})
