import { getProductAvailability } from "@/lib/productAvailability";

const amount = (value: unknown) => {
  const parsed = Number.parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Convert a Storefront collection product into a purchase-safe card model.
 * A collection card may quick-add only when Shopify proves the product has
 * exactly one variant. Multi-variant products always go to product options.
 */
export function mapCollectionProduct(product: any) {
  const variantEdges = product?.variants?.edges || [];
  const hasMultipleVariants = Boolean(product?.variants?.pageInfo?.hasNextPage) || variantEdges.length !== 1;
  const singleVariant = hasMultipleVariants ? null : variantEdges[0]?.node;
  const availableVariants = variantEdges.map((edge: any) => edge?.node).filter((variant: any) => variant?.availableForSale);

  const availability = singleVariant
    ? getProductAvailability(singleVariant)
    : !product?.availableForSale
      ? { canPurchase: false, label: "Sold out" as const, schema: "OutOfStock" as const }
      : !product?.variants?.pageInfo?.hasNextPage
        && availableVariants.length > 0
        && availableVariants.every((variant: any) => typeof variant.quantityAvailable === "number" && variant.quantityAvailable <= 0)
        ? { canPurchase: true, label: "Available to order" as const, schema: "BackOrder" as const }
        : { canPurchase: true, label: "Available online" as const, schema: "InStock" as const };

  const minimumPrice = product?.priceRange?.minVariantPrice;
  const maximumPrice = product?.priceRange?.maxVariantPrice;
  const displayPrice = singleVariant?.price || minimumPrice;
  const compareAt = singleVariant?.compareAtPrice || product?.compareAtPriceRange?.minVariantPrice;
  const numericPrice = amount(displayPrice?.amount);
  const numericCompareAt = amount(compareAt?.amount);
  const firstImage = product?.images?.edges?.[0]?.node;

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: numericPrice,
    currency: displayPrice?.currencyCode || "AUD",
    originalPrice: numericCompareAt > numericPrice ? numericCompareAt : undefined,
    pricePrefix: hasMultipleVariants && amount(maximumPrice?.amount) > amount(minimumPrice?.amount) ? "From " : "",
    image: firstImage?.url || "/placeholder.svg",
    availableForSale: availability.canPurchase,
    availability,
    hasMultipleVariants,
    variantCount: product?.variants?.pageInfo?.hasNextPage ? `${variantEdges.length}+` : String(variantEdges.length),
    quickAddVariantId: singleVariant?.id || null,
    quickAddVariantTitle: singleVariant?.title || null,
  };
}
