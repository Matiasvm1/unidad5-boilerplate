import { useNavigate } from 'react-router-dom';
import BookingSummary from '../components/BookingSummary';
import DoctorCard from '../components/DoctorCard';
import SpecialtyDoctorPicker from '../components/SpecialtyDoctorPicker';
import WeeklySlotGrid from '../components/WeeklySlotGrid';
import useBookAppointment from '../hooks/useBookAppointment';
import useBookingSelection from '../hooks/useBookingSelection';
import Card from '../../shared/components/atoms/Card';
import { formatLongDate } from '../../shared/utils/dates';

const APPOINTMENTS_PATH = '/appointments';

// "/" for the patient: book an appointment (CU01, spec P10). The page only
// wires the hooks to the components: the selection lives in
// useBookingSelection and the booking rules in useBookAppointment.
function PatientHome() {
  const navigate = useNavigate();
  const booking = useBookAppointment();
  const selection = useBookingSelection({ onChange: booking.clearError });
  const { doctor, doctorId, selectedSlot, slots } = selection;

  const confirm = async ({ reason }, setError) => {
    const result = await booking.book(
      { doctorId, slot: selectedSlot, reason },
      setError
    );

    if (result.ok) {
      navigate(APPOINTMENTS_PATH, {
        state: {
          notice: {
            tone: 'success',
            message: `Turno reservado: ${formatLongDate(selectedSlot.date)} a las ${selectedSlot.startTime} con ${doctor.name}`,
          },
        },
      });
    } else if (result.slotTaken) {
      selection.clearSlot();
      slots.reload();
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
          specialties={selection.specialties}
          doctors={selection.doctors}
          specialtyId={selection.specialtyId}
          doctorId={doctorId}
          onSpecialtyChange={selection.changeSpecialty}
          onDoctorChange={selection.changeDoctor}
        />

        {doctor && <DoctorCard doctor={doctor} />}
      </Card>

      {doctor && (
        <Card padded={false} className="p-5 sm:p-6">
          <WeeklySlotGrid
            key={`${doctorId}-${selection.from}`}
            days={selection.days}
            slots={slots.slots}
            loading={slots.loading}
            error={slots.error}
            canGoBack={selection.canGoBack}
            selectedSlotId={selectedSlot?.id}
            onPrevious={() => selection.moveWeek(-1)}
            onNext={() => selection.moveWeek(1)}
            onRetry={slots.reload}
            onSelect={selection.selectSlot}
          />
        </Card>
      )}

      {doctor && (
        <Card padded={false} className="p-5 sm:p-6">
          <BookingSummary
            doctor={doctor}
            slot={selectedSlot}
            errorMessage={booking.errorMessage}
            blocked={booking.blocked}
            onConfirm={confirm}
          />
        </Card>
      )}
    </div>
  );
}

export default PatientHome;
