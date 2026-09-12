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
  if (!variant?.availableForSale) {
    return { canPurchase: false, label: "Sold out", schema: "OutOfStock" };
  }

  // Shopify gift cards and other digital products are not inventory-backed.
  // A zero quantity therefore means "not tracked", not "on backorder".
  if (variant.requiresShipping === false) {
    return { canPurchase: true, label: "Available online", schema: "InStock" };
  }

  if (typeof variant.quantityAvailable === "number" && variant.quantityAvailable <= 0) {
    return { canPurchase: true, label: "Available to order", schema: "BackOrder" };
  }

  return { canPurchase: true, label: "Available online", schema: "InStock" };
}
