/**
 * Safe price extraction utilities.
 *
 * Handles real-world SerpApi formats:
 *   "$49.99"  "49.99 USD"  "From $39"  "$279.00 - $349.00"
 *   extracted_price: 49.99 (number)  price: "$49.99" (string)
 *
 * Every function is null-safe — never throws on bad input.
 */

/**
 * Extract a numeric price from a value.
 *
 * Accepts:
 *   number   → returned directly (if positive and finite)
 *   string   → strips symbols, handles ranges (takes the lowest price)
 *   anything else → null
 */
export function parsePrice(raw: unknown): number | null {
  if (raw == null) return null

  // Numeric input (SerpApi's extracted_price is usually a number)
  if (typeof raw === 'number') {
    if (!isFinite(raw) || raw <= 0) return null
    return Math.round(raw * 100) / 100
  }

  if (typeof raw !== 'string') return null

  const str = raw.trim()
  if (!str) return null

  // Range price: "$279.00 - $349.00" or "$10 to $20" → take the lowest
  const rangeParts = str.split(/\s*[-–—]\s*|\s+to\s+/i)
  if (rangeParts.length > 1) {
    const prices = rangeParts
      .map((p) => extractFirstNumber(p))
      .filter((n): n is number => n !== null)
    if (prices.length > 0) return Math.min(...prices)
  }

  return extractFirstNumber(str)
}

/**
 * Pull the first valid positive number out of a string.
 * Strips currency symbols, commas, "From", etc.
 */
function extractFirstNumber(s: string): number | null {
  // Remove everything except digits, dots, and minus signs
  const cleaned = s.replace(/,/g, '').replace(/[^0-9.]/g, ' ').trim()
  if (!cleaned) return null

  // Match the first decimal-like number
  const match = cleaned.match(/(\d+(?:\.\d+)?)/)
  if (!match) return null

  const num = parseFloat(match[1])
  if (!isFinite(num) || num <= 0) return null

  return Math.round(num * 100) / 100
}

/**
 * Safely parse a rating value.
 * Accepts number or string ("4.5"), clamps to 0–5 range.
 */
export function parseRating(raw: unknown): number | null {
  if (raw == null) return null

  let num: number
  if (typeof raw === 'number') {
    num = raw
  } else if (typeof raw === 'string') {
    num = parseFloat(raw.trim())
  } else {
    return null
  }

  if (!isFinite(num) || num < 0 || num > 5) return null
  return Math.round(num * 10) / 10
}

/**
 * Safely parse a review count.
 * Accepts number or string ("1,234" or "1234").
 */
export function parseReviewCount(raw: unknown): number | null {
  if (raw == null) return null

  if (typeof raw === 'number') {
    if (!isFinite(raw) || raw < 0) return null
    return Math.round(raw)
  }

  if (typeof raw === 'string') {
    const cleaned = raw.replace(/,/g, '').trim()
    const num = parseInt(cleaned, 10)
    if (!isFinite(num) || num < 0) return null
    return num
  }

  return null
}

/**
 * Safely extract a non-empty string, or return null.
 */
export function safeString(raw: unknown): string | null {
  if (raw == null) return null
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : null
}

/**
 * Safely extract a URL string. Returns null if not a valid-looking URL.
 */
export function safeUrl(raw: unknown): string | null {
  const s = safeString(raw)
  if (!s) return null
  // Must start with http:// or https://
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  return null
}

/**
 * Extract currency code from a price string or SerpApi currency field.
 * Defaults to "USD" — never returns null or empty.
 */
export function parseCurrency(raw: unknown): string {
  if (raw == null) return 'USD'

  if (typeof raw === 'string' && raw.trim().length > 0) {
    const upper = raw.toUpperCase().trim()
    if (['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CNY', 'KRW', 'MXN', 'BRL'].includes(upper)) {
      return upper
    }
    if (raw.includes('$')) return 'USD'
    if (raw.includes('€')) return 'EUR'
    if (raw.includes('£')) return 'GBP'
    if (raw.includes('¥') || raw.includes('￥')) return 'JPY'
    if (raw.includes('₹')) return 'INR'
    if (raw.includes('₩')) return 'KRW'
    if (raw.includes('R$')) return 'BRL'
  }

  return 'USD'
}
