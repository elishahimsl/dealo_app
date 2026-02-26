import { supabase } from '../supabase';

const CSE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY!;
const CSE_ID = process.env.EXPO_PUBLIC_GOOGLE_CSE_ID!;
const AMAZON_TAG = process.env.EXPO_PUBLIC_AMAZON_ASSOCIATE_TAG!;

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
async function fetchCSE(query: string): Promise<any[]> {
  const url = `https://www.googleapis.com/customsearch/v1?key=${CSE_API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(query)}&num=10`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const res = await fetch(url, { signal: controller.signal as any });
  clearTimeout(timeout);

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.warn('[DeaLo] CSE search failed:', res.status, errText.slice(0, 200));
    return [];
  }

  const json: any = await res.json();
  return json.items || [];
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
export async function searchProductPrices(productName: string): Promise<PriceResult[]> {
  if (!CSE_API_KEY || !CSE_ID || !productName.trim()) return [];

  const name = productName.trim();
  // Skip overly generic names that produce useless results
  const SKIP_NAMES = new Set([
    'product', 'unknown product', 'unknown', 'signage', 'sign', 'electronics',
    'technology', 'gadget', 'device', 'label', 'packaging', 'brand', 'display',
    'audio equipment', 'electronic device', 'multimedia', 'object', 'item',
  ]);
  if (name.length < 3 || SKIP_NAMES.has(name.toLowerCase())) {
    console.warn('[DeaLo] CSE: skipping generic product name:', name);
    return [];
  }

  try {
    // Run two search queries in parallel for broader coverage
    const shoppingQuery = `${name} buy price`;
    const compareQuery = `${name} best price comparison`;

    console.log('[DeaLo] CSE: searching for', shoppingQuery);
    const [shoppingItems, compareItems] = await Promise.all([
      fetchCSE(shoppingQuery),
      fetchCSE(compareQuery).catch(() => [] as any[]),
    ]);

    console.log('[DeaLo] CSE: got', shoppingItems.length, '+', compareItems.length, 'results');

    const shoppingResults = parseCSEItems(shoppingItems);
    const compareResults = parseCSEItems(compareItems);

    // Merge & deduplicate by domain+price
    const seen = new Set<string>();
    const merged: PriceResult[] = [];
    for (const r of [...shoppingResults, ...compareResults]) {
      const key = `${r.domain}|${r.price}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(r);
    }

    // Sort: items with prices first, then by price ascending
    merged.sort((a, b) => {
      if (a.price !== null && b.price === null) return -1;
      if (a.price === null && b.price !== null) return 1;
      if (a.price !== null && b.price !== null) return a.price - b.price;
      return 0;
    });

    return merged;
  } catch (err: any) {
    console.warn('[DeaLo] Price search error:', err?.message || err);
    return [];
  }
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
