import Badge from '../../shared/components/atoms/Badge';
import DataTable from '../../shared/components/organisms/DataTable';
import { appointmentStatusInfo } from '../../shared/constants/appointmentStatus';
import { formatShortDate, splitDateTime } from '../../shared/utils/dates';

function DateCell({ availableTime }) {
  const { date, time } = splitDateTime(availableTime);

  return (
    <div>
      <p className="font-bold text-med-primary-900">
        {date ? formatShortDate(date) : '-'}
      </p>
      <p className="text-xs text-med-text-muted mt-0.5">{time}</p>
    </div>
  );
}

function PatientCell({ patient }) {
  const dni = <span>DNI: {patient?.dni}</span>;

  if (!patient?.fullName) {
    return <p className="font-semibold text-med-text-main">{dni}</p>;
  }

  return (
    <div>
      <p className="font-semibold text-med-text-main">{patient.fullName}</p>
      <p className="text-xs text-med-text-muted mt-0.5">{dni}</p>
    </div>
  );
}

function AppointmentsTable({ appointments, loading, error, onRetry, empty }) {
  const columns = [
    {
      key: 'date',
      header: 'Fecha',
      render: (row) => <DateCell availableTime={row.availableTime} />,
    },
    {
      key: 'department',
      header: 'Departamento',
      render: (row) => (
        <div>
          <p className="font-semibold text-med-primary-900">
            {row.doctor?.specialty?.name ?? 'Sin especialidad'}
          </p>
          <p className="text-xs text-med-text-muted mt-0.5">
            {row.doctor?.name}
          </p>
        </div>
      ),
    },
    {
      key: 'patient',
      header: 'Paciente',
      render: (row) => <PatientCell patient={row.patient} />,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => {
        const { label, tone } = appointmentStatusInfo(row.appointmentsStatus);

        return <Badge tone={tone}>{label}</Badge>;
      },
    },
  ];

  return (
    <DataTable
      caption="Registros de citas"
      columns={columns}
      rows={appointments}
      rowKey={(row) => row.appointmentsId}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty}
    />
  );
}

export default AppointmentsTable;