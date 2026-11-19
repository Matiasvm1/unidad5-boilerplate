const APPOINTMENT_STATUS = {
  BOOKED: { label: 'Confirmado', tone: 'success' },
  ATTENDED: { label: 'Completado', tone: 'neutral' },
  CANCELLED: { label: 'Cancelado', tone: 'danger' },
  NO_SHOW: { label: 'Ausente', tone: 'warning' },
};

const APPOINTMENT_STATUS_OPTIONS = Object.entries(APPOINTMENT_STATUS).map(
  ([value, { label }]) => ({ value, label })
);

function appointmentStatusInfo(status) {
  return APPOINTMENT_STATUS[status] ?? { label: status, tone: 'neutral' };
}

export {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_OPTIONS,
  appointmentStatusInfo,
};