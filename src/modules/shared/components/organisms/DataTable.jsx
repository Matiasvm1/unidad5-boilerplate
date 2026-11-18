import Button from '../atoms/Button';
import Alert from '../molecules/Alert';

const SKELETON_KEYS = ['skeleton-1', 'skeleton-2', 'skeleton-3'];

function SkeletonBar({ className = '' }) {
  return (
    <span
      className={`block h-4 rounded bg-gray-200 animate-pulse ${className}`}
    />
  );
}

const alignClass = (column) =>
  column.align === 'right' ? 'text-right' : 'text-left';

function TableRows({ columns, rows, rowKey, loading }) {
  if (loading) {
    return SKELETON_KEYS.map((key) => (
      <tr key={key}>
        {columns.map((column) => (
          <td key={column.key} className="px-6 py-4">
            <SkeletonBar />
          </td>
        ))}
      </tr>
    ));
  }

  return rows.map((row) => (
    <tr key={rowKey(row)} className="hover:bg-gray-50/70 transition-colors">
      {columns.map((column) => (
        <td key={column.key} className={`px-6 py-4 ${alignClass(column)}`}>
          {column.render(row)}
        </td>
      ))}
    </tr>
  ));
}

function CardRows({ columns, rows, rowKey, loading }) {
  if (loading) {
    return SKELETON_KEYS.map((key) => (
      <li key={key} className="p-4 flex flex-col gap-2">
        <SkeletonBar className="w-2/3" />
        <SkeletonBar className="w-1/2" />
      </li>
    ));
  }

  const dataColumns = columns.filter((column) => !column.isAction);
  const actionColumn = columns.find((column) => column.isAction);

  return rows.map((row) => (
    <li key={rowKey(row)} className="p-4 flex flex-col gap-2">
      <dl className="flex flex-col gap-2">
        {dataColumns.map((column) => (
          <div key={column.key} className="flex flex-col">
            <dt className="text-[11px] uppercase tracking-wider text-med-text-muted">
              {column.header}
            </dt>
            <dd className="text-sm text-med-text-main break-words">
              {column.render(row)}
            </dd>
          </div>
        ))}
      </dl>
      {actionColumn && (
        <div className="flex justify-end">{actionColumn.render(row)}</div>
      )}
    </li>
  ));
}

// Generic table with loading, empty and error states. Below `lg` each row
// becomes a card with label/value pairs (spec 12.2).
// columns: [{ key, header, render(row), align: 'left'|'right', isAction }]
function DataTable({
  columns,
  rows,
  rowKey = (row) => row.id,
  loading = false,
  error = null,
  onRetry,
  empty,
  caption,
}) {
  if (error) {
    return (
      <div className="p-6 flex flex-col items-start gap-3">
        <Alert tone="error">{error.message}</Alert>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry} className="min-h-11">
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  if (!loading && rows.length === 0) {
    return empty;
  }

  const rowProps = { columns, rows, rowKey, loading };

  return (
    <div aria-busy={loading || undefined}>
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3.5 ${alignClass(column)}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-med-border-subtle">
            <TableRows {...rowProps} />
          </tbody>
        </table>
      </div>

      <ul className="lg:hidden divide-y divide-med-border-subtle">
        <CardRows {...rowProps} />
      </ul>
    </div>
  );
}

export default DataTable;
