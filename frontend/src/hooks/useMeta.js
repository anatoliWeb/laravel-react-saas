import { useCallback, useEffect, useState } from 'react';
import { fetchMeta } from '../services/metaService';

/**
 * Global metadata loader hook.
 *
 * WHY:
 * Meta (roles/permissions/current user capability set) is shared across pages.
 * This hook standardizes fetch lifecycle and refresh entry point.
 */
export function useMeta() {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMeta = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await fetchMeta();
      setMeta(payload || {});
    } catch (err) {
      setError(err);
      // Keep app usable even if meta endpoint fails.
      setMeta({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  return {
    meta,
    loading,
    error,
    refresh: loadMeta,
  };
}
