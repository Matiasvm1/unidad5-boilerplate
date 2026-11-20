import { Controller, useForm } from 'react-hook-form';
import DayScheduleRow from './DayScheduleRow';
import { WEEK_DAYS, toPayloadDays } from '../utils/schedule';
import Button from '../../shared/components/atoms/Button';
import Alert from '../../shared/components/molecules/Alert';

const DAYS_REQUIRED = 'Tenés que activar al menos un día de atención';
const INVALID_RANGE = 'La hora de entrada debe ser anterior a la de salida';

// A day is valid when it is off or when it starts before it ends.
const validateRow = (row) =>
  !row.active || row.startTime < row.endTime || INVALID_RANGE;

// The whole week (7 rows, same order as WEEK_DAYS). This is the only
// component that knows react-hook-form: each row is one controlled field, so
// DayScheduleRow just gets value, error and onChange. The page remounts the
// form with a new key when another schedule loads, so initialRows only seeds
// the defaults.
function WeekScheduleForm({
  initialRows,
  submitLabel,
  errorMessage,
  onSubmit,
  onCancel,
}) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitted, isSubmitting },
  } = useForm({ defaultValues: { rows: initialRows } });

  const rows = watch('rows');
  const noActiveDay = !rows.some((row) => row.active);

  const submit = async (values) => {
    if (noActiveDay) {
      return;
    }

    await onSubmit(toPayloadDays(values.rows));
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-4"
    >
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      {isSubmitted && noActiveDay && (
        <Alert tone="error">{DAYS_REQUIRED}</Alert>
      )}

      <div className="flex flex-col gap-3 lg:gap-0">
        {WEEK_DAYS.map(({ code, label }, index) => (
          <Controller
            key={code}
            name={`rows.${index}`}
            control={control}
            rules={{ validate: validateRow }}
            render={({ field, fieldState }) => (
              <DayScheduleRow
                day={code}
                label={label}
                value={field.value}
                error={fieldState.error?.message}
                onChange={field.onChange}
              />
            )}
          />
        ))}
      </div>

      <div className="flex flex-col-reverse lg:flex-row lg:justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default WeekScheduleForm;
