import { useCallback, useEffect, useState } from 'react';
import { searchAppointments } from '../services/appointmentsService';

const EMPTY_PAGE = { data: [], total: 0 };

function useAppointmentSearch({ filters, pageIndex, pageSize }) {
  const [page, setPage] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    searchAppointments({ ...filters, pageIndex, pageSize })
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
  }, [filters, pageIndex, pageSize, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    appointments: page.data,
    total: page.total,
    loading,
    error,
    reload,
  };
}

export default useAppointmentSearch;