/* Roles guarda los textos exactos que devuelve el back cuando alguien inicia sesion */
/* Roles admin[] nos devuelve que usemos /admin/home */
/* "frizamos" los objetos para que no se puedan modificar en otro archivo */

const ROLES = Object.freeze({
  ADMIN: 'ADMINISTRADOR',
  PATIENT: 'PACIENTE',
});

const HOME_PATH = Object.freeze({
  [ROLES.ADMIN]: '/admin/home',
  [ROLES.PATIENT]: '/',
});

const LOGIN_PATH = Object.freeze({
  [ROLES.ADMIN]: '/admin/login',
  [ROLES.PATIENT]: '/login',
});

export { ROLES, HOME_PATH, LOGIN_PATH };
