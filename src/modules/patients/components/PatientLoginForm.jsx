import { useForm } from 'react-hook-form';
import Button from '../../shared/components/atoms/Button';
import Input from '../../shared/components/atoms/Input';
import Alert from '../../shared/components/molecules/Alert';
import FormField from '../../shared/components/molecules/FormField';
import { EMAIL_PATTERN, trimValue } from '../../shared/utils/formErrors';

const INVALID_EMAIL = 'El correo electrónico no es válido';
// no hay contraseña, los pacientes ingresan con email dni y fullName opcional.
//

function PatientLoginForm({ onSubmit, errorMessage, notice, blocked = false }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { email: '', dni: '', fullName: '' },
  });

  const submit = (values) => onSubmit(values, setError);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-4"
    >
      {notice && <Alert tone="info">{notice}</Alert>}
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      <FormField
        id="patient-email"
        label="Correo electrónico"
        required
        error={errors.email?.message}
      >
        <Input
          type="email"
          icon="mail"
          autoComplete="email"
          placeholder="nombre@ejemplo.com"
          {...register('email', {
            setValueAs: trimValue,
            required: INVALID_EMAIL,
            pattern: { value: EMAIL_PATTERN, message: INVALID_EMAIL },
          })}
        />
      </FormField>

      <FormField
        id="patient-dni"
        label="DNI"
        required
        error={errors.dni?.message}
      >
        <Input
          type="text"
          inputMode="numeric"
          icon="idCard"
          autoComplete="off"
          placeholder="12345678"
          maxLength={8}
          {...register('dni', {
            setValueAs: trimValue,
            required: 'El DNI debe tener 7 u 8 dígitos',
            pattern: {
              value: /^\d{7,8}$/,
              message: 'El DNI debe tener 7 u 8 dígitos',
            },
          })}
        />
      </FormField>

      <FormField
        id="patient-full-name"
        label="Nombre y apellido (opcional)"
        error={errors.fullName?.message}
      >
        <Input
          type="text"
          icon="user"
          autoComplete="name"
          placeholder="Juan Pérez"
          {...register('fullName', {
            setValueAs: trimValue,
            validate: (value) =>
              !value ||
              (value.length >= 3 && value.length <= 150) ||
              'El nombre debe tener entre 3 y 150 caracteres',
          })}
        />
      </FormField>

      <p className="text-xs text-med-text-sub">
        Si es tu primera vez, tu cuenta se crea automáticamente al ingresar.
      </p>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={blocked}
        className="w-full min-h-11"
      >
        Ingresar
      </Button>
    </form>
  );
}

export default PatientLoginForm;
