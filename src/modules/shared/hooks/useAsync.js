import { useCallback, useState } from 'react';

// loading, error and run for one mutation (spec 10). `run` calls the service
// function, keeps `loading` true meanwhile and stores the ApiError when it
// fails. It rethrows, so the page can still branch on `errorCode`.
function useAsync(fn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        return await fn(...args);
      } catch (apiError) {
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  const reset = useCallback(() => setError(null), []);

  return { run, loading, error, reset };
}

export default useAsync;
