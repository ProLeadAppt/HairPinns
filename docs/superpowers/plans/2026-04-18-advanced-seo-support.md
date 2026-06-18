# Advanced SEO Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Hair Pinns technically flawless for Google Search, Local SEO, AEO, and GEO by adding build-time prerendering, unifying the domain, supporting AI crawlers, and fixing SEO bugs.

**Architecture:** Add `vite-plugin-prerender` to generate static HTML for all routes at build time. Centralize the site URL in `businessConfig.ts` and replace all `.com.au` references. Add `llms.txt` for AI crawlers. Upgrade `react-helmet` to `react-helmet-async`. Clean up duplicate configs.

**Tech Stack:** Vite, React 18, react-helmet-async, vite-plugin-prerender (Puppeteer), Netlify

---

### Task 1: Centralize SITE_URL in businessConfig.ts

**Files:**
- Modify: `src/config/businessConfig.ts`

- [ ] **Step 1: Add SITE_URL constant**

Add this at the top of `src/config/businessConfig.ts`, after the existing doc comment and before `BUSINESS_NAP`:

```ts
/** Canonical site URL — single source of truth for all SEO references */
export const SITE_URL = 'https://hairpinns.com';
```

- [ ] **Step 2: Commit**

```bash
git add src/config/businessConfig.ts
git commit -m "feat(seo): add SITE_URL constant to businessConfig"
```

---

### Task 2: Domain Unification — Replace hairpinns.com with hairpinns.com

**Files:**
- Modify: `src/lib/schema.ts:67`
- Modify: `src/lib/sitemap.ts:27,72`
- Modify: `scripts/submit-indexnow.js:44`
- Modify: `src/components/ContactSection.tsx:109`
- Modify: `src/data/blogPosts.ts` (many lines)
- Modify: `src/pages/Terms.tsx:13-16`
- Modify: `src/pages/Collections.tsx:180-181,190,278`
- Modify: `src/pages/Index.tsx:33,41,102,104,110,121`
- Modify: `src/pages/Sitemap.tsx:75`
- Modify: `src/pages/Shipping.tsx:25,28-30,36`
- Modify: `src/pages/Returns.tsx:23,26-28,34`
- Modify: `src/pages/Privacy.tsx:13-14,16`
- Modify: `src/pages/DevShopify.tsx:128`
- Modify: `src/config/featuredProducts.ts:9`

- [ ] **Step 1: Update schema.ts to use SITE_URL**

In `src/lib/schema.ts`, replace line 67:

```ts
// OLD
const BASE_URL = 'https://hairpinns.com';

// NEW
import { SITE_URL } from '@/config/businessConfig';
const BASE_URL = SITE_URL;
```

Add the import at the top of the file (after existing imports, before the constants section).

- [ ] **Step 2: Update sitemap.ts to use SITE_URL**

In `src/lib/sitemap.ts`, add the import and replace the hardcoded URLs:

```ts
import { SITE_URL } from '@/config/businessConfig';
```

Replace line 27:
```ts
// OLD
const baseUrl = 'https://hairpinns.com';
// NEW
const baseUrl = SITE_URL;
```

Replace line 72:
```ts
// OLD
const baseUrl = 'https://hairpinns.com';
// NEW
const baseUrl = SITE_URL;
```

- [ ] **Step 3: Update submit-indexnow.js**

In `scripts/submit-indexnow.js`, fix line 44:

```js
// OLD
keyLocation: `https://hairpinns.com/${INDEXNOW_KEY}.txt`,
// NEW
keyLocation: `https://hairpinns.com/${INDEXNOW_KEY}.txt`,
```

- [ ] **Step 4: Bulk replace hairpinns.com in all remaining src files**

Run a global find-and-replace across the entire `src/` directory:

Replace all instances of `https://hairpinns.com` with `https://hairpinns.com`.

