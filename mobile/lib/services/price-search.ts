import { supabase } from '../supabase';

// Prefer dedicated CSE key; fall back to Vision key
const CSE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_CSE_KEY || process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || '';
const CSE_ID = process.env.EXPO_PUBLIC_GOOGLE_CSE_ID || '';
const AMAZON_TAG = process.env.EXPO_PUBLIC_AMAZON_ASSOCIATE_TAG || '';

export interface PriceResult {
  title: string;
  price: number | null;
  currency: string;
  store: string;
  domain: string;
  url: string;
  affiliateUrl: string | null;
  snippet: string;
  imageUrl: string | null;
}

export interface ReviewResult {
  source: string;
  domain: string;
  url: string;
  rating: number | null;      // e.g. 4.7
  maxRating: number;           // e.g. 5
  reviewCount: number | null;  // e.g. 1234
  snippet: string;             // short review excerpt
}

export interface ProductImage {
  url: string;
  source: string;  // store name or 'vision'
}

export interface FullSearchResult {
  priceResults: PriceResult[];
  reviews: ReviewResult[];
  images: ProductImage[];
}

/**
 * Extract price from a string like "$149.99" or "149.99 USD"
 */
function extractPrice(text: string): number | null {
  const match = text.match(/\$?\s*([\d,]+\.?\d{0,2})/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/,/g, ''));
  return isNaN(num) || num <= 0 || num > 99999 ? null : num;
}

/**
 * Build an Amazon affiliate URL
 */
function buildAffiliateUrl(url: string, domain: string): string | null {
  if (domain.includes('amazon.com') && AMAZON_TAG) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}tag=${AMAZON_TAG}`;
  }
  return null;
}

/**
 * Fetch CSE results for a given query string
 */
async function fetchCSE(query: string): Promise<{ items: any[]; failed: boolean }> {
  const url = `https://www.googleapis.com/customsearch/v1?key=${CSE_API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(query)}&num=10`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, { signal: controller.signal as any });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[DeaLo] CSE ${res.status} for "${query}":`, errText.slice(0, 300));
      // 403 = API key restriction or API not enabled
      if (res.status === 403) {
        console.warn('[DeaLo] CSE 403 — likely API key restriction. Go to Google Cloud Console > APIs & Services > Credentials > click your API key > under "API restrictions" add "Custom Search JSON API" or set to "Don\'t restrict key"');
      }
      return { items: [], failed: true };
    }

    const json: any = await res.json();
    return { items: json.items || [], failed: false };
  } catch (e: any) {
    clearTimeout(timeout);
    console.warn('[DeaLo] CSE fetch error:', e?.message || e);
    return { items: [], failed: true };
  }
}

/**
 * Parse Vision API pagesWithMatchingImages into PriceResults.
 * This is a fallback when CSE fails — extracts retailer URLs and prices from page titles.
 */
