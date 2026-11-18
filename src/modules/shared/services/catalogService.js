import { instance } from '../api/axiosInstance';

// Paged lists that several features read (spec 3.2: what two or more
// features need lives in shared/). Both answer { pageSize, pageIndex, total, data }.

// GET /api/doctors?pageSize&pageIndex&name&specialtyId
// `name` and `specialtyId` are sent only when present (spec 7.4, P10).
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
