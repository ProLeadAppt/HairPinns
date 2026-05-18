/**
 * Generate sitemap.xml at build time
 * Includes: static pages, location/area pages, blog posts, Shopify products & collections
 * Run before build: npm run generate-sitemap (or as prebuild)
 */
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { SERVICE_ROUTES } from './service-routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/**
 * Get the most recent commit date for a file. Falls back to today if
 * the file isn't tracked or git fails.
 */
function gitLastMod(relativePath) {
  try {
    const result = execSync(
      `git log -1 --format=%cd --date=short -- "${relativePath}"`,
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    return result || new Date().toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// Load .env if present (for local builds)
if (existsSync(resolve(root, '.env'))) {
  const { readFileSync } = await import('fs');
  const env = readFileSync(resolve(root, '.env'), 'utf8');
  env.split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && process.env[match[1].trim()] === undefined) {
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[match[1].trim()] = val;
    }
  });
}

const BASE = 'https://hairpinns.com';
const today = new Date().toISOString().split('T')[0];

function url(loc, changefreq = 'weekly', priority = 0.8, lastmod = today) {
  return { loc, changefreq, priority, lastmod };
}

async function fetchShopify(query, variables = {}) {
  const domain = process.env.VITE_SHOPIFY_MYSHOPIFY_DOMAIN || 'femtat-zu.myshopify.com';
  const token = process.env.VITE_SF_STOREFRONT_TOKEN || '';
  const version = process.env.VITE_SF_API_VERSION || '2025-01';
  if (!token) return null;
  const endpoint = `https://${domain}/api/${version}/graphql.json`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.warn('[sitemap] Shopify API errors:', json.errors);
    return null;
  }
  return json.data;
}

async function getShopifyProducts() {
  const data = await fetchShopify(`
    query { products(first: 250, query: "available_for_sale:true") {
      edges { node { handle } }
    }}
  `);
  return data?.products?.edges?.map((e) => e.node.handle).filter(Boolean) || [];
}

async function getShopifyCollections() {
  const data = await fetchShopify(`
    query { collections(first: 50) {
      edges { node { handle } }
    }}
  `);
  return data?.collections?.edges?.map((e) => e.node.handle).filter(Boolean) || [];
}

