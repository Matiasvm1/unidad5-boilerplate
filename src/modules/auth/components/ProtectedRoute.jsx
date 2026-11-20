import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { HOME_PATH, LOGIN_PATH, ROLES } from '../../shared/constants/roles';

// Route guard. Renders the child routes only when the session has one of the
// allowed roles:
// - no session: goes to the login of the first allowed role (or loginPath)
// - session with another role: goes to the home page of that role
// It only protects the UI; the backend still checks the token on every call.
function ProtectedRoute({ allowedRoles = [], loginPath }) {
  const { session, hasRole } = useAuth();

  if (!session) {
    return (
      <Navigate
        to={
          loginPath ?? LOGIN_PATH[allowedRoles[0]] ?? LOGIN_PATH[ROLES.PATIENT]
        }
        replace
      />
    );
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to={HOME_PATH[session.role] ?? '/'} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
