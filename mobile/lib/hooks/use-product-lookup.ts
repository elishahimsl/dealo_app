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
export function useProductLookup(productName: string, category: string, imageUri?: string, upc?: string) {
  const [result, setResult] = useState<ProductLookupResult>({
    status: 'idle',
    data: null,
    dloScore: null,
    error: null,
  });

  const lookup = useCallback(async () => {
    if (!productName.trim()) return;

    setResult({ status: 'loading', data: null, dloScore: null, error: null });

    try {
      // 1. Ingest product (search prices + store in DB)
      const productData = await ingestProduct({
        name: productName,
        category,
        imageUri,
        upc,
      });

      // 2. Calculate DLO score from real data
      const dloScore = await calculateDloScore({
        category: productData.product.category || category,
        priceResults: productData.priceResults,
        avgPrice: productData.avgPrice,
        lowestPrice: productData.lowestPrice,
        highestPrice: productData.highestPrice,
        productName,
      });

      setResult({
        status: 'done',
        data: productData,
        dloScore,
        error: null,
      });
    } catch (err: any) {
      console.warn('Product lookup failed:', err);
      setResult({
        status: 'error',
        data: null,
        dloScore: null,
        error: err?.message || 'Failed to look up product',
      });
    }
  }, [productName, category, imageUri, upc]);

  useEffect(() => {
    lookup();
  }, [lookup]);

  return { ...result, retry: lookup };
}
