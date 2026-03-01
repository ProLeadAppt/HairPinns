/**
 * Featured product handles for homepage and best sellers sections.
 * Add Shopify product handles here to control which products are showcased.
 * Leave empty to fall back to default search/collection behavior.
 */

/**
 * Above-the-fold hero products (4 products in the hero grid).
 * When set, HeroHome fetches these specific products. Update when Jena provides her list.
 * Leave empty to fall back to searchProducts (may show duplicates).
 */
export const ABOVE_FOLD_HERO_PRODUCT_HANDLES: string[] = [
  "aromaganic-curly-curl-hair-shampoo-conditioner-duo",
  "solar-enz",
  "heat-shield",
  "walnut-scrub-hair-scalp-pre-wash-treatment",
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
