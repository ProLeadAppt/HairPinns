/**
 * Collect all routes that should be prerendered at build time.
 * Used by vite.config.ts to feed vite-plugin-prerender.
 * Reads dynamic slugs from data files + Shopify API.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SERVICE_ROUTES } from './service-routes.js';
import { isIndexableRoute } from './route-policy.js';
import { parseLocationSlugs } from './sitemap-utils.js';
import { excludeRetiredProductHandles } from './retired-products.js';
import {
  CHRISTMAS_PRODUCTS,
  PUBLIC_COLLECTION_HANDLES,
} from '../src/config/commerceNavigation.data.js';
import { collectShopifyConnection } from './shopify-pagination.js';
import {
  readShopifyRouteCache,
  writeShopifyRouteCache,
} from './shopify-route-cache.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load .env if present
if (existsSync(resolve(root, '.env'))) {
  const env = readFileSync(resolve(root, '.env'), 'utf8');
  env.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[match[1].trim()] = val;
    }
  });
}

function extractObjectKeys(filePath) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf8');
  return [...(content.match(/"([a-z0-9-]+)":\s*\{/g) || [])]
    .map((m) => m.replace(/"([a-z0-9-]+)":\s*\{/, '$1'))
    .filter((s) => s.length > 1);
}

function extractBlogSlugs(filePath) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf8');
  return [...(content.match(/slug:\s*["']([^"']+)["']/g) || [])]
    .map((m) => m.replace(/slug:\s*["']([^"']+)["']/, '$1'))
    .filter((s) => s.length > 2);
}

async function fetchShopifyHandles(type) {
  const cachedHandles = readShopifyRouteCache(type);
  if (cachedHandles) return cachedHandles;

  const domain = process.env.VITE_SHOPIFY_MYSHOPIFY_DOMAIN || 'femtat-zu.myshopify.com';
  const token = process.env.VITE_SF_STOREFRONT_TOKEN || '';
  const version = process.env.VITE_SF_API_VERSION || '2026-07';
  if (!token) {
    const configuredKeys = Object.keys(process.env).filter((key) => key.startsWith('VITE_SF_') || key.startsWith('VITE_SHOPIFY_'));
    throw new Error(`[prerender] Missing Shopify Storefront token while collecting ${type}. Configured keys: ${configuredKeys.join(', ') || 'none'}`);
  }

  const query = `query catalogueHandles($after: String) {
    ${type}(first: 100, after: $after) {
      edges { node { handle } }
      pageInfo { hasNextPage endCursor }
    }
  }`;

  const nodes = await collectShopifyConnection(async (after) => {
    let res;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
          },
          body: JSON.stringify({ query, variables: { after } }),
        });
        if (res.ok || attempt === 3) break;
      } catch (error) {
        if (attempt === 3) throw error;
      }
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250 * (2 ** (attempt - 1))));
    }
    if (!res) throw new Error(`[prerender] Shopify ${type} request produced no response`);
    if (!res.ok) throw new Error(`[prerender] Shopify ${type} request failed with HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) {
      throw new Error(`[prerender] Shopify ${type} query failed: ${json.errors.map((error) => error.message).join('; ')}`);
    }
    return json.data?.[type];
  }, type);

  const handles = nodes.map((node) => node.handle).filter(Boolean);

  writeShopifyRouteCache({ [type]: handles });
  return handles;
}

export async function collectRoutes() {
  const routes = [];

  const staticPages = [
    '/', '/about', '/blog', '/contact', '/services', '/booking',
    '/faq', '/glossary', '/reviews', '/areas', '/collections', '/search',
    '/offers/free-extra',
    '/privacy', '/terms', '/policies/shipping', '/policies/returns',
    '/sitemap', '/404',
  ];
  routes.push(...staticPages);

  const locationSource = readFileSync(resolve(root, 'src/data/locationPages.ts'), 'utf8');
  const areaSlugs = parseLocationSlugs(locationSource);
  areaSlugs.forEach((slug) => routes.push(`/areas/${slug}`));

  // /near/<slug> routes are deprecated (301 → /areas/<slug>-<postcode> in
  // netlify.toml). Skipping prerender + sitemap so we don't ship static HTML
  // for URLs that immediately redirect. The React route still resolves
  // locally for the few internal links that haven't been migrated.

  const blogSlugs = [...new Set(extractBlogSlugs(resolve(root, 'src/data/blogSummaries.ts')))];
  blogSlugs
    .map((slug) => `/blog/${slug}`)
    .filter(isIndexableRoute)
    .forEach((route) => routes.push(route));

  // State-level shipping landing pages — one per AU state/territory. Auto-
  // discovered from src/data/shippingStates.ts so adding a new entry there
  // automatically gets the page prerendered.
  const stateSlugs = [...new Set(extractObjectKeys(resolve(root, 'src/data/shippingStates.ts')))];
  stateSlugs.forEach((slug) => routes.push(`/shipping-to/${slug}`));

  // City-level shipping landing pages — capital cities + major regional
  // hubs. Same /shipping-to/ route, lookup in ShippingStatePage resolves
  // cities first then states. Auto-discovered from shippingCities.ts.
  const citySlugs = [...new Set(extractObjectKeys(resolve(root, 'src/data/shippingCities.ts')))];
  citySlugs.forEach((slug) => routes.push(`/shipping-to/${slug}`));

  SERVICE_ROUTES.forEach(([cat, svc]) => routes.push(`/services/${cat}/${svc}`));

  const collectionHandles = await fetchShopifyHandles('collections');
  const missingRequiredCollections = PUBLIC_COLLECTION_HANDLES.filter((handle) => !collectionHandles.includes(handle));
  if (missingRequiredCollections.length > 0) {
    throw new Error(`[prerender] Required Shopify collections are missing: ${missingRequiredCollections.join(', ')}`);
  }
  collectionHandles.forEach((h) => routes.push(`/collections/${h}`));

  const productHandles = excludeRetiredProductHandles(await fetchShopifyHandles('products'));
  const missingChristmasProducts = CHRISTMAS_PRODUCTS
    .map((product) => product.handle)
    .filter((handle) => !productHandles.includes(handle));
  if (missingChristmasProducts.length > 0) {
    throw new Error(`[prerender] Required Christmas products are missing: ${missingChristmasProducts.join(', ')}`);
  }
  productHandles.forEach((h) => routes.push(`/products/${h}`));

  const publicRoutes = [...new Set(routes)].filter(isIndexableRoute);
  console.log(`[prerender] Collected ${publicRoutes.length} routes for prerendering`);
  return publicRoutes;
}

// Allow running standalone for debugging
if (process.argv[1] && process.argv[1].includes('collect-prerender-routes')) {
  collectRoutes().then((routes) => {
    routes.forEach((r) => console.log(r));
  });
}
