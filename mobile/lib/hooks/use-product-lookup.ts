import { useState, useEffect, useCallback } from 'react';
import { ingestProduct, ProductWithOffers } from '../services/product-service';
import { calculateDloScore, DloScoreResult } from '../services/dlo-score';

export type LookupStatus = 'idle' | 'loading' | 'done' | 'error';

export interface ProductLookupResult {
  status: LookupStatus;
  data: ProductWithOffers | null;
  dloScore: DloScoreResult | null;
  error: string | null;
}

/**
 * Hook to look up a product: search prices, store in DB, calculate DLO score.
 * Triggered when productName changes.
 */
export function useProductLookup(productName: string, category: string, imageUri?: string, upc?: string, visionWebPages?: { url: string; title: string }[]) {
  const [result, setResult] = useState<ProductLookupResult>({
    status: 'idle',
    data: null,
    dloScore: null,
    error: null,
  });

  const lookup = useCallback(async () => {
    if (!productName.trim()) return;

    setResult({ status: 'loading', data: null, dloScore: null, error: null });

    // Global timeout: never let the whole lookup hang for more than 45s
    const timeoutId = setTimeout(() => {
      setResult((prev) =>
        prev.status === 'loading'
          ? { status: 'error', data: null, dloScore: null, error: 'Search timed out. Please try again.' }
          : prev
      );
    }, 45000);

    try {
      console.log('[DeaLo] lookup: starting for', productName);

      // 1. Ingest product (search prices + store in DB)
      const productData = await ingestProduct({
        name: productName,
        category,
        imageUri,
        upc,
        visionWebPages,
      });
      console.log('[DeaLo] lookup: ingest done, calculating DLO score...');

      // 2. Calculate DLO score from real data
      const dloScore = await calculateDloScore({
        category: productData.product.category || category,
        priceResults: productData.priceResults,
        avgPrice: productData.avgPrice,
        lowestPrice: productData.lowestPrice,
        highestPrice: productData.highestPrice,
        productName,
      });
      console.log('[DeaLo] lookup: done! Score =', dloScore.overallScore);

      clearTimeout(timeoutId);
      setResult({
        status: 'done',
        data: productData,
        dloScore,
        error: null,
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[DeaLo] lookup failed:', err);
      setResult({
        status: 'error',
        data: null,
        dloScore: null,
        error: err?.message || 'Failed to look up product',
      });
    }
  }, [productName, category, imageUri, upc, visionWebPages]);

  useEffect(() => {
    lookup();
  }, [lookup]);

  return { ...result, retry: lookup };
}
