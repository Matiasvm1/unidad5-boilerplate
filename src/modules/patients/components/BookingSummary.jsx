import { useForm } from 'react-hook-form';
import { formatLongDate } from '../../shared/utils/dates';
import Button from '../../shared/components/atoms/Button';
import Textarea from '../../shared/components/atoms/Textarea';
import Alert from '../../shared/components/molecules/Alert';
import FormField from '../../shared/components/molecules/FormField';
import { trimValue } from '../../shared/utils/formErrors';

const REASON_MESSAGE =
  'Contanos el motivo de la consulta (mínimo 5 caracteres)';
const REASON_MAX = 300;

function BookingSummary({
  doctor,
  slot,
  errorMessage,
  blocked = false,
  onConfirm,
}) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', defaultValues: { reason: '' } });

  const reasonLength = (watch('reason') ?? '').trim().length;
  const submit = (values) => onConfirm(values, setError);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div
        aria-live="polite"
        className="p-4 rounded-lg bg-med-primary-50 border border-med-border text-sm"
      >
        {slot ? (
          <p className="text-med-text-main">
            <span className="font-semibold">{formatLongDate(slot.date)}</span> a
            las <span className="font-semibold">{slot.startTime}</span> con{' '}
            <span className="font-semibold">{doctor.name}</span>
          </p>
        ) : (
          <p className="text-med-text-sub">
            Elegí un horario disponible para continuar.
          </p>
        )}
      </div>

      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      <FormField
        id="booking-reason"
        label="Motivo de la consulta"
        required
        hint={`${reasonLength}/${REASON_MAX} caracteres`}
        error={errors.reason?.message}
      >
        <Textarea
          rows={3}
          maxLength={REASON_MAX}
          placeholder="Ej.: Control anual"
          {...register('reason', {
            setValueAs: trimValue,
            required: REASON_MESSAGE,
            validate: (value) =>
              (value.length >= 5 && value.length <= REASON_MAX) ||
              REASON_MESSAGE,
          })}
        />
      </FormField>

      <div className="fixed inset-x-0 bottom-0 z-20 px-4 py-3 bg-white border-t border-med-border shadow-lg flex items-center gap-3 lg:static lg:z-auto lg:p-0 lg:bg-transparent lg:border-0 lg:shadow-none lg:justify-end">
        <p className="lg:hidden flex-1 min-w-0 text-xs text-med-text-sub truncate">
          {slot
            ? `${formatLongDate(slot.date)} · ${slot.startTime}`
            : 'Elegí un horario'}
        </p>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!slot || blocked}
          className="min-h-11 shrink-0"
        >
          Confirmar turno
        </Button>
      </div>
    </form>
  );
}

export default BookingSummary;
