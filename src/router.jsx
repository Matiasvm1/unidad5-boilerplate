import { createBrowserRouter, Navigate } from 'react-router-dom';
import GuestRoute from './modules/auth/components/GuestRoute';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import { ROLES } from './modules/shared/constants/roles';

// Auth Module
import AdminLoginPage from './modules/auth/pages/AdminLoginPage';
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';

// Patients Module (Portal Paciente)
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';

// Dashboard Module (Admin Layout & Overview)
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import OverviewPage from './modules/dashboard/pages/OverviewPage';

// Domain Modules (Screaming Architecture)
import DoctorsPage from './modules/doctors/pages/DoctorsPage';
import DoctorFormPage from './modules/doctors/pages/DoctorFormPage';
import AppointmentsSearchPage from './modules/appointments/pages/AppointmentsSearchPage';
import SpecialtiesPage from './modules/specialties/pages/SpecialtiesPage';
import SpecialtyFormPage from './modules/specialties/pages/SpecialtyFormPage';

const routes = [
  // Public routes: with an active session they redirect to the role's home
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: <PatientLoginPage />,
      },
      {
        path: '/admin/login',
        element: <AdminLoginPage />,
      },
    ],
  },

  // Patient private routes
  {
    path: '/',
    element: <ProtectedRoute role={ROLES.PATIENT} />,
    children: [
      {
        element: <PatientLayout />,
        children: [
          {
            index: true,
            element: <PatientHome />,
          },
          {
            path: 'appointments',
            element: <AppointmentsPage />,
          },
        ],
      },
    ],
  },

  // Admin private routes
  {
    path: '/admin',
    element: <ProtectedRoute role={ROLES.ADMIN} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/home" replace />,
          },
          {
            path: 'home',
            element: <OverviewPage />,
          },
          {
            path: 'doctors',
            element: <DoctorsPage />,
          },
          {
            path: 'doctors/new',
            element: <DoctorFormPage />,
          },
          {
            path: 'patients',
            element: <AppointmentsSearchPage />,
          },
          {
            path: 'specialties',
            element: <SpecialtiesPage />,
          },
          {
            path: 'specialties/new',
            element: <SpecialtyFormPage />,
          },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);

export default router;
