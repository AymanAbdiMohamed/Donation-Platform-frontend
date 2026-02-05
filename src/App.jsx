import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { ROUTES, ROLES } from '@/constants'
import { Loader2 } from 'lucide-react'

// Pages
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Charities from '@/pages/Charities'

// Dashboard Pages (refactored into subdirectories)
import DonorDashboard from '@/pages/donor/Dashboard'
import CharityDashboard from '@/pages/charity/Dashboard'
import AdminDashboard from '@/pages/admin/Dashboard'

/**
 * Main App component.
 * Handles routing and authentication redirects.
 */
function App() {
  const { user, isAuthenticated, loading, getRedirectPath } = useAuth()

  // Show loading state during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  /**
   * Get the default dashboard route based on user role
   */
  const getDefaultDashboard = () => {
    if (!user) return ROUTES.LOGIN
    return getRedirectPath(user.role)
  }

  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultDashboard()} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultDashboard()} replace />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path={ROUTES.CHARITIES}
          element={<Charities />}
        />

        {/* Donor routes */}
        <Route
          path={ROUTES.DONOR_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Charity routes */}
        <Route
          path={ROUTES.CHARITY_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.CHARITY]}>
              <CharityDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path={ROUTES.HOME}
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultDashboard()} replace />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </div>
  )
}

export default App
