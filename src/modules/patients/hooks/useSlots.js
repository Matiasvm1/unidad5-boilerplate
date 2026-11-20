import { useCallback, useEffect, useState } from 'react';
import { getSlots } from '../services/patientAppointmentsService';

function useSlots(doctorId, from, to) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!doctorId) {
      setSlots([]);
      setError(null);
      setLoading(false);

      return undefined;
    }

    let ignore = false;

    setLoading(true);
    setError(null);

    getSlots(doctorId, { from, to })
      .then((result) => {
        if (!ignore) {
          setSlots(result);
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
  }, [doctorId, from, to, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { slots, loading, error, reload };
}

export default useSlots;
