/**
 * Authentication API service
 * Handles login, registration, and user session management
 */
import api from './axios';
import { API_ENDPOINTS } from '../constants';

/**
 * Login user with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{user: Object, access_token: string}>}
 */
export const loginUser = async ({ email, password }) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
  return response.data; // { user, access_token }
};

/**
 * Register new user
 * @param {Object} userData - { email, password, role }
 * @returns {Promise<{user: Object, access_token: string}>}
 */
export const registerUser = async ({ email, password, role }) => {
  const response = await api.post(API_ENDPOINTS.REGISTER, { email, password, role });
  return response.data; // { user, access_token }
};

/**
 * Get current authenticated user
 * @returns {Promise<{user: Object}>}
 */
export const getMe = async () => {
  const response = await api.get(API_ENDPOINTS.ME);
  return response.data; // { user }
};
