import { useCallback, useEffect, useState } from 'react';
import { getSpecialties } from '../services/specialtiesService';

const EMPTY_PAGE = { data: [], total: 0 };

// Listado paginado. Vuelve a cargar cuando cambian los parámetros; una
// respuesta vieja se descarta (spec 3.5). `reload` pide de nuevo con los
// mismos parámetros.
function useSpecialties({ pageIndex, pageSize, name }) {
  const [page, setPage] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getSpecialties({ pageIndex, pageSize, name })
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
    specialties: page.data,
    total: page.total,
    loading,
    error,
    reload,
  };
}

export default useSpecialties;
