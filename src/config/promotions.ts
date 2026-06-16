/**
 * Promotions config for stocktake sale and ongoing offers.
 * Used by Header promo strip and optional homepage banners.
 */

/** Stocktake sale ended 11:30pm AEDT, 31 March 2025 — kept for archive, no longer active. */
export const STOCKTAKE_END_DATE = new Date("2025-03-31T23:30:00+11:00");

export function isStocktakeActive(): boolean {
  return new Date() < STOCKTAKE_END_DATE;
}

/** QIQI 20% off — permanent (for now) */
export const QIQI_DISCOUNT_ACTIVE = true;

/**
 * Shampoo + 50% off Conditioner offer — site-wide headline promotion.
 * Set SHAMPOO_CONDITIONER_OFFER_ACTIVE = false to hide it.
 * Shop link should point to a collection that actually shows both
 * shampoo and conditioner options.
 */
export const SHAMPOO_CONDITIONER_OFFER_ACTIVE = true;

export const SHAMPOO_CONDITIONER_HEADLINE = "Buy any Shampoo — get 50% off Conditioner";

export const SHAMPOO_CONDITIONER_HEADER_MESSAGE =
  "💧 Buy any Shampoo — get 50% off Conditioner | Sitewide";

/**
 * Target a collection that actually shows both shampoo and conditioner options.
 * The `shampoos` collection handle is NOT valid in Shopify (404s) — Juuce Botanical
 * is the broadest hair-care collection with both, so it’s the right destination
 * for the "buy any shampoo, get 50% off conditioner" CTA.
 */
export const SHAMPOO_COLLECTION_HANDLE = "juuce-botanicals";

/** Collection handles for promo links — must match Shopify collection handles exactly */
export const PROMO_COLLECTIONS = {
  /** Pure Lamellar — do not change; must match Shopify & what Jena uses */
  pureLamellar: "pure-lamellar",
  wetBrush: "wet-brush",
  qiqi: "qiqi",
  shampoos: SHAMPOO_COLLECTION_HANDLE,
} as const;

/** Header promo strip message when stocktake is active (legacy) */
export const STOCKTAKE_HEADER_MESSAGE =
  "Stocktake Sale: 20% off Pure Lamellar | 15% off Wet Brush | Mystery gift with every order | Ends 31 March";

/** Default header message when no promos */
export const DEFAULT_HEADER_MESSAGE = "Free shipping on orders over $150";
