import { useCallback, useState } from 'react';

// Small reusable hook for future API integrations.
export function useApi(requestFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        return await requestFn(...args);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [requestFn],
  );

  return { execute, loading, error };
}
