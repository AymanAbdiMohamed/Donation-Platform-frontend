/**
 * Donor API service
 * Handles donor-specific operations (donations, history)
 */
import api from './axios';

/**
 * Create a donation
 * @param {Object} donationData - { charity_id, amount (in cents), message, is_anonymous }
 * @returns {Promise<Object>} Created donation
 */
export const createDonation = async ({ charity_id, amount, message, is_anonymous }) => {
  const response = await api.post('/donor/donate', {
    charity_id,
    amount,
    message,
    is_anonymous: is_anonymous || false,
  });
  return response.data;
};

/**
 * Get donation history for current donor
 * @param {number} limit - Optional limit on number of results
 * @returns {Promise<Object>} { donations: [], total_donated: number }
 */
export const getDonationHistory = async (limit) => {
  const params = limit ? { limit } : {};
  const response = await api.get('/donor/donations', { params });
  return response.data;
};

/**
 * Get active charities (donor view)
 * @returns {Promise<Object>} { charities: [] }
 */
export const getDonorCharities = async () => {
  const response = await api.get('/donor/charities');
  return response.data;
};
