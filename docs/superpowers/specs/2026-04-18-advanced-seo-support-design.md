# Advanced SEO Support — Design Spec

**Date:** 2026-04-18
**Goal:** Make Hair Pinns technically flawless for Google Search, Local SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) to achieve #1 rankings for hair-related searches in the Sutherland Shire / Sydney area and for hair product e-commerce.

**Canonical domain:** `hairpinns.com`

---

## Problem Statement

Hair Pinns is a React/Vite SPA hosted on Netlify. All SEO meta tags, Open Graph tags, Twitter Cards, and structured data are rendered client-side via `react-helmet`. This creates four critical problems:

1. **Social scrapers** (Facebook, Twitter/X, LinkedIn, WhatsApp, iMessage) don't execute JavaScript — they see an empty HTML shell with no title, description, or preview image.
2. **Some search engines** (Bing, Yandex) and all AI crawlers receive the empty shell, limiting indexing and AEO/GEO visibility.
3. **Google** can render JS but does so in a deferred "second wave" of indexing, which is slower and less reliable than static HTML.
4. **Domain inconsistency** — `hairpinns.com` and `hairpinns.com.au` are used interchangeably across the codebase, splitting ranking authority.

---

## Section 1: Build-Time Prerendering

### Approach

Add `vite-plugin-prerender` (Puppeteer-based) to generate static HTML snapshots for every route at build time. After `vite build` produces the SPA bundle, the plugin launches a headless browser, visits each route, waits for React to render fully, and writes the complete HTML (including all meta tags, OG tags, and JSON-LD schema) to disk as static files.

### Routes to Prerender

**Static pages (~15):**
- `/`, `/about`, `/blog`, `/contact`, `/services`, `/booking`, `/faq`, `/reviews`, `/areas`, `/collections`, `/search`, `/privacy`, `/terms`, `/policies/shipping`, `/policies/returns`

**Dynamic pages (~165+):**
- 22 location pages: `/areas/:slug` (sourced from `src/data/locationPages.ts`)
- 15 suburb pages: `/near/:suburb` (sourced from `src/data/suburbPages.ts`)
- 29 blog posts: `/blog/:slug` (sourced from `src/data/blogPosts.ts`)
- 21 service detail pages: `/services/:categorySlug/:serviceSlug` (sourced from services data)
- 7+ collection pages: `/collections/:slug` (hardcoded fallback handles + Shopify API)
- 50-250 product pages: `/products/:handle` (fetched from Shopify Storefront API at build time)

**Excluded from prerendering:**
- `/order-confirmation`, `/confirm` — transactional, no SEO value
- `/reviews/feedback`, `/reviews/google` — redirect flows
- `/dev/*` — development-only routes
- `/404`, `/500` — error pages (404 should still be prerendered for proper status codes)

### Build Script Integration

Current build command:
```
node scripts/inject-nap.js && node scripts/generate-sitemap.js && vite build && (node scripts/submit-indexnow.js || echo 'IndexNow skipped')
```

New build command:
```
node scripts/inject-nap.js && node scripts/generate-sitemap.js && vite build && (node scripts/submit-indexnow.js || echo 'IndexNow skipped')
```

The prerendering is configured within `vite.config.ts` as a Vite plugin, so it runs as part of `vite build` — no separate script needed.

### Route Discovery Script

Create `scripts/collect-prerender-routes.js` that:
1. Reads `src/data/locationPages.ts` and extracts area slugs
2. Reads `src/data/suburbPages.ts` and extracts suburb slugs
3. Reads `src/data/blogPosts.ts` and extracts blog slugs
4. Reads services data and extracts category/service slug pairs
5. Fetches Shopify collections and products via Storefront API (same logic as `generate-sitemap.js`)
6. Outputs the complete route list

This script is imported by `vite.config.ts` to provide the route list to the prerender plugin.

### How It Works on Netlify

Prerendered files are output as `dist/<path>/index.html`. Netlify serves these as static assets. When any crawler or user hits `/about`, Netlify serves `dist/about/index.html` with full HTML content. The React SPA hydrates on top for client-side interactivity.

