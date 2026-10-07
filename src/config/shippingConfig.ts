/**
 * Shipping configuration - single source of truth for free shipping threshold.
 * Used across shipping, trust, cart, and storefront surfaces.
 */

export const FREE_SHIPPING_THRESHOLD = 150;

export const FREE_SHIPPING_THRESHOLD_DISPLAY = `$${FREE_SHIPPING_THRESHOLD}`;

/** Existing policy estimates, verified at /policies/shipping/ on 2026-10-07.
 * Transit starts after dispatch; handling must be represented separately.
 * No express, cutoff or weekday schedule is inferred from these estimates.
 */
export const SHIPPING_HANDLING_TIME = { minValue: 1, maxValue: 2 } as const;
export const STANDARD_SHIPPING_TRANSIT_TIME = {
  NSW: { minValue: 1, maxValue: 3 },
  VIC: { minValue: 3, maxValue: 5 },
  QLD: { minValue: 3, maxValue: 5 },
  WA: { minValue: 5, maxValue: 8 },
  SA: { minValue: 4, maxValue: 6 },
  TAS: { minValue: 5, maxValue: 8 },
  ACT: { minValue: 2, maxValue: 4 },
  NT: { minValue: 6, maxValue: 10 },
} as const;

export function standardShippingDays(region: keyof typeof STANDARD_SHIPPING_TRANSIT_TIME): string {
  const { minValue, maxValue } = STANDARD_SHIPPING_TRANSIT_TIME[region];
  return `${minValue}–${maxValue}`;
}
