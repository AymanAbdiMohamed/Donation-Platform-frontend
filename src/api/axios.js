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
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes(ROUTES.LOGIN) && !currentPath.includes(ROUTES.REGISTER)) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
