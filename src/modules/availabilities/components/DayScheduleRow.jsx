// es una sola fila de la semana, contiene prender y apagar, la hs de entrada y salida
// la entrada tiene q ser menor a la salida

import { Controller } from 'react-hook-form';
import TimeSelect from './TimeSelect';
import Switch from '../../shared/components/atoms/Switch';

const INVALID_RANGE = 'La hora de entrada debe ser anterior a la de salida';

// Las hs permanecen deshabilitadas mientras el dia esta inactivo
// Cada dia de la semana se presenta como una tarjeta
// a partir de lg los dias se visualizan como una tabla

function DayScheduleRow({
  index,
  day,
  label,
  active,
  error,
  register,
  control,
}) {
  const id = `day-${day.toLowerCase()}`;
  const errorId = error ? `${id}-error` : undefined;
  const field = (name) => `rows.${index}.${name}`;

  // Acá se valida la hs de salida. recibe el valor q se elige y todo el form completo
  // busca la fila exacta en la q estamos, si el dia esta apagado devuelve true, si esta prendido
  // compara alfabeticamente los textos

  const endRules = {
    validate: (endTime, values) => {
      const row = values.rows[index];

      return !row.active || row.startTime < endTime || INVALID_RANGE;
    },
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-med-border-subtle lg:p-0 lg:py-3 lg:rounded-none lg:border-0 lg:border-b lg:last:border-b-0">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center justify-between lg:w-48 gap-3">
          <span className="text-sm font-semibold text-med-text-main">
            {label}
          </span>
          {
            //Rhf solo funciona con cajas nativas de html o inputs. El switch es un button disfrazado
            // para conectarlo necesitamos un controller (toma el name y usa control para hacer render)
          }
          <Controller
            name={field('active')}
            control={control}
            rules={{ deps: field('endTime') }} // Si pones mal la hs el cartel queda para siempre, pero con deps se vuelve a validar la hora de salida
            render={({ field: { value, onChange } }) => (
              <Switch checked={value} label={label} onChange={onChange} />
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1">
          <TimeSelect
            id={`${id}-start`}
            label="Entrada"
            disabled={!active}
            invalid={Boolean(error)}
            describedBy={errorId}
            registration={register(field('startTime'), {
              deps: field('endTime'),
            })}
          />
          <TimeSelect
            id={`${id}-end`}
            label="Salida"
            disabled={!active}
            invalid={Boolean(error)}
            describedBy={errorId}
            registration={register(field('endTime'), endRules)}
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
