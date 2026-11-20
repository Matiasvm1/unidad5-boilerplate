import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import useCreateDoctor from '../hooks/useCreateDoctor';
import useSpecialtyOptions from '../../shared/hooks/useSpecialtyOptions';
import Card from '../../shared/components/atoms/Card';
import { applyFieldErrors } from '../../shared/utils/formErrors';

const LIST_PATH = '/admin/doctors';
const FIELD_MESSAGES = {
  name: 'El nombre debe tener entre 3 y 100 caracteres',
  specialtyId: 'Seleccioná una especialidad',
  licenseNumber: 'La matrícula no puede superar los 50 caracteres',
};

// /admin/doctors/new
function DoctorFormPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const specialties = useSpecialtyOptions();
  const creation = useCreateDoctor();

  const backToList = (notice) =>
    navigate(LIST_PATH, notice ? { state: { notice } } : undefined);

  const handleSubmit = async (values, { setError, setValue }) => {
    setErrorMessage('');

    try {
      await creation.run(values);

      backToList({
        tone: 'success',
        message: `Se creó el médico ${values.name}`,
      });
    } catch (apiError) {
      if (apiError.errorCode === 'DOCTOR_SPECIALTY_NOT_FOUND') {
        // Alguien borró la especialidad mientras tanto: se vacía el combo y se recarga la lista.
        setValue('specialtyId', '');
        setError('specialtyId', { type: 'server', message: apiError.message });
        specialties.reload();
      } else if (!applyFieldErrors(apiError, setError, FIELD_MESSAGES)) {
        setErrorMessage(apiError.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Nuevo médico
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Complete los datos para dar de alta un profesional.
        </p>
      </div>

      <Card padded={false} className="p-6">
        <DoctorForm
          specialties={specialties}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          onCancel={() => backToList()}
        />
      </Card>
    </div>
  );
}

export default DoctorFormPage;
