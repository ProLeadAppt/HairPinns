import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEARCH_ROOTS = ['src', 'public', 'scripts'];
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.txt', '.html', '.toml', '.xml']);

async function textFiles(relativeDir) {
  const absoluteDir = path.join(ROOT, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) files.push(...await textFiles(relativePath));
    else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) files.push(relativePath);
  }
  return files;
}

const files = (await Promise.all(SEARCH_ROOTS.map(textFiles))).flat();
const corpus = [];
for (const relativePath of files) {
  corpus.push({ relativePath, text: await readFile(path.join(ROOT, relativePath), 'utf8') });
}

function occurrences(pattern, { exclude = [] } = {}) {
  const effectiveExclusions = ['scripts/quality-regression.mjs', 'scripts\\quality-regression.mjs', ...exclude];
  return corpus
    .filter(({ relativePath }) => {
      const normalizedPath = relativePath.replaceAll('\\', '/');
      return !effectiveExclusions.some((value) => normalizedPath.endsWith(value.replaceAll('\\', '/')));
    })
    .filter(({ text }) => pattern.test(text))
    .map(({ relativePath }) => relativePath);
}

const businessConfig = await readFile(path.join(ROOT, 'src/config/businessConfig.ts'), 'utf8');
assert.match(businessConfig, /display:\s*["']0416 037 663["']/);
assert.match(businessConfig, /raw:\s*["']\+61416037663["']/);
assert.match(businessConfig, /tel:\s*["']tel:\+61416037663["']/);

assert.deepEqual(
  occurrences(/(?:\+61[-\s]*468[-\s]*093[-\s]*991|0468\s*093\s*991|61468093991)/),
  [],
  'Stale non-GBP phone number remains in source or public content',
);

assert.deepEqual(
  occurrences(/Composite of client feedback|real quote to be added before publish/i),
  [],
  'Published placeholder or composite-review copy remains',
);

assert.deepEqual(
  occurrences(/synthesiseCompareAt/, { exclude: ['src/lib/utils.ts'] }),
  [],
  'UI still synthesises an unverified comparison price',
);

assert.deepEqual(
  occurrences(/searchatlas|sa\.searchatlas\.com|dashboard\.searchatlas\.com/i, {
    exclude: ['.hermes/plans/2026-07-15_102209-hair-pinns-10x-audit-and-roadmap.md'],
  }),
  [],
  'SearchAtlas remains in deployable source',
);

assert.deepEqual(
  occurrences(/\/services#(?:colour|cuts|mid-length-straight-up-smoothing)(?=["'])/),
  [],
  'Broken service fragments remain in source or public content',
);

const searchResults = await readFile(path.join(ROOT, 'src/pages/SearchResults.tsx'), 'utf8');
assert.match(searchResults, /<SEOHead[\s\S]*?noIndex=\{true\}/, 'Internal search must be noindex');

const sitemapGenerator = await readFile(path.join(ROOT, 'scripts/generate-sitemap.js'), 'utf8');
assert.doesNotMatch(sitemapGenerator, /urls\.push\(url\(`\$\{BASE\}\/search/);
assert.doesNotMatch(sitemapGenerator, /urls\.push\(url\(`\$\{BASE\}\/(?:llms|llm|humans|ai|\.well-known)/);
assert.match(sitemapGenerator, /canonicalSiteUrl/, 'Sitemap URLs must use the canonical trailing-slash helper');

const seoHead = await readFile(path.join(ROOT, 'src/components/SEOHead.tsx'), 'utf8');
assert.match(seoHead, /canonicalSiteUrl/, 'SEOHead must normalize canonical and Open Graph URLs');
assert.match(seoHead, /canonicalizeSchemaUrls/, 'SEOHead must normalize same-site schema URLs');

const prerender = await readFile(path.join(ROOT, 'scripts/prerender.mjs'), 'utf8');
assert.match(prerender, /canonicalizeInternalHref/, 'Prerendered internal links must use trailing slashes');
assert.match(prerender, /throw new Error\(`Prerender failed/, 'Any missing prerender route must fail the build');

const routeCollector = await readFile(path.join(ROOT, 'scripts/collect-prerender-routes.js'), 'utf8');
assert.doesNotMatch(routeCollector, /collectionHandles = \['juuce', 'qiqi', 'pure'/, 'Stale collection fallbacks must not be prerendered');
assert.match(routeCollector, /juuce-botanicals/, 'Current Shopify collection handles must be guarded');
assert.doesNotMatch(routeCollector, /available_for_sale:true/, 'Sold-out Shopify products must remain routable');

const sitemapXml = await readFile(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
for (const handle of [
  'aromaganic-curly-curl-hair-curly-hair-conditioner',
  'aromaganic-curly-curl-hair-curly-hair-shampoo',
  'juuce-sea-air-mist-beachy',
]) {
  assert.match(sitemapXml, new RegExp(`/products/${handle}/`), `Sold-out product missing from sitemap: ${handle}`);
}

const appSource = await readFile(path.join(ROOT, 'src/App.tsx'), 'utf8');
const exactRouterPaths = [...appSource.matchAll(/<Route\s+path="(\/[^"]*)"/g)]
  .map((match) => match[1])
  .filter((route) => !route.includes(':') && route !== '/*');
const staticPageBlock = routeCollector.match(/const staticPages = \[([\s\S]*?)\];/)?.[1] || '';
const prerenderedExactPaths = new Set([...staticPageBlock.matchAll(/['"](\/[^'"]*)['"]/g)].map((match) => match[1]));
const intentionallyPrivatePaths = new Set(['/dev/collections', '/dev/shopify', '/500']);

const schemaSource = await readFile(path.join(ROOT, 'src/lib/schema.ts'), 'utf8');
assert.match(schemaSource, /shippingDestination:[\s\S]*?addressCountry:\s*'AU'/, 'Product schema must restrict shipping to Australia');
assert.match(schemaSource, /eligibleRegion:[\s\S]*?name:\s*'Australia'/, 'Product offers must be Australia-only');
assert.match(schemaSource, /applicableCountry:\s*'AU'/, 'Merchant return policy must be scoped to Australia');

const indexHtml = await readFile(path.join(ROOT, 'index.html'), 'utf8');
assert.doesNotMatch(indexHtml, /searchatlas|sa\.searchatlas\.com|dashboard\.searchatlas\.com/i, 'SearchAtlas loader remains in index.html');

const netlify = await readFile(path.join(ROOT, 'netlify.toml'), 'utf8');
assert.doesNotMatch(netlify, /searchatlas|sa\.searchatlas\.com|dashboard\.searchatlas\.com/i, 'SearchAtlas remains in CSP');
const netlifyExactFromPaths = new Set(
  [...netlify.matchAll(/from\s*=\s*"(\/[^"]+)"/g)]
    .map((match) => match[1])
    .filter((route) => !route.includes('*') && !route.includes(':')),
);
for (const route of exactRouterPaths) {
  assert.ok(
    prerenderedExactPaths.has(route) || netlifyExactFromPaths.has(route) || intentionallyPrivatePaths.has(route),
    `Public router path is neither prerendered nor explicitly rewritten: ${route}`,
  );
}
assert.match(netlify, /from\s*=\s*"\/suburbs\/\*"[\s\S]*?status\s*=\s*301/, 'Legacy suburb routes need an edge redirect');
for (const operationalPath of ['/confirm', '/order-confirmation', '/reviews/feedback', '/reviews/google']) {
  const escaped = operationalPath.replaceAll('/', '\\/');
  assert.match(
    netlify,
    new RegExp(`from\\s*=\\s*"${escaped}"[\\s\\S]*?to\\s*=\\s*"\\/index\\.html"[\\s\\S]*?status\\s*=\\s*200`),
    `Operational route needs an SPA rewrite: ${operationalPath}`,
  );
}
assert.match(
  netlify,
  /from\s*=\s*"\/\*"[\s\S]*?to\s*=\s*"\/404\.html"[\s\S]*?status\s*=\s*404/,
  'Unknown routes must return a real 404 response',
);

console.log(`Quality regression checks passed across ${files.length} files.`);
