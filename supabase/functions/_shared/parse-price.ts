/**
 * Safe price extraction utilities.
 * Handles various formats: "$49.99", "49.99 USD", "From $39", etc.
 */

/**
 * Extract a numeric price from a string like "$49.99" or "49.99".
 * Returns null if no valid price can be parsed.
 */
export function parsePrice(raw: unknown): number | null {
  if (typeof raw === 'number' && isFinite(raw) && raw > 0) {
    return Math.round(raw * 100) / 100
  }

  if (typeof raw !== 'string') return null

  // Strip currency symbols, commas, whitespace
  const cleaned = raw.replace(/[^0-9.]/g, '')
  if (!cleaned) return null

  const num = parseFloat(cleaned)
  if (!isFinite(num) || num <= 0) return null

  return Math.round(num * 100) / 100
}

/**
 * Extract currency code from a price string or SerpApi field.
 * Defaults to "USD".
 */
export function parseCurrency(raw: unknown): string {
  if (typeof raw === 'string') {
    const upper = raw.toUpperCase().trim()
    if (['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'].includes(upper)) {
      return upper
    }
    if (raw.includes('$')) return 'USD'
    if (raw.includes('€')) return 'EUR'
    if (raw.includes('£')) return 'GBP'
    if (raw.includes('¥')) return 'JPY'
  }
  return 'USD'
}
