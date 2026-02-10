/**
 * Currency formatting helpers.
 *
 * ⚠️ TEAM DECISION NEEDED: The platform currently mixes "$" (donor dashboard,
 * receipts) with "KES" (donation modal).  This helper centralises the choice
 * so only one file needs to change once the team picks a symbol/format.
 *
 * Current default: "KES" (Kenyan Shilling) to match the M-Pesa flow.
 */

const CURRENCY_SYMBOL = "KES";

/**
 * Format a monetary value for display.
 *
 * @param {number} amount  - The amount (already in the display unit, e.g. dollars/shillings).
 * @param {object} [opts]
 * @param {number} [opts.decimals=2]      - Decimal places.
 * @param {string} [opts.symbol]          - Override the default symbol.
 * @returns {string} e.g. "KES 1,250.00"
 */
export function formatCurrency(amount, { decimals = 2, symbol = CURRENCY_SYMBOL } = {}) {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol} ${formatted}`;
}

/**
 * Shorthand that omits decimals when they are .00
 * Useful for stat cards where "KES 1,250" reads better than "KES 1,250.00".
 */
export function formatCurrencyCompact(amount, opts = {}) {
  const num = Number(amount) || 0;
  const hasDecimals = num % 1 !== 0;
  return formatCurrency(amount, { decimals: hasDecimals ? 2 : 0, ...opts });
}
