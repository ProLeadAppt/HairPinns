/**
 * Collect all routes that should be prerendered at build time.
 * Used by vite.config.ts to feed vite-plugin-prerender.
 * Reads dynamic slugs from data files + Shopify API.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SERVICE_ROUTES } from './service-routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load .env if present
if (existsSync(resolve(root, '.env'))) {
  const env = readFileSync(resolve(root, '.env'), 'utf8');
  env.split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && process.env[match[1].trim()] === undefined) {
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
  const domain = process.env.VITE_SHOPIFY_MYSHOPIFY_DOMAIN || 'femtat-zu.myshopify.com';
  const token = process.env.VITE_SF_STOREFRONT_TOKEN || '';
  const version = process.env.VITE_SF_API_VERSION || '2025-01';
  if (!token) return [];

  const query = type === 'products'
    ? `query { products(first: 250, query: "available_for_sale:true") { edges { node { handle } } } }`
    : `query { collections(first: 50) { edges { node { handle } } } }`;

  try {
    const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    const edges = type === 'products' ? json.data?.products?.edges : json.data?.collections?.edges;
    return (edges || []).map((e) => e.node.handle).filter(Boolean);
  } catch {
    return [];
  }
}

export async function collectRoutes() {
  const routes = [];

  const staticPages = [
    '/', '/about', '/blog', '/contact', '/services', '/booking',
    '/faq', '/glossary', '/reviews', '/areas', '/collections', '/search',
    '/privacy', '/terms', '/policies/shipping', '/policies/returns',
    '/sitemap', '/404',
  ];
  routes.push(...staticPages);

  const areaSlugs = [...new Set(extractObjectKeys(resolve(root, 'src/data/locationPages.ts')))];
  areaSlugs.forEach((slug) => routes.push(`/areas/${slug}`));

  // /near/<slug> routes are deprecated (301 → /areas/<slug>-<postcode> in
  // netlify.toml). Skipping prerender + sitemap so we don't ship static HTML
  // for URLs that immediately redirect. The React route still resolves
  // locally for the few internal links that haven't been migrated.

  const blogSlugs = [...new Set(extractBlogSlugs(resolve(root, 'src/data/blogPosts.ts')))];
  blogSlugs.forEach((slug) => routes.push(`/blog/${slug}`));

  SERVICE_ROUTES.forEach(([cat, svc]) => routes.push(`/services/${cat}/${svc}`));

  let collectionHandles = await fetchShopifyHandles('collections');
  if (collectionHandles.length === 0) {
    collectionHandles = ['juuce', 'qiqi', 'pure', 'wet-brush', 'treatments', 'styling', 'best-sellers-nov'];
  }
  collectionHandles.forEach((h) => routes.push(`/collections/${h}`));

  const productHandles = await fetchShopifyHandles('products');
  productHandles.forEach((h) => routes.push(`/products/${h}`));

  console.log(`[prerender] Collected ${routes.length} routes for prerendering`);
  return [...new Set(routes)];
}

// Allow running standalone for debugging
if (process.argv[1] && process.argv[1].includes('collect-prerender-routes')) {
  collectRoutes().then((routes) => {
    routes.forEach((r) => console.log(r));
  });
}
