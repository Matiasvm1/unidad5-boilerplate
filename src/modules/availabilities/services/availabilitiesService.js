import { instance } from '../../shared/api/axiosInstance';

// endpoint GET /api/doctors/{id}/availabilities?year&month -> [{ id, day, startTime, endTime }]
// Un array vacio significa q el medico no esta dispo o q no tiene hs para ese mes
// hace la peticion GET enviando año y mes por URL en params
async function getDoctorAvailabilities(doctorId, { year, month }) {
  const response = await instance.get(
    `api/doctors/${doctorId}/availabilities`,
    { params: { year, month } }
  );

  return response.data;
}

// Estas dos tienen el mismo cuerpo de datos, una manda cuando el cuerpo esta vacio y
// la otra manda cuando el mes ya tiene hs y lo queremos sobreescribir
// Same body for POST (create) and PUT (replace):
// { doctorId, days: [{ day, startTime, endTime }], year, month }
async function createAvailability(body) {
  const response = await instance.post('api/availabilities', body);

  return response.data;
}

async function updateAvailability(body) {
  const response = await instance.put('api/availabilities', body);

  return response.data;
}

export { getDoctorAvailabilities, createAvailability, updateAvailability };
