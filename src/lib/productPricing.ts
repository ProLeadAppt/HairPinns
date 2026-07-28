export interface PrimaryVariantPricing {
  price: number;
  originalPrice?: number;
  currency: string;
  variantId?: string;
}

const parseAmount = (amount?: string): number | undefined => {
  if (!amount) return undefined;
  const value = Number.parseFloat(amount);
  return Number.isFinite(value) ? value : undefined;
};

export const getPrimaryVariantPricing = (product: any): PrimaryVariantPricing => {
  const firstVariant = product.variants?.edges?.[0]?.node;
  const variantPrice = parseAmount(firstVariant?.price?.amount);
  const rangePrice = parseAmount(product.priceRange?.minVariantPrice?.amount) ?? 0;
  const variantCompareAt = parseAmount(firstVariant?.compareAtPrice?.amount);
  const rangeCompareAt = parseAmount(product.compareAtPriceRange?.minVariantPrice?.amount);

  return {
    price: variantPrice ?? rangePrice,
    originalPrice: variantCompareAt ?? (variantPrice === undefined ? rangeCompareAt : undefined),
    currency:
      firstVariant?.price?.currencyCode ||
      product.priceRange?.minVariantPrice?.currencyCode ||
      "AUD",
    variantId: firstVariant?.id,
  };
};
