/**
 * Query builder + candidate ranker for the scan pipeline.
 *
 * Given VisionSignals extracted from a photo, generates 3–5 ranked
 * search queries. The first query is the highest-confidence guess;
 * later queries are progressively broader fallbacks.
 *
 * This is intentionally category-agnostic so it works for electronics,
 * clothing, home goods, food, etc. Electronics score highest because
 * OCR model numbers are usually very distinctive there.
 */

import type { VisionSignals, ScoreBreakdown } from './types.ts'
import { extractTokens } from './vision.ts'

// ─── Known consumer brands ──────────────────────────────────────────
// Helps distinguish brand tokens from noise during query building
// and gives a scoring boost when a candidate title contains a detected brand.

export const KNOWN_BRANDS = new Set([
  'jbl', 'sony', 'bose', 'apple', 'samsung', 'nike', 'adidas', 'beats', 'lg',
  'google', 'microsoft', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'razer',
  'logitech', 'anker', 'skullcandy', 'sennheiser', 'harman', 'marshall',
  'ultimate ears', 'jabra', 'corsair', 'steelseries', 'hyperx',
  'nintendo', 'playstation', 'xbox', 'gopro', 'dji', 'canon', 'nikon',
  'dyson', 'kitchenaid', 'ninja', 'breville', 'cuisinart', 'instant pot',
  'north face', 'patagonia', 'under armour', 'new balance', 'puma', 'reebok',
  'columbia', 'lululemon', 'ray-ban', 'oakley', 'yeti', 'hydro flask',
  'crocs', 'birkenstock', 'vans', 'converse',
  'ikea', 'herman miller', 'steelcase', 'west elm', 'pottery barn',
  'whirlpool', 'bosch', 'miele', 'electrolux', 'frigidaire',
  'dewalt', 'makita', 'milwaukee', 'ryobi', 'craftsman',
  'amazon', 'kindle', 'echo', 'ring', 'blink', 'alexa',
  'fitbit', 'garmin', 'polar', 'suunto',
])

// ─── Noise / accessory keywords ─────────────────────────────────────
// Candidates containing these get a penalty — they're accessories or
// support items, not the actual product the user scanned.

const NOISE_KEYWORDS = new Set([
  'case', 'cover', 'sleeve', 'protector', 'screen protector',
  'replacement', 'parts', 'adapter', 'cable', 'charger',
  'mount', 'strap', 'skin', 'compatible', 'compatible with', 'fits',
  'refurbished', 'renewed', 'used', 'pre-owned',
  'bundle', 'lot', 'set of', 'pack of',
  'manual', 'guide', 'instructions',
  'sticker', 'decal', 'vinyl',
  'stand', 'holder', 'dock', 'cradle',
  'cleaning', 'cloth', 'wipe',
  'warranty', 'protection plan', 'insurance',
])

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s.\-]/g, ' ').replace(/\s+/g, ' ').trim()
}

// ─── Query building ──────────────────────────────────────────────────

/**
 * Build 3–5 search queries from Vision signals, ranked by expected specificity.
 *
 * Priority order:
 * 1. Brand + OCR model tokens (best for electronics: "JBL Clip 5")
 * 2. Best-guess labels from Google Vision
 * 3. Top web entities
 * 4. Consensus phrases from page titles
 * 5. Generic label fallback
 */
export function buildQueries(signals: VisionSignals): string[] {
  const queries: string[] = []
  const seen = new Set<string>()

  const add = (q: string) => {
    const norm = normalize(q)
    if (norm.length < 3 || seen.has(norm)) return
    seen.add(norm)
    queries.push(q.trim())
  }

  // Detect brand from logos or web entities
  const brand = signals.logos[0]
    ?? signals.webEntities.find((we) => KNOWN_BRANDS.has(we.desc.toLowerCase()))?.desc
    ?? ''
  const brandLower = brand.toLowerCase()

  // ── 1. Brand + OCR model tokens (strongest for electronics) ────
  if (brand) {
    const modelTokens = signals.ocrTokens.filter((t) => {
      if (t.toLowerCase() === brandLower) return false
      // Keep tokens with digits (model numbers) or short alphanum strings
      if (/\d/.test(t)) return true
      if (t.length >= 3 && t.length <= 15 && /^[a-z0-9]+$/i.test(t)) return true
      return false
    })

    if (modelTokens.length > 0) {
      // Most specific first: brand + all model tokens, then shorter combos
      for (let len = Math.min(3, modelTokens.length); len >= 1; len--) {
        add(`${brand} ${modelTokens.slice(0, len).join(' ')}`)
      }
    }

    // Brand + OCR lines that contain digits (likely model/variant info)
    const ocrLines = signals.ocrText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    for (const line of ocrLines) {
      if (line.length >= 3 && line.length <= 30 && /\d/.test(line)) {
        const combined = line.toLowerCase().startsWith(brandLower)
          ? line
          : `${brand} ${line}`
        add(combined)
      }
    }
  }

  // ── 2. Best-guess labels (Google's top identification) ──────────
  for (const label of signals.bestGuessLabels) {
    add(label)
    if (brand && !label.toLowerCase().includes(brandLower)) {
      add(`${brand} ${label}`)
    }
  }

  // ── 3. Top web entities ────────────────────────────────────────
  for (const we of signals.webEntities.slice(0, 3)) {
    if (we.desc.length >= 3) add(we.desc)
  }

  // ── 4. Consensus from page titles ─────────────────────────────
  const cleanedTitles = signals.pageTitles
    .map((t) =>
      t.replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/\s*[-|–—]\s*[^-|–—]*$/g, '')  // strip " - Store Name"
        .replace(/\s*[-|–—]\s*[^-|–—]*$/g, '')  // second pass
        .replace(/^(Buy|Shop)\s+/i, '')
        .replace(/\s*\(.*?\)\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter((t) => t.length >= 3 && t.length <= 60)

  if (cleanedTitles.length >= 2) {
    const phraseCount = new Map<string, number>()
    for (const title of cleanedTitles) {
      const words = title.split(/\s+/)
      for (let len = 2; len <= Math.min(5, words.length); len++) {
        for (let start = 0; start <= words.length - len; start++) {
          const phrase = words.slice(start, start + len).join(' ')
          phraseCount.set(phrase, (phraseCount.get(phrase) || 0) + 1)
        }
      }
    }
    const consensus = [...phraseCount.entries()]
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])

    for (const [phrase] of consensus.slice(0, 2)) {
      add(phrase)
    }
  }

  // ── 5. Fallbacks ───────────────────────────────────────────────
  if (queries.length === 0 && brand) {
    add(brand)
  }
  if (queries.length === 0) {
    for (const label of signals.labels.slice(0, 2)) {
      add(label)
    }
  }

  // Cap at 5 queries for cost control
  return queries.slice(0, 5)
}

