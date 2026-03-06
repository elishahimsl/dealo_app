/**
 * scan-product — DeaLo Edge Function
 *
 * Main backend entry point for the camera scan flow.
 *
 * Accepts a base64-encoded product image, runs multi-signal detection
 * via Google Vision, builds smart search queries, calls search-offers
 * for structured price data, reranks candidates with weighted scoring,
 * applies a confidence gate (AUTO vs PICK), and optionally runs Gemini
 * for AI product analysis.
 *
 * The mobile app sends the photo here — no paid API keys on the client.
 *
 * Secrets required (set via `supabase secrets set`):
 *   GOOGLE_VISION_KEY  — Google Cloud API key with Vision API enabled
 *   SERPAPI_KEY         — serpapi.com API key (used by search-offers)
 *   GEMINI_API_KEY      — (optional) Google AI Studio or Vertex AI key
 *
 * POST /scan-product
 * Body: { "imageBase64": "<base64 string>" }
 * Response: ScanProductResponse (see _shared/types.ts)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { jsonResponse, preflightResponse } from '../_shared/cors.ts'
import { callVisionApi, extractVisionSignals } from '../_shared/vision.ts'
import { buildQueries, rankCandidateTitles } from '../_shared/query-builder.ts'
import type { RankedTitle } from '../_shared/query-builder.ts'
import { analyzeProduct } from '../_shared/gemini.ts'
import type {
  Offer,
  ScoredCandidate,
  ScoreBreakdown,
  ScanProductResponse,
  VisionSignals,
} from '../_shared/types.ts'

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

/**
 * Confidence thresholds:
 *
 * AUTO — high confidence, we can show the best match directly
 *   top score ≥ 75 AND gap to #2 ≥ 8
 *
 * PICK — low/medium confidence, show top candidates for user to choose
 *   top score < 75 OR gap to #2 < 8
 *
 * This is intentionally conservative: accuracy > false certainty.
 */
const AUTO_SCORE_THRESHOLD = 75
const AUTO_GAP_THRESHOLD = 8

interface GateResult {
  decision: 'AUTO' | 'PICK'
  bestTitle: string | null
  bestImage: string | null
  confidence: number
  candidates: ScoredCandidate[]
  scoreBreakdowns: ScoreBreakdown[]
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*[-,]\s*(Black|White|Blue|Red|Green|Pink|Gray|Grey|Silver|Gold|Purple|Orange|Yellow)\b.*$/i, '')
    .replace(/\s*\(.*?\)/g, '')
    .trim()
}

/**
 * Rank offers against vision signals and apply the confidence gate.
 */
