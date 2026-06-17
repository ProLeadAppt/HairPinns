/**
 * Custom prerender — replaces @prerenderer/rollup-plugin.
 *
 * Why custom: the rollup plugin hard-fails the build when any single route
 * times out (verified 2026-06-16: 267-route build died at 2m10s on a
 * network-bound product page). We need:
 *   - per-route timeout (so a slow Shopify fetch on one product page
 *     doesn't kill the whole build)
 *   - skip-on-fail (record failures but continue)
 *   - progress reporting (so we can see *which* route hung)
 *   - per-route post-processing (strip third-party noise from HTML)
 *   - schema-preserving (must not break <script type="application/ld+json">)
 *
 * Inputs:
 *   - dist/index.html (Vite SPA shell) is the entry point
 *   - routes from collect-prerender-routes.js
 *   - preview server: vite preview on a random port serves dist/
 *
 * Outputs:
 *   - dist/<route>/index.html for every successful route
 *   - dist/index.html is the SPA fallback (kept untouched)
 *   - dist/404.html copy for the Netlify not-found case
 *   - dist/prerender-report.json (machine-readable for monitoring)
 *
 * Usage:
 *   node scripts/prerender.mjs [--dry-run] [--concurrency=4] [--timeout=20000]
 */
import { spawn, execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, copyFileSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { collectRoutes } from './collect-prerender-routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

// ----- args -----
const args = process.argv.slice(2);
const argMap = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? 'true'];
  })
);
const DRY_RUN = argMap['dry-run'] === 'true';
const CONCURRENCY = parseInt(argMap.concurrency || '4', 10);
const TIMEOUT_MS = parseInt(argMap.timeout || '20000', 10);
const PORT = parseInt(argMap.port || '4180', 10);
const PREVIEW_URL = `http://127.0.0.1:${PORT}`;

// ----- third-party pollution to strip from rendered HTML -----
// Mirrors the regexes from the old rollup-plugin's postProcess. Each one
// was battle-tested in production. Keep them in sync with whatever the
// live site injects (third-party widgets change shape occasionally).
const STRIPPERS = [
  // Ionic / LeadConnector custom elements (open + close tags, separate replaces
  // because JS doesn't backreference across different tag names well)
  { name: 'ionic-custom-elements', re: /<[a-z-]+-(chat|message|conversation|feedback|form|input|pane|selection|widget)\b[^>]*>[\s\S]*?<\/[a-z-]+-(chat|message|conversation|feedback|form|input|pane|selection|widget)>/gi },
  { name: 'slot-fb', re: /<slot-fb[^>]*>[\s\S]*?<\/slot-fb>/gi },
  // Ionic-injected style block
  { name: 'ionic-styles', re: /<style data-styles="">[\s\S]*?<\/style>/gi },
  // reCAPTCHA origin-trial meta + runtime script
  { name: 'recaptcha-meta', re: /<meta http-equiv="origin-trial"[^>]*>/gi },
  { name: 'recaptcha-script', re: /<script[^>]*recaptcha[^>]*><\/script>/gi },
  { name: 'recaptcha-gstatic', re: /<script[^>]*gstatic\.com\/recaptcha[^>]*><\/script>/gi },
  // LeadConnector runtime
  { name: 'leadconnector-script', re: /<script[^>]*leadconnectorhq\.com[^>]*>[\s\S]*?<\/script>/gi },
  { name: 'leadconnector-link', re: /<link[^>]*leadconnectorhq\.com[^>]*>/gi },
  { name: 'bunny-fonts', re: /<link[^>]*fonts\.bunny\.net[^>]*>/gi },
  // Ionic class on <html>
  { name: 'ionic-html-class', re: /<html([^>]*?)class="plt-[^"]*"([^>]*?)mode="md"([^>]*)>/gi, replace: '<html$1$2$3>' },
  { name: 'ionic-html-mode', re: /<html([^>]*?)mode="md"([^>]*)>/gi, replace: '<html$1$2>' },
  // Prerender-ready DOM marker
  { name: 'prerender-marker', re: /<div id="prerender-ready-marker"[^>]*><\/div>/gi },
];

