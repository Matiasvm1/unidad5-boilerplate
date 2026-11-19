import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/atoms/Button';
import Input from '../../shared/components/atoms/Input';
import Select from '../../shared/components/atoms/Select';
import Alert from '../../shared/components/molecules/Alert';
import FormField from '../../shared/components/molecules/FormField';
import { trimValue } from '../../shared/utils/formErrors';

const NAME_MESSAGE = 'El nombre debe tener entre 3 y 100 caracteres';
const SPECIALTY_MESSAGE = 'Seleccioná una especialidad';
const LICENSE_MESSAGE = 'La matrícula no puede superar los 50 caracteres';
const LICENSE_MAX = 50;

const EMPTY_VALUES = { name: '', specialtyId: '', licenseNumber: '' };

// Texto de ayuda debajo del combo según el estado de la lista de especialidades.
function specialtyHint({ loading, error, options }) {
  if (loading) {
    return 'Cargando especialidades...';
  }

  if (error) {
    return 'No se pudieron cargar las especialidades';
  }

  if (options.length === 0) {
    return (
      <>
        Primero tenés que crear una especialidad.{' '}
        <Link
          to="/admin/specialties/new"
          className="font-semibold text-med-primary-700 underline"
        >
          Crear especialidad
        </Link>
      </>
    );
  }

  return undefined;
}

// `specialties` es { options, loading, error } de useSpecialtyOptions.
function DoctorForm({ specialties, errorMessage, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', defaultValues: EMPTY_VALUES });

  const noSpecialties =
    specialties.loading ||
    Boolean(specialties.error) ||
    specialties.options.length === 0;

  // La matrícula vacía se manda como null (la columna acepta nulos).
  const submit = (values) =>
    onSubmit(
      { ...values, licenseNumber: values.licenseNumber || null },
      { setError, setValue }
    );

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      <FormField
        id="doctor-name"
        label="Nombre completo del doctor"
        required
        error={errors.name?.message}
      >
        <Input
          type="text"
          placeholder="Ej.: Dr. Juan Pérez"
          maxLength={100}
          {...register('name', {
            setValueAs: trimValue,
            required: NAME_MESSAGE,
            validate: (value) =>
              (value.length >= 3 && value.length <= 100) || NAME_MESSAGE,
          })}
        />
      </FormField>

      <FormField
        id="doctor-specialty"
        label="Especialidad"
        required
        hint={specialtyHint(specialties)}
        error={errors.specialtyId?.message}
      >
        <Select
          disabled={noSpecialties}
          {...register('specialtyId', { required: SPECIALTY_MESSAGE })}
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
        id="doctor-license"
        label="Número de licencia médica"
        error={errors.licenseNumber?.message}
      >
        <Input
          type="text"
          placeholder="Ej.: MP-12345"
          maxLength={LICENSE_MAX}
          {...register('licenseNumber', {
            setValueAs: trimValue,
            maxLength: { value: LICENSE_MAX, message: LICENSE_MESSAGE },
          })}
        />
      </FormField>

      <div className="flex flex-col-reverse lg:flex-row lg:justify-end gap-2">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="min-h-11"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={noSpecialties}
          className="min-h-11"
        >
          Crear médico
        </Button>
      </div>
    </form>
  );
}

export default DoctorForm;
