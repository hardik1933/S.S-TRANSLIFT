import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

type Role = 'admin' | 'worker';

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: Role;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useApp();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function GuestOnlyRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useApp();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/worker/dashboard'} replace />;
  }

  return children;
}
