import { cloneElement } from 'react';
import Label from '../atoms/Label';

// Label + control + hint + error. Wires id, invalid and aria-describedby
// into the single control it receives as child.
function FormField({ id, label, required = false, hint, error, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {cloneElement(children, {
        id,
        invalid: Boolean(error),
        'aria-describedby': describedBy,
      })}
      {hint && (
        <p id={hintId} className="text-xs text-med-text-sub">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
