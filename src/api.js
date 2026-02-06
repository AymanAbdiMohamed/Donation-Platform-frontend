/**
 * API Module – Backwards Compatibility Layer
 *
 * ⚠️ DEPRECATED
 * This file exists ONLY to support legacy imports.
 *
 * New code MUST import from:
 *   - ./api/axios
 *   - ./api/auth
 *   - ./api/charity
 *   - ./api/admin
 *
 * Example:
 *   import { loginUser } from '@/api/auth'
 *   import { getCharities } from '@/api/charity'
 *   import { approveApplication } from '@/api/admin'
 *
 * Old pages in /pages/ will be removed once
 * /pages/{role}/ dashboards are fully stable.
 */

// Axios instance
export { default as api } from "./api/axios"

// Auth APIs
export * from "./api/auth"

// Charity APIs
export * from "./api/charity"

// Admin APIs
export * from "./api/admin"

// Default export for legacy usage
export { default } from "./api/axios"
