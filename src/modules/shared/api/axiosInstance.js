import axios from 'axios';
import { ApiError } from './apiError';
import { clearSession, readSession, setAuthNotice } from './sessionStore';
import { LOGIN_PATH } from '../constants/roles';

const LOGIN_URL_PREFIX = 'api/auth/';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

//los receptores se ejecutan en orden. El request abre el casillero de readsession, saca el token y
//se lo pega a la cabecera del request. El response (cuando vuelve) con 401 revisa si el error
//ocurrio dentro de la app o afuera.
instance.interceptors.request.use((config) => {
  const session = readSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

// distingue si el error 401 ocurre mientras esataba en login escribiendo mal la clave o si ocurrio dentro del sistema x si la sesion caduco
// si es en el login no recarga la pag, si es dentro borra la sesion y te redirige
function isLoginRequest(config) {
  return (config?.url ?? '').replace(/^\//, '').startsWith(LOGIN_URL_PREFIX);
}

function loginPathFor(role) {
  if (LOGIN_PATH[role]) {
    return LOGIN_PATH[role];
  }

  return window.location.pathname.startsWith('/admin')
    ? '/admin/login'
    : '/login';
}

// Cualquier 401 fuera de una llamada de inicio de sesion indica que la sesion no existe o caduco:
// hay que eliminarla y redirigir a la pagina de login correspondiente.
// una llamada de inicio de sesion significa q el user escribio mal y lo gestiona el form
function handleUnauthorized(apiError) {
  const role = readSession()?.role;
  const expired = apiError.details.some((detail) => detail.issue === 'expired');

  clearSession();
  setAuthNotice(
    expired ? 'Tu sesión expiró. Volvé a ingresar' : 'Tenés que iniciar sesión'
  );
  window.location.assign(loginPathFor(role)); //Recarga la pagina limpia toda la memoria react
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = ApiError.fromAxiosError(error);

    if (apiError.status === 401 && !isLoginRequest(error.config)) {
      handleUnauthorized(apiError);
    }

    return Promise.reject(apiError);
  }
);

export { instance };