The existing SPA catch-all redirect (`/* -> /index.html 200`) in `netlify.toml` only fires when no static file matches, so prerendered pages take priority automatically.

---

## Section 2: Domain Unification

### The Problem

The codebase uses two domains interchangeably:
- `hairpinns.com` — in `index.html` schemas, `robots.txt`
- `hairpinns.com.au` — in `SEOHead.tsx`, `schema.ts`, `sitemap.ts`, `generate-sitemap.js`, `submit-indexnow.js`

Google treats these as separate sites. Mixed canonicals split ranking authority.

### The Fix

Replace every instance of `hairpinns.com.au` with `hairpinns.com` in:

| File | What changes |
|---|---|
| `src/components/SEOHead.tsx` | Canonical URL prefix |
| `src/lib/schema.ts` | All schema `@id`, `url`, `image` fields |
| `src/lib/sitemap.ts` | `SITE_URL` constant, OG image helper |
| `scripts/generate-sitemap.js` | `BASE_URL` constant |
| `scripts/submit-indexnow.js` | `host` field and `keyLocation` URL |
| Any page components | Hardcoded domain references |

After this change, `hairpinns.com` is the single source of truth. The domain should be defined once in `businessConfig.ts` (or a shared constant) and imported everywhere else.

---

## Section 3: Social Media Previews

### Current State

`SEOHead.tsx` already sets comprehensive OG and Twitter Card meta tags. The problem is purely that social scrapers can't see them because they're rendered client-side.

### Solution

Prerendering (Section 1) fixes this entirely. Once pages are static HTML, all OG and Twitter meta tags are in the page source. No additional work needed.

### Fixes Required

1. **Migrate `Booking.tsx` to use `<SEOHead>`** — currently uses raw `<Helmet>`, missing `og:title`, `og:description`, `og:url`, and all Twitter Card tags.
2. **Migrate `Reviews.tsx` to use `<SEOHead>`** — currently uses raw `<Helmet>` with only `noindex` + title/description.

---

## Section 4: AI Crawler / AEO / GEO Support

### 4a: llms.txt

Create `public/llms.txt` — the emerging standard for telling AI systems what a site is about:

```
# Hair Pinns

> Hair Pinns is a premier hair salon in Bangor, NSW (Sutherland Shire, Sydney) offering smoothing treatments, foils, colouring, cuts, and kids/formal styling. We also retail professional hair care products from brands like Juuce, Qiqi, Pure, and Wet Brush through our online store.

## About
- Owner and lead stylist: Jena Pinn
- Location: 60 Goorgool Rd, Bangor NSW 2234, Australia
- Phone: 0468 093 991
- Booking: https://hairpinns.com/booking

## Services
- [Smoothing Treatments](https://hairpinns.com/services/smoothing)
- [Foil Packages](https://hairpinns.com/services/foil-packages)
- [Colouring Packages](https://hairpinns.com/services/colouring-packages)
- [Cut Packages](https://hairpinns.com/services/cut-packages)
- [Kids & Formal](https://hairpinns.com/services/kids-formal)

## Products
- [All Collections](https://hairpinns.com/collections)

## Service Areas
- [Areas We Serve](https://hairpinns.com/areas)

## Blog
- [Hair Care Tips & Guides](https://hairpinns.com/blog)
```

### 4b: llms-full.txt

Create `public/llms-full.txt` with expanded content including:
- Full service descriptions and pricing from the services data
- Product category descriptions from collection data
- Area coverage details from `locationPages.ts` and `suburbPages.ts`
- Blog post titles, dates, and summaries from `blogPosts.ts`
- Business hours, credentials, and specialties

This file is written manually (not generated) since the content should be curated for AI consumption. It lives in `public/` and is served statically.

### 4c: robots.txt Updates

Update `public/robots.txt` to explicitly address AI crawlers:

