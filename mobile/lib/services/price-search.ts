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

  // Fallback: use Vision API's pagesWithMatchingImages when CSE fails or returns nothing
  if ((cseFailed || merged.length === 0) && visionWebPages?.length) {
    console.log('[DeaLo] CSE failed/empty, falling back to Vision webPages (' + visionWebPages.length + ' pages)');
    const visionResults = parseVisionWebPages(visionWebPages);
    // Merge with any CSE results, dedup by domain
    const seenDomains = new Set(merged.map((r) => r.domain));
    for (const r of visionResults) {
      if (!seenDomains.has(r.domain)) {
        seenDomains.add(r.domain);
        merged.push(r);
      }
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
  if (!CSE_API_KEY || !CSE_ID || !productName.trim()) return [];
  const name = productName.trim();
  if (name.length < 3) return [];

  try {
    const reviewQuery = `${name} review rating`;
    console.log('[DeaLo] CSE reviews: searching for', reviewQuery);
    const result = await fetchCSE(reviewQuery);
    if (result.failed || result.items.length === 0) return [];

    const reviews: ReviewResult[] = [];
    for (const item of result.items) {
      let domain = '';
      try { domain = new URL(item.link || '').hostname.replace('www.', ''); } catch { continue; }

      // Extract aggregate rating from pagemap
      const aggRating = item.pagemap?.aggregaterating?.[0]
        || item.pagemap?.review?.[0];
      const ratingVal = parseFloat(aggRating?.ratingvalue || aggRating?.rating || '0');
      const maxVal = parseFloat(aggRating?.bestrating || '5') || 5;
      const reviewCount = parseInt(aggRating?.reviewcount || aggRating?.ratingcount || '0', 10) || null;

      // Also try metatags
      const metaRating = parseFloat(item.pagemap?.metatags?.[0]?.['rating'] || '0');

      const rating = ratingVal > 0 ? ratingVal : (metaRating > 0 ? metaRating : null);

      // Extract a review snippet
      const snippet = (item.snippet || '').trim();

      if (rating || snippet.length > 20) {
        reviews.push({
          source: domainToStore(domain),
          domain,
          url: item.link || '',
          rating: rating ? Math.min(rating, maxVal) : null,
          maxRating: maxVal,
          reviewCount,
          snippet: snippet.slice(0, 200),
        });
      }
    }

    // Deduplicate by domain, keep highest rated
    const byDomain = new Map<string, ReviewResult>();
    for (const r of reviews) {
      const existing = byDomain.get(r.domain);
      if (!existing || (r.rating || 0) > (existing.rating || 0)) {
        byDomain.set(r.domain, r);
      }
    }

    console.log('[DeaLo] CSE reviews: found', byDomain.size, 'reviews');
    return [...byDomain.values()].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } catch (err: any) {
    console.warn('[DeaLo] Review search error:', err?.message || err);
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
