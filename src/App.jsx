import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ROUTES, ROLES } from "./constants";
import { Loader2 } from "lucide-react";

// Pages
import Home from "./pages/Home";
import Charities from "./pages/Charities";
import CharityProfile from "./pages/CharityProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/donor/Dashboard";
import CharityDashboard from "./pages/charity/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    const dashboards = {
      donor: "/donor",
      charity: "/charity",
      admin: "/admin",
    };
    return <Navigate to={dashboards[user?.role] || "/"} replace />;
  }
  return children;
}

function App() {
  const { user, isAuthenticated, loading, getRedirectPath } = useAuth();

  // Show loading state during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/charities" element={<Charities />} />
        <Route path="/charities/:id" element={<CharityProfile />} />

        {/* Authentication pages */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected dashboards */}
        <Route
          path={ROUTES.DONOR_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHARITY_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.CHARITY]}>
              <CharityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect for / based on authentication */}
        <Route
          path={ROUTES.HOME}
          element={
            isAuthenticated ? (
              <Navigate
                to={
                  {
                    donor: "/donor",
                    charity: "/charity",
                    admin: "/admin",
                  }[user?.role] || "/"
                }
                replace
              />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
