import api from "../api";

/**
 * DONOR API MODULE
 * 
 * This file contains all API calls related to the donor's experience.
 * It uses the central 'api' instance which already handles:
 * - baseURL (http://127.0.0.1:5000)
 * - Headers (JSON)
 * - Auth Token (from localStorage)
 */

// 1. Get Donation History
// Returns a list of all donations made by the current user
export const getDonationHistory = async () => {
  const response = await api.get("/donor/donations");
  return response.data; // Expected: { donations: [...] }
};

// 2. Get Favorite Charities
// Returns charities the donor has marked as favorites
export const getFavoriteCharities = async () => {
  const response = await api.get("/donor/favorites");
  return response.data; // Expected: { favorites: [...] }
};

// 3. Get Recurring Donations
// Returns any scheduled/recurring donations
export const getRecurringDonations = async () => {
  const response = await api.get("/donor/recurring");
  return response.data; // Expected: { recurring: [...] }
};

// 4. Get Donor Stats
// Returns summary data like total amount donated and total donation count
export const getDonorStats = async () => {
  const response = await api.get("/donor/stats");
  return response.data; // Expected: { total_donated: 0, donation_count: 0, etc. }
};

// 5. Create a Donation
// Sends donation data (charity_id, amount, payment_method) to the server
export const createDonation = async (donationData) => {
  const response = await api.post("/donor/donations", donationData);
  return response.data; // Expected: { success: true, donation: {...} }
};

// 6. Confirm Donation (if applicable)
// Some payment flows require a confirmation step
export const confirmDonation = async (donationId) => {
  const response = await api.post(`/donor/donations/${donationId}/confirm`);
  return response.data;
};
