/**
 * Authentication Context
 * Provides auth state and methods throughout the application
 * 
 * Handles:
 * - User session persistence across page refreshes
 * - Login/logout/register flows
 * - Token lifecycle management
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe } from '../api/auth';
import { STORAGE_KEYS, ROUTES, ROLES } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track if initial auth check has completed to prevent race conditions
  const [initialized, setInitialized] = useState(false);

  /**
   * Validate existing token and restore user session
   * Called on app mount to handle page refreshes
   * Uses isMounted flag to prevent state updates on unmounted component
   */
  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (!token) {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
        return;
      }

      try {
        const data = await getMe();
        if (isMounted) {
          setUser(data.user);
        }
      } catch (err) {
        // Token is invalid or expired - clean up silently
        console.warn('Token validation failed:', err.response?.status || err.message);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
      setUser(data.user);

      return data.user;
    } catch (err) {
      let message;
      if (err.isNetworkError) {
        message = err.userMessage;
      } else {
        const status = err.response?.status;
        message = err.response?.data?.message || err.userMessage || 'Login failed';
        if (status === 401) message = err.response?.data?.message || 'Invalid email or password';
        if (status === 429) message = 'Too many login attempts. Please wait and try again.';
      }

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (email, password, role = ROLES.DONOR) => {
    setError(null);
    setLoading(true);

    try {
      const data = await registerUser({ email, password, role });
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
      setUser(data.user);

      return data.user;
    } catch (err) {
      let message;
      if (err.isNetworkError) {
        message = err.userMessage;
      } else {
        const status = err.response?.status;
        message = err.response?.data?.message || err.userMessage || 'Registration failed';
        if (status === 409) message = 'An account with this email already exists.';
        if (status === 429) message = 'Too many attempts. Please wait and try again.';
      }

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
    setError(null);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get redirect path based on user role
   * @param {string} role 
   * @returns {string} Route path
   */
  const getRedirectPath = useCallback((role) => {
    switch (role) {
      case ROLES.DONOR:
        return ROUTES.DONOR_DASHBOARD;
      case ROLES.CHARITY:
        return ROUTES.CHARITY_DASHBOARD;
      case ROLES.ADMIN:
        return ROUTES.ADMIN_DASHBOARD;
      default:
        return ROUTES.HOME;
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
