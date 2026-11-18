import { NavLink } from 'react-router-dom';
import Icon from '../../shared/components/atoms/Icon';

const NAV_ITEMS = [
  { to: '/admin/home', label: 'Tablero', icon: 'grid' },
  { to: '/admin/doctors', label: 'Doctores', icon: 'briefcase' },
  { to: '/admin/specialties', label: 'Especialidades', icon: 'medical' },
  { to: '/admin/patients', label: 'Búsqueda de turnos', icon: 'userSearch' },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-med-primary-50 text-med-primary-900 border-r-4 border-med-primary-900'
      : 'text-med-text-sub hover:bg-gray-50 hover:text-med-primary-900'
  }`;

// Admin menu (spec 10): fixed on the left from `lg`, a sliding panel below (spec 12.2).
function Sidebar({ open, email, onNavigate, onLogout }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-med-border flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        <div className="p-6 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900 leading-tight">
            MedPortal
          </h2>
          <span className="text-xs font-medium text-med-text-muted">
            Administración
          </span>
        </div>

        <nav aria-label="Menú principal" className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={linkClass}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-med-border-subtle space-y-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full min-h-11 flex items-center gap-3 px-3 py-2 text-xs font-medium text-med-text-sub hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Icon name="logout" className="w-4 h-4 text-med-text-muted" />
          <span>Cerrar sesión</span>
        </button>

        <div className="pt-3 border-t border-med-border overflow-hidden">
          <p className="text-xs font-semibold text-med-text-main truncate">
            {email}
          </p>
          <p className="text-[11px] text-med-text-muted truncate">
            Administrador
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
