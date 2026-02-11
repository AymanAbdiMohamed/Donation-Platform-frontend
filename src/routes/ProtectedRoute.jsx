import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protected Route - redirects to login if not authenticated.
 * Optionally restricts by role.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboards = {
      donor: '/donor/dashboard',
      charity: '/charity/dashboard',
      admin: '/admin/dashboard',
    }
    return <Navigate to={dashboards[user?.role] || '/login'} replace />
  }

  return children
}

export default ProtectedRoute
