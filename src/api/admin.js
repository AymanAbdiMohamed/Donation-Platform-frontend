/**
 * Admin API service
 * Handles admin operations for charity application management
 */
import api from './axios';
import { API_ENDPOINTS } from '../constants';

/**
 * Get list of pending charity applications
 * @returns {Promise<Array>} Array of pending applications
 */
export const getPendingApplications = async () => {
  const response = await api.get('/admin/applications', { params: { status: 'pending' } });
  return response.data;
};

/**
 * Approve a charity application
 * CRITICAL: Uses POST method to match backend endpoint (not PATCH)
 * @param {number} applicationId 
 * @returns {Promise<Object>} Updated application
 */
export const approveApplication = async (applicationId) => {
  const response = await api.post(API_ENDPOINTS.ADMIN_APPROVE_APPLICATION(applicationId));
  return response.data;
};

/**
 * Reject a charity application
 * CRITICAL: Uses POST method to match backend endpoint (not PATCH)
 * @param {number} applicationId 
 * @param {string} reason - Reason for rejection (optional)
 * @returns {Promise<Object>} Updated application
 */
export const rejectApplication = async (applicationId, reason = '') => {
  const response = await api.post(API_ENDPOINTS.ADMIN_REJECT_APPLICATION(applicationId), { reason });
  return response.data;
};

/**
 * Get platform statistics
 * @returns {Promise<Object>} Platform stats
 */
export const getPlatformStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
