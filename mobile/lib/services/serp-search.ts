/**
 * SerpApi Google Shopping integration for DeaLo.
 * Returns structured product data: prices, images, ratings, merchants.
 * Sign up at https://serpapi.com — free tier: 100 searches/month.
 */

const SERP_API_KEY = process.env.EXPO_PUBLIC_SERP_API_KEY || '';

export interface ShoppingResult {
  title: string;
  price: number | null;
  priceRaw: string;
  store: string;
  link: string;
  imageUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  delivery: string | null;
}

export interface ProductReview {
  source: string;
  rating: number | null;
  maxRating: number;
  reviewCount: number | null;
  snippet: string;
  url: string;
}

export interface SerpProductData {
  /** Exact product name from shopping results (most common title) */
  canonicalName: string | null;
  shopping: ShoppingResult[];
  reviews: ProductReview[];
  images: string[];
  knowledgePanel: {
    title: string | null;
    description: string | null;
    specs: { label: string; value: string }[];
  } | null;
}

/**
 * Check if SerpApi is configured.
 */
export function isSerpApiConfigured(): boolean {
  return !!SERP_API_KEY;
}

/**
 * Search Google Shopping via SerpApi for structured product data.
 */
export async function serpGoogleShopping(productName: string): Promise<ShoppingResult[]> {
  if (!SERP_API_KEY) return [];
  const query = `${productName.trim()} buy`;

  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}&hl=en&gl=us&num=15`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    console.log('[DeaLo] SerpApi Shopping: searching for', query);
    const res = await fetch(url, { signal: controller.signal as any });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('[DeaLo] SerpApi Shopping HTTP', res.status, errText.slice(0, 200));
      return [];
    }

    const json: any = await res.json();
    const items: any[] = json.shopping_results || [];
    console.log('[DeaLo] SerpApi Shopping: got', items.length, 'results');

    return items.map((item: any) => ({
      title: (item.title || '').trim(),
      price: item.extracted_price ?? null,
      priceRaw: item.price || '',
      store: item.source || '',
      link: item.link || item.product_link || '',
      imageUrl: item.thumbnail || null,
      rating: item.rating ?? null,
      reviewCount: item.reviews ?? null,
      delivery: item.delivery || null,
    }));
  } catch (e: any) {
    clearTimeout(timeout);
    console.warn('[DeaLo] SerpApi Shopping error:', e?.message || e);
    return [];
  }
}

/**
 * Search Google organic results via SerpApi for reviews and knowledge panel.
 */
export async function serpGoogleOrganic(productName: string): Promise<{
  reviews: ProductReview[];
  knowledgePanel: SerpProductData['knowledgePanel'];
  images: string[];
}> {
  if (!SERP_API_KEY) return { reviews: [], knowledgePanel: null, images: [] };
  const query = `${productName.trim()} review`;

  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}&hl=en&gl=us&num=10`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    console.log('[DeaLo] SerpApi Organic: searching for', query);
    const res = await fetch(url, { signal: controller.signal as any });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn('[DeaLo] SerpApi Organic HTTP', res.status);
      return { reviews: [], knowledgePanel: null, images: [] };
    }

    const json: any = await res.json();

    // Extract reviews from organic results
    const reviews: ProductReview[] = [];
    for (const item of json.organic_results || []) {
      const rating = item.rich_snippet?.top?.detected_extensions?.rating ?? null;
      const reviewCount = item.rich_snippet?.top?.detected_extensions?.reviews ?? null;
      let domain = '';
      try { domain = new URL(item.link || '').hostname.replace('www.', ''); } catch { continue; }

      if (rating || (item.snippet || '').length > 30) {
        reviews.push({
          source: item.source || domain,
          rating: typeof rating === 'number' ? rating : null,
          maxRating: 5,
          reviewCount: typeof reviewCount === 'number' ? reviewCount : null,
          snippet: (item.snippet || '').slice(0, 250),
          url: item.link || '',
        });
      }
    }

    // Knowledge panel
    let knowledgePanel: SerpProductData['knowledgePanel'] = null;
    const kp = json.knowledge_graph;
    if (kp) {
      const specs: { label: string; value: string }[] = [];
      // Extract specs from knowledge graph attributes
      for (const [key, val] of Object.entries(kp)) {
        if (typeof val === 'string' && !['title', 'description', 'type', 'source', 'image', 'thumbnail'].includes(key)) {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          specs.push({ label, value: val });
        }
      }

      knowledgePanel = {
        title: kp.title || null,
        description: kp.description || null,
        specs: specs.slice(0, 10),
      };
    }

    // Images from inline images
    const images: string[] = [];
    for (const img of json.inline_images || []) {
      if (img.original || img.thumbnail) {
        images.push(img.original || img.thumbnail);
      }
    }

    console.log('[DeaLo] SerpApi Organic:', reviews.length, 'reviews,', images.length, 'images, knowledge_panel:', !!knowledgePanel);
    return { reviews, knowledgePanel, images };
  } catch (e: any) {
    clearTimeout(timeout);
    console.warn('[DeaLo] SerpApi Organic error:', e?.message || e);
    return { reviews: [], knowledgePanel: null, images: [] };
  }
}

/**
 * Full SerpApi product search: shopping + organic in parallel.
 * Returns structured prices, reviews, images, and knowledge panel.
 */
export async function serpFullProductSearch(productName: string): Promise<SerpProductData> {
  if (!SERP_API_KEY) {
    console.warn('[DeaLo] SerpApi: no API key configured. Sign up at https://serpapi.com (free: 100 searches/mo)');
    return { canonicalName: null, shopping: [], reviews: [], images: [], knowledgePanel: null };
  }

  const [shopping, organic] = await Promise.all([
    serpGoogleShopping(productName),
    serpGoogleOrganic(productName),
  ]);

  // Determine canonical product name from shopping results (most common title prefix)
  let canonicalName: string | null = null;
  if (shopping.length > 0) {
    // Find the most common product title (clean it up)
    const titleCounts = new Map<string, number>();
    for (const s of shopping) {
      // Normalize: remove color/size suffixes, take first meaningful part
      const cleaned = s.title
        .replace(/\s*[-,]\s*(Black|White|Blue|Red|Green|Pink|Gray|Grey|Silver|Gold|Purple|Orange|Yellow).*$/i, '')
        .replace(/\s*\(.*?\)/g, '')
        .trim();
      if (cleaned.length > 3) {
        titleCounts.set(cleaned, (titleCounts.get(cleaned) || 0) + 1);
      }
    }
    // Pick most common, or if tied, the shortest (most concise = most accurate)
    const sorted = [...titleCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length);
    canonicalName = sorted[0]?.[0] || shopping[0]?.title || null;
  }

  // Collect all unique images
  const imageSet = new Set<string>();
  for (const s of shopping) {
    if (s.imageUrl) imageSet.add(s.imageUrl);
  }
  for (const img of organic.images) {
    imageSet.add(img);
  }

  console.log('[DeaLo] SerpApi full search:', shopping.length, 'shopping,', organic.reviews.length, 'reviews,', imageSet.size, 'images');

  return {
    canonicalName,
    shopping,
    reviews: organic.reviews,
    images: [...imageSet].slice(0, 12),
    knowledgePanel: organic.knowledgePanel,
  };
}
