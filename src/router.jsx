import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';

// Auth Module
import AdminLoginPage from './modules/auth/pages/AdminLoginPage';

// Patients Module
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';

// Dashboard Module
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import OverviewPage from './modules/dashboard/pages/OverviewPage';

// Domain Modules (Screaming Architecture)
import DoctorsPage from './modules/doctors/pages/DoctorsPage';
import SpecialtiesPage from './modules/specialties/pages/SpecialtiesPage';
import AppointmentsSearchPage from './modules/appointments/pages/AppointmentsSearchPage';

const routes = [
  // Public routes
  {
    path: '/login',
    element: <PatientLoginPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // Patient private routes
  {
    path: '/',
    element: (
      <ProtectedRoute redirectTo="/login">
        <PatientLayout />
      </ProtectedRoute>
    ),
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

  // Admin private routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute redirectTo="/admin/login">
        <DashboardLayout />
      </ProtectedRoute>
    ),
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
        path: 'patients',
        element: <AppointmentsSearchPage />,
      },
      {
        path: 'specialties',
        element: <SpecialtiesPage />,
      },
      {
        path: 'doctors',
        element: <DoctorsPage />,
      },
    ],
  },

  // Any other URL
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

// Created once at module level so it is not rebuilt on every App render.
const router = createBrowserRouter(routes);

export default router;
