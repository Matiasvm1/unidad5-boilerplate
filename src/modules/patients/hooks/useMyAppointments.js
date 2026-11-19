import { useCallback, useEffect, useState } from 'react';
import { getMyAppointments } from '../services/patientAppointmentsService';

const byDateTime = (a, b) =>
  `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`);

function useMyAppointments(dni) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getMyAppointments(dni)
      .then((result) => {
        if (!ignore) {
          setAppointments([...result].sort(byDateTime));
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
  }, [dni, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { appointments, loading, error, reload };
}

export default useMyAppointments;