This covers:
- `src/components/ContactSection.tsx` (1 instance)
- `src/data/blogPosts.ts` (~40 instances)
- `src/pages/Terms.tsx` (3 instances)
- `src/pages/Collections.tsx` (4 instances)
- `src/pages/Index.tsx` (6 instances)
- `src/pages/Sitemap.tsx` (1 instance)
- `src/pages/Shipping.tsx` (4 instances)
- `src/pages/Returns.tsx` (4 instances)
- `src/pages/Privacy.tsx` (3 instances)
- `src/pages/DevShopify.tsx` (1 instance)
- `src/config/featuredProducts.ts` (1 instance — in a comment, but still should be consistent)

- [ ] **Step 5: Verify no .com.au references remain**

Run:
```bash
grep -r "hairpinns\.com\.au" src/ scripts/
```

Expected: No matches (except possibly in `src/components/forms/README.md` which is documentation — update that too if found).

- [ ] **Step 6: Commit**

```bash
git add src/ scripts/submit-indexnow.js
git commit -m "fix(seo): unify domain to hairpinns.com — replace all .com.au references"
```

---

### Task 3: Upgrade react-helmet to react-helmet-async

**Files:**
- Modify: `package.json`
- Modify: `src/main.tsx`
- Modify: `src/components/SEOHead.tsx:1`
- Modify: `src/pages/Reviews.tsx:98` (missing `canonical` prop)
- Modify: All files that import from `react-helmet` directly

- [ ] **Step 1: Install react-helmet-async and remove react-helmet**

```bash
cd HairPinns && npm uninstall react-helmet && npm install react-helmet-async
```

- [ ] **Step 2: Install @types/react-helmet-async if needed**

`react-helmet-async` ships its own types, so no extra `@types` package is needed. But remove `@types/react-helmet` if it exists:

```bash
npm uninstall @types/react-helmet 2>/dev/null || true
```

- [ ] **Step 3: Update SEOHead.tsx import**

In `src/components/SEOHead.tsx`, line 1:

```ts
// OLD
import { Helmet } from "react-helmet";
// NEW
import { Helmet } from "react-helmet-async";
```

- [ ] **Step 4: Find and update all other direct Helmet imports**

Search for any other files that import from `react-helmet`:

```bash
grep -r "from ['\"]react-helmet['\"]" src/
```

For each file found, change the import to `react-helmet-async`. Known files that use raw `<Helmet>` (not `<SEOHead>`):
- `src/pages/Terms.tsx`
- `src/pages/Privacy.tsx`
- `src/pages/Shipping.tsx`
- `src/pages/Returns.tsx`
- `src/pages/Sitemap.tsx`

Update each import:
```ts
// OLD
import { Helmet } from "react-helmet";
// NEW
import { Helmet } from "react-helmet-async";
```

- [ ] **Step 5: Add HelmetProvider to main.tsx**

In `src/main.tsx`, wrap the `<App />` in `<HelmetProvider>`:

```tsx
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./lib/shopifySanityCheck";

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Error boundary for React render
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} catch (error) {
  console.error("Failed to render React app:", error);
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: system-ui; text-align: center;">
        <h1>Application Error</h1>
        <p>Failed to load the application.</p>
        <pre style="background: #f5f5f5; padding: 10px; margin: 10px 0; text-align: left; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
}
```

- [ ] **Step 6: Fix Reviews.tsx missing canonical prop**

In `src/pages/Reviews.tsx`, the `<SEOHead>` call is missing the required `canonical` prop. Add it:

```tsx
<SEOHead
  title="Share Your Experience | Hair Pinns"
  description="How was your experience with Hair Pinns? Share your feedback to help us improve."
  canonical="/reviews"
  noIndex={true}
/>
```

- [ ] **Step 7: Verify the app builds**

```bash
cd HairPinns && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/
git commit -m "feat(seo): upgrade react-helmet to react-helmet-async for React 18 compatibility"
```

---

### Task 4: Remove Static Schemas from index.html and Retire inject-nap.js

**Files:**
- Modify: `index.html`
- Modify: `package.json` (build script)

- [ ] **Step 1: Remove JSON-LD blocks from index.html**

