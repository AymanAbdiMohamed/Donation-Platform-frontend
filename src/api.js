/**
 * API Module - Backwards Compatibility Layer
 * 
 * DEPRECATED: This file is maintained for backwards compatibility.
 * New code should import from './api/index.js' or specific service modules:
 * 
 * import { loginUser, registerUser, getMe } from './api';
 * import { getCharities, submitCharityApplication } from './api';
 * import { getPendingApplications, approveApplication, rejectApplication } from './api';
 * 
 * The old pages (CharityDashboard.jsx, AdminDashboard.jsx, etc.) in /pages/
 * will be removed once the new pages in /pages/{role}/ are verified working.
 */

// Re-export everything from the new API modules
export { default as api } from './api/axios';
export * from './api/auth';
export * from './api/charity';
export * from './api/admin';

// Default export for direct api access
export { default } from './api/axios';
