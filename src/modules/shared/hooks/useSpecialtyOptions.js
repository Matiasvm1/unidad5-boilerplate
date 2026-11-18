import { useCallback, useEffect, useState } from 'react';
import { getSpecialties } from '../services/catalogService';

const OPTIONS_PAGE_SIZE = 100;

// Specialties for a <select> (spec P4: GET /api/specialties?pageSize=100).
// `reload` asks again, e.g. after DOCTOR_SPECIALTY_NOT_FOUND.
function useSpecialtyOptions() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getSpecialties({ pageIndex: 1, pageSize: OPTIONS_PAGE_SIZE })
      .then((result) => {
        if (!ignore) {
          setOptions(result.data);
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
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { options, loading, error, reload };
}

export default useSpecialtyOptions;