In `index.html`, remove lines 28-70 (the comment and both `<script type="application/ld+json">` blocks). The section to remove starts with:
```html
    <!-- Schema.org JSON-LD for SEO, Local SEO, and AEO (global schemas set at build time) -->
```
and ends after the closing `</script>` of the HairSalon schema (line 70).

After removal, the head should go directly from the Google Fonts stylesheet link to the favicon link.

- [ ] **Step 2: Remove inject-nap.js from build script**

In `package.json`, update the `build` script:

```json
"build": "node scripts/generate-sitemap.js && vite build && (node scripts/submit-indexnow.js || echo 'IndexNow skipped')"
```

(Removed `node scripts/inject-nap.js &&` from the beginning.)

- [ ] **Step 3: Verify build still works**

```bash
cd HairPinns && npm run build
```

Expected: Build succeeds. The schemas are now only rendered by React components via SEOHead.

- [ ] **Step 4: Commit**

```bash
git add index.html package.json
git commit -m "refactor(seo): remove static schemas from index.html — dynamic schemas via SEOHead are the source of truth"
```

---

### Task 5: Remove Duplicate _headers File

**Files:**
- Delete: `public/_headers`

- [ ] **Step 1: Delete public/_headers**

Remove `public/_headers`. All header configuration is already in `netlify.toml` (which uses `X-Frame-Options: DENY` — the stricter and correct value).

```bash
rm HairPinns/public/_headers
```

- [ ] **Step 2: Commit**

```bash
cd HairPinns && git add -u public/_headers
git commit -m "fix: remove duplicate _headers — netlify.toml is the single source of truth for headers"
```

---

### Task 6: Update robots.txt with AI Crawler Directives

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Replace robots.txt content**

Replace the entire contents of `public/robots.txt` with:

```
# Hair Pinns — robots.txt
# https://hairpinns.com

User-agent: *
Allow: /

# AI Crawlers — explicitly allowed for AEO/GEO visibility
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

# Disallow transactional and internal paths
Disallow: /cart
Disallow: /cart/
Disallow: /checkout
Disallow: /account
Disallow: /order-confirmation
Disallow: /confirm
Disallow: /dev/
Disallow: /reviews/feedback
Disallow: /reviews/google

# Disallow query parameters that create duplicate content
Disallow: /*?*utm_*
Disallow: /*?*fbclid=*
Disallow: /*?*gclid=*
Disallow: /*?*sort=*
Disallow: /*?*filter=*

# Sitemaps
Sitemap: https://hairpinns.com/sitemap.xml
```

- [ ] **Step 2: Commit**

```bash
cd HairPinns && git add public/robots.txt
git commit -m "feat(seo): update robots.txt with AI crawler directives and expanded disallow rules"
```

---

### Task 7: Create llms.txt for AI Crawlers

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1: Create public/llms.txt**

Create `public/llms.txt` with the following content:

