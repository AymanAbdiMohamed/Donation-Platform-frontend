/**
 * Axios instance configuration
 * Single source of truth for HTTP client setup
 *
 * Development: Vite proxy forwards all backend paths to http://localhost:5000
 *   → set baseURL to '' (empty) so requests go through the proxy
 * Production: set VITE_API_URL to your deployed backend
 */
import axios from "axios";
import { STORAGE_KEYS, ROUTES } from "../constants";

// Use VITE_API_URL if set, otherwise default to deployed Railway backend
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://web-production-63323.up.railway.app";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s timeout
  withCredentials: true, // needed if backend uses cookies
});

// Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    // Catch HTML responses (likely misconfigured backend URL)
    const ct = response.headers?.["content-type"] || "";
    if (!ct.includes("application/json") && typeof response.data === "string" && response.data.trimStart().startsWith("<!")) {
      const err = new Error(
        "API returned HTML instead of JSON. Check VITE_API_URL / backend deployment."
      );
      err.isConfigError = true;
      err.userMessage = "Unable to reach the API server. Please contact support.";
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    // Network errors
    if (!error.response) {
      error.isNetworkError = true;
      error.userMessage =
        "Unable to reach the server. Please check your connection and try again.";
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // HTML response fallback
    if (typeof data === "string" && data.trimStart().startsWith("<!")) {
      error.isConfigError = true;
      error.userMessage =
        "Unable to reach the API server. Please contact support.";
      return Promise.reject(error);
    }

    const serverError = data?.error || "";

    // 401 Unauthorized handling
    if (status === 401) {
      const isTokenExpired = serverError === "Token expired";
      const isTokenInvalid = ["Invalid token", "Token revoked", "Authorization required"].includes(serverError);

      if (isTokenExpired || isTokenInvalid) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        const currentPath = window.location.pathname;
        if (!currentPath.includes(ROUTES.LOGIN) && !currentPath.includes(ROUTES.REGISTER)) {
          window.location.href = `${ROUTES.LOGIN}?expired=1`;
        }
      }

      error.userMessage = isTokenExpired
        ? "Your session has expired. Please sign in again."
        : data?.message || serverError || "Authentication required.";
    }

    // Rate limiting
    if (status === 429) {
      error.userMessage =
        "Too many attempts. Please wait a moment and try again.";
    }

    // General fallback
    if (!error.userMessage) {
      error.userMessage =
        data?.message ||
        data?.error ||
        (status >= 500
          ? "Something went wrong on our end. Please try again later."
          : "An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default api;
