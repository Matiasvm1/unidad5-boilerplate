import { useCallback, useState } from 'react';
import AppointmentFilters from '../components/AppointmentFilters';
import AppointmentsTable from '../components/AppointmentsTable';
import useAppointmentSearch from '../hooks/useAppointmentSearch';
import Card from '../../shared/components/atoms/Card';
import EmptyState from '../../shared/components/molecules/EmptyState';
import TablePagination from '../../shared/components/molecules/TablePagination';
import usePagination from '../../shared/hooks/usePagination';

const NO_FILTERS = {};

function AppointmentsSearchPage() {
  const [applied, setApplied] = useState({ filters: NO_FILTERS, chips: [] });
  const { pageIndex, pageSize, setPageIndex, reset, totalPages } =
    usePagination();

  const { appointments, total, loading, error, reload } = useAppointmentSearch({
    filters: applied.filters,
    pageIndex,
    pageSize,
  });

  const applyFilters = useCallback(
    (filters, chips) => {
      setApplied({ filters: { ...filters }, chips });
      reset();
    },
    [reset]
  );

  const clearFilters = useCallback(() => {
    setApplied({ filters: {}, chips: [] });
    reset();
  }, [reset]);

  const empty =
    applied.chips.length > 0 ? (
      <EmptyState
        icon="search"
        title="No hay turnos que coincidan con los filtros"
      />
    ) : (
      <EmptyState icon="calendar" title="Todavía no hay turnos registrados" />
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y filtrado de citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Busque turnos por paciente, especialidad, médico, fecha o estado.
        </p>
      </div>

      <Card>
        <h2 className="text-base font-bold text-med-primary-900 pb-4 mb-4 border-b border-med-border-subtle">
          Criterios de búsqueda
        </h2>
        <AppointmentFilters
          chips={applied.chips}
          searching={loading}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </Card>

      <Card padded={false} className="overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border flex items-center justify-between">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de citas
          </h2>
          {!loading && !error && (
            <span className="text-xs text-med-text-muted">Total: {total}</span>
          )}
        </div>

        <AppointmentsTable
          appointments={appointments}
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
    </div>
  );
}

export default AppointmentsSearchPage;