```markdown
# Hair Pinns

> Hair Pinns is a premier hair salon in Bangor, NSW (Sutherland Shire, Sydney) owned by Jena Pinn. We offer smoothing treatments, foils, colouring, cuts, and kids/formal styling. We also retail professional hair care products from brands like Juuce, Qiqi, Pure, and Wet Brush through our online store with Australia-wide shipping.

## Key Facts
- Location: 60 Goorgool Rd, Bangor NSW 2234, Australia
- Phone: 0468 093 991
- Email: hairpinns1@gmail.com
- Hours: Tue 10am-5pm, Wed 6pm-9pm, Thu 9am-9pm, Fri 9am-5:30pm, Sat 8am-2pm
- Google Rating: 4.9 stars (53+ reviews)
- Online Booking: https://hairpinns.com/booking (via Fresha)

## Services
- [Smoothing Treatments](https://hairpinns.com/services/smoothing) — Straight Up Smoothing for mid-length, long/thick, and teen hair
- [Foil Packages](https://hairpinns.com/services/foil-packages) — Full head, half head, and quarter head foils with cut and blowdry
- [Colouring Packages](https://hairpinns.com/services/colouring-packages) — Full colour packages for short, mid-length, and long hair
- [Cut Packages](https://hairpinns.com/services/cut-packages) — Wash, cut and blowdry for all lengths including kids
- [Kids & Formal](https://hairpinns.com/services/kids-formal) — Primary and high school formal hairstyling

## Products (Australia-Wide Shipping)
- [All Collections](https://hairpinns.com/collections)
- [Juuce Hair Care](https://hairpinns.com/collections/juuce) — Professional botanicals range
- [Qiqi Professional](https://hairpinns.com/collections/qiqi) — Professional treatments and oils
- [Pure Organic](https://hairpinns.com/collections/pure) — Certified organic hair care
- [Wet Brush](https://hairpinns.com/collections/wet-brush) — Detangling brushes for all hair types
- [Treatments](https://hairpinns.com/collections/treatments) — Deep conditioning and repair
- [Styling Products](https://hairpinns.com/collections/styling) — Professional styling products

## Service Areas
- [All Areas](https://hairpinns.com/areas) — Sutherland Shire and surrounding suburbs
- Key suburbs: Bangor, Menai, Illawong, Alfords Point, Sutherland, Kirrawee, Como, Miranda, Engadine, Cronulla

## Blog
- [Hair Care Tips & Guides](https://hairpinns.com/blog) — Expert advice on hair care, products, and styling
```

- [ ] **Step 2: Commit**

```bash
cd HairPinns && git add public/llms.txt
git commit -m "feat(seo): add llms.txt for AI crawler discovery (AEO/GEO)"
```

---

### Task 8: Create llms-full.txt

**Files:**
- Create: `public/llms-full.txt`

- [ ] **Step 1: Create public/llms-full.txt**

Create `public/llms-full.txt` with expanded content. This is a curated file for AI systems that support the extended format:

```markdown
# Hair Pinns — Full Context for AI Systems

> Hair Pinns is a premier hair salon in Bangor, NSW (Sutherland Shire, Sydney, Australia) owned and operated by Jena Pinn. Established as a trusted local salon, Hair Pinns serves clients across the Sutherland Shire with professional hair services and retails salon-quality hair care products with Australia-wide shipping.

## About Hair Pinns
Hair Pinns is located at 60 Goorgool Rd, Bangor NSW 2234. The salon is owned by Jena Pinn, a professional hairstylist serving the Sutherland Shire community. The salon holds a 4.9-star Google rating from 53+ verified reviews. Appointments can be booked 24/7 online through Fresha at https://hairpinns.com/booking.

Contact: 0468 093 991 | hairpinns1@gmail.com

Opening Hours:
- Tuesday: 10:00 AM – 5:00 PM
- Wednesday: 6:00 PM – 9:00 PM
- Thursday: 9:00 AM – 9:00 PM
- Friday: 9:00 AM – 5:30 PM
- Saturday: 8:00 AM – 2:00 PM
- Sunday & Monday: Closed

## Detailed Services

### Smoothing Treatments
Hair Pinns specialises in Straight Up Smoothing — a professional smoothing treatment that reduces frizz and cuts styling time. Available for mid-length hair, long/thick hair, and teens. These treatments last several weeks and are ideal for Sydney's humid climate.

### Foil Packages
Professional foiling services including full head foils, half head foils with cut and blowdry, and quarter head foils with cut and blowdry. All foil packages include a consultation to achieve the desired colour result.

### Colouring Packages
Complete colour services for all hair lengths — short, mid-length, and long hair. Each package includes colour application, processing, wash, and styling.

### Cut Packages
Wash, cut, and blowdry packages for long, mid-length, and short hair. Also available for kids with a dedicated kids cut and blowdry bundle.

### Kids & Formal Styling
Specialised hairstyling for primary school formals and high school formals. Includes consultation, styling, and finishing.

## Product Brands
Hair Pinns retails professional salon-quality hair care products with Australia-wide shipping:

- **Juuce Hair Care** — Australian professional botanicals range including shampoos, conditioners, treatments, and styling products
- **Qiqi Professional** — Professional-grade treatments, oils, and styling products
- **Pure Organic** — Certified organic hair care for sensitive scalps and eco-conscious consumers
- **Wet Brush** — The original detangling brush, suitable for all hair types including kids

## Service Area
Hair Pinns is based in Bangor (Sutherland Shire, Sydney) and serves surrounding suburbs including: Menai, Illawong, Alfords Point, Woronora, Sutherland, Kirrawee, Kareela, Como, Gymea, Miranda, Engadine, Heathcote, and Cronulla. The salon is centrally located in the Sutherland Shire with easy access from all surrounding areas.

For product purchases, Hair Pinns ships Australia-wide through their online store at https://hairpinns.com/collections.

## Frequently Asked Questions
- **Do you ship products Australia-wide?** Yes, all hair care products are available for delivery across Australia.
- **How do I book an appointment?** Book online 24/7 at https://hairpinns.com/booking via Fresha, or call 0468 093 991.
- **What are your opening hours?** Tuesday to Saturday, with varying hours. Closed Sunday and Monday.
- **Where are you located?** 60 Goorgool Rd, Bangor NSW 2234 (Sutherland Shire, Sydney).
```

