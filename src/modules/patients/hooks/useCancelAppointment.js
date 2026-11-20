import { cancelAppointment } from '../services/patientAppointmentsService';
import useAsync from '../../shared/hooks/useAsync';

// Cancels one of the patient's appointments. Exposes run, loading, error and
// reset.
function useCancelAppointment() {
  return useAsync(cancelAppointment);
}

export default useCancelAppointment;
