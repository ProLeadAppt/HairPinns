import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const trackingInitializer = readFileSync(
  resolve(root, 'src/components/tracking/TrackingInitializer.tsx'),
  'utf8',
);
const indexHtml = readFileSync(
  resolve(root, 'index.html'),
  'utf8',
);

const failures = [];

if (!indexHtml.includes('https://www.googletagmanager.com/gtag/js?id=G-N6Y1TJMWGG')) {
  failures.push('index.html does not load the GA4 gtag.js script.');
}

if (!indexHtml.includes("gtag('config', 'G-N6Y1TJMWGG')")) {
  failures.push('index.html does not configure GA4 with G-N6Y1TJMWGG.');
}

if (!trackingInitializer.includes('ga4.pageView(')) {
  failures.push('TrackingInitializer.tsx does not send GA4 page_view events on route changes.');
}

if (!trackingInitializer.includes('location.pathname + location.search')) {
  failures.push('TrackingInitializer.tsx does not include the full SPA route path in GA4 page_view events.');
}

if (failures.length > 0) {
  console.error('[verify-ga4-tracking] FAILED');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('[verify-ga4-tracking] OK');
