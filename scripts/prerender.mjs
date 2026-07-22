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
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, copyFileSync } from 'fs';
import http from 'http';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { collectRoutes } from './collect-prerender-routes.js';
import { isTransientBrowserError, isTransientPrerenderRouteError } from './prerender-retry.mjs';

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
const TIMEOUT_MS = parseInt(argMap.timeout || '60000', 10);
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
  // Chromium adds these for every dynamic import executed during capture.
  // Shipping them would eagerly preload route and below-fold chunks for real
  // visitors, undoing the application's lazy-loading boundaries.
  { name: 'captured-dynamic-modulepreloads', re: /<link\b(?=[^>]*\brel=["']modulepreload["'])(?=[^>]*\bas=["']script["'])[^>]*>/gi },
  // Ionic class on <html>
  { name: 'ionic-html-class', re: /<html([^>]*?)class="plt-[^"]*"([^>]*?)mode="md"([^>]*)>/gi, replace: '<html$1$2$3>' },
  { name: 'ionic-html-mode', re: /<html([^>]*?)mode="md"([^>]*)>/gi, replace: '<html$1$2>' },
  // Prerender-ready DOM marker
  { name: 'prerender-marker', re: /<div id="prerender-ready-marker"[^>]*><\/div>/gi },
];

function canonicalizeInternalHref(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return href;
  const pathname = match[1];
  const suffix = match[2] || '';
  const lastSegment = pathname.split('/').filter(Boolean).at(-1) || '';
  const isStaticFile = /\.[a-z0-9]{2,8}$/i.test(lastSegment);
  const isNonDocument = /^\/(?:api|cart|discount)(?:\/|$)/.test(pathname);
  if (pathname === '/' || pathname.endsWith('/') || isStaticFile || isNonDocument) return href;
  return `${pathname}/${suffix}`;
}

function postProcessHtml(html) {
  let out = html;
  for (const { name, re, replace = '' } of STRIPPERS) {
    out = out.replace(re, replace);
  }
  out = out.replace(/\bhref=(['"])(\/[^'"]*)\1/gi, (match, quote, href) => {
    return `href=${quote}${canonicalizeInternalHref(href)}${quote}`;
  });
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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function launchPrerenderBrowser(puppeteer, launchOpts) {
  try {
    return await puppeteer.launch(launchOpts);
  } catch (err) {
    // Chrome may be absent from the build cache: Netlify restores node_modules
    // from cache without re-running puppeteer's postinstall download, leaving
    // ~/.cache/puppeteer empty. Install the expected browser, then retry once.
    console.warn(`[prerender] Chrome not available (${err.message}). Installing browser…`);
    try {
      execSync('npx --yes puppeteer browsers install chrome', { cwd: root, stdio: 'inherit' });
      return await puppeteer.launch(launchOpts);
    } catch (installErr) {
      throw new Error(`[prerender] Chrome unavailable after install attempt: ${installErr.message}`);
    }
  }
}

async function closeBrowserSafely(browser) {
  if (!browser) return;
  try {
    if (browser.isConnected()) {
      await browser.close();
    }
  } catch (err) {
    const msg = String(err?.message || err);
    if (!isTransientBrowserError(msg)) {
      console.warn(`[prerender] browser.close warning: ${msg}`);
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
// Close the preview server cleanly. We use an in-process static server rather
// than `vite preview` so prerender can't be derailed by a separate child
// process dying mid-batch.
async function stopPreview(preview) {
  if (!preview) return true;
  try {
    await new Promise((resolve) => preview.close(resolve));
  } catch {
    // ignore shutdown noise
  }
  return true;
}

function startPreviewServer(port, host) {
  const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf8');
  const contentType = (pathname) => {
    if (pathname.endsWith('.html')) return 'text/html; charset=utf-8';
    if (pathname.endsWith('.js')) return 'application/javascript; charset=utf-8';
    if (pathname.endsWith('.css')) return 'text/css; charset=utf-8';
    if (pathname.endsWith('.json')) return 'application/json; charset=utf-8';
    if (pathname.endsWith('.svg')) return 'image/svg+xml';
    if (pathname.endsWith('.png')) return 'image/png';
    if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg';
    if (pathname.endsWith('.webp')) return 'image/webp';
    if (pathname.endsWith('.avif')) return 'image/avif';
    if (pathname.endsWith('.woff2')) return 'font/woff2';
    return 'application/octet-stream';
  };

  const server = http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', `http://${host}:${port}`);
      const pathname = decodeURIComponent(requestUrl.pathname);
      const isAsset = pathname.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(pathname);
      const safePath = pathname.replace(/^\/+/, '');
      const filePath = join(distDir, safePath);

      if (isAsset) {
        if (!existsSync(filePath)) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        res.setHeader('Content-Type', contentType(pathname));
        res.setHeader('Cache-Control', 'no-cache');
        res.end(readFileSync(filePath));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.end(indexHtml);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(String(error?.message || error));
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
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

  // Start a tiny static server in-process. This is more stable than `vite preview`
  // for long prerender batches and still serves the built SPA shell plus assets.
  const PREVIEW_HOST = '127.0.0.1';
  preview = await startPreviewServer(PORT, PREVIEW_HOST);
  const res = await fetch(`${PREVIEW_URL}/`, { method: 'GET' });
  if (!res.ok) {
    console.error(`[prerender] Preview server health check failed with HTTP ${res.status}`);
    await stopPreview(preview);
    process.exit(1);
  }
  console.log(`[prerender] Preview server ready at ${PREVIEW_URL}`);

  // Lazy import puppeteer (large dep)
  const puppeteer = (await import('puppeteer')).default;
  const launchOpts = {
    headless: true,
    protocolTimeout: 120000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  };
  let browser = await launchPrerenderBrowser(puppeteer, launchOpts);
  if (!browser) {
    await stopPreview(preview);
    return;
  }

  const ensureBrowser = async () => {
    if (!browser || !browser.isConnected()) {
      browser = await launchPrerenderBrowser(puppeteer, launchOpts);
    }
    return browser;
  };

  const restartBrowser = async (reason, err) => {
    const msg = String(err?.message || err || '').slice(0, 160);
    console.warn(`[prerender] Restarting browser after ${reason}: ${msg}`);
    await closeBrowserSafely(browser);
    browser = await launchPrerenderBrowser(puppeteer, launchOpts);
    if (!browser) {
      throw new Error('Chrome unavailable after browser restart');
    }
  };


  const results = [];
  let processed = 0;

  const pool = new Pool(CONCURRENCY);
  const productPool = new Pool(1);

  await Promise.all(
    routes.map((route) =>
      (route.startsWith('/products/') ? productPool : pool).run(async () => {
        const t0 = Date.now();
        const url = `${PREVIEW_URL}${route}`;
        let lastErr = null;

        for (let attempt = 0; attempt < 3; attempt++) {
          let page = null;
          try {
            const activeBrowser = await ensureBrowser();
            // `browser.newPage()` can occasionally fail under load or after a
            // Chromium hiccup. Keep it inside the retry loop and relaunch the
            // browser on transient disconnects so one bad page doesn't poison
            // the whole batch.
            page = await activeBrowser.newPage();

            // Propagate the script-level timeout to every Puppeteer call (goto,
            // waitForSelector, waitForFunction, etc.). Without this, any Puppeteer
            // helper that doesn't accept a per-call timeout reverts to its
            // hardcoded 30s default and can still hard-fail a build on a slow
            // network-bound page. Verified 2026-06-17: prerender was crashing
            // at 50/267 with a 30000ms TimeoutError despite TIMEOUT_MS=20000.
            page.setDefaultTimeout(TIMEOUT_MS);
            page.setDefaultNavigationTimeout(TIMEOUT_MS);
            // Set prerender UA so any UA-gated scripts self-skip. Keep the
            // browser free of per-page interception listeners; long prerender
            // batches have been observed to destabilize Chromium when request
            // interception is enabled on every route.
            await page.setUserAgent('HairPinnsPrerender/1.0 (+HeadlessChrome; prerender=true)');

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
            // Wait for the prerender-ready marker that SEOHead injects once
            // all async data (Shopify, blog content, etc.) has resolved.
            await page.waitForSelector('#prerender-ready-marker', { timeout: TIMEOUT_MS });
            // If the page actually uses the scroll-reveal system, give lazy
            // sections a quick chance to mount and then scroll once to trip the
            // IntersectionObserver. Most routes (blog, collections, services)
            // don't use `.reveal` at all, so we skip the extra waiting there.
            const needsReveal = await page.evaluate(() => Boolean(document.querySelector('.reveal')));
            if (needsReveal) {
              try {
                // Keep this short: `waitForNetworkIdle` is the slow path in the
                // prerender pipeline, and we only need a brief cushion for the last
                // async chunks to settle before capturing the home-page reveal rows.
                await page.waitForNetworkIdle({ idleTime: 250, timeout: 1000 });
              } catch {
                // Network may not reach idle quickly on the home page; we still
                // rely on the CSS fallback to make the reveal sections visible.
              }
              await sleep(450);
            }
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
            lastErr = null;
            break;
          } catch (err) {
            lastErr = err;
            const msg = String(err?.message || err);
            if (isTransientPrerenderRouteError(msg) && attempt < 2) {
              if (isTransientBrowserError(msg)) {
                await restartBrowser(`route ${route} attempt ${attempt + 1}`, err);
              } else {
                console.warn(`[prerender] Retrying route ${route} after navigation timeout (attempt ${attempt + 1})`);
              }
              await sleep(750 * Math.pow(2, attempt));
              continue;
            }
            const error = msg.slice(0, 120);
            console.warn(`[prerender] FAIL ${route} (${Date.now() - t0}ms): ${error}`);
            results.push({
              route, ok: false, dt: Date.now() - t0,
              error,
            });
            break;
          } finally {
            try {
              if (page && !page.isClosed()) {
                await page.close();
              }
            } catch (closeErr) {
              const msg = String(closeErr?.message || closeErr);
              if (!isTransientBrowserError(msg)) {
                console.warn(`[prerender] page.close warning for ${route}: ${msg}`);
              }
            }
          }
        }

        if (lastErr && isTransientBrowserError(lastErr)) {
          // If we exhausted retries because Chromium keeps disconnecting,
          // record the failure once here so the batch can continue cleanly.
          const error = String(lastErr?.message || lastErr).slice(0, 120);
          if (!results.some((r) => r.route === route)) {
            console.warn(`[prerender] FAIL ${route} (${Date.now() - t0}ms): ${error}`);
            results.push({ route, ok: false, dt: Date.now() - t0, error });
          }
        }

        processed++;
        if (processed % 25 === 0 || processed === routes.length) {
          const ok = results.filter((r) => r.ok).length;
          const fail = results.length - ok;
          process.stdout.write(`[prerender] ${processed}/${routes.length} — ${ok} ok, ${fail} failed
`);
        }
      })
    )
  );

  await closeBrowserSafely(browser);
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

  if (report.failed > 0) {
    throw new Error(`Prerender failed for ${report.failed} of ${report.total} routes`);
  }
}

main().catch((err) => {
  console.error('[prerender] Fatal:', err);
  process.exit(1);
});

// Belt-and-braces: when Node's event loop drains, exit. This should be a
// no-op (the await stopPreview calls above release the loop), but if anything
// else (a stray setTimeout, a misbehaving native binding) ever sneaks in,
// `process.exit(0)` is a final guarantee that the build script returns control
// to `npm run build` and the Netlify job finishes inside its time limit.
process.on('exit', () => {});
