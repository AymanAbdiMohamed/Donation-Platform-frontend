/**
 * Dashboard Layout Component
 * Pink-themed header with navigation and user menu for all dashboard pages
 */
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LogOut, User, LayoutDashboard, Search, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => { logout(); };

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  // Role-based nav links
  const navLinks = [];
  if (user?.role === 'donor') {
    navLinks.push(
      { to: '/donor', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/browse-charities', label: 'Browse', icon: Search },
    );
  }
  navLinks.push({ to: '/', label: 'Home', icon: Home });

  return (
    <div className="min-h-screen bg-[#FDF2F8]/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#FBB6CE]/20 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-[#FDF2F8] transition-colors"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5 text-[#4B5563]" />
              ) : (
                <Menu className="h-5 w-5 text-[#4B5563]" />
              )}
            </button>

            <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#EC4899] to-[#DB2777] shadow-pink group-hover:shadow-pink-lg transition-shadow duration-300">
                <Heart className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-[#EC4899]">She</span><span className="text-[#1F2937]">Needs</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === link.to
                      ? "bg-[#FDF2F8] text-[#EC4899]"
                      : "text-[#4B5563] hover:text-[#EC4899] hover:bg-[#FDF2F8]"
                  )}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {title && (
              <span className="hidden lg:block text-sm font-medium text-[#9CA3AF]">
                {title}
              </span>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-[#FDF2F8]">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] text-white text-sm font-bold">
                      {getInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-[#FBB6CE]/20" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-[#1F2937]">{user?.email}</p>
                    <p className="text-xs leading-none text-[#9CA3AF] capitalize">
                      {user?.role} Account
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="#" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#EF4444] focus:text-[#EF4444]">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile nav panel */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-[#FBB6CE]/20 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileNavOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                location.pathname === link.to
                  ? "bg-[#FDF2F8] text-[#EC4899]"
                  : "text-[#4B5563] hover:text-[#EC4899] hover:bg-[#FDF2F8]"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile title */}
      {title && (
        <div className="md:hidden border-b border-[#FBB6CE]/20 px-4 py-3 bg-white">
          <h1 className="text-lg font-bold text-[#1F2937]">{title}</h1>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
