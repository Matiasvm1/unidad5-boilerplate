// On/off toggle (spec 10). `label` names it for screen readers; the visible
// text says Activo / Inactivo.
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${label}: ${checked ? 'activo' : 'inactivo'}`}
      onClick={() => onChange(!checked)}
      className="min-h-11 inline-flex items-center gap-2 text-xs font-semibold text-med-text-sub"
    >
      <span
        className={`relative inline-block w-10 h-6 rounded-full transition ${
          checked ? 'bg-med-primary-700' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
            checked ? 'left-5' : 'left-1'
          }`}
        />
      </span>
      {checked ? 'Activo' : 'Inactivo'}
    </button>
  );
}

export default Switch;
