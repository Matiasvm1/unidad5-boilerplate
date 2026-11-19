import { instance } from '../../shared/api/axiosInstance';

// El listado paginado lo usan otras funcionalidades: vive en shared/services.
export { getSpecialties } from '../../shared/services/catalogService';

const BASE = 'api/specialties';

async function createSpecialty({ name, description }) {
  const response = await instance.post(BASE, { name, description });

  return response.data;
}

async function deleteSpecialty(id) {
  await instance.delete(`${BASE}/${id}`);
}

export { createSpecialty, deleteSpecialty };
