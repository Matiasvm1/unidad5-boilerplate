import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuth from '../../auth/hooks/useAuth';
import Icon from '../../shared/components/atoms/Icon';

// Admin template: Sidebar + content (spec 10).
function DashboardLayout() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-med-bg flex">
      <Sidebar
        open={openMobileMenu}
        email={session?.email}
        onNavigate={() => setOpenMobileMenu(false)}
        onLogout={handleLogout}
      />

      {/* Backdrop for the mobile panel */}
      {openMobileMenu && (
        <div
          aria-hidden="true"
          onClick={() => setOpenMobileMenu(false)}
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-med-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-med-primary-900 text-white flex items-center justify-center font-bold text-xs">
              MP
            </div>
            <span className="font-bold text-sm text-med-primary-900">
              MedPortal
            </span>
          </div>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={openMobileMenu}
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
            className="min-w-11 min-h-11 flex items-center justify-center p-1.5 rounded-lg border border-med-border text-med-text-sub"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