export function parseVisionWebPages(webPages: { url: string; title: string }[]): PriceResult[] {
  const results: PriceResult[] = [];

  for (const page of webPages) {
    let domain = '';
    try {
      domain = new URL(page.url).hostname.replace('www.', '');
    } catch {
      continue;
    }

    const storeName = domainToStore(domain);
    const title = page.title
      .replace(/\s*[-|–—]\s*[^-|–—]*$/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    if (!title || title.length < 3) continue;

    // Try to extract price from title
    const price = extractPrice(page.title);
    const affiliateUrl = buildAffiliateUrl(page.url, domain);

    results.push({
      title: title.slice(0, 100),
      price,
      currency: 'USD',
      store: storeName,
      domain,
      url: page.url,
      affiliateUrl,
      snippet: page.title,
      imageUrl: null,
    });
  }

  // Deduplicate by domain
  const seen = new Set<string>();
  const deduped: PriceResult[] = [];
  for (const r of results) {
    if (seen.has(r.domain)) continue;
    seen.add(r.domain);
    deduped.push(r);
  }

  return deduped;
}

// ─── WEB SEARCH FALLBACK (no API key needed) ────────────────────────────────

const RETAILER_DOMAINS = [
  'amazon.com', 'walmart.com', 'target.com', 'bestbuy.com', 'ebay.com',
  'newegg.com', 'costco.com', 'bhphotovideo.com', 'adorama.com', 'kohls.com',
  'macys.com', 'nordstrom.com', 'homedepot.com', 'lowes.com', 'samsclub.com',
  'staples.com', 'officedepot.com', 'microcenter.com', 'jbl.com', 'bose.com',
  'sony.com', 'samsung.com', 'dell.com', 'hp.com', 'lenovo.com', 'apple.com',
  'nike.com', 'adidas.com', 'crutchfield.com', 'harmankardon.com',
  'skullcandy.com', 'rei.com', 'zappos.com', 'overstock.com',
];

/**
 * Fallback web search using DuckDuckGo HTML (no API key needed).
 * React Native fetch has no CORS, so this works on mobile.
 */
async function fetchWebSearchFallback(query: string): Promise<{ results: { url: string; title: string; snippet: string }[] }> {
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  console.log('[DeaLo] Fallback web search:', query);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; DeaLo/1.0)',
      },
      body: `q=${encodeURIComponent(query)}`,
      signal: controller.signal as any,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn('[DeaLo] Fallback search HTTP', res.status);
      return { results: [] };
    }

    const html = await res.text();
    return { results: parseDDGHtml(html) };
  } catch (e: any) {
    clearTimeout(timeout);
    console.warn('[DeaLo] Fallback search error:', e?.message || e);
    return { results: [] };
  }
}

/**
 * Parse DuckDuckGo HTML results into structured data.
 */
