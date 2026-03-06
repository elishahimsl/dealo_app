/**
 * Google Vision API helpers for the scan-product edge function.
 *
 * Extracts structured signals from a Vision API response:
 * OCR text, web entities, best-guess labels, logos, labels, page titles.
 *
 * Secrets required:
 *   GOOGLE_VISION_KEY — a Google Cloud API key with Vision API enabled
 */

import type { VisionSignals } from './types.ts'

// ─── Stopwords & token extraction ────────────────────────────────────

const STOPWORDS = new Set([
  'the', 'and', 'with', 'for', 'buy', 'shop', 'new', 'best', 'top',
  'price', 'sale', 'deal', 'free', 'shipping', 'review', 'reviews',
  'online', 'official', 'store', 'site', 'website', 'home', 'page',
  'from', 'get', 'your', 'our', 'this', 'that', 'how', 'what',
  'more', 'all', 'any', 'off', 'out', 'one', 'two', 'are', 'was',
  'has', 'have', 'had', 'been', 'will', 'can', 'not', 'its', 'you',
])

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s.\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Split text into meaningful tokens, removing stopwords and junk.
 */
export function extractTokens(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .filter((t) => !STOPWORDS.has(t))
    .filter((t) => /[a-z0-9]/i.test(t))
}

// ─── Vision API call ─────────────────────────────────────────────────

/**
 * Call Google Vision API with WEB_DETECTION and TEXT_DETECTION.
 * Accepts base64-encoded image data.
 */
export async function callVisionApi(
  base64Image: string,
  apiKey: string,
  // deno-lint-ignore no-explicit-any
): Promise<Record<string, any>> {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`

  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [
          { type: 'WEB_DETECTION', maxResults: 20 },
          { type: 'TEXT_DETECTION', maxResults: 5 },
          { type: 'LOGO_DETECTION', maxResults: 10 },
          { type: 'LABEL_DETECTION', maxResults: 12 },
          { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
        ],
      },
    ],
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      throw new Error(`Vision API ${res.status}: ${errBody.slice(0, 300)}`)
    }

    return await res.json()
  } catch (err: unknown) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Vision API request timed out after 20s')
    }
    throw err
  }
}

// ─── Signal extraction ───────────────────────────────────────────────

/**
 * Extract structured VisionSignals from a raw Vision API JSON response.
 */
// deno-lint-ignore no-explicit-any
export function extractVisionSignals(json: Record<string, any>): VisionSignals {
  const first = json?.responses?.[0]
  if (!first) {
    return {
      ocrText: '', ocrTokens: [], webEntities: [],
      bestGuessLabels: [], pageTitles: [], logos: [],
      labels: [], objectNames: [],
    }
  }

  // OCR
  const ocrText = (first?.fullTextAnnotation?.text ?? '').trim()
  const ocrTokens = extractTokens(ocrText)

  // Web entities
  // deno-lint-ignore no-explicit-any
  const webEntities = (first?.webDetection?.webEntities ?? [])
    // deno-lint-ignore no-explicit-any
    .filter((e: any) => e?.description)
    // deno-lint-ignore no-explicit-any
    .map((e: any) => ({
      desc: String(e.description).trim(),
      score: typeof e.score === 'number' ? e.score : 0.5,
    }))

  // Best guess labels
  const bestGuessLabels: string[] = (first?.webDetection?.bestGuessLabels ?? [])
    // deno-lint-ignore no-explicit-any
    .map((l: any) => String(l?.label ?? '').trim())
    .filter(Boolean)

  // Page titles from pagesWithMatchingImages
  const pageTitles: string[] = (first?.webDetection?.pagesWithMatchingImages ?? [])
    // deno-lint-ignore no-explicit-any
    .map((p: any) => String(p?.pageTitle ?? '').trim())
    .filter((t: string) => t.length > 3 && t.length < 120)

  // Logos
  const logos: string[] = (first?.logoAnnotations ?? [])
    // deno-lint-ignore no-explicit-any
    .filter((l: any) => l?.description)
    // deno-lint-ignore no-explicit-any
    .map((l: any) => String(l.description).trim())

  // Labels
  const labels: string[] = (first?.labelAnnotations ?? [])
    // deno-lint-ignore no-explicit-any
    .map((l: any) => String(l?.description ?? '').trim())
    .filter(Boolean)

  // Object names
  const objectNames: string[] = (first?.localizedObjectAnnotations ?? [])
    // deno-lint-ignore no-explicit-any
    .map((o: any) => String(o?.name ?? '').trim())
    .filter(Boolean)

  return {
    ocrText, ocrTokens, webEntities, bestGuessLabels,
    pageTitles, logos, labels, objectNames,
  }
}
