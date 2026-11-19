// contador independiente para una sola card.
// en vez de hacer un solo pedido grande hace uno por uno
import { useEffect, useState } from 'react';

function useTotal(load) {
  //recibe una func load y como el hook es generico no sabe que se pide
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    load()
      .then((result) => {
        if (!ignore) {
          // si el user cambia de pantalla antes de q el back responda, ignore pasa a true
          setTotal(result.total);
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
  }, [load]);

  return { total, loading, error };
}
//load como dependencia tiene q ser estable, es decir creada una sola vez fuera del componente
export default useTotal;
