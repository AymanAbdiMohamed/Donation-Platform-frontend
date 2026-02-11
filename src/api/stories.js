/**
 * Stories API service
 * Handles beneficiary story operations for charities and public viewing
 */
import api from './axios';

/**
 * Get published stories (public)
 * @param {Object} params - { page, per_page, charity_id }
 * @returns {Promise<Object>} { stories: [], pagination: {} }
 */
export const getPublicStories = async (params = {}) => {
  const response = await api.get('/stories', { params });
  return response.data;
};

/**
 * Get a single published story (public)
 * @param {number} storyId
 * @returns {Promise<Object>} { story: {} }
 */
export const getPublicStory = async (storyId) => {
  const response = await api.get(`/stories/${storyId}`);
  return response.data;
};

/**
 * Get charity's own stories
 * @returns {Promise<Object>} { stories: [] }
 */
export const getCharityStories = async () => {
  const response = await api.get('/charity/stories');
  return response.data;
};

/**
 * Create a new story
 * @param {Object} data - { title, content, image_path?, is_published? }
 * @returns {Promise<Object>} { message, story }
 */
export const createStory = async (data) => {
  const response = await api.post('/charity/stories', data);
  return response.data;
};

/**
 * Update a story
 * @param {number} storyId
 * @param {Object} data - { title?, content?, image_path?, is_published? }
 * @returns {Promise<Object>} { message, story }
 */
export const updateStory = async (storyId, data) => {
  const response = await api.put(`/charity/stories/${storyId}`, data);
  return response.data;
};

/**
 * Delete a story
 * @param {number} storyId
 * @returns {Promise<Object>} { message }
 */
export const deleteStory = async (storyId) => {
  const response = await api.delete(`/charity/stories/${storyId}`);
  return response.data;
};
