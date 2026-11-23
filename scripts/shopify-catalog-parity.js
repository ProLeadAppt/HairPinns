/**
 * Compare the public Online Store catalogue (products.json) with the
 * Storefront API catalogue used to prerender pages and generate the sitemap.
 *
 * Products published only to the Online Store channel appear at
 * femtat-zu.myshopify.com but 404 on hairpinns.com, because the headless
 * site and its 404-recovery edge function can only see Storefront products.
 */

const ONLINE_STORE_PAGE_SIZE = 250;
const ONLINE_STORE_MAX_PAGES = 20;

export function isShopifyDomain(domain) {
  return /^[a-z0-9-]+\.myshopify\.com$/i.test(domain || '');
}

export async function fetchOnlineStoreProducts(domain, fetchImpl = fetch) {
  if (!isShopifyDomain(domain)) {
    throw new Error(`Invalid Shopify domain: ${domain || '(empty)'}`);
  }
  const products = [];
  for (let page = 1; page <= ONLINE_STORE_MAX_PAGES; page += 1) {
    const res = await fetchImpl(`https://${domain}/products.json?limit=${ONLINE_STORE_PAGE_SIZE}&page=${page}`);
    if (!res.ok) {
      throw new Error(`Online Store products.json failed with HTTP ${res.status}`);
    }
    const data = await res.json();
    const batch = Array.isArray(data?.products) ? data.products : [];
    for (const product of batch) {
      if (product?.handle) {
        products.push({ handle: product.handle, title: product.title || product.handle });
      }
    }
    if (batch.length < ONLINE_STORE_PAGE_SIZE) break;
  }
  return products;
}

export function diffShopifyCatalogs({
  onlineStoreHandles = [],
  storefrontHandles = [],
  retiredHandles = [],
} = {}) {
  const online = new Set(onlineStoreHandles.filter(Boolean));
  const storefront = new Set(storefrontHandles.filter(Boolean));
  const retired = new Set(retiredHandles.filter(Boolean));
  return {
    missingFromStorefront: [...online].filter((handle) => !storefront.has(handle)).sort(),
    missingFromOnlineStore: [...storefront].filter((handle) => !online.has(handle)).sort(),
    retiredButLiveOnStorefront: [...retired].filter((handle) => storefront.has(handle)).sort(),
    retiredButLiveOnOnlineStore: [...retired].filter((handle) => online.has(handle)).sort(),
  };
}

export function formatCatalogParityWarnings(diff, titles = {}) {
  const label = (handle) => (titles[handle] ? `${handle} (${titles[handle]})` : handle);
  const warnings = [];
  if (diff.missingFromStorefront.length > 0) {
    warnings.push(
      `${diff.missingFromStorefront.length} Online Store product(s) are not visible to the Storefront API, so they cannot be prerendered, recovered from a 404, or added to the sitemap. Publish them to the Headless / Storefront sales channel: ${diff.missingFromStorefront.map(label).join(', ')}`,
    );
  }
  if (diff.missingFromOnlineStore.length > 0) {
    warnings.push(
      `${diff.missingFromOnlineStore.length} Storefront product(s) are missing from the public Online Store catalogue: ${diff.missingFromOnlineStore.map(label).join(', ')}`,
    );
  }
  if (diff.retiredButLiveOnStorefront.length > 0 || diff.retiredButLiveOnOnlineStore.length > 0) {
    const handles = [...new Set([
      ...diff.retiredButLiveOnStorefront,
      ...diff.retiredButLiveOnOnlineStore,
    ])].sort();
    warnings.push(
      `Retired handle(s) are still published in Shopify. Un-retire them on the site or unpublish them in Shopify: ${handles.map(label).join(', ')}`,
    );
  }
  return warnings;
}

export async function reportOnlineStoreParity({
  domain,
  storefrontHandles,
  retiredHandles = [],
  fetchImpl = fetch,
  log = console,
} = {}) {
  let online;
  try {
    online = await fetchOnlineStoreProducts(domain, fetchImpl);
  } catch (error) {
    log.warn(`[sitemap] Online Store catalogue check skipped: ${error.message}`);
    return null;
  }
  const titles = Object.fromEntries(online.map((product) => [product.handle, product.title]));
  const diff = diffShopifyCatalogs({
    onlineStoreHandles: online.map((product) => product.handle),
    storefrontHandles,
    retiredHandles,
  });
  const warnings = formatCatalogParityWarnings(diff, titles);
  warnings.forEach((message) => log.warn(`[sitemap] ${message}`));
  if (warnings.length === 0) {
    log.log(`[sitemap] Online Store and Storefront catalogues match (${storefrontHandles.length} product handles).`);
  }
  return diff;
}
