import { ROLES } from '../constants/roles';

const SESSION_KEY = 'medportal.session';
const NOTICE_KEY = 'medportal.authNotice';
const KNOWN_ROLES = Object.values(ROLES);
// usamos stringify y parse porque sessionStorage solo guadra texto plano. Al guardar lo convertimos en txt y al leer en objeto

//verificamos que exista una sesion y que el rol sea un rol conocido o real, si no devolvemos null. Si es valido devolvemos la session
function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));

    return session?.token && KNOWN_ROLES.includes(session.role)
      ? session
      : null;
  } catch {
    return null;
  }
}

// guarda la sesion en el sessionStorage
function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// borra la llave medportal.session con removeitem, en vez de .clear() xq si no borra todo el almacenamiento
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// token caducado, muestra un mensaje en login de una sola aparicion tras un cierre de sesion forzoso
function setAuthNotice(message) {
  sessionStorage.setItem(NOTICE_KEY, message);
}

// Si existe un msj de sesion caducada devuelve un mensaje
function peekAuthNotice() {
  return sessionStorage.getItem(NOTICE_KEY);
}

// borra el mensaje de sesion caducada
function clearAuthNotice() {
  sessionStorage.removeItem(NOTICE_KEY);
}

export {
  readSession,
  saveSession,
  clearSession,
  setAuthNotice,
  peekAuthNotice,
  clearAuthNotice,
};
