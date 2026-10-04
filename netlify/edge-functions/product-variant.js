import manifest from '../../shared/productVariantSnapshots.generated.js';
import { variantSnapshotTarget } from '../../shared/productVariantSnapshots.js';
import { isRetiredProductHandle } from '../../scripts/retired-products.js';

export default function productVariant(request, context) {
  const url = new URL(request.url);
  const target = variantSnapshotTarget(url, manifest, request.method);
  if (!target) {
    const handle = url.pathname.match(/^\/products\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/)?.[1];
    if (!context || !['GET', 'HEAD'].includes(request.method) || !handle || isRetiredProductHandle(handle)) return;
    return newlyPublishedProduct(request, context, handle);
  }
  url.pathname = target;
  url.search = '';
  // Same-site rewrite retains the visitor's variant and marketing URL.
  return url;
}

async function newlyPublishedProduct(request, context, handle) {
  // Leave built pages, legacy redirects and non-404 errors untouched.
  const response = await context.next();
  if (response.status !== 404) return response;
  const env = globalThis.Netlify?.env;
  const token = env?.get('SF_STOREFRONT_TOKEN') || env?.get('VITE_SF_STOREFRONT_TOKEN');
  const domain = env?.get('SHOPIFY_MYSHOPIFY_DOMAIN') || env?.get('VITE_SHOPIFY_MYSHOPIFY_DOMAIN');
  const version = env?.get('SF_API_VERSION') || env?.get('VITE_SF_API_VERSION') || '2026-07';
  if (!token || !/^[a-z0-9-]+\.myshopify\.com$/i.test(domain || '') || !/^\d{4}-\d{2}$/.test(version)) return response;
  try {
    const catalogue = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({ query: 'query PublicProductRoute($handle: String!) { product(handle: $handle) { id } }', variables: { handle } }),
      signal: AbortSignal.timeout(3000),
    });
    if (!catalogue.ok) return response;
    const result = await catalogue.json();
    if (result.errors?.length || !/^gid:\/\/shopify\/Product\/\d+$/.test(result.data?.product?.id || '')) return response;
    // A same-site rewrite retains variant/tracking parameters in the visitor URL.
    // Never turn a nonexistent or unpublished product into a soft 404.
    const shell = new URL('/_product-shell.html', request.url);
    return shell;
  } catch {
    return response;
  }
}

// Netlify's manifest validator does not accept HEAD in its method enum.
// The handler gates GET/HEAD itself and leaves every other method untouched.
export const config = { path: '/products/*' };
