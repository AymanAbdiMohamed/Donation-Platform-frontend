/**
 * API Module - Backwards Compatibility Layer
 * 
 * DEPRECATED: This file is maintained for backwards compatibility.
 * New code should import from './api/index.js' or specific service modules:
 * 
 * import { loginUser, registerUser, getMe } from './api';
 * import { getCharities, submitCharityApplication } from './api';
 * import { getPendingApplications, approveApplication, rejectApplication } from './api';
 * 
 * The old pages (CharityDashboard.jsx, AdminDashboard.jsx, etc.) in /pages/
 * will be removed once the new pages in /pages/{role}/ are verified working.
 */


// Create a reusable Axios instance.
// This centralizes backend configuration (base URL + headers)
// so individual API calls stay clean.
const api = axios.create({
  baseURL: "http://127.0.0.1:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token automatically to every request (if available).
// This prevents manually adding Authorization headers everywhere.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Named export for api (also export as default)
export { api, api as apiInstance };
export default api;

/* =========================
   AUTHENTICATION
   ========================= */

// Login user
export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // { user, access_token }
};

// Register user
export const registerUser = async ({ email, password, role }) => {
  const response = await api.post("/auth/register", {
    email,
    password,
    role,
  });
  return response.data; // { user, access_token } jbjhjjgjhj
};

// Get current logged-in user
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data; // { user }
};

/* =========================
   CHARITY
   ========================= */

// Submit charity application (supports file uploads)
export const submitCharityApplication = async (formData) => {
  const response = await api.post("/charity/application", formData);
  return response.data;
};

/* =========================
   ADMIN
   ========================= */

// Get pending charity applications
export const getPendingApplications = async () => {
  const response = await api.get("/admin/applications?status=pending");
  return response.data; // array of applications
};

// Approve application
export const approveApplication = async (applicationId) => {
  const response = await api.patch(
    `/admin/applications/${applicationId}/approve`,
  );
  return response.data;
};

// Reject application (optional reason)
export const rejectApplication = async (applicationId, reason = "") => {
  const response = await api.patch(
    `/admin/applications/${applicationId}/reject`,
    { reason },
  );
  return response.data;
};

// Re-export everything from the new API modules
export { default as api } from './api/axios';
export * from './api/auth';
export * from './api/charity';
export * from './api/admin';

// Default export for direct api access
export { default } from './api/axios';

