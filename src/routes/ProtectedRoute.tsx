import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VotingLoader from '../common/Loader/VotingLoader'; // Make sure this path matches your project

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
  // Pull in isLoading from the context
  const { authUser, isLoading } = useAuth();
  const location = useLocation();

  // 1. THE FIX: Wait for AuthContext to finish checking tokens/API
  if (isLoading) {
    return (
      <VotingLoader title="Authenticating..." description="Please wait..." />
    );
  }

  // 2. Guest-only routes (e.g., Login/Signup pages)
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

  // 3. Not authenticated
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

  // 4. Role restricted
  if (role && authUser.role !== role) {
    // Redirect to the correct login page if wrong role
    const loginPage =
      authUser.role === 'admin' ? '/admin/signin' : '/client/signin';
    return <Navigate to={loginPage} replace />;
  }

  // 5. Super Admin restricted
  if (superAdminOnly && authUser.user.role !== 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 6. If all checks pass, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;
