// cartelera real de medicos con buscador y paginacion (5 en 5)
// reemplazamos la tabla con doctores inventados

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../shared/components/atoms/Avatar';
import Badge from '../../shared/components/atoms/Badge';
import Card from '../../shared/components/atoms/Card';
import EmptyState from '../../shared/components/molecules/EmptyState';
import SearchInput from '../../shared/components/molecules/SearchInput';
import TablePagination from '../../shared/components/molecules/TablePagination';
import DataTable from '../../shared/components/organisms/DataTable';
import { availabilityInfo } from '../../shared/constants/doctorStatus';
import useDoctors from '../../shared/hooks/useDoctors';
import usePagination from '../../shared/hooks/usePagination';

const PAGE_SIZE = 5;
const ACTION_CLASS =
  'min-h-11 lg:min-h-0 px-2 py-1.5 rounded-lg text-sm font-semibold text-med-primary-700 transition hover:bg-med-primary-50 hover:text-med-primary-900';

function DoctorsDirectory() {
  const navigate = useNavigate();
  const { pageIndex, pageSize, setPageIndex, reset, totalPages } =
    usePagination(PAGE_SIZE); //estos hooks llevan la cuenta de en q pagina estamos
  const [name, setName] = useState('');
  const { doctors, total, loading, error, reload } = useDoctors({
    // llama al endpoint cada vez q se cambia de pagina o escribis en el buscador
    pageIndex,
    pageSize,
    name,
  });

  const handleSearch = useCallback(
    // Con usecallback congelamos la funcion para q se ejecute solo cuando buscamos de vdd
    (term) => {
      setName(term);
      reset();
    },
    [reset]
  );
  //columnas de la tabla
  const columns = [
    {
      key: 'name',
      header: 'Nombre del doctor', // muestra las iniciales con avatar
      render: (doctor) => (
        <span className="flex items-center gap-3">
          <Avatar name={doctor.name} />
          <span className="font-semibold text-med-primary-900">
            {doctor.name}
          </span>
        </span>
      ),
    },
    {
      key: 'specialty',
      header: 'Especialidad',
      render: (doctor) => (
        // si vino null muestra esto
        <span className="text-med-text-sub">
          {doctor.specialty?.name ?? 'Sin especialidad'}
        </span>
      ),
    },
    {
      key: 'availability',
      header: 'Estado de disponibilidad',
      render: (doctor) => {
        const { label, tone } = availabilityInfo(doctor.hasAvailability); // dibuja una etiqeta q dice "con y sin agenda"

        return <Badge tone={tone}>{label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Acciones', // lleva directamente a doctoress
      align: 'right',
      isAction: true,
      render: (doctor) => (
        <button
          type="button"
          aria-label={`Ver detalle de ${doctor.name}`}
          onClick={() => navigate('/admin/doctors')}
          className={ACTION_CLASS}
        >
          Ver detalle
        </button>
      ),
    },
  ];

  const empty = (
    <EmptyState
      icon={name ? 'search' : 'inbox'}
      title={
        name
          ? 'No hay médicos que coincidan con la búsqueda' // si no hay medicos q coincidan xq buscamos mal devuelve esto
          : 'Todavía no hay médicos cargados'
      }
    />
  );

  return (
    <Card padded={false} className="overflow-hidden border-med-border">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-med-border">
        <h2 className="text-base font-bold text-med-primary-900">
          Directorio de profesionales médicos
        </h2>
        <SearchInput
          id="directory-search"
          label="Buscar médico por nombre"
          placeholder="Buscar por nombre..."
          onSearch={handleSearch}
          className="w-full sm:w-72"
        />
      </div>

      <DataTable
        caption="Directorio de profesionales médicos"
        columns={columns}
        rows={doctors}
        loading={loading}
        error={error}
        onRetry={reload}
        empty={empty}
      />

      {!error && total > 0 && (
        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages(total)}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={setPageIndex}
        />
      )}
    </Card>
  );
}

export default DoctorsDirectory;
