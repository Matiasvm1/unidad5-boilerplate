import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../shared/components/atoms/Icon';

const NAV_ITEMS = [
  { to: '/', label: 'Reservar turno', end: true },
  { to: '/appointments', label: 'Mis turnos', end: false },
];

const desktopLinkClass = ({ isActive }) =>
  `px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
    isActive
      ? 'bg-med-primary-900 text-white'
      : 'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block min-h-11 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
    isActive
      ? 'bg-med-primary-900 text-white'
      : 'text-med-text-sub hover:bg-med-primary-50'
  }`;

// Patient top bar (spec 10): links inline from `md`, a drop-down below.
// Shows the session email and DNI (spec 5.2).
function PatientNavbar({ email, dni, onLogout }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="bg-white shadow-xs border-b border-med-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-8">
          <NavLink to="/" className="min-h-11 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-med-primary-900 text-white flex items-center justify-center shadow-xs">
              <Icon name="briefcase" />
            </span>
            <span className="text-lg font-bold text-med-primary-900 tracking-tight">
              MedPortal
            </span>
          </NavLink>

          <nav aria-label="Menú principal" className="hidden md:flex gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={desktopLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs font-semibold text-med-text-main">
              {email}
            </span>
            <span className="text-[11px] text-med-text-muted">DNI {dni}</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="hidden sm:inline-flex text-xs font-semibold text-med-text-sub hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-med-border hover:bg-red-50/40 transition"
          >
            Salir
          </button>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="md:hidden min-w-11 min-h-11 flex items-center justify-center p-1.5 rounded-lg border border-med-border text-med-text-sub hover:bg-gray-50"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-med-border px-4 py-3 bg-white space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={close}
              className={mobileLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-med-border-subtle flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-med-text-sub break-all">
              {email} · DNI {dni}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="min-h-11 shrink-0 text-xs font-bold text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default PatientNavbar;