async function main() {
  const urls = [];

  // Lastmod from git for static page files
  const idxMod = gitLastMod('src/pages/Index.tsx');
  const svcMod = gitLastMod('src/pages/Services.tsx');
  const aboutMod = gitLastMod('src/pages/About.tsx');
  const bookMod = gitLastMod('src/pages/Booking.tsx');
  const contactMod = gitLastMod('src/pages/Contact.tsx');
  const colMod = gitLastMod('src/pages/Collections.tsx');
  const blogIdxMod = gitLastMod('src/pages/Blog.tsx');
  const areasIdxMod = gitLastMod('src/pages/AreasIndex.tsx');
  const faqMod = gitLastMod('src/pages/FAQ.tsx');
  const reviewsMod = gitLastMod('src/pages/Reviews.tsx');
  const glossaryMod = gitLastMod('src/pages/Glossary.tsx');

  // Core pages
  urls.push(url(BASE, 'weekly', 1.0, idxMod));
  urls.push(url(`${BASE}/services`, 'weekly', 0.9, svcMod));
  urls.push(url(`${BASE}/about`, 'monthly', 0.8, aboutMod));
  urls.push(url(`${BASE}/booking`, 'weekly', 0.9, bookMod));
  urls.push(url(`${BASE}/contact`, 'monthly', 0.8, contactMod));
  urls.push(url(`${BASE}/collections`, 'weekly', 0.9, colMod));
  urls.push(url(`${BASE}/blog`, 'weekly', 0.8, blogIdxMod));
  urls.push(url(`${BASE}/search`, 'weekly', 0.7));
  urls.push(url(`${BASE}/areas`, 'monthly', 0.9, areasIdxMod));
  urls.push(url(`${BASE}/sitemap`, 'monthly', 0.5));
  urls.push(url(`${BASE}/reviews`, 'monthly', 0.7, reviewsMod));
  urls.push(url(`${BASE}/faq`, 'monthly', 0.8, faqMod));
  urls.push(url(`${BASE}/glossary`, 'monthly', 0.8, glossaryMod));

  // Service detail pages - high local intent, must be indexed.
  // Sourced from scripts/service-routes.js (shared with prerender script).
  const svcMod2 = gitLastMod('src/data/serviceDetails.ts');
  SERVICE_ROUTES.forEach(([cat, svc]) => {
    urls.push(url(`${BASE}/services/${cat}/${svc}`, 'monthly', 0.8, svcMod2));
  });

  // Collections - from Shopify or fallback to known
  let collectionHandles = await getShopifyCollections();
  if (collectionHandles.length === 0) {
    collectionHandles = ['juuce', 'qiqi', 'pure', 'wet-brush', 'treatments', 'styling', 'best-sellers-nov'];
  }
  collectionHandles.forEach((h) => {
    urls.push(url(`${BASE}/collections/${h}`, 'weekly', 0.8));
  });

  // Products from Shopify
  const productHandles = await getShopifyProducts();
  productHandles.forEach((h) => {
    urls.push(url(`${BASE}/products/${h}`, 'weekly', 0.8));
  });

  // Location pages (areas) - read from source
  const locPath = resolve(root, 'src/data/locationPages.ts');
  const locContent = existsSync(locPath) ? readFileSync(locPath, 'utf8') : '';
  const locMod = gitLastMod('src/data/locationPages.ts');
  const areaSlugs = [...(locContent.match(/"([a-z0-9-]+)":\s*\{/g) || [])].map((m) => m.replace(/"([a-z0-9-]+)":\s*\{/, '$1'));
  [...new Set(areaSlugs)].filter((s) => s.length > 1).forEach((slug) => {
    urls.push(url(`${BASE}/areas/${slug}`, 'monthly', 0.7, locMod));
  });

  // /near/<slug> routes are deprecated — they 301 to /areas/<slug>-<postcode>
  // via netlify.toml. The route still renders locally so the suburbPages.ts
  // data is preserved for future migration, but we no longer surface these
  // URLs to crawlers.

  // Blog posts - read slug from source
  const blogPath = resolve(root, 'src/data/blogPosts.ts');
  const blogContent = existsSync(blogPath) ? readFileSync(blogPath, 'utf8') : '';
  const blogMod = gitLastMod('src/data/blogPosts.ts');
  const blogSlugs = [...(blogContent.match(/slug:\s*["']([^"']+)["']/g) || [])].map((m) => m.replace(/slug:\s*["']([^"']+)["']/, '$1'));
  [...new Set(blogSlugs)].filter((s) => s.length > 2).forEach((slug) => {
    urls.push(url(`${BASE}/blog/${slug}`, 'monthly', 0.6, blogMod));
  });

  // State-by-state shipping landing pages — one per AU state/territory.
  // Source of truth: src/data/shippingStates.ts. High priority because
  // these are the entry points for "hair products delivered to <state>"
  // intent across the whole AU market.
  const statePath = resolve(root, 'src/data/shippingStates.ts');
  const stateContent = existsSync(statePath) ? readFileSync(statePath, 'utf8') : '';
  const stateMod = gitLastMod('src/data/shippingStates.ts');
  const stateSlugs = [...(stateContent.match(/"([a-z0-9-]+)":\s*\{\s*slug:/g) || [])].map((m) => m.replace(/"([a-z0-9-]+)":\s*\{\s*slug:/, '$1'));
  [...new Set(stateSlugs)].filter((s) => s.length > 1).forEach((slug) => {
    urls.push(url(`${BASE}/shipping-to/${slug}`, 'monthly', 0.8, stateMod));
  });

  // Policy pages
  urls.push(url(`${BASE}/policies/shipping`, 'monthly', 0.4));
  urls.push(url(`${BASE}/policies/returns`, 'monthly', 0.4));
  urls.push(url(`${BASE}/privacy`, 'yearly', 0.3));
  urls.push(url(`${BASE}/terms`, 'yearly', 0.3));

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outPath = resolve(root, 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`[sitemap] Generated ${urls.length} URLs → public/sitemap.xml`);
}

main().catch((err) => {
  console.error('[sitemap] Error:', err);
  process.exit(1);
});
