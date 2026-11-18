import { useEffect, useState } from 'react';
import { getDoctors } from '../services/catalogService';

const OPTIONS_PAGE_SIZE = 100;

// Doctors for a <select> (spec P5: GET /api/doctors?pageSize=100).
function useDoctorOptions() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getDoctors({ pageIndex: 1, pageSize: OPTIONS_PAGE_SIZE })
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
  }, []);

  return { options, loading, error };
}

export default useDoctorOptions;
