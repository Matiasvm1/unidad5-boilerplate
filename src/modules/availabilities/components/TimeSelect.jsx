import Select from '../../shared/components/atoms/Select';
import { TIME_OPTIONS } from '../utils/schedule';

// Hour picker in half-hour steps (00:00 to 23:30), the only values the
// backend accepts. Controlled: it receives value and reports onChange(time).
function TimeSelect({
  id,
  label,
  value,
  onChange,
  disabled,
  invalid,
  describedBy,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-med-text-sub">
        {label}
      </label>
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        invalid={invalid}
        aria-describedby={describedBy}
      >
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default TimeSelect;
