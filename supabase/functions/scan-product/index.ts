/**
 * scan-product — DeaLo Edge Function
 *
 * Accepts a base64-encoded product image, runs multi-signal detection
 * via Google Vision, builds smart search queries, calls search-offers
 * for structured price data, reranks candidates, and returns the best
 * match with offers.
 *
 * This is the main backend entry point for the camera scan flow.
 * The mobile app sends the photo here instead of calling Vision/SerpApi
 * directly — no paid API keys on the client.
 *
 * Secrets required (set via `supabase secrets set`):
 *   GOOGLE_VISION_KEY — Google Cloud API key with Vision API enabled
 *   SERPAPI_KEY        — serpapi.com API key (used by search-offers)
 *
 * POST /scan-product
 * Body: { "image": "<base64 string>" }
 * Response: ScanProductResponse (see _shared/types.ts)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { jsonResponse, preflightResponse } from '../_shared/cors.ts'
import { callVisionApi, extractVisionSignals } from '../_shared/vision.ts'
import { buildQueries, rankCandidateTitles } from '../_shared/query-builder.ts'
import type { Offer, ScanProductResponse } from '../_shared/types.ts'

// ─── Internal: call search-offers ────────────────────────────────────

/**
 * Call the search-offers edge function to get normalized offers.
 *
 * In production this is an internal Supabase function-to-function call.
 * We call it via the public URL so it goes through the same gateway,
 * but we could also import the handler directly if latency matters.
 *
 * ── Swap point ──
 * To replace SerpApi with another provider, you only need to change
 * search-offers/index.ts. This function stays the same.
 */
