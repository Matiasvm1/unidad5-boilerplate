import { useCallback, useEffect, useState } from 'react';
import { getDoctorAvailabilities } from '../services/availabilitiesService';

// programacion de un medico para un mes. Sin id no realiza ninguna accion
// Se descarta cualquier rta obsoleta, ejemplo si el mes cambia mientras se hace el proceso

function useDoctorAvailability(doctorId, year, month) {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  // Aumenta con carga cada exitosa para q un form se vuelva a montar
  const [version, setVersion] = useState(0); //contador, lo usamos para pegarle ese nro al form entero de la semana

  useEffect(() => {
    if (!doctorId) {
      // si no elegimos ningun medico se aborta la mision y no pide nada inutil al back
      setAvailabilities([]);
      setError(null);
      setLoading(false);

      return undefined;
    }

    let ignore = false;

    setLoading(true);
    setError(null);

    getDoctorAvailabilities(doctorId, { year, month })
      .then((result) => {
        if (!ignore) {
          setAvailabilities(result);
          setVersion((current) => current + 1);
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
  }, [doctorId, year, month, reloadKey]); //Cada vez q cambie el medico, mes o recarga hay que volver a ejecutar todo

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { availabilities, loading, error, reload, version };
}

export default useDoctorAvailability;
