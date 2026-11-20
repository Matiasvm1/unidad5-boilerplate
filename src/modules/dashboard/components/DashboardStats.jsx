import useDashboardTotals from '../hooks/useDashboardTotals';
import StatCard from '../../shared/components/molecules/StatCard';

function DashboardStats() {
  const { doctors, specialties, todayBooked } = useDashboardTotals();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <StatCard
        icon="briefcase"
        label="Doctores activos"
        value={doctors.total}
        loading={doctors.loading}
        error={doctors.error}
      />
      <StatCard
        icon="grid"
        label="Especialidades activas"
        value={specialties.total}
        loading={specialties.loading}
        error={specialties.error}
      />
      <StatCard
        icon="calendar"
        label="Turnos confirmados para hoy"
        value={todayBooked.total}
        loading={todayBooked.loading}
        error={todayBooked.error}
      />
    </div>
  );
}

export default DashboardStats;
