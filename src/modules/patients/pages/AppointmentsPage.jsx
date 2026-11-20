import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';
import useMyAppointments from '../hooks/useMyAppointments';
import { cancelAppointment } from '../services/patientAppointmentsService';
import useAuth from '../../auth/hooks/useAuth';
import Button from '../../shared/components/atoms/Button';
import Card from '../../shared/components/atoms/Card';
import Icon from '../../shared/components/atoms/Icon';
import Spinner from '../../shared/components/atoms/Spinner';
import Alert from '../../shared/components/molecules/Alert';
import ConfirmDialog from '../../shared/components/molecules/ConfirmDialog';
import EmptyState from '../../shared/components/molecules/EmptyState';
import useAsync from '../../shared/hooks/useAsync';
import useFlashNotice from '../../shared/hooks/useFlashNotice';
import { formatLongDate } from '../../shared/utils/dates';

const BOOK_PATH = '/';

function cancelMessage(appointment) {
  if (!appointment) {
    return '';
  }

  return `¿Cancelar el turno del ${formatLongDate(appointment.date)} a las ${appointment.startTime} con ${appointment.doctor?.name}?`;
}

function AppointmentsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [notice, setNotice] = useFlashNotice();
  const [toCancel, setToCancel] = useState(null);
  const cancellation = useAsync(cancelAppointment);
  const { appointments, loading, error, reload } = useMyAppointments(
    session.dni
  );

  const openCancel = (appointment) => {
    cancellation.reset();
    setToCancel(appointment);
  };

  const closeCancel = useCallback(() => setToCancel(null), []);

  const confirmCancel = async () => {
    try {
      await cancellation.run(toCancel.id);
      setNotice({ tone: 'success', message: 'Turno cancelado' });
      setToCancel(null);
      reload();
    } catch (apiError) {
      if (apiError.errorCode === 'APPOINTMENT_NOT_CANCELLABLE') {
        setNotice({ tone: 'error', message: apiError.message });
        setToCancel(null);
        reload();
      }
    }
  };

  const bookButton = (
    <Button onClick={() => navigate(BOOK_PATH)} className="min-h-11">
      <span className="inline-flex items-center gap-1.5">
        <Icon name="plus" />
        Reservar turno
      </span>
    </Button>
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis turnos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Tus turnos reservados, ordenados por fecha.
          </p>
        </div>
        {bookButton}
      </div>

      {notice && <Alert tone={notice.tone}>{notice.message}</Alert>}

      {loading && (
        <div className="flex justify-center py-10 text-med-primary-700">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && error && (
        <Alert tone="error">
          <span className="flex flex-wrap items-center gap-2">
            {error.message}
            <button
              type="button"
              onClick={reload}
              className="font-semibold underline"
            >
              Reintentar
            </button>
          </span>
        </Alert>
      )}

      {!loading && !error && appointments.length === 0 && (
        <Card>
          <EmptyState icon="calendar" title="No tenés turnos reservados">
            {bookButton}
          </EmptyState>
        </Card>
      )}

      {!loading && !error && appointments.length > 0 && (
        <ul className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <AppointmentCard
                appointment={appointment}
                onCancel={openCancel}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Cancelar turno"
        message={cancelMessage(toCancel)}
        confirmLabel="Cancelar turno"
        cancelLabel="Volver"
        loading={cancellation.loading}
        error={cancellation.error?.message}
        onConfirm={confirmCancel}
        onCancel={closeCancel}
      />
    </div>
  );
}

export default AppointmentsPage;