- [ ] **Step 2: Commit**

```bash
cd HairPinns && git add public/llms-full.txt
git commit -m "feat(seo): add llms-full.txt with expanded AI crawler content"
```

---

### Task 9: Build-Time Prerendering — Route Collection Script

**Files:**
- Create: `scripts/collect-prerender-routes.js`

- [ ] **Step 1: Create the route collection script**

Create `scripts/collect-prerender-routes.js`:

```js
/**
 * Collect all routes that should be prerendered at build time.
 * Used by vite.config.ts to feed vite-plugin-prerender.
 * Reads dynamic slugs from data files + Shopify API.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

/** Extract slugs from TS data files using regex */
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

  // Static pages
  const staticPages = [
    '/', '/about', '/blog', '/contact', '/services', '/booking',
    '/faq', '/reviews', '/areas', '/collections', '/search',
    '/privacy', '/terms', '/policies/shipping', '/policies/returns',
    '/sitemap', '/404',
  ];
  routes.push(...staticPages);

  // Location pages (/areas/:slug)
  const areaSlugs = [...new Set(extractObjectKeys(resolve(root, 'src/data/locationPages.ts')))];
  areaSlugs.forEach((slug) => routes.push(`/areas/${slug}`));

  // Suburb pages (/near/:suburb)
  const suburbSlugs = [...new Set(extractObjectKeys(resolve(root, 'src/data/suburbPages.ts')))];
  suburbSlugs.forEach((slug) => routes.push(`/near/${slug}`));

  // Blog posts (/blog/:slug)
  const blogSlugs = [...new Set(extractBlogSlugs(resolve(root, 'src/data/blogPosts.ts')))];
  blogSlugs.forEach((slug) => routes.push(`/blog/${slug}`));

  // Service detail pages (/services/:category/:service)
  // Hardcoded since serviceDetails.ts structure is complex to parse via regex
  const services = [
    ['smoothing', 'mid-length-straight-up-smoothing'],
    ['smoothing', 'long-thick-straight-up-smoothing'],
    ['smoothing', 'straight-up-smoothing-teens'],
    ['foil-packages', 'full-head-foils-package'],
    ['foil-packages', 'half-head-foils-cut-blowdry'],
    ['foil-packages', 'quarter-head-foils-cut-blowdry'],
    ['colouring-packages', 'long-hair-colour-package'],
    ['colouring-packages', 'mid-length-colour-package'],
    ['colouring-packages', 'short-hair-colour-package'],
    ['cut-packages', 'long-hair-wash-cut-blowdry'],
    ['cut-packages', 'mid-length-wash-cut-blowdry'],
    ['cut-packages', 'short-wash-cut-blowdry'],
    ['cut-packages', 'kids-cut-blowdry-bundle'],
    ['kids-formal', 'primary-formal-hairstyle'],
    ['kids-formal', 'high-school-formal-hairstyle'],
  ];
  services.forEach(([cat, svc]) => routes.push(`/services/${cat}/${svc}`));

  // Shopify collections
  let collectionHandles = await fetchShopifyHandles('collections');
  if (collectionHandles.length === 0) {
    collectionHandles = ['juuce', 'qiqi', 'pure', 'wet-brush', 'treatments', 'styling', 'best-sellers-nov'];
  }
  collectionHandles.forEach((h) => routes.push(`/collections/${h}`));

  // Shopify products
  const productHandles = await fetchShopifyHandles('products');
  productHandles.forEach((h) => routes.push(`/products/${h}`));

  console.log(`[prerender] Collected ${routes.length} routes for prerendering`);
  return [...new Set(routes)]; // deduplicate
}

// Allow running standalone for debugging
if (process.argv[1] && process.argv[1].includes('collect-prerender-routes')) {
  collectRoutes().then((routes) => {
    routes.forEach((r) => console.log(r));
  });
}
```

