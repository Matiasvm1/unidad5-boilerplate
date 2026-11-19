// Mensajero del tablero que le va preguntando al back cuantos turnos hay para un dia en especifico

import { instance } from '../../shared/api/axiosInstance';

// endpoint GET /api/appointments?date&status&pageSize&pageIndex. `date` is always sent:

async function getAppointmentsByDate({
  date, //se manda siempre, si no usa la UTC, el tablero mostraria turnos del dia sig
  status,
  pageIndex = 1,
  pageSize = 10,
}) {
  const params = { date, pageIndex, pageSize };

  if (status) {
    // solo agrega el filtro de estados, para no mandar params vacios
    params.status = status;
  }

  const response = await instance.get('api/appointments', { params });

  return response.data;
}

export { getAppointmentsByDate };