function parseDDGHtml(html: string): { url: string; title: string; snippet: string }[] {
  const results: { url: string; title: string; snippet: string }[] = [];

  // DuckDuckGo HTML results have links in <a class="result__a" href="...">title</a>
  // and snippets in <a class="result__snippet">...</a>
  // We use regex since we can't use DOM parser in React Native
  const resultBlocks = html.split(/class="result__body"|class="result "/g);

  for (const block of resultBlocks) {
    // Extract URL from uddg= redirect parameter or direct href
    const urlMatch = block.match(/href="[^"]*uddg=([^&"]+)/)
      || block.match(/href="(https?:\/\/[^"]+)"[^>]*class="result__a"/);
    if (!urlMatch) continue;

    let url = '';
    try {
      url = decodeURIComponent(urlMatch[1]);
    } catch {
      url = urlMatch[1];
    }
    if (!url.startsWith('http')) continue;

    // Extract title — text between result__a tags
    const titleMatch = block.match(/class="result__a"[^>]*>([^<]+)</);
    const title = titleMatch
      ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
      : '';

    // Extract snippet
    const snippetMatch = block.match(/class="result__snippet"[^>]*>(.*?)<\/a>/s);
    const snippet = snippetMatch
      ? snippetMatch[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
      : '';

    if (title || snippet) {
      results.push({ url, title, snippet });
    }
  }

  console.log('[DeaLo] Fallback: parsed', results.length, 'results from DDG HTML');
  return results;
}

/**
 * Convert DuckDuckGo web search results into PriceResults.
 */
function parseFallbackResults(results: { url: string; title: string; snippet: string }[]): PriceResult[] {
  const priceResults: PriceResult[] = [];

  for (const r of results) {
    let domain = '';
    try {
      domain = new URL(r.url).hostname.replace('www.', '');
    } catch {
      continue;
    }

    // Try to extract price from snippet or title
    const price = extractPrice(r.snippet) || extractPrice(r.title);
    const storeName = domainToStore(domain);
    const affiliateUrl = buildAffiliateUrl(r.url, domain);

    priceResults.push({
      title: r.title.replace(/ - .*$/, '').replace(/\|.*$/, '').trim() || storeName,
      price,
      currency: 'USD',
      store: storeName,
      domain,
      url: r.url,
      affiliateUrl,
      snippet: r.snippet,
      imageUrl: null,
    });
  }

  return priceResults;
}

/**
 * Extract review data from DuckDuckGo search results.
 */
function parseReviewsFromFallback(results: { url: string; title: string; snippet: string }[]): ReviewResult[] {
  const reviews: ReviewResult[] = [];

  for (const r of results) {
    let domain = '';
    try {
      domain = new URL(r.url).hostname.replace('www.', '');
    } catch {
      continue;
    }

    // Try to extract rating from snippet (e.g., "4.7 out of 5", "Rating: 4.5/5", "4.7 stars")
    const ratingMatch = r.snippet.match(/(\d\.\d)\s*(?:out of|\/)\s*(\d)/)
      || r.snippet.match(/(?:rating|rated|stars?)\s*:?\s*(\d\.\d)/i)
      || r.title.match(/(\d\.\d)\s*(?:out of|\/)\s*(\d)/);

    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    const maxRating = ratingMatch?.[2] ? parseFloat(ratingMatch[2]) : 5;

    // Try to extract review count
    const countMatch = r.snippet.match(/(\d[\d,]*)\s*(?:reviews?|ratings?)/i);
    const reviewCount = countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : null;

    if (rating || r.snippet.length > 30) {
      reviews.push({
        source: domainToStore(domain),
        domain,
        url: r.url,
        rating,
        maxRating,
        reviewCount,
        snippet: r.snippet.slice(0, 200),
      });
    }
  }

  // Deduplicate by domain
  const byDomain = new Map<string, ReviewResult>();
  for (const r of reviews) {
    const existing = byDomain.get(r.domain);
    if (!existing || (r.rating || 0) > (existing.rating || 0)) {
      byDomain.set(r.domain, r);
    }
  }

  return [...byDomain.values()].sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Parse CSE items into PriceResult[]
 */
function parseCSEItems(items: any[]): PriceResult[] {
  const results: PriceResult[] = [];

  for (const item of items) {
    const link: string = item.link || '';
    const title: string = item.title || '';
    const snippet: string = item.snippet || '';

    // Extract domain
    let domain = '';
    try {
      domain = new URL(link).hostname.replace('www.', '');
    } catch {
      continue;
    }

    // Try to extract price from multiple structured-data sources
    const priceFromMeta =
      item.pagemap?.offer?.[0]?.price
      || item.pagemap?.product?.[0]?.price
      || item.pagemap?.metatags?.[0]?.['product:price:amount']
      || item.pagemap?.metatags?.[0]?.['og:price:amount']
      || null;

    const price = priceFromMeta
      ? extractPrice(String(priceFromMeta))
      : extractPrice(snippet) || extractPrice(title);

    // Determine store name from domain
    const storeName = domainToStore(domain);
    const affiliateUrl = buildAffiliateUrl(link, domain);

    // Get image from multiple sources
    const imageUrl =
      item.pagemap?.cse_image?.[0]?.src
      || item.pagemap?.product?.[0]?.image
      || item.pagemap?.metatags?.[0]?.['og:image']
      || item.pagemap?.cse_thumbnail?.[0]?.src
      || null;

    results.push({
      title: title.replace(/ - .*$/, '').replace(/\|.*$/, '').trim(),
      price,
      currency: 'USD',
      store: storeName,
      domain,
      url: link,
      affiliateUrl,
      snippet,
      imageUrl,
    });
  }

  return results;
}

/**
 * Search Google CSE for product prices across retailers.
 * Runs two queries in parallel: a shopping-focused query and a review/comparison query.
 */
export async function searchProductPrices(
  productName: string,
  visionWebPages?: { url: string; title: string }[]
): Promise<PriceResult[]> {
  const name = productName.trim();
  // Skip overly generic names that produce useless results
  const SKIP_NAMES = new Set([
    'product', 'unknown product', 'unknown', 'signage', 'sign', 'electronics',
    'technology', 'gadget', 'device', 'label', 'packaging', 'brand', 'display',
    'audio equipment', 'electronic device', 'multimedia', 'object', 'item',
  ]);
  if (!name || name.length < 3 || SKIP_NAMES.has(name.toLowerCase())) {
    console.warn('[DeaLo] CSE: skipping generic product name:', name);
    // Even for generic names, try vision web pages
    if (visionWebPages?.length) {
      console.log('[DeaLo] Using Vision webPages fallback for generic name');
      return parseVisionWebPages(visionWebPages);
    }
    return [];
  }

  let cseFailed = false;
  let merged: PriceResult[] = [];

  // Try CSE first if keys are available
  if (CSE_API_KEY && CSE_ID) {
    try {
      const shoppingQuery = `${name} buy price`;
      const compareQuery = `${name} best price comparison`;

      console.log('[DeaLo] CSE: searching for', shoppingQuery);
      const [shoppingResult, compareResult] = await Promise.all([
        fetchCSE(shoppingQuery),
        fetchCSE(compareQuery),
      ]);

      cseFailed = shoppingResult.failed && compareResult.failed;

      console.log('[DeaLo] CSE: got', shoppingResult.items.length, '+', compareResult.items.length, 'results', cseFailed ? '(both failed)' : '');

      const shoppingResults = parseCSEItems(shoppingResult.items);
      const compareResults = parseCSEItems(compareResult.items);

      const seen = new Set<string>();
      for (const r of [...shoppingResults, ...compareResults]) {
        const key = `${r.domain}|${r.price}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(r);
      }
    } catch (err: any) {
      console.warn('[DeaLo] CSE error:', err?.message || err);
      cseFailed = true;
    }
  } else {
    console.warn('[DeaLo] CSE: no API key or CSE ID configured');
    cseFailed = true;
  }

  // Fallback 1: Vision API's pagesWithMatchingImages
  if ((cseFailed || merged.length === 0) && visionWebPages?.length) {
    console.log('[DeaLo] Trying Vision webPages fallback (' + visionWebPages.length + ' pages)');
    const visionResults = parseVisionWebPages(visionWebPages);
    const seenDomains = new Set(merged.map((r) => r.domain));
    for (const r of visionResults) {
      if (!seenDomains.has(r.domain)) {
        seenDomains.add(r.domain);
        merged.push(r);
      }
    }
  }

  // Fallback 2: DuckDuckGo web search (free, no API key)
  if (cseFailed || merged.length === 0) {
    console.log('[DeaLo] CSE unavailable, using web search fallback for prices');
    try {
      const ddgPriceSearch = await fetchWebSearchFallback(`${name} buy price USD`);
      const ddgResults = parseFallbackResults(ddgPriceSearch.results);
      const seenDomains = new Set(merged.map((r) => r.domain));
      for (const r of ddgResults) {
        if (!seenDomains.has(r.domain)) {
          seenDomains.add(r.domain);
          merged.push(r);
        }
      }
      console.log('[DeaLo] Fallback: added', ddgResults.length, 'results from web search');
    } catch (err: any) {
      console.warn('[DeaLo] Web search fallback error:', err?.message || err);
    }
  }

  // Sort: items with prices first, then by price ascending
  merged.sort((a, b) => {
    if (a.price !== null && b.price === null) return -1;
    if (a.price === null && b.price !== null) return 1;
    if (a.price !== null && b.price !== null) return a.price - b.price;
    return 0;
  });

  return merged;
}

/**
 * Search for product reviews via CSE. Parses aggregate ratings from pagemap.
 */
export async function searchProductReviews(
  productName: string
): Promise<ReviewResult[]> {
  const name = productName.trim();
  if (name.length < 3) return [];

  // Try CSE first
  if (CSE_API_KEY && CSE_ID) {
    try {
      const reviewQuery = `${name} review rating`;
      console.log('[DeaLo] CSE reviews: searching for', reviewQuery);
      const result = await fetchCSE(reviewQuery);
      if (!result.failed && result.items.length > 0) {
        const reviews: ReviewResult[] = [];
        for (const item of result.items) {
          let domain = '';
          try { domain = new URL(item.link || '').hostname.replace('www.', ''); } catch { continue; }

          const aggRating = item.pagemap?.aggregaterating?.[0]
            || item.pagemap?.review?.[0];
          const ratingVal = parseFloat(aggRating?.ratingvalue || aggRating?.rating || '0');
          const maxVal = parseFloat(aggRating?.bestrating || '5') || 5;
          const reviewCount = parseInt(aggRating?.reviewcount || aggRating?.ratingcount || '0', 10) || null;
          const metaRating = parseFloat(item.pagemap?.metatags?.[0]?.['rating'] || '0');
          const rating = ratingVal > 0 ? ratingVal : (metaRating > 0 ? metaRating : null);
          const snippet = (item.snippet || '').trim();

          if (rating || snippet.length > 20) {
            reviews.push({
              source: domainToStore(domain), domain, url: item.link || '',
              rating: rating ? Math.min(rating, maxVal) : null,
              maxRating: maxVal, reviewCount, snippet: snippet.slice(0, 200),
            });
          }
        }

        const byDomain = new Map<string, ReviewResult>();
        for (const r of reviews) {
          const existing = byDomain.get(r.domain);
          if (!existing || (r.rating || 0) > (existing.rating || 0)) byDomain.set(r.domain, r);
        }
        if (byDomain.size > 0) {
          console.log('[DeaLo] CSE reviews: found', byDomain.size);
          return [...byDomain.values()].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
      }
    } catch (err: any) {
      console.warn('[DeaLo] CSE review search error:', err?.message || err);
    }
  }

  // Fallback: DuckDuckGo web search for reviews
  console.log('[DeaLo] Using web search fallback for reviews');
  try {
    const ddg = await fetchWebSearchFallback(`${name} review rating stars`);
    const reviews = parseReviewsFromFallback(ddg.results);
    console.log('[DeaLo] Fallback reviews: found', reviews.length);
    return reviews;
  } catch (err: any) {
    console.warn('[DeaLo] Fallback review search error:', err?.message || err);
    return [];
  }
}

/**
 * Collect product images from CSE results and Vision API data.
 */
export function collectProductImages(
  priceResults: PriceResult[],
  visionWebPages?: { url: string; title: string }[]
): ProductImage[] {
  const seen = new Set<string>();
  const images: ProductImage[] = [];

  // From price/CSE results
  for (const r of priceResults) {
    if (r.imageUrl && !seen.has(r.imageUrl)) {
      seen.add(r.imageUrl);
      images.push({ url: r.imageUrl, source: r.store });
    }
  }

  return images.slice(0, 10); // Cap at 10 images
}

/**
 * Full product search: prices + reviews + images in parallel
 */
export async function fullProductSearch(
  productName: string,
  visionWebPages?: { url: string; title: string }[]
): Promise<FullSearchResult> {
  const [priceResults, reviews] = await Promise.all([
    searchProductPrices(productName, visionWebPages),
    searchProductReviews(productName).catch(() => [] as ReviewResult[]),
  ]);

  const images = collectProductImages(priceResults, visionWebPages);

  console.log('[DeaLo] Full search:', priceResults.length, 'prices,', reviews.length, 'reviews,', images.length, 'images');
  return { priceResults, reviews, images };
}

function domainToStore(domain: string): string {
  const map: Record<string, string> = {
    'amazon.com': 'Amazon',
    'target.com': 'Target',
    'walmart.com': 'Walmart',
    'bestbuy.com': 'Best Buy',
    'nike.com': 'Nike',
    'apple.com': 'Apple',
    'ebay.com': 'eBay',
    'newegg.com': 'Newegg',
    'costco.com': 'Costco',
    'kohls.com': "Kohl's",
    'macys.com': "Macy's",
    'nordstrom.com': 'Nordstrom',
    'homedepot.com': 'Home Depot',
    'lowes.com': "Lowe's",
    'bhphotovideo.com': 'B&H Photo',
    'adorama.com': 'Adorama',
    'jbl.com': 'JBL',
    'crutchfield.com': 'Crutchfield',
    'samsung.com': 'Samsung',
    'dell.com': 'Dell',
    'hp.com': 'HP',
    'lenovo.com': 'Lenovo',
    'samsclub.com': "Sam's Club",
    'staples.com': 'Staples',
    'officedepot.com': 'Office Depot',
    'microcenter.com': 'Micro Center',
    'harmankardon.com': 'Harman Kardon',
    'bose.com': 'Bose',
    'sony.com': 'Sony',
    'skullcandy.com': 'Skullcandy',
  };

  for (const [key, val] of Object.entries(map)) {
    if (domain.includes(key)) return val;
  }

  // Capitalize first letter of domain
  const name = domain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
