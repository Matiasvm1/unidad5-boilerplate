import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/atoms/Button';
import Icon from '../../shared/components/atoms/Icon';
import Input from '../../shared/components/atoms/Input';
import Alert from '../../shared/components/molecules/Alert';
import FormField from '../../shared/components/molecules/FormField';
import { EMAIL_PATTERN, trimValue } from '../../shared/utils/formErrors';

// Form de inicio de sesion para admins
// recibe por props onSubmit (funcion que hace el login), errorMessage (mensaje de error de login) y notice (mensaje de sesion caducada)vy blocked que viene del cronometro de cooldown

function AdminLoginForm({ onSubmit, errorMessage, notice, blocked = false }) {
  const [showPassword, setShowPassword] = useState(false); //ver o no ver la contraseña mientras se escribe
  const {
    register, //conecta input con las reglas de validacion
    handleSubmit, // envuelve el envio
    setError, // permite marcar un error manual si el back nos rechaza un dato
    formState: { errors, isSubmitting }, //mientras el back piensa, la ruedita gira y evita doble click
  } = useForm({
    mode: 'onTouched', // cuando el user abandone el campo recein valida
    defaultValues: { email: '', password: '' },
  });

  const submit = (values) => onSubmit(values, setError);
  const toggleLabel = showPassword
    ? 'Ocultar contraseña'
    : 'Mostrar contraseña';

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate //apaga los globos de error nativos del navegador, solo se ven nuestros propios mensajes
      className="flex flex-col gap-4"
    >
      {notice && <Alert tone="info">{notice}</Alert>}
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      <FormField
        id="admin-email"
        label="Correo electrónico"
        error={errors.email?.message}
      >
        <Input
          type="email"
          icon="mail"
          autoComplete="email"
          placeholder="nombre@ejemplo.com"
          {...register('email', {
            // regristra el email con tres reglas (trimvalue, required y pattern)
            setValueAs: trimValue,
            required: 'Ingresá tu correo electrónico',
            pattern: {
              value: EMAIL_PATTERN,
              message: 'El correo electrónico no es válido',
            },
          })}
        />
      </FormField>

      <FormField
        id="admin-password"
        label="Contraseña"
        error={errors.password?.message}
      >
        <Input
          type={showPassword ? 'text' : 'password'}
          icon="lock"
          autoComplete="current-password"
          placeholder="••••••••"
          endAdornment={
            //boton al final del input para que no cualquier button sea submit
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={toggleLabel}
              title={toggleLabel}
              className="min-w-11 min-h-11 flex items-center justify-center text-med-text-muted hover:text-med-text-main"
            >
              <Icon name={showPassword ? 'eyeOff' : 'eye'} />
            </button>
          }
          {...register('password', {
            required: 'Ingresá tu contraseña',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres',
            },
          })}
        />
      </FormField>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={blocked}
        className="mt-2 w-full min-h-11"
      >
        Iniciar Sesión →
      </Button>
    </form>
  );
}

export default AdminLoginForm;
