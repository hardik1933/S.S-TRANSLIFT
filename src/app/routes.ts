import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { TransportEntryForm } from './pages/TransportEntryForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { RequestManagement } from './pages/RequestManagement';
import { WorkerManagement } from './pages/WorkerManagement';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
  {
    path: '/worker/dashboard',
    Component: WorkerDashboard,
  },
  {
    path: '/worker/new-entry',
    Component: TransportEntryForm,
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
  },
  {
    path: '/admin/requests',
    Component: RequestManagement,
  },
  {
    path: '/admin/workers',
    Component: WorkerManagement,
  },
  {
    path: '/admin/reports',
    Component: ReportsPage,
  },
  {
    path: '/admin/settings',
    Component: SettingsPage,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);