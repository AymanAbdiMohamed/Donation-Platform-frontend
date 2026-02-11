/**
 * Beneficiaries API service
 * Handles beneficiary and inventory management for charities
 */
import api from './axios';

/**
 * Get all beneficiaries for the charity
 * @param {boolean} includeInventory - include inventory items
 * @returns {Promise<Object>} { beneficiaries: [] }
 */
export const getBeneficiaries = async (includeInventory = false) => {
  const params = includeInventory ? { include_inventory: 'true' } : {};
  const response = await api.get('/charity/beneficiaries', { params });
  return response.data;
};

/**
 * Create a new beneficiary
 * @param {Object} data - { name, age?, location?, school?, notes? }
 * @returns {Promise<Object>} { message, beneficiary }
 */
export const createBeneficiary = async (data) => {
  const response = await api.post('/charity/beneficiaries', data);
  return response.data;
};

/**
 * Update a beneficiary
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>} { message, beneficiary }
 */
export const updateBeneficiary = async (id, data) => {
  const response = await api.put(`/charity/beneficiaries/${id}`, data);
  return response.data;
};

/**
 * Delete a beneficiary
 * @param {number} id
 * @returns {Promise<Object>} { message }
 */
export const deleteBeneficiary = async (id) => {
  const response = await api.delete(`/charity/beneficiaries/${id}`);
  return response.data;
};

/**
 * Get inventory for a beneficiary
 * @param {number} beneficiaryId
 * @returns {Promise<Object>} { beneficiary, inventory: [] }
 */
export const getInventory = async (beneficiaryId) => {
  const response = await api.get(`/charity/beneficiaries/${beneficiaryId}/inventory`);
  return response.data;
};

/**
 * Add inventory item to a beneficiary
 * @param {number} beneficiaryId
 * @param {Object} data - { item_name, quantity?, notes? }
 * @returns {Promise<Object>} { message, item }
 */
export const addInventoryItem = async (beneficiaryId, data) => {
  const response = await api.post(`/charity/beneficiaries/${beneficiaryId}/inventory`, data);
  return response.data;
};

/**
 * Delete an inventory item
 * @param {number} itemId
 * @returns {Promise<Object>} { message }
 */
export const deleteInventoryItem = async (itemId) => {
  const response = await api.delete(`/charity/inventory/${itemId}`);
  return response.data;
};
