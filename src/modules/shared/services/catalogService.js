import { instance } from '../api/axiosInstance';

async function getDoctors({
  pageIndex = 1,
  pageSize = 10,
  name,
  specialtyId,
} = {}) {
  const params = { pageIndex, pageSize };

  if (name) {
    params.name = name;
  }

  if (specialtyId) {
    params.specialtyId = specialtyId;
  }

  const response = await instance.get('api/doctors', { params });

  return response.data;
}

// GET /api/specialties?pageSize&pageIndex&name. `name` only when present.
async function getSpecialties({ pageIndex = 1, pageSize = 10, name } = {}) {
  const params = { pageIndex, pageSize };

  if (name) {
    params.name = name;
  }

  const response = await instance.get('api/specialties', { params });

  return response.data;
}

export { getDoctors, getSpecialties };
