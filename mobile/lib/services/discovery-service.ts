import { supabase } from '../supabase';

export interface DiscoveryProduct {
  id: string;
  name: string;
  store: string;
  image: string;
  category: string;
}

/**
 * Fetch trending products — most frequently scanned products across all users.
 */
export async function fetchTrendingProducts(limit = 10): Promise<DiscoveryProduct[]> {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('product_id, products(id, name, category, image_url)')
    .eq('interaction_type', 'scan')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  // Count scans per product, return most scanned
  const counts: Record<string, { count: number; product: any }> = {};
  for (const row of data) {
    const p = (row as any).products;
    if (!p) continue;
    const pid = p.id;
    if (!counts[pid]) counts[pid] = { count: 0, product: p };
    counts[pid].count++;
  }

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((c) => ({
      id: c.product.id,
      name: c.product.name || 'Product',
      store: extractBrand(c.product.name),
      image: c.product.image_url || '',
      category: c.product.category || 'General',
    }));
}

/**
 * Fetch products by category from the products table.
 */
export async function fetchProductsByCategory(category: string, limit = 10): Promise<DiscoveryProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, image_url')
    .ilike('category', `%${category}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id,
    name: p.name || 'Product',
    store: extractBrand(p.name),
    image: p.image_url || '',
    category: p.category || category,
  }));
}

/**
 * Fetch recently scanned products for a specific user.
 */
export async function fetchRecentProducts(userId: string, limit = 10): Promise<DiscoveryProduct[]> {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('product_id, metadata, products(id, name, category, image_url)')
    .eq('user_id', userId)
    .eq('interaction_type', 'scan')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const seen = new Set<string>();
  const results: DiscoveryProduct[] = [];

  for (const row of data) {
    const p = (row as any).products;
    if (!p || seen.has(p.id)) continue;
    seen.add(p.id);
    results.push({
      id: p.id,
      name: p.name || 'Product',
      store: extractBrand(p.name),
      image: p.image_url || '',
      category: p.category || 'General',
    });
  }

  return results;
}

/**
 * Fetch all products (for compare suggestions).
 */
export async function fetchAllProducts(limit = 20): Promise<DiscoveryProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, image_url')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id,
    name: p.name || 'Product',
    store: extractBrand(p.name),
    image: p.image_url || '',
    category: p.category || 'General',
  }));
}

/**
 * Extract a likely brand name from a product name string.
 */
function extractBrand(name: string | null): string {
  if (!name) return 'Store';
  const brands = [
    'Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Beats', 'Bose', 'LG',
    'Google', 'Microsoft', 'Dell', 'HP', 'Lenovo', 'Dyson', 'KitchenAid',
    'Canon', 'Nikon', 'JBL', 'Anker', 'Logitech', 'Razer', 'Corsair',
    'Nintendo', 'PlayStation', 'Xbox', 'IKEA', 'Zara', 'H&M', 'Uniqlo',
    'Coach', 'Gucci', 'Prada', 'Lululemon', 'Under Armour', 'Puma',
    'New Balance', 'Reebok', 'Converse', 'Vans', 'North Face',
  ];
  const lower = name.toLowerCase();
  for (const brand of brands) {
    if (lower.includes(brand.toLowerCase())) return brand;
  }
  // Return first word as brand fallback
  return name.split(/\s+/)[0] || 'Store';
}
