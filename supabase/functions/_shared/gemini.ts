/**
 * Optional Gemini AI product analysis.
 *
 * This module calls Google's Gemini API to generate a structured product
 * analysis (overview, strengths, weaknesses, verdict). It is designed to
 * be completely optional — if GEMINI_API_KEY is not set, the scan still
 * succeeds and returns `analysis: null`.
 *
 * ── Provider swap point ──
 * To replace Gemini with another LLM (OpenAI, Claude, Llama, etc.):
 * 1. Change the URL and request format in callGemini()
 * 2. Update parseGeminiResponse() to match the new response shape
 * 3. The ProductAnalysis return type stays the same
 *
 * ── Key setup ──
 * Option A: Google AI Studio (free tier)
 *   1. Go to https://aistudio.google.com/apikey
 *   2. Create an API key
 *   3. supabase secrets set GEMINI_API_KEY=your_key_here
 *
 * Option B: Google Cloud / Vertex AI (production)
 *   1. Enable Vertex AI API in Google Cloud Console
 *   2. Create a service account key or use API key
 *   3. supabase secrets set GEMINI_API_KEY=your_key_here
 *   4. Update the URL below to use the Vertex AI endpoint
 */

import type { ProductAnalysis } from './types.ts'

const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_TIMEOUT_MS = 15_000

/**
 * Check if Gemini is configured. Returns the API key or null.
 */
export function getGeminiKey(): string | null {
  const key = Deno.env.get('GEMINI_API_KEY') ?? ''
  return key.length > 0 ? key : null
}

/**
 * Generate a product analysis using Gemini.
 * Returns null if GEMINI_API_KEY is not set or if the call fails.
 * Never throws — failures are logged and silently return null.
 */
export async function analyzeProduct(
  productName: string,
  category?: string,
): Promise<ProductAnalysis | null> {
  const apiKey = getGeminiKey()
  if (!apiKey) {
    console.log('[gemini] GEMINI_API_KEY not set, skipping analysis')
    return null
  }

  try {
    console.log(`[gemini] analyzing "${productName}"`)

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

    const categoryHint = category ? ` in the ${category} category` : ''
    const prompt = `You are a concise product analyst. Analyze this product: "${productName}"${categoryHint}.

Return a JSON object with exactly these fields:
{
  "overview": "2-3 sentence overview of what this product is and who it's for",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "verdict": "1-2 sentence buying recommendation"
}

Rules:
- Be factual, not promotional
- Focus on real user-reported pros/cons
- If you don't know the product well, say so honestly
- Return ONLY valid JSON, no markdown fences`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS)

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      console.error(`[gemini] API returned ${res.status}: ${errBody.slice(0, 200)}`)
      return null
    }

    // deno-lint-ignore no-explicit-any
    const json: any = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    return parseGeminiResponse(text)
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.error('[gemini] request timed out')
    } else {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[gemini] error: ${msg}`)
    }
    return null
  }
}

/**
 * Parse Gemini's text response into a ProductAnalysis.
 * Handles both clean JSON and JSON wrapped in markdown fences.
 */
function parseGeminiResponse(text: string): ProductAnalysis | null {
  if (!text.trim()) return null

  // Strip markdown code fences if present
  let cleaned = text.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }

  try {
    const parsed = JSON.parse(cleaned)

    const overview = typeof parsed.overview === 'string' ? parsed.overview : ''
    const strengths = Array.isArray(parsed.strengths)
      ? parsed.strengths.filter((s: unknown) => typeof s === 'string')
      : []
    const weaknesses = Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses.filter((s: unknown) => typeof s === 'string')
      : []
    const verdict = typeof parsed.verdict === 'string' ? parsed.verdict : ''

    if (!overview && strengths.length === 0) {
      console.warn('[gemini] parsed response has no useful content')
      return null
    }

    return { overview, strengths, weaknesses, verdict }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`[gemini] failed to parse response: ${msg}`)
    console.error(`[gemini] raw text: ${text.slice(0, 200)}`)
    return null
  }
}
