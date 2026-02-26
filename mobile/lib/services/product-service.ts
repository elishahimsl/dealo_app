import { supabase } from '../supabase';
import { searchProductPrices, PriceResult } from './price-search';

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
}

/**
 * Ingest a detected product: save to DB, search for prices, store offers
 */
export async function ingestProduct(params: {
  name: string;
  category: string;
  imageUri?: string;
  upc?: string;
  visionWebPages?: { url: string; title: string }[];
}): Promise<ProductWithOffers> {
  const { name, category, imageUri, upc, visionWebPages } = params;

  // 1. Search for real prices via Google CSE (with Vision webPages fallback)
  console.log('[DeaLo] ingest: searching prices for', name);
  const priceResults = await searchProductPrices(name, visionWebPages);
  console.log('[DeaLo] ingest: got', priceResults.length, 'price results');

  // 2. Extract brand from product name (first word if multi-word)
  const words = name.trim().split(/\s+/);
  const brand = words.length > 1 ? words[0] : null;

  // 3. Try to find existing product in DB by title match
  let product: Product | null = null;

  if (upc) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('upc', upc)
      .single();
    if (data) product = data as Product;
  }

  if (!product) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('title', `%${name.trim().substring(0, 50)}%`)
      .limit(1)
      .single();
    if (data) product = data as Product;
  }

  // 4. If not found, insert new product
  if (!product) {
    const imageUrls = imageUri ? [imageUri] : [];
    // Add images from search results
    for (const pr of priceResults) {
      if (pr.imageUrl && imageUrls.length < 5) {
        imageUrls.push(pr.imageUrl);
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        title: name.trim(),
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
      // Return results without DB persistence
      return buildResultWithoutDB(name, category, priceResults);
    }
    product = data as Product;
  }

  // 5. Store offers in DB (best effort, parallelized)
  const pricedForDB = priceResults.filter((pr) => pr.price !== null);
  console.log('[DeaLo] ingest: storing', pricedForDB.length, 'offers in parallel');
  const offerPromises = pricedForDB.map(async (pr) => {
    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('domain', pr.domain)
        .single();

      const { data: offer } = await supabase
        .from('offers')
        .upsert({
          product_id: product.id,
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
  const offerResults = await Promise.all(offerPromises);
  const offers: Offer[] = offerResults.filter((o): o is Offer => o !== null);

  // 6. Calculate price stats
  const pricedResults = priceResults.filter((r) => r.price !== null);
  const prices = pricedResults.map((r) => r.price!);
  const bestPrice = pricedResults.length > 0 ? pricedResults[0] : null;
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null;

  return {
    product,
    offers,
    priceResults,
    bestPrice,
    avgPrice,
    lowestPrice,
    highestPrice,
  };
}

function buildResultWithoutDB(
  name: string,
  category: string,
  priceResults: PriceResult[]
): ProductWithOffers {
  const pricedResults = priceResults.filter((r) => r.price !== null);
  const prices = pricedResults.map((r) => r.price!);

  return {
    product: {
      id: 'temp-' + Date.now(),
      title: name,
      brand: null,
      category,
      description: priceResults[0]?.snippet || null,
      image_urls: null,
      upc: null,
    },
    offers: [],
    priceResults,
    bestPrice: pricedResults[0] || null,
    avgPrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
    lowestPrice: prices.length > 0 ? Math.min(...prices) : null,
    highestPrice: prices.length > 0 ? Math.max(...prices) : null,
  };
}
