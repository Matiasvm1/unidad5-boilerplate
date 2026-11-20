import TimeSelect from './TimeSelect';
import Switch from '../../shared/components/atoms/Switch';

// One day of the weekly schedule: the on/off switch and the start and end
// hours. Controlled and form-library agnostic: it receives the row
// ({ active, startTime, endTime }) and reports every change with onChange.
function DayScheduleRow({ day, label, value, error, onChange }) {
  const id = `day-${day.toLowerCase()}`;
  const errorId = error ? `${id}-error` : undefined;

  const update = (field) => (fieldValue) =>
    onChange({ ...value, [field]: fieldValue });

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-med-border-subtle lg:p-0 lg:py-3 lg:rounded-none lg:border-0 lg:border-b lg:last:border-b-0">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center justify-between lg:w-48 gap-3">
          <span className="text-sm font-semibold text-med-text-main">
            {label}
          </span>
          <Switch
            checked={value.active}
            label={label}
            onChange={update('active')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1">
          <TimeSelect
            id={`${id}-start`}
            label="Entrada"
            value={value.startTime}
            onChange={update('startTime')}
            disabled={!value.active}
            invalid={Boolean(error)}
            describedBy={errorId}
          />
          <TimeSelect
            id={`${id}-end`}
            label="Salida"
            value={value.endTime}
            onChange={update('endTime')}
            disabled={!value.active}
            invalid={Boolean(error)}
            describedBy={errorId}
          />
        </div>
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default DayScheduleRow;
