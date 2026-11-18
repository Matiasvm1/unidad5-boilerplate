import Select from '../../shared/components/atoms/Select';
import Alert from '../../shared/components/molecules/Alert';
import FormField from '../../shared/components/molecules/FormField';

function specialtyHint(specialties) {
  if (specialties.loading) {
    return 'Cargando especialidades...';
  }

  if (!specialties.error && specialties.options.length === 0) {
    return 'Todavía no hay especialidades disponibles';
  }

  return undefined;
}

function doctorHint(specialtyId, doctors) {
  if (!specialtyId) {
    return 'Primero elegí una especialidad';
  }

  if (doctors.loading) {
    return 'Cargando profesionales...';
  }

  if (!doctors.error && doctors.doctors.length === 0) {
    return 'No hay profesionales para esta especialidad';
  }

  return undefined;
}

function SpecialtyDoctorPicker({
  specialties,
  doctors,
  specialtyId,
  doctorId,
  onSpecialtyChange,
  onDoctorChange,
}) {
  const doctorDisabled =
    !specialtyId || doctors.loading || doctors.doctors.length === 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormField
          id="booking-specialty"
          label="Especialidad"
          hint={specialtyHint(specialties)}
        >
          <Select
            value={specialtyId}
            onChange={(event) => onSpecialtyChange(event.target.value)}
            disabled={specialties.loading || specialties.options.length === 0}
          >
            <option value="">Seleccioná una especialidad</option>
            {specialties.options.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          id="booking-doctor"
          label="Profesional"
          hint={doctorHint(specialtyId, doctors)}
        >
          <Select
            value={doctorId}
            onChange={(event) => onDoctorChange(event.target.value)}
            disabled={doctorDisabled}
          >
            <option value="">Seleccioná un profesional</option>
            {doctors.doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      {specialties.error && (
        <Alert tone="error">{specialties.error.message}</Alert>
      )}
      {doctors.error && <Alert tone="error">{doctors.error.message}</Alert>}
    </div>
  );
}

export default SpecialtyDoctorPicker;