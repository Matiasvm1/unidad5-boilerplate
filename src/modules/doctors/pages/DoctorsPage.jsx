import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorsTable from '../components/DoctorsTable';
import { deleteDoctor } from '../services/doctorsService';
import Button from '../../shared/components/atoms/Button';
import Card from '../../shared/components/atoms/Card';
import Icon from '../../shared/components/atoms/Icon';
import Alert from '../../shared/components/molecules/Alert';
import ConfirmDialog from '../../shared/components/molecules/ConfirmDialog';
import EmptyState from '../../shared/components/molecules/EmptyState';
import SearchInput from '../../shared/components/molecules/SearchInput';
import TablePagination from '../../shared/components/molecules/TablePagination';
import useAsync from '../../shared/hooks/useAsync';
import useDoctors from '../../shared/hooks/useDoctors';
import useFlashNotice from '../../shared/hooks/useFlashNotice';
import usePagination from '../../shared/hooks/usePagination';

const NEW_PATH = '/admin/doctors/new';
const AVAILABILITY_PATH = '/admin/doctors/availability';

function DoctorsPage() {
  const navigate = useNavigate();
  const { pageIndex, pageSize, setPageIndex, reset, totalPages } =
    usePagination();
  const [name, setName] = useState('');
  const [notice, setNotice] = useFlashNotice();
  const [toDelete, setToDelete] = useState(null);
  const removal = useAsync(deleteDoctor);

  const { doctors, total, loading, error, reload } = useDoctors({
    pageIndex,
    pageSize,
    name,
  });

  const handleSearch = useCallback(
    (term) => {
      setName(term);
      reset();
    },
    [reset]
  );

  const openDelete = (doctor) => {
    removal.reset();
    setToDelete(doctor);
  };

  const closeDelete = useCallback(() => setToDelete(null), []);

  const confirmDelete = async () => {
    try {
      await removal.run(toDelete.id);
    } catch {
      return; // el diálogo muestra removal.error
    }

    setNotice({
      tone: 'success',
      message: `Se eliminó a ${toDelete.name}`,
    });
    setToDelete(null);

    // Si se borra la última fila de una página que no es la primera, vuelve una página.
    if (doctors.length === 1 && pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    } else {
      reload();
    }
  };

  const newButton = (
    <Button onClick={() => navigate(NEW_PATH)} className="min-h-11">
      <span className="inline-flex items-center gap-1.5">
        <Icon name="plus" />
        Nuevo doctor
      </span>
    </Button>
  );

  const empty = name ? (
    <EmptyState
      icon="search"
      title="No hay médicos que coincidan con la búsqueda"
    />
  ) : (
    <EmptyState title="Todavía no hay médicos cargados">{newButton}</EmptyState>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
          <SearchInput
            id="doctors-search"
            label="Buscar doctor por nombre"
            placeholder="Buscar doctor por nombre..."
            onSearch={handleSearch}
            className="sm:w-64"
          />
          <Button
            variant="secondary"
            onClick={() => navigate(AVAILABILITY_PATH)}
            className="min-h-11"
          >
            Agregar disponibilidad horaria
          </Button>
          {newButton}
        </div>
      </div>

      {notice && <Alert tone={notice.tone}>{notice.message}</Alert>}

      <Card padded={false} className="overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border flex items-center justify-between">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
          {!loading && !error && (
            <span className="text-xs text-med-text-muted">Total: {total}</span>
          )}
        </div>

        <DoctorsTable
          doctors={doctors}
          loading={loading}
          error={error}
          onRetry={reload}
          onDelete={openDelete}
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

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar médico"
        message={`¿Eliminar a ${toDelete?.name ?? ''}? No se va a poder reservar más turnos con este profesional.`}
        loading={removal.loading}
        error={removal.error?.message}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </div>
  );
}

export default DoctorsPage;