- [ ] **Step 2: Test the script standalone**

```bash
cd HairPinns && node scripts/collect-prerender-routes.js
```

Expected: Prints a list of ~100+ routes (fewer if no Shopify token is set, since products won't be fetched).

- [ ] **Step 3: Commit**

```bash
cd HairPinns && git add scripts/collect-prerender-routes.js
git commit -m "feat(seo): add route collection script for build-time prerendering"
```

---

### Task 10: Build-Time Prerendering — Install and Configure vite-plugin-prerender

**Files:**
- Modify: `package.json` (new dependency)
- Modify: `vite.config.ts`

- [ ] **Step 1: Install vite-plugin-prerender and its Puppeteer renderer**

```bash
cd HairPinns && npm install --save-dev vite-plugin-prerender @prerenderer/renderer-puppeteer
```

Note: The Puppeteer renderer will download Chromium (~130MB) on first install. These are dev dependencies only — they don't affect the production bundle.

- [ ] **Step 2: Update vite.config.ts**

Replace the entire `vite.config.ts` with:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Only load prerender plugin for production builds
  const plugins = [react()];

  if (mode === 'production') {
    try {
      const vitePrerender = (await import('vite-plugin-prerender')).default;
      const Renderer = (await import('@prerenderer/renderer-puppeteer')).default;
      const { collectRoutes } = await import('./scripts/collect-prerender-routes.js');
      const routes = await collectRoutes();

      plugins.push(
        vitePrerender({
          staticDir: path.join(__dirname, 'dist'),
          routes,
          renderer: new Renderer({
            // Give React time to fully render (including async data fetches)
            renderAfterTime: 5000,
            maxConcurrentRoutes: 4,
            headless: true,
          }),
        })
      );
    } catch (err) {
      console.warn('[prerender] Skipping prerendering:', err.message);
    }
  }

  return {
    server: {
      host: "::",
      port: 5173,
      strictPort: false,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
              if (id.includes('framer-motion')) return 'framer-motion';
              if (id.includes('@radix-ui')) return 'ui-vendor';
              if (id.includes('recharts')) return 'recharts';
              if (id.includes('lucide-react')) return 'lucide';
              if (id.includes('sonner') || id.includes('vaul') || id.includes('embla-carousel')) return 'ui-misc';
              if (id.includes('@tanstack/react-query')) return 'tanstack-query';
            }
          },
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) {
              return `assets/[name]-[hash][extname]`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      target: 'es2015',
      minify: 'esbuild',
    },
  };
});
```

Key changes:
- `defineConfig` callback is now `async` to allow dynamic imports
- Prerender plugin uses `vite-plugin-prerender` with `@prerenderer/renderer-puppeteer`
- `staticDir` points to the Vite output directory (`dist`)
- Routes are collected dynamically from the route collection script
- `renderAfterTime: 5000` gives React 5 seconds to fully render (including async data fetches)
- `maxConcurrentRoutes: 4` prevents overwhelming the system

- [ ] **Step 3: Test the build**

```bash
cd HairPinns && npm run build
```

Expected: Build succeeds. You should see output like `[prerender] Collected 120 routes for prerendering` followed by Vite's build output, and then the prerender plugin processing each route.

If the prerender plugin fails (e.g., Puppeteer issues on the machine), the build still succeeds due to the try/catch — it just skips prerendering and outputs a warning.

- [ ] **Step 4: Verify prerendered output**

Check that the prerendered HTML contains actual content:

```bash
cat HairPinns/dist/about/index.html | head -50
```

Expected: You should see a full HTML page with `<title>`, `<meta name="description">`, `<meta property="og:title">`, and actual page content in the `<div id="root">` — not an empty div.

- [ ] **Step 5: Commit**

```bash
cd HairPinns && git add vite.config.ts package.json package-lock.json
git commit -m "feat(seo): add build-time prerendering with vite-plugin-prerender"
```

---

### Task 11: Verify and Adjust Netlify Configuration

**Files:**
- Modify: `netlify.toml` (if needed)

- [ ] **Step 1: Verify SPA catch-all still works correctly**

The existing SPA catch-all in `netlify.toml` is:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

With prerendered files in `dist/`, Netlify serves static files first and only falls back to this redirect when no static file matches. This means:
- `/about` → serves `dist/about/index.html` (prerendered)
- `/some-unknown-path` → falls back to `dist/index.html` (SPA catch-all)

No changes needed to `netlify.toml` for this to work correctly.

- [ ] **Step 2: Add cache headers for llms.txt**

Add a header rule for the llms files in `netlify.toml` after the sitemap header (after line 48):

```toml
# AI crawler files
[[headers]]
  for = "/llms.txt"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/llms-full.txt"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
    Cache-Control = "public, max-age=86400"
