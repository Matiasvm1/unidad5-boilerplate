// axiosInstance dejaba la nota cuando se vencia la sesion
// este hook ldespega la nota y la borra para que si recargas, no vuelva a aparecer

import { useEffect, useState } from 'react';
import { clearAuthNotice, peekAuthNotice } from '../../shared/api/sessionStore';

function useAuthNotice() {
  const [notice] = useState(peekAuthNotice);

  useEffect(() => {
    clearAuthNotice();
  }, []);

  return notice;
}

export default useAuthNotice;
