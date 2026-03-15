/**
 * Promotions config for stocktake sale and ongoing offers.
 * Used by Header promo strip and optional homepage banners.
 */

/** Stocktake sale ends 11:30pm AEDT, 31 March */
export const STOCKTAKE_END_DATE = new Date("2025-03-31T23:30:00+11:00");

export function isStocktakeActive(): boolean {
  return new Date() < STOCKTAKE_END_DATE;
}

/** QIQI 20% off — permanent (for now) */
export const QIQI_DISCOUNT_ACTIVE = true;

/** Collection handles for promo links — must match Shopify collection handles exactly */
export const PROMO_COLLECTIONS = {
  /** Pure Lamellar — do not change; must match Shopify & what Jena uses */
  pureLamellar: "pure-lamellar",
  wetBrush: "wet-brush",
  qiqi: "qiqi",
} as const;

/** Header promo strip message when stocktake is active */
export const STOCKTAKE_HEADER_MESSAGE =
  "Stocktake Sale: 20% off Pure Lamellar | 15% off Wet Brush | Mystery gift with every order | Ends 31 March";

/** Default header message when no promos */
export const DEFAULT_HEADER_MESSAGE = "Free shipping on orders over $150";
