import Icon from '../../shared/components/atoms/Icon';
import DataTable from '../../shared/components/organisms/DataTable';

function SpecialtiesTable({
  specialties,
  loading,
  error,
  onRetry,
  onDelete,
  empty,
}) {
  const columns = [
    {
      key: 'name',
      header: 'Nombre de la especialidad',
      render: (specialty) => (
        <span className="font-semibold text-med-primary-900">
          {specialty.name}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (specialty) => (
        <span className="text-med-text-sub">{specialty.description}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      isAction: true,
      render: (specialty) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label={`Eliminar ${specialty.name}`}
            title="Eliminar"
            onClick={() => onDelete(specialty)}
            className="min-w-11 min-h-11 lg:min-w-0 lg:min-h-0 p-1.5 rounded-lg flex items-center justify-center text-med-text-muted hover:bg-red-50 hover:text-red-600 transition"
          >
            <Icon name="trash" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      caption="Especialidades"
      columns={columns}
      rows={specialties}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty}
    />
  );
}

export default SpecialtiesTable;
