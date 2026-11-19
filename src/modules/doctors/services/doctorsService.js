import { instance } from '../../shared/api/axiosInstance';

// El listado paginado lo usan otras funcionalidades: vive en shared/services.
export { getDoctors } from '../../shared/services/catalogService';

const BASE = 'api/doctors';

async function createDoctor({ name, licenseNumber, specialtyId }) {
  const response = await instance.post(BASE, {
    name,
    licenseNumber,
    specialtyId,
  });

  return response.data;
}

async function deleteDoctor(id) {
  await instance.delete(`${BASE}/${id}`);
}

export { createDoctor, deleteDoctor };
