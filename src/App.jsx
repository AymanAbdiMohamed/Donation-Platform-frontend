import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { ROUTES, ROLES } from '@/constants'
import { Loader2 } from 'lucide-react'

// Auth pages
import Login from '@/pages/Login'
import Register from '@/pages/Register'

// Public pages
import Charities from '@/pages/Charities'

// Donor pages
import DonorDashboard from '@/pages/donor/Dashboard'
import BrowseCharities from '@/pages/donor/BrowseCharities'
import DonationSuccess from '@/pages/donor/DonationSuccess'

// Charity pages
import CharityDashboard from '@/pages/charity/Dashboard'

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard'

/**
 * Main App component.
 * Handles routing and authentication redirects.
 */
function App() {
  const { user, isAuthenticated, loading, getRedirectPath } = useAuth()

  // Initial auth loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
            isAuthenticated
              ? <Navigate to={getDefaultDashboard()} replace />
              : <Login />
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            isAuthenticated
              ? <Navigate to={getDefaultDashboard()} replace />
              : <Register />
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

        <Route
          path="/browse-charities"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
              <BrowseCharities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donation/success"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
              <DonationSuccess />
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

        {/* Default redirects */}
        <Route
          path={ROUTES.HOME}
          element={
            isAuthenticated
              ? <Navigate to={getDefaultDashboard()} replace />
              : <Navigate to={ROUTES.LOGIN} replace />
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </div>
  )
}

export default App
