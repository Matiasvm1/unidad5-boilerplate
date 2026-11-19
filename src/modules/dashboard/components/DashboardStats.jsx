// tablero marcador con las 3 pantallas una al lado de la otra

import useTotal from '../hooks/useTotal';
import { getAppointmentsByDate } from '../services/dashboardService';
import StatCard from '../../shared/components/molecules/StatCard';
import {
  getDoctors,
  getSpecialties,
} from '../../shared/services/catalogService';
import { todayIso } from '../../shared/utils/dates';

// todos los endp paginados devuelven total data etc.. pero como solo nos interesa el numero, pedimos una pag tamaño 1
const loadDoctors = () => getDoctors({ pageIndex: 1, pageSize: 1 });
const loadSpecialties = () => getSpecialties({ pageIndex: 1, pageSize: 1 });
//estos loads estan fuera pa q sean estables y no disparen el useEffect
const loadTodayBooked = () =>
  getAppointmentsByDate({ date: todayIso(), status: 'BOOKED', pageSize: 1 });

function Stat({ load, ...props }) {
  //cada card llama a su propio useTotal
  const { total, loading, error } = useTotal(load);

  return <StatCard value={total} loading={loading} error={error} {...props} />;
}

function DashboardStats() {
  // responsive, cel y tablet unaa debajo de la otra, en pc se ponen en 3 columnas
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Stat load={loadDoctors} icon="briefcase" label="Doctores activos" />
      <Stat load={loadSpecialties} icon="grid" label="Especialidades activas" />
      <Stat
        load={loadTodayBooked}
        icon="calendar"
        label="Turnos confirmados para hoy"
      />
    </div>
  );
}

export default DashboardStats;
