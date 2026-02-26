import { useState, useEffect, useCallback } from 'react';
import {
  getSavedProducts,
  toggleSaveProduct,
  isProductSaved,
  SavedProductRow,
} from '../services/saved-products';

/**
 * Hook for the Saved screen — fetches all saved products.
 */
export function useSavedProducts() {
  const [items, setItems] = useState<SavedProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getSavedProducts();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
}

/**
 * Hook for a single product's save state — used on the results screen.
 * Pass optional meta so local saves include product details.
 */
export function useSaveToggle(productId: string | undefined, meta?: { title?: string; brand?: string | null; category?: string | null; image_urls?: string[] | null }) {
  const [saved, setSaved] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!productId) return;
    isProductSaved(productId).then(setSaved).catch(() => {});
  }, [productId]);

  const toggle = useCallback(async () => {
    if (!productId || toggling) return;
    setToggling(true);
    try {
      const newState = await toggleSaveProduct(productId, meta);
      setSaved(newState);
    } catch {
      // silent fail
    }
    setToggling(false);
  }, [productId, toggling, meta]);

  return { saved, toggling, toggle };
}