async function callSearchOffers(
  query: string,
  supabaseUrl: string,
  anonKey: string,
): Promise<Offer[]> {
  const url = `${supabaseUrl}/functions/v1/search-offers`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`[scan-product] search-offers returned ${res.status}: ${body.slice(0, 200)}`)
      return []
    }

    const json = await res.json()
    return Array.isArray(json.offers) ? json.offers : []
  } catch (err: unknown) {
    clearTimeout(timeout)
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[scan-product] search-offers call failed: ${msg}`)
    return []
  }
}

// ─── Confidence gate ─────────────────────────────────────────────────

interface ConfidenceResult {
  bestTitle: string | null
  bestImage: string | null
  confidence: number
  offers: Offer[]
  alternatives: string[]
}

/**
 * Given offers from one or more queries, rank them against vision signals
 * and determine confidence level.
 *
 * High confidence  → top score ≥ 75 and gap to #2 ≥ 8
 * Medium           → top score ≥ 60
 * Low              → below 60, return alternatives for user to pick
 */
function evaluateConfidence(
  allOffers: Offer[],
  // deno-lint-ignore no-explicit-any
  signals: any,
): ConfidenceResult {
  if (allOffers.length === 0) {
    return { bestTitle: null, bestImage: null, confidence: 0, offers: [], alternatives: [] }
  }

  // Rank candidate titles against vision signals
  const titles = allOffers.map((o) => o.title)
  const ranked = rankCandidateTitles(titles, signals)

  if (ranked.length === 0) {
    return { bestTitle: null, bestImage: null, confidence: 0, offers: allOffers, alternatives: [] }
  }

  const top = ranked[0]
  const gap = ranked.length > 1 ? top.score - ranked[1].score : 100

  let confidence: number
  if (top.score >= 75 && gap >= 8) {
    confidence = Math.min(0.98, top.score / 100)
  } else if (top.score >= 60) {
    confidence = Math.min(0.85, top.score / 100)
  } else {
    confidence = Math.min(0.6, top.score / 100)
  }

  // Clean the best title: strip color suffixes for the canonical name
  const bestTitle = top.title
    .replace(/\s*[-,]\s*(Black|White|Blue|Red|Green|Pink|Gray|Grey|Silver|Gold|Purple|Orange|Yellow)\b.*$/i, '')
    .replace(/\s*\(.*?\)/g, '')
    .trim()

  const bestOffer = allOffers[top.index]
  const bestImage = bestOffer?.image ?? null

  // Collect unique alternative names (top 5 excluding the best)
  const altSet = new Set<string>()
  for (const r of ranked.slice(1, 8)) {
    const clean = r.title
      .replace(/\s*[-,]\s*(Black|White|Blue|Red|Green|Pink|Gray|Grey|Silver|Gold|Purple|Orange|Yellow)\b.*$/i, '')
      .replace(/\s*\(.*?\)/g, '')
      .trim()
    if (clean && clean !== bestTitle) altSet.add(clean)
  }

  return {
    bestTitle,
    bestImage,
    confidence,
    offers: allOffers,
    alternatives: [...altSet].slice(0, 5),
  }
}

// ─── Main handler ────────────────────────────────────────────────────

serve(async (req: Request) => {
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

    const base64Image = typeof body.image === 'string' ? body.image.trim() : ''
    if (!base64Image) {
      return jsonResponse(
        { error: 'Missing required field: "image" (base64 string).' },
        400,
      )
    }

    // ── Read secrets ──────────────────────────────────────────────
    const visionKey = Deno.env.get('GOOGLE_VISION_KEY')
    if (!visionKey) {
      console.error('[scan-product] GOOGLE_VISION_KEY secret is not set.')
      return jsonResponse(
        { error: 'Vision API is not configured. Contact support.' },
        500,
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    // ── Step 1: Call Vision API ───────────────────────────────────
    console.log(`[scan-product] calling Vision API (image: ${base64Image.length} chars)`)
    const visionJson = await callVisionApi(base64Image, visionKey)
    const signals = extractVisionSignals(visionJson)

    console.log('[scan-product] signals:', {
      ocrTokens: signals.ocrTokens.length,
      webEntities: signals.webEntities.length,
      logos: signals.logos,
      bestGuess: signals.bestGuessLabels,
      pages: signals.pageTitles.length,
    })

    // ── Step 2: Build search queries ─────────────────────────────
    const queries = buildQueries(signals)
    console.log(`[scan-product] built ${queries.length} queries:`, queries)

    if (queries.length === 0) {
      const response: ScanProductResponse = {
        bestMatch: null,
        offers: [],
        alternatives: [],
        queriesUsed: [],
      }
      return jsonResponse(response)
    }

    // ── Step 3: Search with progressive queries ──────────────────
    // Try the best query first. If we get enough high-scoring results,
    // stop early to save API credits. Otherwise try the next query.
    const allOffers: Offer[] = []
    const seenUrls = new Set<string>()
    const queriesUsed: string[] = []

    for (const query of queries) {
      console.log(`[scan-product] searching: "${query}"`)
      const offers = await callSearchOffers(query, supabaseUrl, anonKey)
      queriesUsed.push(query)

      // Deduplicate by URL
      for (const o of offers) {
        const key = o.url ?? o.title
        if (!seenUrls.has(key)) {
          seenUrls.add(key)
          allOffers.push(o)
        }
      }

      // Early stop: if we already have 15+ offers, evaluate confidence
      if (allOffers.length >= 15) {
        const check = evaluateConfidence(allOffers, signals)
        if (check.confidence >= 0.75) {
          console.log(`[scan-product] high confidence after ${queriesUsed.length} queries, stopping early`)
          break
        }
      }

      // Hard cap: never run more than 3 queries (SerpApi cost control)
      if (queriesUsed.length >= 3) break
    }

    console.log(`[scan-product] total offers: ${allOffers.length} from ${queriesUsed.length} queries`)

    // ── Step 4: Final ranking + confidence gate ──────────────────
    const result = evaluateConfidence(allOffers, signals)

    const response: ScanProductResponse = {
      bestMatch: result.bestTitle
        ? {
            title: result.bestTitle,
            image: result.bestImage,
            confidence: result.confidence,
          }
        : null,
      offers: result.offers,
      alternatives: result.alternatives,
      queriesUsed,
    }

    console.log('[scan-product] done:', {
      bestMatch: response.bestMatch?.title,
      confidence: response.bestMatch?.confidence,
      offerCount: response.offers.length,
      alternatives: response.alternatives.length,
    })

    return jsonResponse(response)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[scan-product] error:', message)
    return jsonResponse({ error: message }, 500)
  }
})
