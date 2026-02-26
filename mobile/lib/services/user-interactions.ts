import { supabase } from '../supabase';

export type InteractionType = 'view' | 'save' | 'compare' | 'scan' | 'purchase';

export interface InteractionRow {
  id: string;
  product_id: string;
  interaction_type: InteractionType;
  metadata: Record<string, any> | null;
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
 * Record a user interaction (scan, view, save, compare, purchase).
 * Silently skips if user is not authenticated.
 */
export async function trackInteraction(params: {
  productId: string;
  type: InteractionType;
  metadata?: Record<string, any>;
}): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_interactions')
      .insert({
        user_id: user.id,
        product_id: params.productId,
        interaction_type: params.type,
        metadata: params.metadata || null,
      });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Get recent interactions of a specific type for the current user.
 */
export async function getRecentInteractions(
  type?: InteractionType,
  limit = 20
): Promise<InteractionRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('user_interactions')
    .select(`
      id,
      product_id,
      interaction_type,
      metadata,
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
    .limit(limit);

  if (type) {
    query = query.eq('interaction_type', type);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as unknown as InteractionRow[];
}

/**
 * Get recently scanned products (unique, most recent first).
 */
export async function getRecentScans(limit = 10): Promise<InteractionRow[]> {
  return getRecentInteractions('scan', limit);
}
