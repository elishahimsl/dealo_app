import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';

const LOCAL_SAVES_KEY = '@dealo_saved_products';

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

export interface LocalSavedProduct {
  product_id: string;
  title: string;
  brand: string | null;
  category: string | null;
  image_urls: string[] | null;
  created_at: string;
}

// ── Local storage helpers ──

async function getLocalSaves(): Promise<LocalSavedProduct[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_SAVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function setLocalSaves(items: LocalSavedProduct[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCAL_SAVES_KEY, JSON.stringify(items));
  } catch {
    // silent
  }
}

async function addLocalSave(product: LocalSavedProduct): Promise<void> {
  const current = await getLocalSaves();
  if (current.some((p) => p.product_id === product.product_id)) return;
  current.unshift(product);
  await setLocalSaves(current);
}

async function removeLocalSave(productId: string): Promise<void> {
  const current = await getLocalSaves();
  await setLocalSaves(current.filter((p) => p.product_id !== productId));
}

async function isLocalSaved(productId: string): Promise<boolean> {
  const current = await getLocalSaves();
  return current.some((p) => p.product_id === productId);
}

// ── Helper to check if user is authenticated ──

async function getUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// ── Public API (uses Supabase when logged in, AsyncStorage when not) ──

/**
 * Save a product. Uses Supabase if authenticated, AsyncStorage otherwise.
 */
export async function saveProduct(productId: string, meta?: { title?: string; brand?: string | null; category?: string | null; image_urls?: string[] | null }): Promise<boolean> {
  // Always save locally as backup
  await addLocalSave({
    product_id: productId,
    title: meta?.title || 'Saved Product',
    brand: meta?.brand || null,
    category: meta?.category || null,
    image_urls: meta?.image_urls || null,
    created_at: new Date().toISOString(),
  });

  const user = await getUser();
  if (!user) return true; // local-only save

  try {
    const { error } = await supabase
      .from('saved_products')
      .upsert(
        { user_id: user.id, product_id: productId },
        { onConflict: 'user_id,product_id' }
      );
    return !error;
  } catch {
    return true; // local save already done
  }
}

/**
 * Unsave (remove) a saved product.
 */
export async function unsaveProduct(productId: string): Promise<boolean> {
  await removeLocalSave(productId);

  const user = await getUser();
  if (!user) return true;

  try {
    const { error } = await supabase
      .from('saved_products')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    return !error;
  } catch {
    return true;
  }
}

/**
 * Check if a product is saved.
 */
export async function isProductSaved(productId: string): Promise<boolean> {
  // Check local first (fast)
  if (await isLocalSaved(productId)) return true;

  const user = await getUser();
  if (!user) return false;

  try {
    const { data } = await supabase
      .from('saved_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();
    return !!data;
  } catch {
    return false;
  }
}

/**
 * Get all saved products. Merges Supabase + local saves.
 */
export async function getSavedProducts(): Promise<SavedProductRow[]> {
  const localSaves = await getLocalSaves();

  const user = await getUser();
  if (!user) {
    // Return local saves formatted as SavedProductRow
    return localSaves.map((ls) => ({
      id: `local-${ls.product_id}`,
      product_id: ls.product_id,
      created_at: ls.created_at,
      product: {
        id: ls.product_id,
        title: ls.title,
        brand: ls.brand,
        category: ls.category,
        image_urls: ls.image_urls,
      },
    }));
  }

  try {
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

    if (error || !data) {
      // Fall back to local saves
      return localSaves.map((ls) => ({
        id: `local-${ls.product_id}`,
        product_id: ls.product_id,
        created_at: ls.created_at,
        product: {
          id: ls.product_id,
          title: ls.title,
          brand: ls.brand,
          category: ls.category,
          image_urls: ls.image_urls,
        },
      }));
    }

    // Merge: DB saves + any local-only saves not in DB
    const dbIds = new Set((data as any[]).map((d) => d.product_id));
    const localOnly = localSaves
      .filter((ls) => !dbIds.has(ls.product_id))
      .map((ls) => ({
        id: `local-${ls.product_id}`,
        product_id: ls.product_id,
        created_at: ls.created_at,
        product: {
          id: ls.product_id,
          title: ls.title,
          brand: ls.brand,
          category: ls.category,
          image_urls: ls.image_urls,
        },
      }));

    return [...(data as unknown as SavedProductRow[]), ...localOnly];
  } catch {
    return localSaves.map((ls) => ({
      id: `local-${ls.product_id}`,
      product_id: ls.product_id,
      created_at: ls.created_at,
      product: {
        id: ls.product_id,
        title: ls.title,
        brand: ls.brand,
        category: ls.category,
        image_urls: ls.image_urls,
      },
    }));
  }
}

/**
 * Toggle save state and return the new state (true = saved).
 */
export async function toggleSaveProduct(productId: string, meta?: { title?: string; brand?: string | null; category?: string | null; image_urls?: string[] | null }): Promise<boolean> {
  const saved = await isProductSaved(productId);
  if (saved) {
    await unsaveProduct(productId);
    return false;
  } else {
    await saveProduct(productId, meta);
    return true;
  }
}