```

- [ ] **Step 3: Add CSP allowance for widgets.leadconnectorhq.com**

Check the existing CSP in `netlify.toml` line 66. The `<script>` tag in `index.html` loads from `widgets.leadconnectorhq.com` but the CSP `script-src` doesn't include it. Add it to the `script-src` directive:

Find: `https://www.fresha.com;` (end of script-src)
Add: ` https://widgets.leadconnectorhq.com` before the semicolon.

Also add to `connect-src`: ` https://widgets.leadconnectorhq.com`

(This is a pre-existing bug — the chat widget might be blocked by CSP. Fixing it while we're here.)

- [ ] **Step 4: Commit**

```bash
cd HairPinns && git add netlify.toml
git commit -m "fix: add llms.txt cache headers and fix CSP for chat widget"
```

---

### Task 12: Final Verification

- [ ] **Step 1: Full build test**

```bash
cd HairPinns && npm run build
```

Expected: Build succeeds with prerendering output showing all routes processed.

- [ ] **Step 2: Verify prerendered pages have OG tags**

```bash
grep -l "og:title" HairPinns/dist/about/index.html HairPinns/dist/services/index.html HairPinns/dist/blog/index.html
```

Expected: All three files are listed (meaning they contain og:title meta tags in the static HTML).

- [ ] **Step 3: Verify no .com.au references in built output**

```bash
grep -r "hairpinns\.com\.au" HairPinns/dist/ | head -5
```

Expected: No matches.

- [ ] **Step 4: Verify llms.txt and robots.txt are in dist**

```bash
ls HairPinns/dist/llms.txt HairPinns/dist/llms-full.txt HairPinns/dist/robots.txt HairPinns/dist/sitemap.xml
```

Expected: All four files exist.

- [ ] **Step 5: Start preview server and test**

```bash
cd HairPinns && npm run preview
```

Visit `http://localhost:4173` in a browser. Check:
- View page source on the homepage — should see full HTML content, OG tags, and JSON-LD schemas
- View page source on `/about` — same
- View page source on a blog post — same
- Check that the SPA still works (client-side navigation between pages)

- [ ] **Step 6: Commit final state**

If any adjustments were needed during verification:

```bash
cd HairPinns && git add -A
git commit -m "fix(seo): final adjustments from verification testing"
```
