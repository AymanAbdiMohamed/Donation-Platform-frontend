import axios from "axios";

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
 *   - ./api/donor
 *
 * Example:
 *   import { loginUser } from '@/api/auth'
 *   import { getCharities } from '@/api/charity'
 *   import { approveApplication } from '@/api/admin'
 *   import { createDonation } from '@/api/donor'
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

// Donor APIs
export * from "./api/donor"

// Admin APIs
export * from "./api/admin"

// Default export for legacy usage
export { default } from "./api/axios"

