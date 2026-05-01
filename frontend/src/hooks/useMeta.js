import { useCallback, useEffect, useState } from 'react';
import { fetchMeta } from '../services/metaService';

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
