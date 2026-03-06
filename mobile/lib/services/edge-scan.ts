/**
 * Edge function client for the scan-product Supabase Edge Function.
 *
 * This is the ONLY place the mobile app calls scan-product.
 * No paid API keys are used on the client — Vision, SerpApi, and Gemini
 * are all called server-side by the edge function.
 *
 * Also includes a mapper from the edge function response shape
 * to the existing ProductWithOffers shape used by the results UI.
 */

import { supabase } from '../supabase';
import type { PriceResult, ReviewResult, ProductImage } from './price-search';
import type { Product, ProductWithOffers } from './product-service';
import type { GeminiProductAnalysis } from './gemini-ai';

// ─── Types matching the edge function response ─────────────────────

export interface EdgeOffer {
  merchant: string | null;
  title: string;
  price: number | null;
  currency: string | null;
  url: string | null;
  image: string | null;
  rating: number | null;
  reviewCount: number | null;
  source: string;
}

export interface ScoredCandidate {
  title: string;
  image: string | null;
  price: number | null;
  merchant: string | null;
  confidence: number;
}

export interface ScanProductResponse {
  decision: 'AUTO' | 'PICK';
  bestMatch: {
    title: string;
    image: string | null;
    confidence: number;
  } | null;
  offers: EdgeOffer[];
  candidates: ScoredCandidate[];
  queriesUsed: string[];
  analysis: {
    overview: string;
    strengths: string[];
    weaknesses: string[];
    verdict: string;
  } | null;
}

// ─── Call the edge function ─────────────────────────────────────────

export interface ScanProductInput {
  /** Public URL of image in Supabase Storage (preferred path) */
  imageUrl?: string;
  /** Relative path within the scan-images bucket */
  storagePath?: string;
  /** Base64-encoded image data (legacy fallback) */
  imageBase64?: string;
}

/**
 * Call the scan-product Supabase Edge Function.
 *
 * Preferred flow: send imageUrl (public Storage URL) so the backend
 * can pass it directly to Vision API — no large base64 payloads.
 *
 * Falls back to storagePath or imageBase64 for backward compat.
 */
export async function callScanProduct(input: ScanProductInput): Promise<ScanProductResponse> {
  const label = input.imageUrl
    ? `url (${input.imageUrl.slice(0, 60)})`
    : input.storagePath
      ? `storage (${input.storagePath})`
      : `base64 (${input.imageBase64?.length ?? 0} chars)`;

  console.log('[DeaLo] edge-scan: calling scan-product,', label);

  const { data, error } = await supabase.functions.invoke('scan-product', {
    body: {
      ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
      ...(input.storagePath ? { storagePath: input.storagePath } : {}),
      ...(input.imageBase64 ? { imageBase64: input.imageBase64 } : {}),
    },
  });

  if (error) {
    console.error('[DeaLo] edge-scan: error:', error.message);
    throw new Error(error.message || 'Scan failed');
  }

  if (!data) {
    throw new Error('scan-product returned empty response');
  }

  console.log('[DeaLo] edge-scan: response:', {
    decision: data.decision,
    bestMatch: data.bestMatch?.title,
    offerCount: data.offers?.length,
    candidateCount: data.candidates?.length,
  });

  return data as ScanProductResponse;
}

// ─── Map edge response → existing UI data shape ────────────────────

/**
 * Convert a ScanProductResponse into the ProductWithOffers shape
 * that the results screen already knows how to render.
 *
 * This is a thin adapter — the UI stays exactly the same.
 */
export function mapScanResponseToProductData(
  response: ScanProductResponse,
  category: string,
  imageUri: string,
): ProductWithOffers {
  const productName = response.bestMatch?.title || 'Unknown Product';

  // Map edge offers → PriceResult[]
  const priceResults: PriceResult[] = (response.offers || [])
    .filter((o) => o.title)
    .map((o) => {
      let domain = '';
      try {
        domain = o.url ? new URL(o.url).hostname.replace('www.', '') : '';
      } catch {
        domain = '';
      }

      return {
        title: o.title,
        price: o.price,
        currency: o.currency || 'USD',
        store: o.merchant || 'Unknown',
        domain,
        url: o.url || '',
        affiliateUrl: null,
        snippet: '',
        imageUrl: o.image || null,
      };
    });

  // Sort by price (cheapest first), nulls last
  priceResults.sort((a, b) => {
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return a.price - b.price;
  });

  // Extract product images (deduplicated)
  const productImages: ProductImage[] = [];
  const seenImages = new Set<string>();
  for (const o of response.offers || []) {
    if (o.image && !seenImages.has(o.image)) {
      seenImages.add(o.image);
      productImages.push({ url: o.image, source: o.merchant || 'Unknown' });
    }
  }
  // Add captured photo as fallback
  if (imageUri && !seenImages.has(imageUri)) {
    productImages.push({ url: imageUri, source: 'camera' });
  }

  // Extract reviews from offers that have ratings
  const reviews: ReviewResult[] = [];
  const seenSources = new Set<string>();
  for (const o of response.offers || []) {
    if (o.rating && o.merchant && !seenSources.has(o.merchant)) {
      seenSources.add(o.merchant);
      reviews.push({
        source: o.merchant,
        domain: '',
        url: o.url || '',
        rating: o.rating,
        maxRating: 5,
        reviewCount: o.reviewCount,
        snippet: o.title,
      });
    }
  }

  // Price stats
  const priced = priceResults.filter((r) => r.price !== null);
  const prices = priced.map((r) => r.price!);
  const avgPrice = prices.length > 0
    ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    : null;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null;

  // Map analysis → GeminiProductAnalysis (the UI already handles null)
  let geminiAnalysis: GeminiProductAnalysis | null = null;
  if (response.analysis) {
    geminiAnalysis = {
      overview: response.analysis.overview || '',
      strengths: response.analysis.strengths || [],
      weaknesses: response.analysis.weaknesses || [],
      specs: [],
      verdict: response.analysis.verdict || '',
      category: category,
      priceRange: { low: lowestPrice, high: highestPrice, typical: avgPrice },
    };
  }

  // Build Product record (temp ID — DB insert happens separately if needed)
  const words = productName.trim().split(/\s+/);
  const brand = words.length > 1 ? words[0] : null;
  const product: Product = {
    id: 'scan-' + Date.now(),
    title: productName,
    brand,
    category,
    description: priceResults[0]?.snippet || null,
    image_urls: productImages.slice(0, 5).map((pi) => pi.url),
    upc: null,
  };

  return {
    product,
    offers: [],
    priceResults,
    bestPrice: priced[0] || null,
    avgPrice,
    lowestPrice,
    highestPrice,
    reviews,
    productImages,
    geminiAnalysis,
    refinedName: productName,
  };
}
