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
import { parsePrice, parseCurrency } from '../_shared/parse-price.ts'
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
 */
function normalizeSerpApiOffers(raw: Record<string, unknown>): Offer[] {
  // deno-lint-ignore no-explicit-any
  const items = (raw as any).shopping_results as any[] | undefined
  if (!Array.isArray(items)) return []

  return items.map((item): Offer => {
    const extractedPrice = parsePrice(item.extracted_price ?? item.price)
    const currency = parseCurrency(item.currency ?? item.price)

    return {
      merchant: typeof item.source === 'string' ? item.source : null,
      title: typeof item.title === 'string' ? item.title : 'Unknown',
      price: extractedPrice,
      currency,
      url: typeof item.link === 'string' ? item.link : null,
      image: typeof item.thumbnail === 'string' ? item.thumbnail : null,
      rating:
        typeof item.rating === 'number' && isFinite(item.rating)
          ? item.rating
          : null,
      reviewCount:
        typeof item.reviews === 'number' && isFinite(item.reviews)
          ? item.reviews
          : null,
      source: 'serpapi',
    }
  })
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