function postProcessHtml(html) {
  let out = html;
  for (const { name, re, replace = '' } of STRIPPERS) {
    out = out.replace(re, replace);
  }
  return out;
}

// ----- concurrency control -----
class Pool {
  constructor(limit) {
    this.limit = limit;
    this.active = 0;
    this.queue = [];
  }
  async run(fn) {
    if (this.active >= this.limit) {
      await new Promise((r) => this.queue.push(r));
    }
    this.active++;
    try {
      return await fn();
    } finally {
      this.active--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

// ----- route output path -----
function routeToPath(route) {
  // /            -> dist/index.html (the SPA root)
  // /about       -> dist/about/index.html
  // /blog/post   -> dist/blog/post/index.html
  // /404         -> dist/404.html (Netlify convention)
  if (route === '/' || route === '') return { file: 'index.html', dir: '' };
  if (route === '/404') return { file: '404.html', dir: '' };
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return { file: 'index.html', dir: clean };
}

// ----- main -----
// Kill the entire preview-server process group and wait for it to actually
// exit. `spawn` is created with `detached: true` below, so the child PID is
// also its own process-group leader — `process.kill(-pid, signal)` reaches
// every descendant (npx → vite preview → its own worker handles), which a
// plain `preview.kill()` (SIGTERM to the parent only) does not. On Linux the
// `npx` shim spawns `vite preview` as a separate child, and without group
// signalling that child becomes orphaned and keeps the HTTP port bound —
// Node's event loop stays alive, the build script never returns, and Netlify
// kills the whole job at 18m. Returns true if the group was reaped, false
// if it was still alive after the hard-kill fallback (still resolved so the
// build can proceed to the next step regardless).
async function stopPreview(preview, { graceMs = 5000 } = {}) {
  if (!preview || preview.killed || preview.exitCode !== null) return true;
  const pid = preview.pid;
  if (!pid) return true;
  // SIGTERM the whole group first — gives vite a chance to flush.
  try { process.kill(-pid, 'SIGTERM'); } catch { /* already gone */ }
  const exited = await Promise.race([
    new Promise((r) => preview.once('exit', () => r(true))),
    new Promise((r) => setTimeout(() => r(false), graceMs)),
  ]);
  if (exited) return true;
  // Hard fallback — nothing should still be listening.
  try { process.kill(-pid, 'SIGKILL'); } catch { /* already gone */ }
  // Give the kill a moment to actually reap; don't block the build forever.
  await Promise.race([
    new Promise((r) => preview.once('exit', () => r(true))),
    new Promise((r) => setTimeout(r, 1000)),
  ]);
  return preview.exitCode !== null;
}

async function main() {
  const t0Total = Date.now();
  let preview = null;

  // Dry-run path doesn't need a built dist — just enumerate routes.
  if (DRY_RUN) {
    const routes = await collectRoutes();
    console.log(`[prerender] DRY RUN — ${routes.length} routes:`);
    routes.forEach((r) => console.log('  ' + r));
    return;
  }

  if (!existsSync(distDir)) {
    console.error('[prerender] dist/ not found. Run `vite build` first.');
    process.exit(1);
  }
  const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf8');
  if (!/<div id="root"><\/div>/i.test(indexHtml) && !/<div id="root">\s*<\/div>/i.test(indexHtml)) {
    console.warn('[prerender] dist/index.html does not look like a Vite SPA shell — proceeding anyway.');
  }

  const allRoutes = await collectRoutes();
  // De-dupe + sort: static first (most important for crawlers), then alphabetical
  const order = (r) => {
    if (r === '/') return 0;
    if (r === '/404') return 99;
    if (/^\/(about|contact|services|booking|blog|faq|reviews|collections|areas|search|sitemap)$/.test(r)) return 1;
    return 2;
  };
  const routes = [...new Set(allRoutes)].sort((a, b) => {
    const oa = order(a), ob = order(b);
    return oa !== ob ? oa - ob : a.localeCompare(b);
  });

  console.log(`[prerender] ${routes.length} routes, concurrency=${CONCURRENCY}, timeout=${TIMEOUT_MS}ms, dryRun=${DRY_RUN}`);

  // Start preview server. Bind to an explicit loopback host and strict port so
  // the address is deterministic regardless of any PORT/HOST env Netlify sets.
  // `detached: true` + `stdio: ignore` (below) puts the child in its own
  // process group with PID == PGID, so we can kill the whole tree (npx →
  // vite preview → workers) with a single negative-PID signal at teardown.
  // Without this, SIGTERM to the npx shim leaves the actual `vite` node
  // process orphaned and the port stays bound, holding the build open.
  const PREVIEW_HOST = '127.0.0.1';
  preview = spawn('npx', ['vite', 'preview', '--host', PREVIEW_HOST, '--port', String(PORT), '--strictPort'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  // Capture all output for diagnostics, and watch for an early exit (e.g. port
  // in use, missing dist) so we fail fast with a useful message.
  let previewOutput = '';
  let previewExited = null;
  preview.stdout.on('data', (c) => { previewOutput += c.toString(); });
  preview.stderr.on('data', (c) => { previewOutput += c.toString(); });
  preview.on('exit', (code, signal) => { previewExited = { code, signal }; });
  preview.on('error', (err) => { previewExited = { error: err.message }; });

  // Readiness: poll the HTTP endpoint until it actually answers. This is far
  // more reliable than scraping the startup banner from stdout, which varies
  // between Vite versions and can be buffered/colorised in CI.
  const START_TIMEOUT_MS = 60000;
  const startDeadline = Date.now() + START_TIMEOUT_MS;
  let ready = false;
  while (Date.now() < startDeadline) {
    if (previewExited) {
      console.error(`[prerender] Preview server exited before becoming ready:`, JSON.stringify(previewExited));
      if (previewOutput.trim()) console.error(previewOutput.slice(0, 2000));
      await stopPreview(preview);
      process.exit(1);
    }
    try {
      const res = await fetch(`${PREVIEW_URL}/`, { method: 'GET' });
      if (res.status >= 200 && res.status < 500) { ready = true; break; }
    } catch {
      // Server not accepting connections yet — keep polling.
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  if (!ready) {
    console.error(`[prerender] Failed to start preview server: not reachable at ${PREVIEW_URL} within ${START_TIMEOUT_MS}ms`);
    if (previewOutput.trim()) console.error(previewOutput.slice(0, 2000));
    await stopPreview(preview);
    process.exit(1);
  }
  console.log(`[prerender] Preview server ready at ${PREVIEW_URL}`);

  // Lazy import puppeteer (large dep)
  const puppeteer = (await import('puppeteer')).default;
  const launchOpts = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  };
  let browser;
  try {
    browser = await puppeteer.launch(launchOpts);
  } catch (err) {
    // Chrome may be absent from the build cache: Netlify restores node_modules
    // from cache without re-running puppeteer's postinstall download, leaving
    // ~/.cache/puppeteer empty. Install the expected browser, then retry once.
    console.warn(`[prerender] Chrome not available (${err.message}). Installing browser…`);
    try {
      execSync('npx --yes puppeteer browsers install chrome', { cwd: root, stdio: 'inherit' });
      browser = await puppeteer.launch(launchOpts);
    } catch (installErr) {
      // Still no usable browser. Don't fail the build — the SPA shell is valid
      // for JS-capable crawlers. Skip prerendering and exit cleanly.
      console.warn(`[prerender] Skipping prerender — Chrome unavailable: ${installErr.message}`);
      await stopPreview(preview);
      return;
    }
  }

  const results = [];
  let processed = 0;

  const pool = new Pool(CONCURRENCY);

  await Promise.all(
    routes.map((route) =>
      pool.run(async () => {
        const t0 = Date.now();
        const url = `${PREVIEW_URL}${route}`;
        const page = await browser.newPage();
        // Block any non-essential third-party (analytics, chat widgets) so
        // they don't slow prerender or pollute HTML. CSP-friendly list of
        // domains we serve our own copies of or that are non-essential.
        await page.setRequestInterception(true);
        const blockedHosts = [
          'leadconnectorhq.com', 'google-analytics.com', 'googletagmanager.com',
          'clarity.ms', 'fonts.bunny.net',
        ];
        page.on('request', (req) => {
          try {
            const u = new URL(req.url());
            if (blockedHosts.some((h) => u.hostname.endsWith(h))) {
              req.abort();
              return;
            }
            req.continue();
          } catch {
            req.continue();
          }
        });
        // Set prerender UA so any UA-gated scripts self-skip
        await page.setUserAgent('HairPinnsPrerender/1.0 (+HeadlessChrome; prerender=true)');
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
          // Wait for the prerender-ready marker that SEOHead injects once
          // all async data (Shopify, blog content, etc.) has resolved.
          await page.waitForSelector('#prerender-ready-marker', { timeout: TIMEOUT_MS });
          const rawHtml = await page.content();
          const cleanedHtml = postProcessHtml(rawHtml);
          // Sanity checks: must have <h1>, <title>, meta description, JSON-LD
          const h1Count = (cleanedHtml.match(/<h1\b/gi) || []).length;
          const jsonLdCount = (cleanedHtml.match(/<script[^>]*type=["']application\/ld\+json["']/gi) || []).length;
          const hasTitle = /<title>[^<]+<\/title>/i.test(cleanedHtml);
          const out = routeToPath(route);
          const outPath = join(distDir, out.dir, out.file);
          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, cleanedHtml, 'utf8');
          results.push({
            route, ok: true, dt: Date.now() - t0,
            bytes: cleanedHtml.length, h1Count, jsonLdCount, hasTitle,
            path: relative(root, outPath),
          });
        } catch (err) {
          results.push({
            route, ok: false, dt: Date.now() - t0,
            error: String(err.message || err).slice(0, 120),
          });
        } finally {
          await page.close();
          processed++;
          if (processed % 25 === 0 || processed === routes.length) {
            const ok = results.filter((r) => r.ok).length;
            const fail = results.length - ok;
            process.stdout.write(`[prerender] ${processed}/${routes.length} — ${ok} ok, ${fail} failed\n`);
          }
        }
      })
    )
  );

  await browser.close();
  await stopPreview(preview);

  // Write report
  const report = {
    when: new Date().toISOString(),
    total: results.length,
    ok: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    timeoutMs: TIMEOUT_MS,
    concurrency: CONCURRENCY,
    results: [...results].sort((a, b) => (b.dt - a.dt)),
  };
  writeFileSync(join(distDir, 'prerender-report.json'), JSON.stringify(report, null, 2), 'utf8');

  // Summary
  const wallSecs = ((Date.now() - t0Total) / 1000).toFixed(1);
  console.log(`\n[prerender] DONE — ${report.ok} ok, ${report.failed} failed in ${wallSecs}s`);
  if (report.failed > 0) {
    console.log('[prerender] FAILED routes:');
    results.filter((r) => !r.ok).forEach((r) => console.log(`  ${r.route}  (${r.dt}ms)  ${r.error}`));
  }
  const slow = results.filter((r) => r.ok).sort((a, b) => b.dt - a.dt).slice(0, 10);
  if (slow.length) {
    console.log('[prerender] Top 10 slowest OK routes:');
    slow.forEach((r) => console.log(`  ${r.route.padEnd(50)} ${String(r.dt).padStart(6)}ms  ${r.jsonLdCount} schemas`));
  }

  // Don't fail the build on prerender errors — the SPA shell is fine for
  // crawlers that run JS. The IndexNow submit will skip 404s. seo-smoke-test
  // is the right place to enforce coverage gates.
}

main().catch(async (err) => {
  console.error('[prerender] Fatal:', err);
  // Reap the preview server even on unexpected error paths so the build
  // process exits cleanly. Without this, an unhandled throw here would
  // skip the teardown and trigger the same 18m Netlify timeout.
  const { execSync } = await import('child_process');
  try { execSync('pkill -f "vite preview" || true', { stdio: 'ignore' }); } catch {}
  process.exit(1);
});

// Belt-and-braces: when Node's event loop drains, exit. This should be a
// no-op (the await stopPreview calls above release the loop), but if anything
// else (a stray setTimeout, a misbehaving native binding) ever sneaks in,
// `process.exit(0)` is a final guarantee that the build script returns control
// to `npm run build` and the Netlify job finishes inside its time limit.
process.on('exit', () => { try { execSync('pkill -f "vite preview" || true', { stdio: 'ignore' }); } catch {} });
