import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import ProtectedRoute from "./routes/ProtectedRoute"
import { ROUTES, ROLES } from "./constants"
import { Loader2 } from "lucide-react"

// Public pages
import Home from "./pages/Home"
import Charities from "./pages/Charities"
import CharityProfile from "./pages/CharityProfile"
import NotFound from "./pages/NotFound"

// Auth pages
import Login from "./pages/Login"
import Register from "./pages/Register"

// Donor pages
import DonorDashboard from "./pages/donor/Dashboard"
import BrowseCharities from "./pages/BrowseCharities"
import DonationSuccess from "./pages/DonationSuccess"

// Charity pages
import CharityDashboard from "./pages/charity/Dashboard"

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard"

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
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CHARITIES} element={<Charities />} />
        <Route path="/charities/:id" element={<CharityProfile />} />

        {/* Auth pages */}
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

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
