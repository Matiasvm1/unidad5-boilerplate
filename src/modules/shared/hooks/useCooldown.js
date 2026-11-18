//Seguridad para que no intenten adivinar la contraseña tocando 30 veces
//el boton de ingresar. Este hook es un cronometro de penitencia con start
//congela el boton por 10 seg

import { useCallback, useEffect, useState } from 'react';

const DEFAULT_SECONDS = 10;

// despues de un 429 el boton q lo provoca se deshabilita por 10 seg. Start inicia la espera

function useCooldown(seconds = DEFAULT_SECONDS) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const timer = setTimeout(() => setActive(false), seconds * 1000); //10 segundos

    return () => clearTimeout(timer); //limpieza de useEffect, si se cierra la pantalla antes de los 10 seg se apaga el reloj.
  }, [active, seconds]);

  const start = useCallback(() => setActive(true), []);

  return { active, start };
}

export default useCooldown;
