import { createBrowserRouter } from 'react-router-dom';
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
import { GuestOnlyRoute, ProtectedRoute } from './components/RouteGuards';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: () => (
      <GuestOnlyRoute>
        <LoginPage />
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/signup',
    Component: () => (
      <GuestOnlyRoute>
        <SignupPage />
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/worker/dashboard',
    Component: () => (
      <ProtectedRoute role="worker">
        <WorkerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/worker/new-entry',
    Component: () => (
      <ProtectedRoute role="worker">
        <TransportEntryForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    Component: () => (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/requests',
    Component: () => (
      <ProtectedRoute role="admin">
        <RequestManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/workers',
    Component: () => (
      <ProtectedRoute role="admin">
        <WorkerManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/reports',
    Component: () => (
      <ProtectedRoute role="admin">
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/settings',
    Component: () => (
      <ProtectedRoute role="admin">
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
