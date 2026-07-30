import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const trackingInitializer = readFileSync(
  resolve(root, 'src/components/tracking/TrackingInitializer.tsx'),
  'utf8',
);
const trackingScripts = readFileSync(
  resolve(root, 'src/components/tracking/TrackingScripts.tsx'),
  'utf8',
);
const indexHtml = readFileSync(
  resolve(root, 'index.html'),
  'utf8',
);
const envExample = readFileSync(
  resolve(root, '.env.example'),
  'utf8',
);
const ecommerceTracking = readFileSync(
  resolve(root, 'src/lib/ecommerceTracking.ts'),
  'utf8',
);
const productDetail = readFileSync(
  resolve(root, 'src/pages/ProductDetail.tsx'),
  'utf8',
);
const miniCart = readFileSync(
  resolve(root, 'src/components/cart/MiniCart.tsx'),
  'utf8',
);
const projectConfig = readFileSync(
  resolve(root, 'src/config/projectConfig.ts'),
  'utf8',
);
const ghlRelay = readFileSync(
  resolve(root, 'netlify/functions/ghl-capture.js'),
  'utf8',
);

const collectSourceFiles = (directory) => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? collectSourceFiles(path) : [path];
  });
const clientSource = collectSourceFiles(resolve(root, 'src'))
  .filter((path) => /\.(?:js|jsx|ts|tsx)$/.test(path))
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n');

const failures = [];

if (
  !trackingScripts.includes('const GA4_MEASUREMENT_ID = "G-N6Y1TJMWGG"')
  || !trackingScripts.includes('https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}')
) {
  failures.push('TrackingScripts.tsx does not load the configured GA4 provider script.');
}

if (!indexHtml.includes("gtag('config', 'G-N6Y1TJMWGG')")) {
  failures.push('index.html does not configure GA4 with G-N6Y1TJMWGG.');
}

if (!envExample.includes('GHL_INBOUND_WEBHOOK_URL=')) {
  failures.push('.env.example does not document the server-only GHL relay secret.');
}

if (envExample.includes('VITE_GHL_INBOUND_WEBHOOK_URL=')) {
  failures.push('.env.example exposes the private GHL webhook as a public Vite variable.');
}

if (clientSource.includes('VITE_GHL_INBOUND_WEBHOOK_URL')) {
  failures.push('Client source still references the obsolete public GHL webhook variable.');
}

if (/services\.leadconnectorhq\.com\/hooks\//.test(clientSource)) {
  failures.push('Client source contains a private HighLevel webhook URL.');
}

if (!projectConfig.includes("inboundWebhookUrl: '/api/ghl-capture'")) {
  failures.push('projectConfig.ts does not route CRM capture through the same-origin relay.');
}

for (const relayGuard of ['rateLimit', 'isAllowedOrigin', 'hasKnownContact']) {
  if (!ghlRelay.includes(relayGuard)) {
    failures.push(`ghl-capture.js is missing ${relayGuard}.`);
  }
}

if (!trackingInitializer.includes('ga4.pageView(')) {
  failures.push('TrackingInitializer.tsx does not send GA4 page_view events on route changes.');
}

if (!trackingInitializer.includes('location.pathname + location.search')) {
  failures.push('TrackingInitializer.tsx does not include the full SPA route path in GA4 page_view events.');
}

for (const helper of ['trackProductView', 'trackAddToCart', 'trackBeginCheckout']) {
  if (!ecommerceTracking.includes(`pixelTracking.${helper}(`)) {
    failures.push(`ecommerceTracking.ts does not route ${helper} through browser pixels.`);
  }
}

if (!productDetail.includes('trackProductView({')) {
  failures.push('ProductDetail.tsx does not emit a structured product-view event.');
}

if (!productDetail.includes('items: [{')) {
  failures.push('ProductDetail.tsx buy-now checkout does not include GA4 line-item data.');
}

if (!miniCart.includes('items: lines.map(')) {
  failures.push('MiniCart.tsx checkout does not include GA4 cart line-item data.');
}

if (failures.length > 0) {
  console.error('[verify-ga4-tracking] FAILED');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('[verify-ga4-tracking] OK');
