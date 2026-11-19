// dayschedulerow es la fila indiv de un dia, esta es la planilla completa de la semana

import { useForm } from 'react-hook-form';
import DayScheduleRow from './DayScheduleRow';
import { WEEK_DAYS, toPayloadDays } from '../utils/schedule';
import Button from '../../shared/components/atoms/Button';
import Alert from '../../shared/components/molecules/Alert';

const DAYS_REQUIRED = 'Tenés que activar al menos un día de atención';

// 7 filas, un intervalo por dia gestionado por rhf
// initial rows sigue el orden de weekdays -> index corresponde a weekdays
// la pag monta d nuevo el form mediante key cuando hay una nueva programacion
// entonces initialrows solo sirve para valores predet

function WeekScheduleForm({
  initialRows,
  submitLabel,
  errorMessage,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm({ defaultValues: { rows: initialRows } });

  // el unico campo es rows, el array con 7 filas dentro

  const rows = watch('rows'); //le dice a rhf q avise cada vez que cambie algo dentro de las filas
  const noActiveDay = !rows.some((row) => row.active); // se calcula para ver si al menos existe alguna fila prendida

  // si el user hace clic en guardar y lo de arriba es verdadero
  // se aborta silenciosamente y no manda nada, si todo est bien
  // agarra los valores en crudo y los pasa por topayloaddays y se los entrega a la pag
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
        {' '}
        {WEEK_DAYS.map(({ code, label }, index) => (
          // recorre weekdays con un map y por c u dibuja un componente
          <DayScheduleRow //inyecta los register y control y avisa si el dia tiene un error
            key={code}
            index={index}
            day={code}
            label={label}
            active={rows[index].active}
            error={errors.rows?.[index]?.endTime?.message}
            register={register}
            control={control}
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
