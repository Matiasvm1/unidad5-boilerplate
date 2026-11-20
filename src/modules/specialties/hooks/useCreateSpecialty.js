import { createSpecialty } from '../services/specialtiesService';
import useAsync from '../../shared/hooks/useAsync';

// Creates a specialty. Exposes run, loading and error.
function useCreateSpecialty() {
  return useAsync(createSpecialty);
}

export default useCreateSpecialty;
