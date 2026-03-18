import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  role?: 'admin' | 'client';
  guestOnly?: boolean;
  redirectPath?: string;
  superAdminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  role,
  guestOnly = false,
  redirectPath,
  superAdminOnly = false,
}) => {
  const { authUser } = useAuth();
  const location = useLocation();

  // Guest-only routes
  if (guestOnly) {
    if (authUser) {
      return (
        <Navigate
          to={
            authUser.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'
          }
          replace
        />
      );
    }
    return <Outlet />;
  }

  // Not authenticated
  if (!authUser) {
    const targetPath = location.pathname.startsWith('/admin')
      ? '/admin/signin'
      : location.pathname.startsWith('/client')
      ? '/client/signin'
      : redirectPath || '/signin';

    return (
      <Navigate to={targetPath} replace state={{ from: location.pathname }} />
    );
  }

  // Role restricted
  if (role && authUser.role !== role) {
    // Redirect to the correct login page if wrong role
    const loginPage =
      authUser.role === 'admin' ? '/admin/signin' : '/client/signin';
    return <Navigate to={loginPage} replace />;
  }

  if (superAdminOnly && authUser.user.role !== 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
