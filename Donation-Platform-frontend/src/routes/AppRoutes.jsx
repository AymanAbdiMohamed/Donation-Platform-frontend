import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

// Pages
import Login from '../pages/Login'
import Register from '../pages/Register'
import DonorDashboard from '../pages/DonorDashboard'
import CharityDashboard from '../pages/CharityDashboard'
import AdminDashboard from '../pages/AdminDashboard'

/**
 * Application routes with role-based access control.
 */
function AppRoutes() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  const getDefaultDashboard = () => {
    const dashboards = {
      donor: '/donor/dashboard',
      charity: '/charity/dashboard',
      admin: '/admin/dashboard',
    }
    return dashboards[user?.role] || '/login'
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getDefaultDashboard()} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={getDefaultDashboard()} replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Donor routes */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Charity routes */}
      <Route
        path="/charity/dashboard"
        element={
          <ProtectedRoute allowedRoles={['charity']}>
            <CharityDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getDefaultDashboard()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
