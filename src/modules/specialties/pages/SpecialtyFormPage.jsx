import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialtyForm from '../components/SpecialtyForm';
import { createSpecialty } from '../services/specialtiesService';
import Card from '../../shared/components/atoms/Card';
import { applyFieldErrors } from '../../shared/utils/formErrors';

const LIST_PATH = '/admin/specialties';
const FIELD_MESSAGES = {
  name: 'El nombre debe tener entre 3 y 100 caracteres',
  description: 'La descripción debe tener entre 10 y 100 caracteres',
};

// /admin/specialties/new
function SpecialtyFormPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const backToList = (notice) =>
    navigate(LIST_PATH, notice ? { state: { notice } } : undefined);

  const handleSubmit = async (values, setError) => {
    setErrorMessage('');

    try {
      await createSpecialty(values);

      backToList({
        tone: 'success',
        message: `Se creó la especialidad ${values.name}`,
      });
    } catch (apiError) {
      // Nombre repetido va al campo; un 400 con campos va a cada campo; el resto, arriba.
      if (apiError.errorCode === 'SPECIALTY_DUPLICATED') {
        setError('name', { type: 'server', message: apiError.message });
      } else if (!applyFieldErrors(apiError, setError, FIELD_MESSAGES)) {
        setErrorMessage(apiError.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Nueva especialidad
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Complete los datos para dar de alta una especialidad.
        </p>
      </div>

      <Card padded={false} className="p-6">
        <SpecialtyForm
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          onCancel={() => backToList()}
        />
      </Card>
    </div>
  );
}

export default SpecialtyFormPage;
