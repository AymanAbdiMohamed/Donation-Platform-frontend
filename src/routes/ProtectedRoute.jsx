import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route - redirects to login if not authenticated.
 * Restrictions by role: redirects to the dashboard of the user's role if they try to access a forbidden route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboards = {
      donor: '/donor',
      charity: '/charity',
      admin: '/admin',
    };
    return <Navigate to={dashboards[user?.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
