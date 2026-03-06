import { useState, useEffect, useCallback } from 'react';
import { ingestProduct, ProductWithOffers } from '../services/product-service';
import { calculateDloScore, DloScoreResult } from '../services/dlo-score';
import { callScanProduct, mapScanResponseToProductData, ScanProductResponse } from '../services/edge-scan';

export type LookupStatus = 'idle' | 'loading' | 'done' | 'error';

export interface ProductLookupResult {
  status: LookupStatus;
  data: ProductWithOffers | null;
  dloScore: DloScoreResult | null;
  error: string | null;
  /** Edge function response (available when scanImageUrl path is used) */
  scanResponse: ScanProductResponse | null;
}

/**
 * Hook to look up a product.
 *
 * Two paths:
 * 1. scanImageUrl provided → call scan-product edge function (camera scan flow)
 * 2. productName provided  → call ingestProduct client-side (barcode / manual flow)
 */
export function useProductLookup(
  productName: string,
  category: string,
  imageUri?: string,
  scanImageUrl?: string | null,
  upc?: string,
  visionWebPages?: { url: string; title: string }[],
) {
  const [result, setResult] = useState<ProductLookupResult>({
    status: 'idle',
    data: null,
    dloScore: null,
    error: null,
    scanResponse: null,
  });

  const lookup = useCallback(async () => {
    // Need either a scan image URL or a product name to search
    if (!scanImageUrl && !productName.trim()) return;

    setResult({ status: 'loading', data: null, dloScore: null, error: null, scanResponse: null });

    // Global timeout: 90s for edge function (Vision + SerpApi + optional Gemini)
    const timeoutId = setTimeout(() => {
      setResult((prev) =>
        prev.status === 'loading'
          ? { status: 'error', data: null, dloScore: null, error: 'Search timed out. Please try again.', scanResponse: null }
          : prev
      );
    }, 90000);

    try {
      let productData: ProductWithOffers;
      let scanResponse: ScanProductResponse | null = null;

      if (scanImageUrl) {
        // ─── Path A: Edge function via Storage URL (camera scan) ──
        console.log('[DeaLo] lookup: calling scan-product with imageUrl');
        scanResponse = await callScanProduct({ imageUrl: scanImageUrl });
        productData = mapScanResponseToProductData(scanResponse, category, imageUri || '');
        console.log('[DeaLo] lookup: edge scan done, decision:', scanResponse.decision, '| product:', productData.refinedName);
      } else {
        // ─── Path B: Client-side pipeline (barcode / manual) ─────
        console.log('[DeaLo] lookup: using client-side ingest for', productName);
        productData = await ingestProduct({
          name: productName,
          category,
          imageUri,
          upc,
          visionWebPages,
        });
      }

      console.log('[DeaLo] lookup: calculating DLO score...');

      // Calculate DLO score from the data
      const displayName = productData.refinedName || productName;
      const dloScore = await calculateDloScore({
        category: productData.product.category || category,
        priceResults: productData.priceResults,
        avgPrice: productData.avgPrice,
        lowestPrice: productData.lowestPrice,
        highestPrice: productData.highestPrice,
        productName: displayName,
      });
      console.log('[DeaLo] lookup: done! Score =', dloScore.overallScore);

      clearTimeout(timeoutId);
      setResult({
        status: 'done',
        data: productData,
        dloScore,
        error: null,
        scanResponse,
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[DeaLo] lookup failed:', err);
      setResult({
        status: 'error',
        data: null,
        dloScore: null,
        error: err?.message || 'Failed to look up product',
        scanResponse: null,
      });
    }
  }, [productName, category, imageUri, scanImageUrl, upc, visionWebPages]);

  useEffect(() => {
    lookup();
  }, [lookup]);

  return { ...result, retry: lookup };
}
