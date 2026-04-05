import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
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
  { path: '/', Component: LandingPage },

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
    path: '/admin-dashboard',
    Component: () => (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-dashboard/requests',
    Component: () => (
      <ProtectedRoute role="admin">
        <RequestManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-dashboard/workers',
    Component: () => (
      <ProtectedRoute role="admin">
        <WorkerManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-dashboard/reports',
    Component: () => (
      <ProtectedRoute role="admin">
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-dashboard/settings',
    Component: () => (
      <ProtectedRoute role="admin">
        <SettingsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/worker-dashboard',
    Component: () => (
      <ProtectedRoute role="worker">
        <WorkerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/worker-dashboard/new-entry',
    Component: () => (
      <ProtectedRoute role="worker">
        <TransportEntryForm />
      </ProtectedRoute>
    ),
  },

  { path: '/admin/dashboard', Component: () => <Navigate to="/admin-dashboard" replace /> },
  { path: '/admin/requests', Component: () => <Navigate to="/admin-dashboard/requests" replace /> },
  { path: '/admin/workers', Component: () => <Navigate to="/admin-dashboard/workers" replace /> },
  { path: '/admin/reports', Component: () => <Navigate to="/admin-dashboard/reports" replace /> },
  { path: '/admin/settings', Component: () => <Navigate to="/admin-dashboard/settings" replace /> },
  { path: '/worker/dashboard', Component: () => <Navigate to="/worker-dashboard" replace /> },
  { path: '/worker/new-entry', Component: () => <Navigate to="/worker-dashboard/new-entry" replace /> },

  { path: '*', Component: NotFound },
]);
