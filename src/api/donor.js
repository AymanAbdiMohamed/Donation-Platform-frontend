/**
 * Donor API service
 * Handles donor-specific operations (donations, dashboard, charities)
 */

import api from "./axios";

/**
 * Create a donation (simple flow — amount in cents)
 * @param {Object} donationData - { charity_id, amount, message, is_anonymous }
 * @returns {Promise<Object>} { message, donation }
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
 * Get donation history for current donor
 * @param {number} limit - Optional limit on number of results
 * @returns {Promise<Object>} { donations: [] }
 */
export const getDonationHistory = async (limit) => {
  const params = limit ? { limit } : {};
  const response = await api.get("/donor/donations", { params });
  return response.data;
};

/**
 * Get donor dashboard data (stats + recent donations)
 * @returns {Promise<Object>} { stats: {...}, recent_donations: [] }
 */
export const getDonorDashboard = async () => {
  const response = await api.get("/donor/dashboard");
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

/**
 * Get receipt for a specific donation
 * @param {number} donationId - ID of the donation
 * @returns {Promise<Object>} { receipt: {...} }
 */
export const getDonationReceipt = async (donationId) => {
  const response = await api.get(`/donor/donations/${donationId}/receipt`);
  return response.data;
};

/**
 * Email receipt for a specific donation to the donor
 * @param {number} donationId - ID of the donation
 * @returns {Promise<Object>} { message: "..." }
 */
export const emailDonationReceipt = async (donationId) => {
  const response = await api.post(`/donor/donations/${donationId}/receipt/email`);
  return response.data;
};
