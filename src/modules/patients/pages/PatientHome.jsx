import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingSummary from '../components/BookingSummary';
import DoctorCard from '../components/DoctorCard';
import SpecialtyDoctorPicker from '../components/SpecialtyDoctorPicker';
import WeeklySlotGrid from '../components/WeeklySlotGrid';
import useSlots from '../hooks/useSlots';
import { bookAppointment } from '../services/patientAppointmentsService';
import {
  WEEK_LENGTH,
  addDays,
  buildWeek,
  formatLongDate,
  todayIso,
} from '../../shared/utils/dates';
import useAuth from '../../auth/hooks/useAuth';
import useDoctorsBySpecialty from '../../shared/hooks/useDoctorsBySpecialty';
import useSpecialtyOptions from '../../shared/hooks/useSpecialtyOptions';
import Card from '../../shared/components/atoms/Card';
import useCooldown from '../../shared/hooks/useCooldown';
import { applyFieldErrors } from '../../shared/utils/formErrors';

const APPOINTMENTS_PATH = '/appointments';
const SLOT_TAKEN_CODES = [
  'APPOINTMENT_CONFLICT',
  'APPOINTMENT_SLOT_UNAVAILABLE',
  'APPOINTMENT_IN_THE_PAST',
];
const SLOT_TAKEN_MESSAGE =
  'Ese horario acaba de ser reservado por otra persona. Elegí otro.';
const TOO_MANY_MESSAGE =
  'Hiciste demasiadas reservas seguidas. Esperá un minuto.';
const FIELD_MESSAGES = {
  reason: 'Contanos el motivo de la consulta (mínimo 5 caracteres)',
};

// "/" for the patient: book an appointment (CU01, spec P10).
function PatientHome() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [from, setFrom] = useState(todayIso);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const cooldown = useCooldown();

  const specialties = useSpecialtyOptions();
  const doctors = useDoctorsBySpecialty(specialtyId);
  const doctor = doctors.doctors.find((option) => option.id === doctorId);
  const to = addDays(from, WEEK_LENGTH - 1);
  const slots = useSlots(doctor ? doctorId : '', from, to);
  const days = buildWeek(from);

  const resetSelection = () => {
    setSelectedSlot(null);
    setErrorMessage('');
  };

  const changeSpecialty = (value) => {
    setSpecialtyId(value);
    setDoctorId('');
    setFrom(todayIso());
    resetSelection();
  };

  const changeDoctor = (value) => {
    setDoctorId(value);
    setFrom(todayIso());
    resetSelection();
  };

  const moveWeek = (direction) => {
    setFrom((current) => addDays(current, direction * WEEK_LENGTH));
    resetSelection();
  };

  const selectSlot = (slot) => {
    setSelectedSlot(slot);
    setErrorMessage('');
  };

  const confirm = async ({ reason }, setError) => {
    setErrorMessage('');

    try {
      await bookAppointment({
        doctorId,
        availabilitySlotId: selectedSlot.id,
        dni: session.dni,
        reason,
      });

      navigate(APPOINTMENTS_PATH, {
        state: {
          notice: {
            tone: 'success',
            message: `Turno reservado: ${formatLongDate(selectedSlot.date)} a las ${selectedSlot.startTime} con ${doctor.name}`,
          },
        },
      });
    } catch (apiError) {
      if (SLOT_TAKEN_CODES.includes(apiError.errorCode)) {
        setSelectedSlot(null);
        setErrorMessage(SLOT_TAKEN_MESSAGE);
        slots.reload();
      } else if (apiError.status === 429) {
        setErrorMessage(TOO_MANY_MESSAGE);
        cooldown.start();
      } else if (!applyFieldErrors(apiError, setError, FIELD_MESSAGES)) {
        setErrorMessage(apiError.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-24 lg:pb-0">
      <Card padded={false} className="p-5 sm:p-6 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar turno
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Elegí la especialidad y el profesional para ver sus horarios.
          </p>
        </div>

        <SpecialtyDoctorPicker
          specialties={specialties}
          doctors={doctors}
          specialtyId={specialtyId}
          doctorId={doctorId}
          onSpecialtyChange={changeSpecialty}
          onDoctorChange={changeDoctor}
        />

        {doctor && <DoctorCard doctor={doctor} />}
      </Card>

      {doctor && (
        <Card padded={false} className="p-5 sm:p-6">
          <WeeklySlotGrid
            key={`${doctorId}-${from}`}
            days={days}
            slots={slots.slots}
            loading={slots.loading}
            error={slots.error}
            canGoBack={from > todayIso()}
            selectedSlotId={selectedSlot?.id}
            onPrevious={() => moveWeek(-1)}
            onNext={() => moveWeek(1)}
            onRetry={slots.reload}
            onSelect={selectSlot}
          />
        </Card>
      )}

      {doctor && (
        <Card padded={false} className="p-5 sm:p-6">
          <BookingSummary
            doctor={doctor}
            slot={selectedSlot}
            errorMessage={errorMessage}
            blocked={cooldown.active}
            onConfirm={confirm}
          />
        </Card>
      )}
    </div>
  );
}

export default PatientHome;
