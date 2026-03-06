/**
 * Query builder for the scan pipeline.
 *
 * Given VisionSignals extracted from a photo, generates 3–5 ranked
 * search queries. The first query is the highest-confidence guess;
 * later queries are progressively broader fallbacks.
 *
 * This is intentionally category-agnostic so it works for electronics,
 * clothing, home goods, food, etc.
 */

import type { VisionSignals } from './types.ts'
import { extractTokens } from './vision.ts'

// Known consumer brands — helps distinguish brand tokens from noise
const KNOWN_BRANDS = new Set([
  'jbl', 'sony', 'bose', 'apple', 'samsung', 'nike', 'adidas', 'beats', 'lg',
  'google', 'microsoft', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'razer',
  'logitech', 'anker', 'skullcandy', 'sennheiser', 'harman', 'marshall',
  'ultimate ears', 'jabra', 'corsair', 'steelseries', 'hyperx',
  'nintendo', 'playstation', 'xbox', 'gopro', 'dji', 'canon', 'nikon',
  'dyson', 'kitchenaid', 'ninja', 'breville', 'cuisinart',
  'north face', 'patagonia', 'under armour', 'new balance', 'puma', 'reebok',
  'columbia', 'lululemon', 'ray-ban', 'oakley', 'yeti', 'hydro flask',
  'crocs', 'birkenstock', 'vans', 'converse',
])

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s.\-]/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Build 3–5 search queries from Vision signals, ranked by expected specificity.
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

  const brand = signals.logos[0] ?? ''
  const brandLower = brand.toLowerCase()

  // ── 1. Best-guess labels (Google's top identification) ──────────
  for (const label of signals.bestGuessLabels) {
    add(label)
    // Prepend brand if not already included
    if (brand && !label.toLowerCase().includes(brandLower)) {
      add(`${brand} ${label}`)
    }
  }

  // ── 2. Brand + OCR model tokens ────────────────────────────────
  if (brand) {
    const modelTokens = signals.ocrTokens.filter((t) => {
      if (t.toLowerCase() === brandLower) return false
      // Keep tokens with digits (model numbers) or short alphanum strings
      if (/\d/.test(t)) return true
      if (t.length >= 3 && t.length <= 15 && /^[a-z0-9]+$/i.test(t)) return true
      return false
    })

    if (modelTokens.length > 0) {
      // Combine brand with 1–3 model tokens
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

// ─── Reranking ───────────────────────────────────────────────────────

// Accessory / noise keywords — penalize candidates with these
const NOISE_KEYWORDS = new Set([
  'case', 'cover', 'sleeve', 'protector', 'screen protector',
  'replacement', 'parts', 'adapter', 'cable', 'charger',
  'mount', 'strap', 'skin', 'compatible', 'fits',
  'refurbished', 'renewed', 'used', 'bundle', 'lot',
])

export interface ScoredTitle {
  title: string
  score: number
  index: number
}

/**
 * Score candidate titles against Vision signals.
 * Returns a sorted list (highest score first).
 */
export function rankCandidateTitles(
  titles: string[],
  signals: VisionSignals,
): ScoredTitle[] {
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

  // Brand detection
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
    .map((title, index): ScoredTitle => {
      const titleTokens = extractTokens(title)
      const titleLower = title.toLowerCase()

      // Text match (0–50)
      const matching = titleTokens.filter((t) => signalTokens.has(t))
      const textMatch = Math.min(50, (matching.length / Math.max(1, signalTokens.size)) * 80)

      // Brand match (0–20)
      let brandMatch = 0
      for (const b of brands) {
        if (titleLower.includes(b)) { brandMatch = 20; break }
      }

      // Entity match (0–15)
      let entityMatch = 0
      for (const we of signals.webEntities) {
        if (titleLower.includes(we.desc.toLowerCase())) {
          entityMatch = Math.min(15, entityMatch + we.score * 10)
        }
      }

      // Consensus (0–10)
      const norm = normalize(title).replace(/\s*[-,]\s*(black|white|blue|red|green|pink|gray|silver|gold).*$/, '').trim()
      const consensus = Math.min(10, ((normCounts.get(norm) ?? 0) - 1) * 5)

      // Noise penalty (0–15)
      let noisePenalty = 0
      for (const kw of NOISE_KEYWORDS) {
        if (titleLower.includes(kw)) noisePenalty += 5
      }
      noisePenalty = Math.min(15, noisePenalty)

      const score = Math.max(0, textMatch + brandMatch + entityMatch + consensus - noisePenalty)
      return { title, score, index }
    })
    .sort((a, b) => b.score - a.score)
}
