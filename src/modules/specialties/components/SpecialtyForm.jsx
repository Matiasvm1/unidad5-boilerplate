import { useForm } from 'react-hook-form';
import Button from '../../shared/components/atoms/Button';
import Input from '../../shared/components/atoms/Input';
import Textarea from '../../shared/components/atoms/Textarea';
import Alert from '../../shared/components/molecules/Alert';
import FormField from '../../shared/components/molecules/FormField';
import { trimValue } from '../../shared/utils/formErrors';

const NAME_MESSAGE = 'El nombre debe tener entre 3 y 100 caracteres';
const DESCRIPTION_MESSAGE =
  'La descripción debe tener entre 10 y 100 caracteres';
const DESCRIPTION_MAX = 100;

const lengthBetween = (min, max, message) => (value) =>
  (value.length >= min && value.length <= max) || message;

function SpecialtyForm({ errorMessage, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', description: '' },
  });

  const descriptionLength = (watch('description') ?? '').trim().length;
  const submit = (values) => onSubmit(values, setError);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      <FormField
        id="specialty-name"
        label="Nombre de la especialidad"
        required
        error={errors.name?.message}
      >
        <Input
          type="text"
          placeholder="Ej.: Cardiología"
          maxLength={100}
          {...register('name', {
            setValueAs: trimValue,
            required: NAME_MESSAGE,
            validate: lengthBetween(3, 100, NAME_MESSAGE),
          })}
        />
      </FormField>

      <FormField
        id="specialty-description"
        label="Descripción"
        required
        hint={`${descriptionLength}/${DESCRIPTION_MAX} caracteres`}
        error={errors.description?.message}
      >
        <Textarea
          placeholder="Ej.: Estudio y tratamiento del corazón"
          maxLength={DESCRIPTION_MAX}
          {...register('description', {
            setValueAs: trimValue,
            required: DESCRIPTION_MESSAGE,
            validate: lengthBetween(10, DESCRIPTION_MAX, DESCRIPTION_MESSAGE),
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
        <Button type="submit" loading={isSubmitting} className="min-h-11">
          Crear especialidad
        </Button>
      </div>
    </form>
  );
}

export default SpecialtyForm;
