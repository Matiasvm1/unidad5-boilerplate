import {instance} from '../../shared/api/axiosInstace';

async function getSlots( doctorId, {from, to}) {
  // Implementation here
  const response = await instance.get(`api/doctors/${doctorId}/slots`, {
    params: { from, to }
  });
  return response.data;
}


async function bookAppointment({doctorId, availabilitySlotId, dni, reason}) {
    // Implementation here
    const response = await instance.post(`api/appointments`, {
        doctorId,
        availabilitySlotId,
        patient: {dni: Number(dni)},
        reason,
    });
    return response.data;
    }


async function getMyAppointments(dni) {
    // Implementation here
    const response = await instance.get(`api/appointments/patient`, {
        params: {dni}
    });
    return response.data;
}


async function cancelAppointment(id) {
    await instance.delete(`api/appointments/${id}`);
}


export {getSlots, bookAppointment, getMyAppointments, cancelAppointment};