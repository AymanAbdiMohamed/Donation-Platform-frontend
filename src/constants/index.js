/**
 * Application-wide constants
 * Centralizes magic strings for routes, roles, and API endpoints
 */

// User roles - must match backend role values
export const ROLES = {
  DONOR: 'donor',
  CHARITY: 'charity',
  ADMIN: 'admin',
};

// Frontend route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHARITIES: '/charities',
  
  // Role-based dashboard routes
  DONOR_DASHBOARD: '/donor',
  CHARITY_DASHBOARD: '/charity',
  ADMIN_DASHBOARD: '/admin',
};

// API endpoint paths (relative to base URL)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Charities
  CHARITIES: '/charities',
  
  // Charity application (for charity role)
  CHARITY_APPLICATION: '/charity/application',
  
  // Admin
  ADMIN_APPROVE_APPLICATION: (id) => `/admin/applications/${id}/approve`,
  ADMIN_REJECT_APPLICATION: (id) => `/admin/applications/${id}/reject`,
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'access_token',
};

// Add this to constants/index.js

export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};