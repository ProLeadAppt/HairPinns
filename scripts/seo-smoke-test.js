/**
 * SEO smoke test for the prerendered build output.
 *
 * Scans every HTML file under `dist/` and asserts the basics that crawlers
 * (especially Bingbot, which doesn't reliably execute JS) need to see:
 *   - exactly one <h1>
 *   - a <title>
 *   - <meta name="description">
 *   - <link rel="canonical">
 *   - at least one <script type="application/ld+json">
 *
 * Output: console table of findings. Exits 0 always (non-blocking) so it
 * reports without breaking CI. To make it blocking, change the final
 * `process.exit(0)` to `process.exit(failures.length > 0 ? 1 : 0)`.
 *
 * Run after `vite build`:
 *   node scripts/seo-smoke-test.js
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

if (!existsSync(distDir)) {
  console.warn('[seo-smoke] dist/ not found. Run `vite build` first. Skipping.');
  process.exit(0);
}

// Find every index.html under dist/ (the prerendered route HTML).
// Uses git ls-files-style globbing via Node's built-in glob in Node 22+, but
// we fall back to a portable recursive walk for older runtimes.
import { readdirSync, statSync } from 'fs';

function walkHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // Skip asset bundles — we only care about route HTML.
      if (entry === 'assets' || entry === 'node_modules' || entry.startsWith('.')) continue;
      walkHtmlFiles(full, acc);
    } else if (entry === 'index.html' || entry === '404.html') {
      acc.push(full);
    }
  }
  return acc;
}

const htmlFiles = walkHtmlFiles(distDir);

if (htmlFiles.length === 0) {
  console.warn('[seo-smoke] No HTML files found in dist/. Did prerender run?');
  process.exit(0);
}

const findings = [];

for (const file of htmlFiles) {
  const route = '/' + relative(distDir, dirname(file)).replace(/\\/g, '/');
  const normalisedRoute = route === '/' || route === '/.' ? '/' : route;
  const html = readFileSync(file, 'utf8');

  // Skip the noindex 404 page from "missing canonical" complaints.
  const noIndex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const hasTitle = /<title>[^<]+<\/title>/i.test(html);
  const hasDescription = /<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html);
  const hasCanonical = /<link\s+rel=["']canonical["']\s+href=["']https?:[^"']+["']/i.test(html);
  const jsonLdCount = (html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi) || []).length;

  const issues = [];
  if (h1Count === 0) issues.push('no <h1>');
  if (h1Count > 1) issues.push(`${h1Count} <h1>s`);
  if (!hasTitle) issues.push('no <title>');
  if (!hasDescription) issues.push('no meta description');
  if (!hasCanonical && !noIndex) issues.push('no canonical');
  if (jsonLdCount === 0 && !noIndex) issues.push('no JSON-LD');

  findings.push({
    route: normalisedRoute,
    h1: h1Count,
    title: hasTitle,
    desc: hasDescription,
    canonical: hasCanonical,
    jsonLd: jsonLdCount,
    noIndex,
    issues: issues.join(', ') || 'OK',
  });
}

const failures = findings.filter((f) => f.issues !== 'OK');
const passed = findings.length - failures.length;

console.log(`\n[seo-smoke] Scanned ${findings.length} prerendered routes`);
console.log(`[seo-smoke] ${passed} OK, ${failures.length} with issues\n`);

if (failures.length > 0) {
  console.log('Routes needing attention:');
  console.log('─'.repeat(80));
  for (const f of failures) {
    console.log(`  ${f.route}`);
    console.log(`    → ${f.issues}`);
  }
  console.log('');
}

// Non-blocking by design — change to `process.exit(failures.length > 0 ? 1 : 0)`
// to fail the build when routes have issues.
process.exit(0);
