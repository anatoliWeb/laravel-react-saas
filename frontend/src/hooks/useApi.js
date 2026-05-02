import { useCallback, useState } from 'react';

/**
 * Async request state wrapper.
 *
 * WHY:
 * Keeps local loading/error boilerplate out of feature components
 * when an API call does not need page-specific orchestration.
 */
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
