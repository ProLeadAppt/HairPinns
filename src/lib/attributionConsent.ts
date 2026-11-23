interface CustomerPrivacy {
  marketingAllowed?: () => boolean;
}

/** Marketing linkers follow an explicit denial. With no banner decision, Australia stays allowed. */
export function marketingAttributionAllowed(): boolean {
  if (typeof window === 'undefined') return true;
  const privacy = (window as Window & { Shopify?: { customerPrivacy?: CustomerPrivacy } }).Shopify?.customerPrivacy;
  if (typeof privacy?.marketingAllowed !== 'function') return true;
  try {
    return privacy.marketingAllowed() !== false;
  } catch {
    return true;
  }
}
