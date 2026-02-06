import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';
import { Loader2 } from 'lucide-react';

/**
 * Protected Route Component
 * - Redirects to login if not authenticated
 * - Redirects to appropriate dashboard if user doesn't have required role
 * 
 * @param {React.ReactNode} children - Child components to render if authorized
 * @param {string[]} allowedRoles - Array of roles that can access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, getRedirectPath } = useAuth();

  // Show loading state during auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to user's appropriate dashboard
    return <Navigate to={getRedirectPath(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
