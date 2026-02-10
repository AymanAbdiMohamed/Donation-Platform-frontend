/**
 * Charity API service
 * Handles charity listing and application submission
 */
import api from './axios';
import { API_ENDPOINTS } from '../constants';

/**
 * Get list of charities
 * @param {Object} params - Query parameters (e.g., { status: 'approved' })
 * @returns {Promise<Array>} Array of charity objects
 */
export const getCharities = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.CHARITIES, { params });
  return response.data;
};

/**
 * Get current user's charity application status
 * @returns {Promise<{application: Object}>}
 */
export const getCharityApplication = async () => {
  const response = await api.get(API_ENDPOINTS.CHARITY_APPLICATION);
  return response.data;
};

/**
 * Submit charity application
 * @param {Object} applicationData - Application data object
 * @returns {Promise<Object>} Created application
 */
export const submitCharityApplication = async (formData) => {
  const response = await api.post('/charity/apply', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get charity profile
 * @returns {Promise<{charity: Object}>}
 */
export const getCharityProfile = async () => {
  const response = await api.get('/charity/profile');
  return response.data;
};

/**
 * Update charity profile
 * @param {Object} updates - { name, description }
 * @returns {Promise<Object>} Updated charity
 */
export const updateCharityProfile = async (updates) => {
  const response = await api.put('/charity/profile', updates);
  return response.data;
};

/**
 * Get received donations
 * @param {number} limit - Optional limit
 * @returns {Promise<{donations: []}>}
 */
export const getReceivedDonations = async (limit) => {
  const params = limit ? { limit } : {};
  const response = await api.get('/charity/donations', { params });
  return response.data;
};

/**
 * Get charity dashboard with stats
 * @returns {Promise<Object>} Dashboard data
 */
export const getCharityDashboard = async () => {
  const response = await api.get('/charity/dashboard');
  return response.data;
};
