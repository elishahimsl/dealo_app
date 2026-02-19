import { supabase } from '../supabase';

export interface SavedProductRow {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    brand: string | null;
    category: string | null;
    image_urls: string[] | null;
  };
}

/**
 * Save a product for the current user.
 * Returns true on success.
 */
export async function saveProduct(productId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('saved_products')
    .upsert(
      { user_id: user.id, product_id: productId },
      { onConflict: 'user_id,product_id' }
    );

  return !error;
}

/**
 * Unsave (remove) a saved product for the current user.
 */
export async function unsaveProduct(productId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('saved_products')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId);

  return !error;
}

/**
 * Check if a product is saved by the current user.
 */
export async function isProductSaved(productId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('saved_products')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  return !!data;
}

/**
 * Get all saved products for the current user.
 */
export async function getSavedProducts(): Promise<SavedProductRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_products')
    .select(`
      id,
      product_id,
      created_at,
      product:products (
        id,
        title,
        brand,
        category,
        image_urls
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data as unknown as SavedProductRow[];
}

/**
 * Toggle save state and return the new state (true = saved).
 */
export async function toggleSaveProduct(productId: string): Promise<boolean> {
  const saved = await isProductSaved(productId);
  if (saved) {
    await unsaveProduct(productId);
    return false;
  } else {
    await saveProduct(productId);
    return true;
  }
}
