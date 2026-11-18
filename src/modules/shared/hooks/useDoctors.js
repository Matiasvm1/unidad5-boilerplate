import { useCallback, useEffect, useState } from 'react';
import { getDoctors } from '../services/catalogService';

const EMPTY_PAGE = { data: [], total: 0 };

// Paged list. Reloads when the params change; a stale response is ignored
// (spec 3.5). `reload` asks again with the same params.
function useDoctors({ pageIndex, pageSize, name }) {
  const [page, setPage] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getDoctors({ pageIndex, pageSize, name })
      .then((result) => {
        if (!ignore) {
          setPage({ data: result.data, total: result.total });
        }
      })
      .catch((apiError) => {
        if (!ignore) {
          setError(apiError);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [pageIndex, pageSize, name, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    doctors: page.data,
    total: page.total,
    loading,
    error,
    reload,
  };
}

export default useDoctors;
