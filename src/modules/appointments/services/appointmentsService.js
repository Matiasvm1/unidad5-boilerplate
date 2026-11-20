import { instance } from '../../shared/api/axiosInstance';

const BASE = 'api/appointments';

function compact(params) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
}

async function searchAppointments({
  pageIndex = 1,
  pageSize = 10,
  dni,
  specialtyId,
  doctorId,
  date,
  status,
} = {}) {
  const params = compact({
    pageIndex,
    pageSize,
    dni,
    specialtyId,
    doctorId,
    date,
    status,
  });
  const response = await instance.get(`${BASE}/search`, { params });

  return response.data;
}

export { searchAppointments };
