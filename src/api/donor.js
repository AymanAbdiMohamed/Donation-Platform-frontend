/**
 * Donor API service
 * Handles donor-specific operations (donations, dashboard, charities)
 */

import api from "./axios";

/**
 * Initiate an M-Pesa STK Push donation (primary flow)
 * @param {Object} params - { charity_id, amount, phone_number, message?, is_anonymous? }
 * @returns {Promise<Object>} { message, donation, checkout_request_id, customer_message }
 */
export const initiateMpesaDonation = async ({
  charity_id,
  amount,
  phone_number,
  message,
  is_anonymous = false,
}) => {
  console.log("🔄 Initiating M-Pesa donation:", {
    charity_id,
    amount,
    phone_number,
    message,
    is_anonymous,
    url: "/api/donations/mpesa"
  });
  const response = await api.post("/api/donations/mpesa", {
    charity_id,
    amount,
    phone_number,
    message: message || "",
    is_anonymous,
  });
  console.log("✅ M-Pesa donation initiated:", response.data);
  return response.data;
};

/**
 * Initiate a Pesapal donation (alternative flow)
 * @param {Object} params - { charity_id, amount, phone_number, email, message?, is_anonymous? }
 * @returns {Promise<Object>} { success, payment_url, tracking_id, reference, donation_id }
 */
export const initiatePesapalDonation = async ({
  charity_id,
  amount,
  phone_number,
  email,
  message,
  is_anonymous = false,
}) => {
  console.log("🔄 Initiating Pesapal donation:", {
    charity_id,
    amount,
    phone_number,
    email,
    message,
    is_anonymous,
    url: "/donor/donations/pesapal"
  });
  const response = await api.post("/donor/donations/pesapal", {
    charity_id,
    amount,
    phone: phone_number,
    email,
    message: message || "",
    is_anonymous,
  });
  console.log("✅ Pesapal donation initiated:", response.data);
  return response.data;
};

/**
 * Poll donation status (used after STK Push to check if payment completed)
 * @param {number} donationId - ID of the donation
 * @returns {Promise<Object>} { id, status, mpesa_receipt_number, amount, amount_kes, charity_name }
 */
export const getDonationStatus = async (donationId) => {
  const response = await api.get(`/api/donations/${donationId}/status`);
  return response.data;
};

/**
 * Poll donation status by checkout request ID
 * This is the preferred method right after STK Push initiation
 * @param {string} checkoutId - Checkout request ID from STK Push response
 * @returns {Promise<Object>} { id, status, mpesa_receipt_number, amount_kes, charity_name, failure_reason }
 */
export const getDonationStatusByCheckout = async (checkoutId) => {
  const response = await api.get(`/api/donations/status/${checkoutId}`);
  return response.data;
};

/**
 * Create a donation (simple flow — amount in cents, no M-Pesa)
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
