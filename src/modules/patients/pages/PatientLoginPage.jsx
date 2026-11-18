import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PatientLoginForm from '../components/PatientLoginForm';
import useAuth from '../../auth/hooks/useAuth';
import useAuthNotice from '../../auth/hooks/useAuthNotice';
import AuthLayout from '../../shared/components/templates/AuthLayout';
import { HOME_PATH, ROLES } from '../../shared/constants/roles';
import useCooldown from '../../shared/hooks/useCooldown';
import { applyFieldErrors } from '../../shared/utils/formErrors';

const NOT_MATCHING =
  'El email y el DNI no coinciden con un paciente registrado.';
const FIELD_MESSAGES = {
  email: 'El correo electrónico no es válido',
  dni: 'El DNI debe tener 7 u 8 dígitos',
  fullName: 'El nombre debe tener entre 3 y 150 caracteres',
};

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const notice = useAuthNotice();
  const navigate = useNavigate();
  const { loginPatient } = useAuth();
  const cooldown = useCooldown();

  const handleSubmit = async (values, setError) => {
    setErrorMessage('');

    try {
      await loginPatient(values);
      navigate(HOME_PATH[ROLES.PATIENT], { replace: true });
    } catch (error) {
      if (error.status === 429) {
        cooldown.start();
      }

      if (error.status === 401) {
        setErrorMessage(NOT_MATCHING);
      } else if (!applyFieldErrors(error, setError, FIELD_MESSAGES)) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <AuthLayout
      footer={
        <Link
          to="/admin/login"
          className="inline-flex items-center min-h-11 text-xs text-med-primary-200 hover:text-white transition"
        >
          ¿Es personal administrativo o médico? Ingrese aquí →
        </Link>
      }
    >
      <div className="p-6 sm:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-med-primary-900">
            Portal del Paciente
          </h2>
          <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
            Inicia sesión para reservar y consultar tus turnos médicos
          </p>
        </div>

        <PatientLoginForm
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          notice={notice}
          blocked={cooldown.active}
        />
      </div>
    </AuthLayout>
  );
}

export default PatientLoginPage;
