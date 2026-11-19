// Se arma el rompecabezas y se completa todo
// el selector de doctores + los meses + la tarjeta del medico
// tambien decide si hacer post o put al guardar

import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorPicker from '../components/DoctorPicker';
import DoctorSummary from '../components/DoctorSummary';
import MonthPicker from '../components/MonthPicker';
import WeekScheduleForm from '../components/WeekScheduleForm';
import useDoctorAvailability from '../hooks/useDoctorAvailability';
import {
  createAvailability,
  updateAvailability,
} from '../services/availabilitiesService';
import { monthOptions, toRows } from '../utils/schedule';
import useDoctorOptions from '../../shared/hooks/useDoctorOptions';
import Card from '../../shared/components/atoms/Card';
import Spinner from '../../shared/components/atoms/Spinner';
import Alert from '../../shared/components/molecules/Alert';

const LIST_PATH = '/admin/doctors';
const BASE_PATH = '/admin/doctors/availability';
const SAVED_MESSAGE = 'Disponibilidad guardada';

function LoadingBlock() {
  return (
    <div className="flex justify-center py-10 text-med-primary-700">
      <Spinner size="lg" />
    </div>
  );
}

//
function AvailabilityPage() {
  const { id: doctorId } = useParams(); // leemos el ID de la url, cuando cambias el combo la funcion te navega a la nueva URL
  const navigate = useNavigate();
  const months = useMemo(() => monthOptions(), []);
  const [monthValue, setMonthValue] = useState(months[0].value);
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const doctors = useDoctorOptions();
  const selectedMonth = months.find((option) => option.value === monthValue);
  const { year, month } = selectedMonth;
  const schedule = useDoctorAvailability(doctorId, year, month);

  const doctor = doctors.options.find((option) => option.id === doctorId);
  const unknownDoctor = Boolean(doctorId) && !doctors.loading && !doctor;
  const isEdit = schedule.availabilities.length > 0; // Si al traer el back vemos q tiene algo, estamos en modo edicion
  const { rows, hasExtraRanges } = useMemo(
    () => toRows(schedule.availabilities),
    [schedule.availabilities]
  );

  const clearMessages = () => {
    setNotice('');
    setErrorMessage('');
  };

  const selectDoctor = (value) => {
    // no cambia si refrescamos la pagina
    clearMessages();
    navigate(value ? `${LIST_PATH}/${value}/availability` : BASE_PATH, {
      replace: true,
    });
  };

  const selectMonth = (value) => {
    clearMessages();
    setMonthValue(value);
  };

  const handleSubmit = async (days) => {
    //aca decide si usamos put o post con isTrue
    clearMessages();
    const body = { doctorId, days, year, month };

    try {
      if (isEdit) {
        await updateAvailability(body);
      } else {
        await createAvailability(body);
      }

      setNotice(SAVED_MESSAGE);
      schedule.reload();
    } catch (apiError) {
      setErrorMessage(apiError.message);
    }
  };

  const showForm =
    doctor && !schedule.loading && !schedule.error && schedule.version > 0;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Disponibilidad horaria
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Configure los días y horarios de atención de cada profesional por mes.
        </p>
      </div>

      <Card padded={false} className="p-6 flex flex-col gap-5">
        {doctors.loading && <LoadingBlock />}

        {doctors.error && <Alert tone="error">{doctors.error.message}</Alert>}

        {!doctors.loading && !doctors.error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DoctorPicker
              doctors={doctors.options}
              value={doctor ? doctorId : ''}
              onChange={selectDoctor}
            />
            <MonthPicker
              months={months}
              value={monthValue}
              onChange={selectMonth}
            />
          </div>
        )}

        {unknownDoctor && (
          <Alert tone="error">El médico indicado no existe</Alert>
        )}

        {doctor && <DoctorSummary doctor={doctor} />}
      </Card>

      {doctor && (
        <Card padded={false} className="p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-med-primary-900">
              Horario semanal
            </h2>
            {showForm && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                {isEdit ? 'Editando agenda' : 'Nueva agenda'}
              </span>
            )}
          </div>

          <Alert tone="info">
            Los cambios se aplican de inmediato a los horarios libres. Los
            turnos ya reservados no se modifican. Se generan turnos de 30
            minutos desde hoy hasta fin de mes (o desde el día 1 si el mes es
            futuro), salteando los feriados.
          </Alert>

          {notice && <Alert tone="success">{notice}</Alert>}

          {hasExtraRanges && showForm && (
            <Alert tone="info">
              Este mes tiene más de un horario en algún día. Se muestra el
              primero; al guardar se reemplazan todos.
            </Alert>
          )}

          {schedule.loading && <LoadingBlock />}

          {schedule.error && (
            <Alert tone="error">{schedule.error.message}</Alert>
          )}

          {showForm && (
            <WeekScheduleForm
              key={`${doctorId}-${monthValue}-${schedule.version}`} // Obliga a react a matar el componente y crear uno nuevo cada vez q se cambia de algo
              initialRows={rows}
              submitLabel="Guardar disponibilidad"
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
              onCancel={() => navigate(LIST_PATH)}
            />
          )}
        </Card>
      )}
    </div>
  );
}

export default AvailabilityPage;
