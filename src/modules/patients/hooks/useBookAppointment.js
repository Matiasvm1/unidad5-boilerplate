import { useCallback, useState } from 'react';
import { bookAppointment } from '../services/patientAppointmentsService';
import useAuth from '../../auth/hooks/useAuth';
import useCooldown from '../../shared/hooks/useCooldown';
import { applyFieldErrors } from '../../shared/utils/formErrors';

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

// Books an appointment for the logged-in patient and turns the API errors
// into messages: a taken slot, too many requests (starts a cooldown), field
// errors (sent to the form) or anything else (errorMessage).
// book resolves to { ok: true } or { ok: false, slotTaken }.
function useBookAppointment() {
  const { session } = useAuth();
  const cooldown = useCooldown();
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = useCallback(() => setErrorMessage(''), []);

  const book = async ({ doctorId, slot, reason }, setError) => {
    setErrorMessage('');

    try {
      await bookAppointment({
        doctorId,
        availabilitySlotId: slot.id,
        dni: session.dni,
        reason,
      });

      return { ok: true };
    } catch (apiError) {
      if (SLOT_TAKEN_CODES.includes(apiError.errorCode)) {
        setErrorMessage(SLOT_TAKEN_MESSAGE);

        return { ok: false, slotTaken: true };
      }

      if (apiError.status === 429) {
        setErrorMessage(TOO_MANY_MESSAGE);
        cooldown.start();
      } else if (!applyFieldErrors(apiError, setError, FIELD_MESSAGES)) {
        setErrorMessage(apiError.message);
      }

      return { ok: false, slotTaken: false };
    }
  };

  return { book, errorMessage, clearError, blocked: cooldown.active };
}

export default useBookAppointment;
