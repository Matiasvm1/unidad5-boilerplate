// el codigo anterior permitia que si tenias algun token, permitia que un paciente
// escriba un /admin y entrar. Este nuevo codigo recibe por parametro el rol
// y redobla el control de seguridad

// Traemos navigate y outlet, useAuth (hook) y los diccionarios homepath y loginpath donde dice cual es el login y el inicio de cada rol

import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { HOME_PATH, LOGIN_PATH } from '../../shared/constants/roles';

// Sin sesion, inicio de sesion para esta zona.  Otro rol, pagina de inicio correspondiente a ese rol

//recibe un prop (role) .
function ProtectedRoute({ role }) {
  const { session } = useAuth(); //Pedimos la sesion actual, si no hay nadie es null
  // si alguien inicio, nos devuelve el objeto token role email ...

  if (!session) {
    return <Navigate to={LOGIN_PATH[role]} replace />;
  } //pregunta si hay sesion y lo mandamos a la puerta correspondiente

  if (session.role !== role) {
    return <Navigate to={HOME_PATH[session.role] ?? '/'} replace />;
  } // si hay sesion pero el rol no coincide, lo mandas al inicio de su rol

  return <Outlet />; //si paso el primer if y el segundo if, se dibuja la pagina que pidio
}

export default ProtectedRoute;
