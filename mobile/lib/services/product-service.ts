import { supabase } from '../supabase';
import { fullProductSearch, PriceResult, ReviewResult, ProductImage } from './price-search';
import { serpFullProductSearch, isSerpApiConfigured, ShoppingResult, ProductReview } from './serp-search';
import { geminiAnalyzeProduct, GeminiProductAnalysis } from './gemini-ai';
import { VisionSignals, runScanPipeline, RankedCandidate } from './scan-pipeline';

export interface Product {
  id: string;
  title: string;
  brand: string | null;
  category: string | null;
  description: string | null;
  image_urls: string[] | null;
  upc: string | null;
}

export interface Offer {
  id: string;
  product_id: string;
  merchant_id: string | null;
  price: number;
  currency: string;
  availability: string;
  url: string;
  affiliate_url: string | null;
}

export interface ProductWithOffers {
  product: Product;
  offers: Offer[];
  priceResults: PriceResult[];
  bestPrice: PriceResult | null;
  avgPrice: number | null;
  lowestPrice: number | null;
  highestPrice: number | null;
  reviews: ReviewResult[];
  productImages: ProductImage[];
  geminiAnalysis: GeminiProductAnalysis | null;
  /** Canonical product name from shopping results (may be more specific than Vision detection) */
  refinedName: string | null;
}

/**
 * Convert SerpApi ShoppingResults to our PriceResult format for compatibility.
 */
function shoppingToPriceResults(items: ShoppingResult[]): PriceResult[] {
  return items.map((s) => {
    let domain = '';
    try { domain = new URL(s.link).hostname.replace('www.', ''); } catch { domain = s.store.toLowerCase().replace(/\s+/g, '') + '.com'; }

    return {
      title: s.title,
      price: s.price,
      currency: 'USD',
      store: s.store,
      domain,
      url: s.link,
      affiliateUrl: null,
      snippet: s.delivery || '',
      imageUrl: s.imageUrl,
    };
  });
}

/**
 * Convert SerpApi ProductReviews to our ReviewResult format.
 */
function serpReviewsToReviews(items: ProductReview[]): ReviewResult[] {
  return items.map((r) => ({
    source: r.source,
    domain: '',
    url: r.url,
    rating: r.rating,
    maxRating: r.maxRating,
    reviewCount: r.reviewCount,
    snippet: r.snippet,
  }));
}

/**
 * Convert pipeline RankedCandidates into PriceResults + images + reviews.
 */
function pipelineCandidatesToResults(candidates: RankedCandidate[]): {
  priceResults: PriceResult[];
  productImages: ProductImage[];
  reviews: ReviewResult[];
} {
  const priceResults: PriceResult[] = [];
  const productImages: ProductImage[] = [];
  const reviews: ReviewResult[] = [];
  const seenImages = new Set<string>();
  const seenReviewSources = new Set<string>();

  for (const c of candidates) {
    let domain = '';
    try { domain = new URL(c.url).hostname.replace('www.', ''); } catch { domain = c.merchant.toLowerCase().replace(/\s+/g, '') + '.com'; }

    priceResults.push({
      title: c.title,
      price: c.price,
      currency: 'USD',
      store: c.merchant,
      domain,
      url: c.url,
      affiliateUrl: null,
      snippet: c.priceRaw || '',
      imageUrl: c.image,
    });

    if (c.image && !seenImages.has(c.image)) {
      seenImages.add(c.image);
      productImages.push({ url: c.image, source: c.merchant });
    }

    if (c.rating && !seenReviewSources.has(c.merchant)) {
      seenReviewSources.add(c.merchant);
      reviews.push({
        source: c.merchant,
        domain,
        url: c.url,
        rating: c.rating,
        maxRating: 5,
        reviewCount: c.reviewCount,
        snippet: `${c.title} — ${c.priceRaw}`,
      });
    }
  }

  return { priceResults, productImages, reviews };
}

/**
 * Ingest a detected product: save to DB, search for prices, store offers.
 * 
 * Pipeline priority:
 * 1. Scan Pipeline (VisionSignals + SerpApi multi-query) — best accuracy
 * 2. SerpApi direct search (single query) — good structured data
 * 3. CSE + DDG fallback — works without paid APIs
 */
