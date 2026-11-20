import { useForm } from 'react-hook-form';
import useDoctorOptions from '../../shared/hooks/useDoctorOptions';
import useDoctorsBySpecialty from '../../shared/hooks/useDoctorsBySpecialty';
import Button from '../../shared/components/atoms/Button';
import Icon from '../../shared/components/atoms/Icon';
import Input from '../../shared/components/atoms/Input';
import Select from '../../shared/components/atoms/Select';
import FormField from '../../shared/components/molecules/FormField';
import { APPOINTMENT_STATUS_OPTIONS } from '../../shared/constants/appointmentStatus';
import { formatShortDate } from '../../shared/utils/dates';
import { trimValue } from '../../shared/utils/formErrors';
import useSpecialtyOptions from '../../shared/hooks/useSpecialtyOptions';

const EMPTY_FILTERS = {
  dni: '',
  specialtyId: '',
  doctorId: '',
  date: '',
  status: '',
};
const DNI_MESSAGE = 'El DNI debe tener 7 u 8 dígitos';

function nameOf(options, id) {
  return options.find((option) => option.id === id)?.name ?? '';
}

function buildChips(values, specialties, doctors) {
  const statusLabel = APPOINTMENT_STATUS_OPTIONS.find(
    (option) => option.value === values.status
  )?.label;

  return [
    values.dni && { key: 'dni', label: `DNI: ${values.dni}` },
    values.specialtyId && {
      key: 'specialty',
      label: `Especialidad: ${nameOf(specialties, values.specialtyId)}`,
    },
    values.doctorId && {
      key: 'doctor',
      label: `Doctor: ${nameOf(doctors, values.doctorId)}`,
    },
    values.date && {
      key: 'date',
      label: `Fecha: ${formatShortDate(values.date)}`,
    },
    values.status && { key: 'status', label: `Estado: ${statusLabel}` },
  ].filter(Boolean);
}

function AppointmentFilters({ chips, searching = false, onApply, onClear }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched', defaultValues: EMPTY_FILTERS });

  const specialtyId = watch('specialtyId');
  const specialties = useSpecialtyOptions();
  const allDoctors = useDoctorOptions();
  const specialtyDoctors = useDoctorsBySpecialty(specialtyId);
  const doctors = specialtyId ? specialtyDoctors.doctors : allDoctors.options;
  const doctorsLoading = specialtyId
    ? specialtyDoctors.loading
    : allDoctors.loading;

  const specialtyField = register('specialtyId', {
    onChange: () => setValue('doctorId', ''),
  });

  const apply = (values) =>
    onApply(values, buildChips(values, specialties.options, doctors));

  const clear = () => {
    reset(EMPTY_FILTERS);
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit(apply)}
      noValidate
      aria-label="Criterios de búsqueda"
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        <FormField
          id="search-dni"
          label="DNI del paciente"
          error={errors.dni?.message}
        >
          <Input
            inputMode="numeric"
            placeholder="Ej.: 30111222"
            {...register('dni', {
              setValueAs: trimValue,
              validate: (value) =>
                !value || /^\d{7,8}$/.test(value) || DNI_MESSAGE,
            })}
          />
        </FormField>

        <FormField id="search-specialty" label="Especialidad">
          <Select disabled={specialties.loading} {...specialtyField}>
            <option value="">Todas las especialidades</option>
            {specialties.options.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="search-doctor" label="Doctor">
          <Select disabled={doctorsLoading} {...register('doctorId')}>
            <option value="">Todos los doctores</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="search-date" label="Fecha">
          <Input type="date" {...register('date')} />
        </FormField>

        <FormField id="search-status" label="Estado">
          <Select {...register('status')}>
            <option value="">Todos los estados</option>
            {APPOINTMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-med-border-subtle">
        <ul aria-label="Filtros activos" className="flex flex-wrap gap-2">
          {chips.length === 0 && (
            <li className="text-xs text-med-text-muted">Sin filtros activos</li>
          )}
          {chips.map((chip) => (
            <li
              key={chip.key}
              className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800"
            >
              {chip.label}
            </li>
          ))}
        </ul>

        <div className="flex flex-col lg:flex-row gap-2 shrink-0">
          <Button
            variant="secondary"
            onClick={clear}
            disabled={searching}
            className="min-h-11"
          >
            Limpiar
          </Button>
          <Button type="submit" loading={searching} className="min-h-11">
            <span className="inline-flex items-center gap-2">
              <Icon name="filter" />
              Aplicar filtros
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default AppointmentFilters;
