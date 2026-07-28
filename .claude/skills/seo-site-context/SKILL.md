---
name: seo-site-context
description: "Site facts for hairpinns.com: domain, stack, business model, existing SEO surface and known gaps. Load this before any SEO work in this repo so /seo commands reason about the real site instead of generic assumptions. Triggers on: SEO, audit, schema, sitemap, robots, metadata, canonical, local SEO, ecommerce SEO, product schema, Shopify, SPA prerendering, GEO, AI Overviews, llms.txt, structured data."
---

# Site context: hairpinns.com

Read this before running any `/seo` command in this repo.

## Business

Hair Pinns, a hair salon in Bangor NSW with an attached e-commerce store.
Two distinct SEO problems in one site:

1. **Local service.** Salon services, bookings via Fresha, suburb and
   shipping-state landing pages, reviews, map pack visibility.
2. **E-commerce.** Shopify-backed product and collection pages, checkout,
   product schema, Google Shopping surface.

**Industry classification for `/seo audit`:** hybrid local + e-commerce. Run
both `/seo local` and `/seo ecommerce`. Do not let the audit settle on one.

## Stack, this one matters

- **Vite + React SPA**, not Next.js. React Router pages in `src/pages/`.
- Metadata comes from `react-helmet-async` via `src/components/SEOHead.tsx`,
  not from a Next `metadata` export. There are **zero** `export const metadata`
  sites in this repo, and that is expected, not a finding.
- Crawlability depends on **prerendering** (`scripts/prerender.mjs`, run in
  `postbuild`). If prerendering breaks, the site serves an empty shell to
  crawlers. Treat prerender failures as a Critical SEO incident.
- When running `/seo page` or `/seo audit` against this site, use
  `--render auto` so the skill fetches the rendered DOM rather than the
  source shell.
- Hosted on Netlify. Supabase and Shopify integrations. Deno lock present.

## Existing SEO surface

Strongest build-time SEO automation in the portfolio. `npm run build` already
chains: quality audit, trust audit, tests, sitemap generation, AI discovery
generation, Vite build, prerender, SEO smoke test, internal link audit and
crawler hardening audit.

| Artefact | Location |
|---|---|
| head / metadata | `src/components/SEOHead.tsx`, `src/lib/metadata.ts` |
| schema | `src/lib/schema.ts`, `src/lib/schemaRegistry.ts`, `src/lib/schemaEligibility.ts` |
| sitemap | `src/lib/sitemap.ts`, `scripts/generate-sitemap.js`, `scripts/sitemap-utils.js` → `public/sitemap.xml` (270 URLs, flat urlset) |
| robots | `public/robots.txt` |
| audits | `scripts/seo-smoke-test.js`, `scripts/internal-link-audit.mjs`, `scripts/crawler-hardening-audit.mjs`, `scripts/content-trust-audit.mjs` |
| IndexNow | `scripts/submit-indexnow.js`, key file in `public/` |
| GSC | `scripts/gsc-pulse.mjs` |
| existing docs | `SEO_IMPLEMENTATION.md`, `SCHEMA_IMPLEMENTATION_GUIDE.md`, `INTERNAL_LINKING_MAP.md`, `SUBURB_PAGES_GUIDE.md`, `docs/retail-seo-checklist.md` |

Schema types in use: Organization, Person, Article, BreadcrumbList, FAQPage,
HowTo, Offer, OpeningHoursSpecification, City, Question, Answer, ListItem.

## Known gaps

1. **Five overlapping AI-discovery files in `public/`**: `llms.txt` (1.4 KB),
   `llms-full.txt` (17.5 KB), `llm.txt` (17.5 KB), `llms.json` (2.9 KB) and
   `ai.txt` (824 B). **`llm.txt` and `llms-full.txt` are byte-identical
   duplicates.** `llm.txt` is not a recognised convention. Delete it. Beyond
   that, note the `seo-geo` skill's finding that Google Search ignores llms.txt
   entirely and it is not currently a citation lever, so this whole surface is
   lower value than it looks. Consolidate rather than extend.

2. **`HowTo` schema is deprecated.** Google removed HowTo rich results in
   September 2023. It appears in `tests/e2e/phase2-performance-accessibility.spec.ts`,
   so check whether `src/lib/schema.ts` still emits it and whether the test is
   asserting on a dead type. See
   `.claude/skills/seo-schema/references/deprecated-types-2024-2026.md`.

3. **`FAQPage` on `src/pages/LocationPage.tsx`** no longer produces rich
   results (retired 2026-05-07). Inert, not harmful.

4. **Product schema completeness for a 2026 e-commerce surface.** Run
   `/seo ecommerce`. It validates `hasMerchantReturnPolicy`, `shippingDetails`,
   `MemberProgram` and `ProductGroup` variants, which are now required for
   full Google Shopping eligibility and are easy to miss on a Shopify
   integration.

5. **Flat 270-URL sitemap.** Fine at this size, but if suburb and product
   pages keep growing, split into a sitemap index the way
   romansbuildingservices does.

6. **Suburb and shipping-state pages are a doorway-page risk.** Run
   `/seo programmatic` and `/seo local`. The 30-page warn and 50-page
   hard-stop thresholds apply.

## Verification

```bash
npm run build       # runs the full audit chain, this is the real gate
npm run seo-smoke
npm run audit:links
npm run audit:crawler
```

If a `/seo` recommendation cannot survive `npm run build`, it is not shippable
here.
