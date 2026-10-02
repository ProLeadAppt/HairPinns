import { resolveProductAvailability } from "../../shared/productAvailability.js";

export type ProductAvailabilitySchema = "InStock" | "BackOrder" | "OutOfStock";

export interface ShopifyVariantAvailability {
  availableForSale?: boolean | null;
  quantityAvailable?: number | null;
  requiresShipping?: boolean | null;
}

export interface ProductAvailabilityState {
  canPurchase: boolean;
  label: "Available online" | "Available to order" | "Sold out";
  schema: ProductAvailabilitySchema;
}

/**
 * Shopify can allow a zero-inventory variant to keep selling. Treating that
 * state as InStock is misleading, so it is exposed consistently as a
 * backorder while retaining Add to Bag.
 */
export function getProductAvailability(
  variant?: ShopifyVariantAvailability | null,
): ProductAvailabilityState {
  return resolveProductAvailability(variant) as ProductAvailabilityState;
}
