// Shared by the storefront and build-time snapshot validation.
// Preserve Shopify's existing sale, backorder and digital-inventory semantics.
export function resolveProductAvailability(variant) {
  if (!variant?.availableForSale) return { canPurchase: false, label: 'Sold out', schema: 'OutOfStock' };
  if (variant.requiresShipping === false) return { canPurchase: true, label: 'Available online', schema: 'InStock' };
  if (typeof variant.quantityAvailable === 'number' && variant.quantityAvailable <= 0) return { canPurchase: true, label: 'Available to order', schema: 'BackOrder' };
  return { canPurchase: true, label: 'Available online', schema: 'InStock' };
}
