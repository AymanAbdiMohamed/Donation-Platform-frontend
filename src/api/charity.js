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
 * @param {FormData} formData - Multipart form data with application details
 * @returns {Promise<Object>} Created application
 */
export const submitCharityApplication = async (formData) => {
  const response = await api.post(API_ENDPOINTS.CHARITY_APPLICATION, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