function evaluateConfidence(
  allOffers: Offer[],
  signals: VisionSignals,
): GateResult {
  const empty: GateResult = {
    decision: 'PICK',
    bestTitle: null,
    bestImage: null,
    confidence: 0,
    candidates: [],
    scoreBreakdowns: [],
  }

  if (allOffers.length === 0) return empty

  // Rank candidate titles against vision signals
  const titles = allOffers.map((o) => o.title)
  const ranked: RankedTitle[] = rankCandidateTitles(titles, signals)

  if (ranked.length === 0) return { ...empty, candidates: [] }

  const top = ranked[0]
  const gap = ranked.length > 1 ? top.score - ranked[1].score : 100

  // Determine confidence and decision
  let confidence: number
  let decision: 'AUTO' | 'PICK'

  if (top.score >= AUTO_SCORE_THRESHOLD && gap >= AUTO_GAP_THRESHOLD) {
    confidence = Math.min(0.98, top.score / 100)
    decision = 'AUTO'
  } else if (top.score >= 60) {
    confidence = Math.min(0.85, top.score / 100)
    decision = 'PICK' // medium confidence — let user confirm
  } else {
    confidence = Math.min(0.6, top.score / 100)
    decision = 'PICK' // low confidence — user must pick
  }

  const bestTitle = cleanTitle(top.title)
  const bestOffer = allOffers[top.index]
  const bestImage = bestOffer?.image ?? null

  // Build candidates list (unique titles, top 8)
  const seenTitles = new Set<string>()
  const candidates: ScoredCandidate[] = []
  for (const r of ranked.slice(0, 15)) {
    const clean = cleanTitle(r.title)
    if (seenTitles.has(clean)) continue
    seenTitles.add(clean)
    const offer = allOffers[r.index]
    candidates.push({
      title: clean,
      image: offer?.image ?? null,
      price: offer?.price ?? null,
      merchant: offer?.merchant ?? null,
      confidence: Math.min(0.98, r.score / 100),
    })
    if (candidates.length >= 8) break
  }

  // Collect all score breakdowns for debug
  const scoreBreakdowns = ranked.slice(0, 20).map((r) => r.breakdown)

  return {
    decision,
    bestTitle,
    bestImage,
    confidence,
    candidates,
    scoreBreakdowns,
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

    const base64Image = typeof body.imageBase64 === 'string' ? body.imageBase64.trim() : ''
    if (!base64Image) {
      return jsonResponse(
        { error: 'Missing required field: "imageBase64" (base64 string).' },
        400,
      )
    }

    // NOTE: Image preprocessing (resize/compress) should happen on the
    // mobile client before sending. Supabase Edge Functions have a 2MB
    // body limit so large images should be resized client-side.
    // A future improvement could add a resize step here using sharp/wasm.

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
        decision: 'PICK',
        bestMatch: null,
        offers: [],
        candidates: [],
        queriesUsed: [],
        analysis: null,
      }
      return jsonResponse(response)
    }

    // ── Step 3: Search with progressive queries ──────────────────
    // Try the best query first. If we get high confidence early, stop
    // to save API credits. Otherwise try the next query for more data.
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

      // Early stop: if we have 15+ offers with high confidence, done
      if (allOffers.length >= 15) {
        const check = evaluateConfidence(allOffers, signals)
        if (check.decision === 'AUTO') {
          console.log(`[scan-product] AUTO confidence after ${queriesUsed.length} queries, stopping early`)
          break
        }
      }

      // Hard cap: never run more than 3 queries (SerpApi cost control)
      if (queriesUsed.length >= 3) break
    }

    console.log(`[scan-product] total offers: ${allOffers.length} from ${queriesUsed.length} queries`)

    // ── Step 4: Final ranking + confidence gate ──────────────────
    const gate = evaluateConfidence(allOffers, signals)

    console.log(`[scan-product] decision: ${gate.decision} | best: "${gate.bestTitle}" | confidence: ${gate.confidence}`)

    // ── Step 5: Optional Gemini analysis (non-blocking if key missing) ─
    // Only run analysis for AUTO decisions where we're confident in the match.
    // For PICK mode, wait until the user confirms a choice.
    let analysis = null
    if (gate.decision === 'AUTO' && gate.bestTitle) {
      // Run Gemini in parallel — if it fails or times out, we still return
      analysis = await analyzeProduct(gate.bestTitle)
    }

    // ── Build response ───────────────────────────────────────────
    const response: ScanProductResponse = {
      decision: gate.decision,
      bestMatch: gate.bestTitle
        ? {
            title: gate.bestTitle,
            image: gate.bestImage,
            confidence: gate.confidence,
          }
        : null,
      offers: allOffers,
      candidates: gate.candidates,
      queriesUsed,
      analysis,
      _debug: {
        signals: {
          ocrTokenCount: signals.ocrTokens.length,
          webEntityCount: signals.webEntities.length,
          logos: signals.logos,
          bestGuessLabels: signals.bestGuessLabels,
          pageTitleCount: signals.pageTitles.length,
        },
        scoreBreakdown: gate.scoreBreakdowns,
      },
    }

    console.log('[scan-product] done:', {
      decision: response.decision,
      bestMatch: response.bestMatch?.title,
      confidence: response.bestMatch?.confidence,
      offerCount: response.offers.length,
      candidateCount: response.candidates.length,
      hasAnalysis: response.analysis !== null,
    })

    return jsonResponse(response)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[scan-product] error:', message)
    return jsonResponse({ error: message }, 500)
  }
})
