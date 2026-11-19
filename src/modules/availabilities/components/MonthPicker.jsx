// Es para seleccionar los meses (1 actual y 12 siguientes)

import Select from '../../shared/components/atoms/Select';
import FormField from '../../shared/components/molecules/FormField';

// iteramos el array months q nos pasan por props
// para cada mes guardamos un codigo en value y le mostramos al user el texto legible
function MonthPicker({ months, value, onChange }) {
  return (
    <FormField id="availability-month" label="Mes">
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        {months.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormField>
  );
}

export default MonthPicker;
