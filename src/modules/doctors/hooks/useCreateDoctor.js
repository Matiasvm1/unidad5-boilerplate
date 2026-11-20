import { createDoctor } from '../services/doctorsService';
import useAsync from '../../shared/hooks/useAsync';

// Creates a doctor. Exposes run, loading and error so the page never imports
// the service.
function useCreateDoctor() {
  return useAsync(createDoctor);
}

export default useCreateDoctor;
