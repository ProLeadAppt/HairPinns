const GTIN_LENGTHS = new Set([8, 12, 13, 14]);

export interface VariantIdentifiers {
  sku?: string | null;
  barcode?: string | null;
  mpn?: { value?: string | null } | null;
  googleMpn?: { value?: string | null } | null;
}

export interface ProductIdentifierFields {
  sku?: string;
  gtin?: string;
  mpn?: string;
}

function cleanText(value?: string | null) {
  const text = value?.trim();
  return text || undefined;
}

/** Real catalogue identifiers only. A Shopify variant ID is not a SKU or GTIN. */
export function productIdentifiers(variant?: VariantIdentifiers | null): ProductIdentifierFields {
  const sku = cleanText(variant?.sku);
  const digits = (variant?.barcode || '').replace(/\D/g, '');
  const gtin = GTIN_LENGTHS.has(digits.length) ? digits : undefined;
  const mpn = cleanText(variant?.mpn?.value) || cleanText(variant?.googleMpn?.value);
  return {
    ...(sku ? { sku } : {}),
    ...(gtin ? { gtin } : {}),
    ...(mpn ? { mpn } : {}),
  };
}