export async function ingestProduct(params: {
  name: string;
  category: string;
  imageUri?: string;
  upc?: string;
  visionWebPages?: { url: string; title: string }[];
  visionSignals?: VisionSignals;
}): Promise<ProductWithOffers> {
  const { name, category, imageUri, upc, visionWebPages, visionSignals } = params;

  let priceResults: PriceResult[] = [];
  let reviews: ReviewResult[] = [];
  let productImages: ProductImage[] = [];
  let refinedName: string | null = null;
  let geminiAnalysis: GeminiProductAnalysis | null = null;

  // ─── TIER 0: Scan Pipeline (multi-query, reranked candidates) ──────
  if (visionSignals && isSerpApiConfigured()) {
    console.log('[DeaLo] ingest: running scan pipeline for', name);
    try {
      const decision = await runScanPipeline(visionSignals);

      if (decision.best && decision.allCandidates.length > 0) {
        refinedName = decision.bestName || null;
        console.log('[DeaLo] Pipeline result:', decision.mode, '| name:', refinedName, '| confidence:', decision.confidence.toFixed(2));

        const pipelineData = pipelineCandidatesToResults(decision.allCandidates);
        priceResults = pipelineData.priceResults;
        productImages = pipelineData.productImages;
        reviews = pipelineData.reviews;

        console.log('[DeaLo] Pipeline data:', priceResults.length, 'prices,', productImages.length, 'images,', reviews.length, 'reviews');
      }
    } catch (err: any) {
      console.warn('[DeaLo] Scan pipeline error, falling back:', err?.message || err);
    }
  }

  // ─── TIER 1: SerpApi direct search (if pipeline didn't run or returned nothing) ───
  if (priceResults.length === 0 && isSerpApiConfigured()) {
    console.log('[DeaLo] ingest: using SerpApi direct for', name);
    try {
      const serpData = await serpFullProductSearch(name);

      if (serpData.canonicalName && serpData.canonicalName.length > name.length) {
        refinedName = serpData.canonicalName;
        console.log('[DeaLo] ingest: refined name:', name, '→', refinedName);
      }

      priceResults = shoppingToPriceResults(serpData.shopping);
      reviews = serpReviewsToReviews(serpData.reviews);

      for (const img of serpData.images) {
        productImages.push({ url: img, source: 'Google' });
      }
      for (const s of serpData.shopping) {
        if (s.imageUrl && !productImages.find((pi) => pi.url === s.imageUrl)) {
          productImages.push({ url: s.imageUrl, source: s.store });
        }
      }
      for (const s of serpData.shopping) {
        if (s.rating && !reviews.find((r) => r.source === s.store)) {
          reviews.push({
            source: s.store, domain: '', url: s.link,
            rating: s.rating, maxRating: 5, reviewCount: s.reviewCount,
            snippet: `${s.title} — ${s.priceRaw}`,
          });
        }
      }

      console.log('[DeaLo] SerpApi results:', priceResults.length, 'prices,', reviews.length, 'reviews,', productImages.length, 'images');
    } catch (err: any) {
      console.warn('[DeaLo] SerpApi error, falling back:', err?.message || err);
    }
  }

  // ─── TIER 2: CSE + DDG fallback ─────
  if (priceResults.length === 0) {
    console.log('[DeaLo] ingest: using CSE/DDG fallback for', name);
    const fallbackData = await fullProductSearch(name, visionWebPages);
    priceResults = fallbackData.priceResults;
    if (reviews.length === 0) reviews = fallbackData.reviews;
    if (productImages.length === 0) productImages = fallbackData.images;
  }

  // ─── TIER 3: Gemini AI analysis (always, runs in parallel with DB ops) ─────
  const productNameForAnalysis = refinedName || name;
  const pricedForStats = priceResults.filter((r) => r.price !== null);
  const prices = pricedForStats.map((r) => r.price!);
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;

  const geminiPromise = geminiAnalyzeProduct(productNameForAnalysis, category, {
    avgPrice,
    lowestPrice,
  }).catch((err) => {
    console.warn('[DeaLo] Gemini analysis failed:', err?.message || err);
    return null;
  });

  console.log('[DeaLo] ingest: got', priceResults.length, 'prices,', reviews.length, 'reviews,', productImages.length, 'images');

  // ─── DB operations ─────────────────────────────────────────────
  const displayName = refinedName || name;
  const words = displayName.trim().split(/\s+/);
  const brand = words.length > 1 ? words[0] : null;

  let product: Product | null = null;

  if (upc) {
    const { data } = await supabase.from('products').select('*').eq('upc', upc).single();
    if (data) product = data as Product;
  }

  if (!product) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('title', `%${displayName.trim().substring(0, 50)}%`)
      .limit(1)
      .single();
    if (data) product = data as Product;
  }

  if (!product) {
    const imageUrls = productImages.slice(0, 5).map((pi) => pi.url);
    if (imageUri && imageUrls.length < 5) imageUrls.push(imageUri);

    const { data, error } = await supabase
      .from('products')
      .insert({
        title: displayName.trim(),
        brand,
        category: category || 'General',
        description: priceResults[0]?.snippet || null,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        upc: upc || null,
      })
      .select()
      .single();

    if (error) {
      console.warn('Failed to insert product:', error.message);
      geminiAnalysis = await geminiPromise;
      return buildResult(displayName, category, priceResults, reviews, productImages, geminiAnalysis, refinedName);
    }
    product = data as Product;
  }

  // Store offers in DB (best effort, parallelized)
  const pricedForDB = priceResults.filter((pr) => pr.price !== null);
  console.log('[DeaLo] ingest: storing', pricedForDB.length, 'offers');
  const offerPromises = pricedForDB.map(async (pr) => {
    try {
      const { data: merchant } = await supabase
        .from('merchants').select('id').eq('domain', pr.domain).single();

      const { data: offer } = await supabase
        .from('offers')
        .upsert({
          product_id: product!.id,
          merchant_id: merchant?.id || null,
          price: pr.price!,
          currency: pr.currency,
          availability: 'in_stock',
          url: pr.url,
          affiliate_url: pr.affiliateUrl,
        }, { onConflict: 'id' })
        .select()
        .single();

      return offer as Offer | null;
    } catch {
      return null;
    }
  });

  // Store price snapshots for future history (best effort)
  const snapshotPromises = pricedForDB.slice(0, 10).map(async (pr) => {
    try {
      await supabase.from('price_snapshots').insert({
        product_id: product!.id,
        price: pr.price!,
        currency: pr.currency,
        source: pr.store || pr.domain,
      });
    } catch { /* ignore */ }
  });

  // Wait for Gemini + DB ops in parallel
  const [offerResults, , geminiResult] = await Promise.all([
    Promise.all(offerPromises),
    Promise.all(snapshotPromises),
    geminiPromise,
  ]);
  geminiAnalysis = geminiResult;

  const offers: Offer[] = offerResults.filter((o): o is Offer => o !== null);

  // Price stats
  const bestPrice = pricedForStats.length > 0 ? pricedForStats[0] : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null;

  return {
    product,
    offers,
    priceResults,
    bestPrice,
    avgPrice,
    lowestPrice,
    highestPrice,
    reviews,
    productImages,
    geminiAnalysis,
    refinedName,
  };
}

function buildResult(
  name: string,
  category: string,
  priceResults: PriceResult[],
  reviews: ReviewResult[] = [],
  productImages: ProductImage[] = [],
  geminiAnalysis: GeminiProductAnalysis | null = null,
  refinedName: string | null = null,
): ProductWithOffers {
  const pricedResults = priceResults.filter((r) => r.price !== null);
  const prices = pricedResults.map((r) => r.price!);

  return {
    product: {
      id: 'temp-' + Date.now(),
      title: refinedName || name,
      brand: null,
      category,
      description: priceResults[0]?.snippet || null,
      image_urls: productImages.slice(0, 5).map((pi) => pi.url),
      upc: null,
    },
    offers: [],
    priceResults,
    bestPrice: pricedResults[0] || null,
    avgPrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
    lowestPrice: prices.length > 0 ? Math.min(...prices) : null,
    highestPrice: prices.length > 0 ? Math.max(...prices) : null,
    reviews,
    productImages,
    geminiAnalysis,
    refinedName,
  };
}
