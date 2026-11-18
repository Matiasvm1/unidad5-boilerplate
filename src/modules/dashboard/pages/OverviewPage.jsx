import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import DoctorsDirectory from '../components/DoctorsDirectory';
import Button from '../../shared/components/atoms/Button';
import Icon from '../../shared/components/atoms/Icon';

// Vidriera final de adminhome, solo pone titulo, dos botones de alta y los dashboards correspondientes
function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Vista general de gestión
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Configure el personal médico y las especialidades del centro.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <Button // apuntan a nuevo doctor y nueva especialidad
            onClick={() => navigate('/admin/doctors/new')}
            className="min-h-11"
          >
            <span className="inline-flex items-center gap-1.5">
              <Icon name="plus" />
              Agregar nuevo doctor
            </span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/specialties/new')}
            className="min-h-11"
          >
            <span className="inline-flex items-center gap-1.5">
              <Icon name="plus" />
              Agregar nueva especialidad
            </span>
          </Button>
        </div>
      </div>

      <DashboardStats />
      <DoctorsDirectory />
    </div>
  );
}

export default OverviewPage;
