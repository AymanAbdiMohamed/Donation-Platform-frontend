import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Charities from "./pages/Charities";
import CharityProfile from "./pages/CharityProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import CharityDashboard from "./pages/CharityDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

/**
 * Optional wrapper for public routes like login/register.
 * Redirects authenticated users to their dashboard.
 */
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
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading...
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
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected dashboards */}
        <Route
          path="/donor"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charity"
          element={
            <ProtectedRoute allowedRoles={["charity"]}>
              <CharityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect for / based on authentication */}
        <Route
          path="/"
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
              <Home />
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