// ─── Candidate ranking ───────────────────────────────────────────────

/**
 * A ranked candidate title with its index back into the original offers array.
 */
export interface RankedTitle {
  title: string
  score: number
  index: number
  breakdown: ScoreBreakdown
}

/**
 * Score candidate titles against Vision signals.
 * Returns a sorted list (highest score first) with full score breakdowns.
 *
 * Scoring weights (0–100):
 *   textMatch     0–50  How many OCR/entity tokens appear in the title
 *   brandMatch    0–20  Does the title contain the detected brand
 *   entityMatch   0–15  Web entity overlap (weighted by Vision confidence)
 *   consensus     0–10  Same product across multiple merchants
 *   noisePenalty  0–15  Penalty for accessory/support keywords
 */
export function rankCandidateTitles(
  titles: string[],
  signals: VisionSignals,
): RankedTitle[] {
  // Build token set from all vision signals
  const signalTokens = new Set<string>()
  for (const t of signals.ocrTokens) signalTokens.add(t.toLowerCase())
  for (const we of signals.webEntities) {
    for (const t of extractTokens(we.desc)) signalTokens.add(t)
  }
  for (const label of signals.bestGuessLabels) {
    for (const t of extractTokens(label)) signalTokens.add(t)
  }
  for (const logo of signals.logos) signalTokens.add(logo.toLowerCase())

  // Brand detection: logos + known brand entities
  const brands = new Set(
    [
      signals.logos[0]?.toLowerCase(),
      ...signals.webEntities
        .filter((we) => KNOWN_BRANDS.has(we.desc.toLowerCase()))
        .map((we) => we.desc.toLowerCase()),
    ].filter(Boolean),
  )

  // Count title frequency for consensus scoring
  const normCounts = new Map<string, number>()
  for (const t of titles) {
    const norm = normalize(t).replace(/\s*[-,]\s*(black|white|blue|red|green|pink|gray|silver|gold).*$/, '').trim()
    normCounts.set(norm, (normCounts.get(norm) || 0) + 1)
  }

  return titles
    .map((title, index): RankedTitle => {
      const titleTokens = extractTokens(title)
      const titleLower = title.toLowerCase()

      // Text match (0–50): what fraction of signal tokens appear in this title
      const matching = titleTokens.filter((t) => signalTokens.has(t))
      const textMatch = Math.round(Math.min(50, (matching.length / Math.max(1, signalTokens.size)) * 80) * 100) / 100

      // Brand match (0–20)
      let brandMatch = 0
      for (const b of brands) {
        if (titleLower.includes(b)) { brandMatch = 20; break }
      }

      // Entity match (0–15): weighted by Vision's confidence score
      let entityMatch = 0
      for (const we of signals.webEntities) {
        if (titleLower.includes(we.desc.toLowerCase())) {
          entityMatch = Math.min(15, entityMatch + we.score * 10)
        }
      }
      entityMatch = Math.round(entityMatch * 100) / 100

      // Consensus (0–10): same normalized title from multiple merchants
      const norm = normalize(title).replace(/\s*[-,]\s*(black|white|blue|red|green|pink|gray|silver|gold).*$/, '').trim()
      const consensus = Math.min(10, ((normCounts.get(norm) ?? 0) - 1) * 5)

      // Noise penalty (0–15): penalize accessories, cases, cables, etc.
      let noisePenalty = 0
      for (const kw of NOISE_KEYWORDS) {
        if (titleLower.includes(kw)) noisePenalty += 5
      }
      noisePenalty = Math.min(15, noisePenalty)

      const total = Math.round(Math.max(0, textMatch + brandMatch + entityMatch + consensus - noisePenalty) * 100) / 100

      const breakdown: ScoreBreakdown = {
        title,
        textMatch,
        brandMatch,
        entityMatch,
        consensus,
        noisePenalty,
        total,
      }

      return { title, score: total, index, breakdown }
    })
    .sort((a, b) => b.score - a.score)
}
