import { formatLongDate } from '../../shared/utils/dates';
import Button from '../../shared/components/atoms/Button';
import Card from '../../shared/components/atoms/Card';
import Icon from '../../shared/components/atoms/Icon';

function AppointmentCard({ appointment, onCancel }) {
  return (
    <Card
      padded={false}
      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4 min-w-0">
        <span className="w-11 h-11 shrink-0 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center">
          <Icon name="calendar" className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="font-bold text-med-primary-900">
            {formatLongDate(appointment.date)} · {appointment.startTime} hs
          </p>
          <p className="text-sm text-med-text-main mt-0.5">
            {appointment.doctor?.name}
            <span className="text-med-text-sub">
              {' '}
              · {appointment.specialty?.name ?? 'Sin especialidad'}
            </span>
          </p>
          <p className="text-xs text-med-text-sub mt-1 break-words">
            Motivo: {appointment.reason}
          </p>
        </div>
      </div>

      <Button
        variant="secondary"
        onClick={() => onCancel(appointment)}
        className="min-h-11 shrink-0 text-red-600"
      >
        Cancelar turno
      </Button>
    </Card>
  );
}

export default AppointmentCard;