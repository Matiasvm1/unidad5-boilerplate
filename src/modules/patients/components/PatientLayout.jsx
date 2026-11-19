import { Outlet, useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import useAuth from '../../auth/hooks/useAuth';

function PatientLayout() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-med-bg flex flex-col">
      <PatientNavbar
        email={session?.email}
        dni={session?.dni}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;
