function TablePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label="Paginación"
      className="p-4 bg-med-primary-50/50 border-t border-med-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-med-text-muted"
    >
      <span>
        Mostrando {from} a {to} de {totalItems} resultados
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Página anterior"
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ‹
        </button>
        <span>
          Página {currentPage} de {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          aria-label="Página siguiente"
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ›
        </button>
      </div>
    </nav>
  );
}

export default TablePagination;
