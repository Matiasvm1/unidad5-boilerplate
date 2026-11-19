import Badge from '../../shared/components/atoms/Badge';
import Icon from '../../shared/components/atoms/Icon';
import DataTable from '../../shared/components/organisms/DataTable';
import { availabilityInfo } from '../../shared/constants/doctorStatus';

const ACTION_CLASS =
  'min-w-11 min-h-11 lg:min-w-0 lg:min-h-0 p-1.5 rounded-lg flex items-center justify-center text-med-text-muted transition';

// Si la especialidad fue dada de baja, el backend la manda en null.
function SpecialtyBadge({ specialty }) {
  if (!specialty) {
    return (
      <span className="text-xs italic text-med-text-muted">
        Sin especialidad
      </span>
    );
  }

  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
      {specialty.name}
    </span>
  );
}

function DoctorsTable({ doctors, loading, error, onRetry, onDelete, empty }) {
  const columns = [
    {
      key: 'name',
      header: 'Nombre del doctor',
      render: (doctor) => (
        <div>
          <p className="font-semibold text-med-primary-900 leading-tight">
            {doctor.name}
          </p>
          <p className="text-xs text-med-text-muted mt-0.5">
            Matrícula: {doctor.licenseNumber ?? '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'specialty',
      header: 'Especialidad',
      render: (doctor) => <SpecialtyBadge specialty={doctor.specialty} />,
    },
    {
      key: 'availability',
      header: 'Estado de disponibilidad',
      render: (doctor) => {
        const { label, tone } = availabilityInfo(doctor.hasAvailability);

        return <Badge tone={tone}>{label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      isAction: true,
      render: (doctor) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label={`Eliminar ${doctor.name}`}
            title="Eliminar"
            onClick={() => onDelete(doctor)}
            className={`${ACTION_CLASS} hover:bg-red-50 hover:text-red-600`}
          >
            <Icon name="trash" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      caption="Médicos"
      columns={columns}
      rows={doctors}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty}
    />
  );
}

export default DoctorsTable;
