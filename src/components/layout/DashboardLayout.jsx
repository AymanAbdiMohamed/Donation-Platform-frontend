/**
 * Dashboard Layout Component
 * Provides consistent header with logout functionality for all dashboard pages
 */
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import { Link } from 'react-router-dom';

function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-xl font-bold">
                <span className="text-red-500">She</span>Needs
              </span>
            </Link>

            {/* Page Title (center) */}
            {title && (
              <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
                {title}
              </h1>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile title */}
      {title && (
        <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </div>
      )}

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
