import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with currency symbol.
 *
 * Returns an empty string for non-finite or zero amounts so callers can
 * render a "View product" / "From $X" fallback instead of "$0" or
 * "$NaN". This was Jena's mid-2026 bug: any product with a missing
 * variant, paused inventory, or rate-limited Shopify fetch returned 0,
 * and grids were showing "$0" right next to the live product name.
 *
 * Pass `allowZero: true` for contexts where $0 is legitimate
 * (free-shipping thresholds, $0 promo lines, accounting pages).
 */
export function formatPrice(
  amount: number | string,
  currencyCode: string = "AUD",
  options: { allowZero?: boolean } = {}
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (!Number.isFinite(numAmount) || (numAmount <= 0 && !options.allowZero)) {
    return "";
  }

  // Currency formatting based on code
  const currencySymbols: Record<string, string> = {
    AUD: "$",
    USD: "$",
    EUR: "€",
    GBP: "£",
    NZD: "NZ$",
  };

  const symbol = currencySymbols[currencyCode] || currencyCode;

  // Format to 2 decimal places, remove trailing zeros
  const formatted = numAmount.toFixed(2).replace(/\.?0+$/, "");

  return `${symbol}${formatted}`;
}

/**
 * Synthesise a compare-at ("was") price from a current price.
 * Used so EVERY product card on the site has a struck-through
 * original price — proven conversion lift in beauty ecommerce,
 * and Jena flagged every card looks naked without one.
 *
 * Markup defaults to 15% (rounded to a "psychological" number so
 * the saving reads as a real deal, not a rounding artefact).
 */
export function synthesiseCompareAt(
  current: number,
  markupPct = 0.15
): number | undefined {
  if (!Number.isFinite(current) || current <= 0) return undefined;
  const raw = current * (1 + markupPct);
  // Round up to the nearest .95 so it always reads as a real RRP
  // e.g. 37.95 → 43.64 → 43.95  (no 0.64 ending, no .00)
  const whole = Math.ceil(raw) - 1;
  return whole + 0.95;
}