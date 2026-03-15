/**
 * Featured product handles for homepage and best sellers sections.
 * Add Shopify product handles here to control which products are showcased.
 * Leave empty to fall back to default search/collection behavior.
 */

/**
 * Frizz-Free Must-Haves collection — products from this collection appear in the hero grid.
 * @see https://hairpinns.com/collections/frizz-free-must-haves
 */
export const FRIZZ_FREE_COLLECTION_HANDLE: string | null = "frizz-free-must-haves";

/**
 * Above-the-fold hero products (4 products in the hero grid).
 * Best seller = first in list. Frizz-Free products are merged in from FRIZZ_FREE_COLLECTION_HANDLE.
 */
export const ABOVE_FOLD_HERO_PRODUCT_HANDLES: string[] = [
  "walnut-scrub-hair-scalp-pre-wash-treatment", // Best Seller (first)
  "aromaganic-curly-curl-hair-shampoo-conditioner-duo",
  "solar-enz",
  "heat-shield",
];

/**
 * Best Sellers collection handle (optional).
 * When set, the Best Sellers section fetches products from this Shopify collection.
 * Jena can create this collection in Shopify admin and add products (e.g. "best-sellers-nov" for November).
 * Leave null to use FEATURED_PRODUCT_HANDLES or auto-detect a "best"/"featured"/"popular" collection.
 */
export const BEST_SELLERS_COLLECTION_HANDLE: string | null = "best-sellers-nov";

export const FEATURED_PRODUCT_HANDLES: string[] = [
  "aromaganic-curly-curl-hair-shampoo-conditioner-duo",
  // Add more handles as Jena provides them
];
