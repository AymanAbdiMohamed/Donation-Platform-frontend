import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LogOut, LayoutDashboard, Search, Home, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const getInitials = (email) => (email ? email.substring(0, 2).toUpperCase() : 'U');

  const navLinks = [];
  if (user?.role === 'donor') {
    navLinks.push(
      { to: '/donor', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/browse-charities', label: 'Browse Charities', icon: Search },
    );
  } else if (user?.role === 'charity') {
    navLinks.push({ to: '/charity', label: 'Dashboard', icon: LayoutDashboard });
  } else if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Dashboard', icon: LayoutDashboard });
  }
  navLinks.push({ to: '/', label: 'Home', icon: Home });

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Dark sidebar — md+ ──────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 fixed inset-y-0 left-0 z-40 bg-slate-800">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 flex-shrink-0">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EC4899] group-hover:bg-[#DB2777] transition-colors">
              <Heart className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">SheNeeds</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                location.pathname === link.to
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <link.icon className="h-4 w-4 flex-shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-[#EC4899] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getInitials(user?.email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Content area (offset by sidebar on md+) ────────────── */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-56">

        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-50 w-full bg-slate-800 border-b border-white/10">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link to={ROUTES.HOME} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EC4899]">
                  <Heart className="h-3.5 w-3.5 text-white fill-white" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">SheNeeds</span>
              </Link>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Mobile nav panel */}
        {mobileNavOpen && (
          <div className="md:hidden bg-slate-800 border-b border-white/10 px-4 py-2 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.to
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile page title */}
        {title && (
          <div className="md:hidden border-b border-border px-4 py-3 bg-background">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
