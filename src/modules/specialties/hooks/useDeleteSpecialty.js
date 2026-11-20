import { deleteSpecialty } from '../services/specialtiesService';
import useAsync from '../../shared/hooks/useAsync';

// Deletes a specialty by id. Exposes run, loading, error and reset.
function useDeleteSpecialty() {
  return useAsync(deleteSpecialty);
}

export default useDeleteSpecialty;
