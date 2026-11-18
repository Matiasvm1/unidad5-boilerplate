import Select from '../../shared/components/atoms/Select';
import FormField from '../../shared/components/molecules/FormField';

// Menu despl para elegir q profesional le asignamos los hs
//

function DoctorPicker({ doctors, value, onChange }) {
  const empty = doctors.length === 0; // si no hay medicos cargados en el sist desactiva el componente para que muestre q no hay medicos cargados

  return (
    <FormField
      id="availability-doctor"
      label="Seleccionar profesional"
      hint={empty ? 'Todavía no hay médicos cargados' : undefined}
    >
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={empty}
      >
        <option value="">Seleccioná un profesional</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </Select>
    </FormField>
  );
}

export default DoctorPicker;
