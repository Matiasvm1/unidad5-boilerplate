// es como un guardia antes de los login que hace lo inverso a protected route
// solo deja ver el formulario a los que no tienen seion

import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { HOME_PATH } from '../../shared/constants/roles';

//Aplica para los dos login, no recibe prop

function GuestRoute() {
  const { session } = useAuth(); //mira quien esta conectado

  if (session) {
    //si ya existe sesion no deja ver el login. Mira la sesion role y te manda ahi con replace
    return <Navigate to={HOME_PATH[session.role] ?? '/'} replace />;
  }

  return <Outlet />; // si no hay sesion te deja pasar y te muestra la pagina de login correspondiente
}

export default GuestRoute;
