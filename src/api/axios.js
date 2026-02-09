/**
 * Axios instance configuration
 * Single source of truth for HTTP client setup
 * 
 * Note: In development, Vite proxy forwards /api/* to http://localhost:5000/*
 * The baseURL is empty because backend routes don't have /api prefix
 */
import axios from 'axios';
import { STORAGE_KEYS, ROUTES } from '../constants';

// Determine base URL based on environment
// In production, this should be configured via environment variable
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - attach auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common error scenarios
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (server unreachable, no internet)
    if (!error.response) {
      error.isNetworkError = true;
      error.userMessage = 'Unable to reach the server. Please check your connection and try again.';
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const serverError = error.response?.data?.error || '';

    // Handle 401 Unauthorized
    if (status === 401) {
      const isTokenExpired = serverError === 'Token expired';
      const isTokenInvalid = ['Invalid token', 'Token revoked'].includes(serverError);

      if (isTokenExpired || isTokenInvalid) {
        // Session ended — clear token and redirect
        localStorage.removeItem(STORAGE_KEYS.TOKEN);

        const currentPath = window.location.pathname;
        if (!currentPath.includes(ROUTES.LOGIN) && !currentPath.includes(ROUTES.REGISTER)) {
          // Preserve where the user wanted to go
          const dest = `${ROUTES.LOGIN}?expired=1`;
          window.location.href = dest;
        }
      }

      error.userMessage = isTokenExpired
        ? 'Your session has expired. Please sign in again.'
        : error.response?.data?.message || 'Authentication required.';
    }

    // Rate limited
    if (status === 429) {
      error.userMessage = 'Too many attempts. Please wait a moment and try again.';
    }

    // Server errors
    if (status >= 500) {
      error.userMessage = 'Something went wrong on our end. Please try again later.';
    }

    return Promise.reject(error);
  }
);

export default api;
