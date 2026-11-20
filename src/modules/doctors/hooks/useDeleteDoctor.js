import { deleteDoctor } from '../services/doctorsService';
import useAsync from '../../shared/hooks/useAsync';

// Deletes a doctor by id. Exposes run, loading, error and reset.
function useDeleteDoctor() {
  return useAsync(deleteDoctor);
}

export default useDeleteDoctor;
