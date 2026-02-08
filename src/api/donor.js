/**
 * Donor API service
 * Handles donor-specific operations (donations, history, stats, favorites)
 */

import api from "./axios";

/**
 * Create a donation
 * @param {Object} donationData
 * { charity_id, amount (in cents), message, is_anonymous }
 * @returns {Promise<Object>} Created donation
 */
export const createDonation = async ({
  charity_id,
  amount,
  message,
  is_anonymous = false,
}) => {
  const response = await api.post("/donor/donations", {
    charity_id,
    amount,
    message,
    is_anonymous,
  });
  return response.data;
};

/**
 * Confirm a donation (for multi-step payment flows)
 * @param {number|string} donationId
 * @returns {Promise<Object>}
 */
export const confirmDonation = async (donationId) => {
  const response = await api.post(`/donor/donations/${donationId}/confirm`);
  return response.data;
};

/**
 * Get donation history for current donor
 * @param {number} limit - Optional limit on number of results
 * @returns {Promise<Object>} { donations: [], total_donated: number }
 */
export const getDonationHistory = async (limit) => {
  const params = limit ? { limit } : {};
  const response = await api.get("/donor/donations", { params });
  return response.data;
};

/**
 * Get donor statistics
 * @returns {Promise<Object>}
 * { total_donated, donation_count, last_donation_date, ... }
 */
export const getDonorStats = async () => {
  const response = await api.get("/donor/stats");
  return response.data;
};

/**
 * Get favorite charities for donor
 * @returns {Promise<Object>} { favorites: [] }
 */
export const getFavoriteCharities = async () => {
  const response = await api.get("/donor/favorites");
  return response.data;
};

/**
 * Get recurring donations for donor
 * @returns {Promise<Object>} { recurring: [] }
 */
export const getRecurringDonations = async () => {
  const response = await api.get("/donor/recurring");
  return response.data;
};

/**
 * Get active charities (donor view)
 * @returns {Promise<Object>} { charities: [] }
 */
export const getDonorCharities = async () => {
  const response = await api.get("/donor/charities");
  return response.data;
};
