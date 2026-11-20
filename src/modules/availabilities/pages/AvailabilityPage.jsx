// Weekly schedule of a doctor for one month (CU02). The doctor comes from the
// URL; the month, the schedule and the save live in useAvailabilityEditor.

import { useNavigate, useParams } from 'react-router-dom';
import DoctorPicker from '../components/DoctorPicker';
import DoctorSummary from '../components/DoctorSummary';
import MonthPicker from '../components/MonthPicker';
import WeekScheduleForm from '../components/WeekScheduleForm';
import useAvailabilityEditor from '../hooks/useAvailabilityEditor';
import useDoctorOptions from '../../shared/hooks/useDoctorOptions';
import Card from '../../shared/components/atoms/Card';
import Spinner from '../../shared/components/atoms/Spinner';
import Alert from '../../shared/components/molecules/Alert';

const LIST_PATH = '/admin/doctors';
const BASE_PATH = '/admin/doctors/availability';

function LoadingBlock() {
  return (
    <div className="flex justify-center py-10 text-med-primary-700">
      <Spinner size="lg" />
    </div>
  );
}

function AvailabilityPage() {
  const { id: doctorId } = useParams();
  const navigate = useNavigate();
  const doctors = useDoctorOptions();
  const editor = useAvailabilityEditor(doctorId);
  const { schedule } = editor;

  const doctor = doctors.options.find((option) => option.id === doctorId);
  const unknownDoctor = Boolean(doctorId) && !doctors.loading && !doctor;
  const showForm =
    doctor && !schedule.loading && !schedule.error && schedule.version > 0;

  // The doctor lives in the URL, so a refresh keeps the selection.
  const selectDoctor = (value) => {
    editor.clearMessages();
    navigate(value ? `${LIST_PATH}/${value}/availability` : BASE_PATH, {
      replace: true,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Disponibilidad horaria
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Configure los días y horarios de atención de cada profesional por mes.
        </p>
      </div>

      <Card padded={false} className="p-6 flex flex-col gap-5">
        {doctors.loading && <LoadingBlock />}

        {doctors.error && <Alert tone="error">{doctors.error.message}</Alert>}

        {!doctors.loading && !doctors.error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DoctorPicker
              doctors={doctors.options}
              value={doctor ? doctorId : ''}
              onChange={selectDoctor}
            />
            <MonthPicker
              months={editor.months}
              value={editor.monthValue}
              onChange={editor.selectMonth}
            />
          </div>
        )}

        {unknownDoctor && (
          <Alert tone="error">El médico indicado no existe</Alert>
        )}

        {doctor && <DoctorSummary doctor={doctor} />}
      </Card>

      {doctor && (
        <Card padded={false} className="p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-med-primary-900">
              Horario semanal
            </h2>
            {showForm && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                {editor.isEdit ? 'Editando agenda' : 'Nueva agenda'}
              </span>
            )}
          </div>

          <Alert tone="info">
            Los cambios se aplican de inmediato a los horarios libres. Los
            turnos ya reservados no se modifican. Se generan turnos de 30
            minutos desde hoy hasta fin de mes (o desde el día 1 si el mes es
            futuro), salteando los feriados.
          </Alert>

          {editor.notice && <Alert tone="success">{editor.notice}</Alert>}

          {editor.hasExtraRanges && showForm && (
            <Alert tone="info">
              Este mes tiene más de un horario en algún día. Se muestra el
              primero; al guardar se reemplazan todos.
            </Alert>
          )}

          {schedule.loading && <LoadingBlock />}

          {schedule.error && (
            <Alert tone="error">{schedule.error.message}</Alert>
          )}

          {showForm && (
            <WeekScheduleForm
              // A new key remounts the form, so it starts from the rows just
              // loaded for this doctor and month.
              key={`${doctorId}-${editor.monthValue}-${schedule.version}`}
              initialRows={editor.rows}
              submitLabel="Guardar disponibilidad"
              errorMessage={editor.errorMessage}
              onSubmit={editor.save}
              onCancel={() => navigate(LIST_PATH)}
            />
          )}
        </Card>
      )}
    </div>
  );
}

export default AvailabilityPage;
