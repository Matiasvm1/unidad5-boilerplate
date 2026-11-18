import { useEffect, useState } from 'react';
import { getDoctors } from '../services/catalogService';

const OPTIONS_PAGE_SIZE = 100;

// Doctors of one specialty (spec P10). Without specialtyId it does nothing.
function useDoctorsBySpecialty(specialtyId) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!specialtyId) {
      setDoctors([]);
      setError(null);
      setLoading(false);

      return undefined;
    }

    let ignore = false;

    setLoading(true);
    setError(null);

    getDoctors({ pageIndex: 1, pageSize: OPTIONS_PAGE_SIZE, specialtyId })
      .then((result) => {
        if (!ignore) {
          setDoctors(result.data);
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
  }, [specialtyId]);

  return { doctors, loading, error };
}

export default useDoctorsBySpecialty;
