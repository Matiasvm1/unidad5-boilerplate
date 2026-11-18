import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLoginForm from '../components/AdminLoginForm';
import useAuth from '../hooks/useAuth';
import useAuthNotice from '../hooks/useAuthNotice';
import Icon from '../../shared/components/atoms/Icon';
import AuthLayout from '../../shared/components/templates/AuthLayout';
import { HOME_PATH, ROLES } from '../../shared/constants/roles';
import useCooldown from '../../shared/hooks/useCooldown';
import { applyFieldErrors } from '../../shared/utils/formErrors';

const WRONG_CREDENTIALS = 'Usuario o contraseña incorrectos';
const FIELD_MESSAGES = {
  email: 'El correo electrónico no es válido',
  password: 'La contraseña debe tener al menos 8 caracteres',
};

function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState(''); //guarda el msj de error si login falla
  const notice = useAuthNotice(); //lee si hay una notita que dejo el hook
  const navigate = useNavigate();
  const { loginAdmin } = useAuth(); // habla con el back y guarda la sesion
  const cooldown = useCooldown(); // cronometro de 10 seg

  const handleSubmit = async (values, setError) => {
    // limpia cualquier error viejo
    setErrorMessage('');

    try {
      // si el back responde OK lo lleva a home con replace, para que al volver no se vuelva al login
      await loginAdmin(values);
      navigate(HOME_PATH[ROLES.ADMIN], { replace: true });
    } catch (error) {
      //si no devuelve OK, se evalua el error status. Si es 429 va el cronomtero
      if (error.status === 429) {
        cooldown.start();
      }

      if (error.status === 401) {
        setErrorMessage(WRONG_CREDENTIALS);
        //Si es 400 y que un campo esta mal, coloca el error debajo del inmput, si no lo es devuelve false y entra al bloque final mostrando mensaje gral.
      } else if (!applyFieldErrors(error, setError, FIELD_MESSAGES)) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <AuthLayout
      footer={
        <Link
          to="/login"
          className="inline-flex items-center min-h-11 text-xs text-med-primary-200 hover:text-white transition"
        >
          ← Volver al Portal de Pacientes
        </Link>
      }
    >
      <div className="p-6 sm:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-med-primary-900">
            Bienvenido de nuevo
          </h2>
          <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
            Por favor, autentíquese para acceder al portal de proveedores.
          </p>
        </div>

        <AdminLoginForm
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          notice={notice}
          blocked={cooldown.active}
        />
      </div>

      <div className="bg-med-primary-50 border-t border-med-primary-100 p-4 sm:p-5 flex items-start gap-3">
        <Icon
          name="shield"
          className="w-5 h-5 text-med-primary-600 shrink-0 mt-0.5"
        />
        <p className="text-xs text-med-text-sub leading-relaxed">
          <strong className="text-med-text-main font-semibold">
            Solo Acceso Seguro:
          </strong>{' '}
          Este sistema es para personal médico autorizado. Los intentos de
          acceso no autorizados son registrados y monitoreados para su
          cumplimiento.
        </p>
      </div>
    </AuthLayout>
  );
}

export default AdminLoginPage;
