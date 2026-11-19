import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialtiesTable from '../components/SpecialtiesTable';
import useSpecialties from '../hooks/useSpecialties';
import { deleteSpecialty } from '../services/specialtiesService';
import Button from '../../shared/components/atoms/Button';
import Card from '../../shared/components/atoms/Card';
import Icon from '../../shared/components/atoms/Icon';
import Alert from '../../shared/components/molecules/Alert';
import ConfirmDialog from '../../shared/components/molecules/ConfirmDialog';
import EmptyState from '../../shared/components/molecules/EmptyState';
import SearchInput from '../../shared/components/molecules/SearchInput';
import TablePagination from '../../shared/components/molecules/TablePagination';
import useAsync from '../../shared/hooks/useAsync';
import useFlashNotice from '../../shared/hooks/useFlashNotice';
import usePagination from '../../shared/hooks/usePagination';

const NEW_PATH = '/admin/specialties/new';

function SpecialtiesPage() {
  const navigate = useNavigate();
  const { pageIndex, pageSize, setPageIndex, reset, totalPages } =
    usePagination();
  const [name, setName] = useState('');
  const [notice, setNotice] = useFlashNotice();
  const [toDelete, setToDelete] = useState(null);
  const removal = useAsync(deleteSpecialty);

  const { specialties, total, loading, error, reload } = useSpecialties({
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

  const openDelete = (specialty) => {
    removal.reset();
    setToDelete(specialty);
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
      message: `Se eliminó la especialidad ${toDelete.name}`,
    });
    setToDelete(null);

    // Si se borra la última fila de una página que no es la primera, vuelve una página.
    if (specialties.length === 1 && pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    } else {
      reload();
    }
  };

  const newButton = (
    <Button onClick={() => navigate(NEW_PATH)} className="min-h-11">
      <span className="inline-flex items-center gap-1.5">
        <Icon name="plus" />
        Nueva especialidad
      </span>
    </Button>
  );

  const empty = name ? (
    <EmptyState
      icon="search"
      title="No hay especialidades que coincidan con la búsqueda"
    />
  ) : (
    <EmptyState title="Todavía no hay especialidades cargadas">
      {newButton}
    </EmptyState>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas que ofrece el centro.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <SearchInput
            id="specialties-search"
            label="Buscar especialidad"
            placeholder="Buscar especialidad..."
            onSearch={handleSearch}
            className="sm:w-64"
          />
          {newButton}
        </div>
      </div>

      {notice && <Alert tone={notice.tone}>{notice.message}</Alert>}

      <Card padded={false} className="overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border flex items-center justify-between">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
          {!loading && !error && (
            <span className="text-xs text-med-text-muted">Total: {total}</span>
          )}
        </div>

        <SpecialtiesTable
          specialties={specialties}
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
        title="Eliminar especialidad"
        message={`¿Eliminar la especialidad ${toDelete?.name ?? ''}?`}
        loading={removal.loading}
        error={removal.error?.message}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </div>
  );
}

export default SpecialtiesPage;
