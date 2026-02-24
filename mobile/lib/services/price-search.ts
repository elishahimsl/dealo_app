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
 * Search Google CSE for product prices across retailers
 */
export async function searchProductPrices(productName: string): Promise<PriceResult[]> {
  if (!CSE_API_KEY || !CSE_ID || !productName.trim()) return [];

  const query = `${productName.trim()} price buy`;

  try {
    console.log('[DeaLo] CSE: searching for', query);
    const url = `https://www.googleapis.com/customsearch/v1?key=${CSE_API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(query)}&num=10`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, { signal: controller.signal as any });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn('[DeaLo] CSE search failed:', res.status, await res.text().catch(() => ''));
      return [];
    }

    const json: any = await res.json();
    console.log('[DeaLo] CSE: got', json.items?.length ?? 0, 'results');
    const items: any[] = json.items || [];

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

      // Try to extract price from multiple sources
      const priceFromMeta = item.pagemap?.offer?.[0]?.price
        || item.pagemap?.product?.[0]?.price
        || null;

      const price = priceFromMeta
        ? extractPrice(String(priceFromMeta))
        : extractPrice(snippet) || extractPrice(title);

      // Determine store name from domain
      const storeName = domainToStore(domain);

      const affiliateUrl = buildAffiliateUrl(link, domain);

      // Get image
      const imageUrl = item.pagemap?.cse_image?.[0]?.src
        || item.pagemap?.product?.[0]?.image
        || null;

      results.push({
        title: title.replace(/ - .*$/, '').trim(), // Clean title
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

    // Sort: items with prices first, then by price ascending
    results.sort((a, b) => {
      if (a.price !== null && b.price === null) return -1;
      if (a.price === null && b.price !== null) return 1;
      if (a.price !== null && b.price !== null) return a.price - b.price;
      return 0;
    });

    return results;
  } catch (err) {
    console.warn('Price search error:', err);
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
  };

  for (const [key, val] of Object.entries(map)) {
    if (domain.includes(key)) return val;
  }

  // Capitalize first letter of domain
  const name = domain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
