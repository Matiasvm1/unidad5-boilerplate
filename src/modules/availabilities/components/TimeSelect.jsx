import Select from '../../shared/components/atoms/Select';
import { TIME_OPTIONS } from '../utils/schedule';

// Las horas son intervalos de media hora, desde las 00:00 hasta las 23:30
// registration es lo que devuelve la funcion register de rhf

// con select le damos el candado numerico q tiene las combinaciones validas calculadas en timeoptions
function TimeSelect({
  id,
  label,
  disabled,
  invalid,
  describedBy,
  registration, //esta es la prop controlado por rhf
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-med-text-sub">
        {label}
      </label>
      <Select
        id={id}
        disabled={disabled}
        invalid={invalid}
        aria-describedby={describedBy}
        {...registration} //enchufamos al select
      >
        // agarra la lista de 48 horarios y por cada uno crea la etiqueta option
        con key obligatoria
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