```
User-agent: *
Allow: /

# AI Crawlers — explicitly allowed
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

# Disallowed paths
Disallow: /cart
Disallow: /cart/
Disallow: /checkout
Disallow: /account
Disallow: /order-confirmation
Disallow: /confirm
Disallow: /dev/
Disallow: /reviews/feedback
Disallow: /reviews/google

# Query parameter canonicalization
Disallow: /*?*utm_*
Disallow: /*?*fbclid=*
Disallow: /*?*gclid=*
Disallow: /*?*sort=*
Disallow: /*?*filter=*

Sitemap: https://hairpinns.com/sitemap.xml
```

### 4d: Existing Schema Markup

The existing `schema.ts` already includes strong AEO/GEO schemas:
- `KnowledgeGraphSchema` — Organization data for AI knowledge bases
- `QAPageSchema` — Question/answer format for featured snippets
- `HowToSchema` — Step-by-step content for how-to panels
- `ArticleSchema` with `speakable` — Voice search optimization
- `FAQPageSchema` — FAQ rich results

Prerendering ensures these are visible to all crawlers. No changes needed to the schema generators themselves.

---

## Section 5: react-helmet Upgrade

### The Problem

The project uses `react-helmet` v6, which has known issues with React 18's concurrent rendering and is unmaintained. It also doesn't work reliably with prerendering in some edge cases.

### The Fix

1. Replace `react-helmet` with `react-helmet-async` in `package.json`
2. Wrap the app root in `<HelmetProvider>` in `App.tsx` (or `main.tsx`)
3. Update all imports from `react-helmet` to `react-helmet-async`
4. The API is identical — `<Helmet>` component works the same way

This is a mechanical find-and-replace with one provider wrapper addition.

---

## Section 6: Bug Fixes & Cleanup

### 6a: IndexNow Host Mismatch

**Current bug:** `submit-indexnow.js` sends `host: 'hairpinns.com'` but `keyLocation: 'https://hairpinns.com.au/...'`. Fixed automatically by domain unification (Section 2).

### 6b: Duplicate Headers

`netlify.toml` and `public/_headers` both define security headers with conflicting values:
- `netlify.toml`: `X-Frame-Options: DENY`
- `public/_headers`: `X-Frame-Options: SAMEORIGIN`

**Fix:** Remove `public/_headers` and consolidate all header config into `netlify.toml` as the single source of truth.

### 6c: Static Schema Duplication in index.html

`index.html` contains hardcoded `WebSite` and `HairSalon` JSON-LD schemas. These are also generated dynamically by `schema.ts` and injected via `SEOHead`. With prerendering, the dynamic versions are baked into every page's HTML.

**Fix:** Remove the static JSON-LD blocks from `index.html`. The `inject-nap.js` script that maintains them can also be retired, since `businessConfig.ts` feeds the dynamic schemas directly.

### 6d: Centralize Domain Config

Create a single `SITE_URL` constant in `businessConfig.ts`:
```ts
export const SITE_URL = 'https://hairpinns.com';
```

All files that currently hardcode the domain (`SEOHead.tsx`, `schema.ts`, `sitemap.ts`, `generate-sitemap.js`, `submit-indexnow.js`) import from this constant instead.

---

## Out of Scope

- Framework migration (Next.js, Astro, Remix)
- Per-page custom OG images (current `og-default.jpg` fallback is acceptable for now)
- Google Search Console configuration (manual step by site owner)
- Google Business Profile optimization (external to codebase)
- Content strategy / keyword research
- Link building

---

## Success Criteria

1. Sharing any Hair Pinns URL on Facebook, Twitter/X, LinkedIn, or WhatsApp shows a proper preview with title, description, and image
2. `curl -s https://hairpinns.com/about | grep "og:title"` returns the About page's OG title (not empty)
3. All pages in `sitemap.xml` use `https://hairpinns.com` (no `.com.au`)
4. `https://hairpinns.com/llms.txt` returns valid content
5. AI crawlers receive full HTML content when visiting any page
6. Google Search Console shows no indexing errors related to missing content or mixed domains
7. Build completes in under 5 minutes with all routes prerendered
