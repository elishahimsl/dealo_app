import { useState, useEffect, useCallback } from 'react';
import { getRecentScans, InteractionRow } from '../services/user-interactions';

/**
 * Hook that fetches the user's recently scanned products.
 */
export function useRecentScans(limit = 10) {
  const [scans, setScans] = useState<InteractionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getRecentScans(limit);
    setScans(data);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { scans, loading, refresh };
}
