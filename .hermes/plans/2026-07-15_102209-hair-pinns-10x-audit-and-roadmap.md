# Hair Pinns 10x Site Improvement Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task after Tyson approves a direction.

**Goal:** Turn Hair Pinns from a competent salon and ecommerce site into a distinctive, fast, trustworthy, conversion-focused digital extension of Jena's chair, while protecting SEO, ecommerce, booking, accessibility, and mobile performance.

**Architecture:** Keep the existing React, Vite, Shopify Storefront, Netlify, and prerender stack. Repair technical and trust defects before adding motion. Add art direction through reusable design tokens, real salon media, GSAP choreography, and one optional cinematic prototype rather than coating every section in effects.

**Tech stack:** React 18, Vite 7, TypeScript, Tailwind, Shopify Storefront API, Netlify, Puppeteer prerendering, optional GSAP ScrollTrigger, optional Blender-rendered frame sequence or Three.js lab route.

---

## 1. Aesthetic and commercial contract

**Aesthetic contract:** Hair Pinns should feel like sitting in Jena's chair after hours: candid, expert, warm, tactile, editorial and unmistakably local, with product commerce growing naturally from the salon rather than looking like a generic beauty template.

**Primary commercial journeys:**

1. Local salon visitor understands the speciality, trusts Jena, sees relevant proof, and books.
2. Australia-wide shopper understands why Jena's recommendations are more trustworthy than a large retailer, finds the right routine, and buys.

**Protected strengths:**

- Strong founder-led hero proposition: “Hair care from someone who actually does hair.”
- Real Jena voice, real salon history and clear Bangor location.
- Strong review volume and visible booking path.
- Real product catalogue and useful content depth.
- Current serif-led editorial direction and purple brand equity.
- Strong desktop technical performance and zero horizontal overflow at 1440, 390 and 320 pixels.
- Existing reduced-motion, save-data and mobile video gates in `src/components/home/HeroHome.tsx`.

**Category defaults to reject:**

- Generic beauty gradients with stock-model overlays.
- Repeating centred section heading, three cards, CTA patterns.
- Purple pill buttons everywhere.
- Baked marketing copy inside hero artwork.
- Decorative 3D that behaves like an isolated widget.
- Scroll effects that hide content, delay shopping, or damage mobile LCP.

---

## 2. Verified baseline

### Promotion removal, completed and deployed

- Removed all source and rendered references to the ended “Buy any Shampoo, get 50% off Conditioner” promotion.
- Deleted `src/components/home/ShampooConditionerPromo.tsx`.
- Removed the expired promotion branches from `src/components/Header.tsx` and `src/config/promotions.ts`.
- Removed the homepage insertion from `src/pages/Index.tsx`.
- Build passed.
- Lint passed with zero errors and 18 existing warnings.
- SEO smoke test passed: 133 prerendered routes, 0 issues.
- PR #6 merged: `https://github.com/ProLeadAppt/HairPinns/pull/6`.
- Production browser verification confirmed the 50% offer is gone. The separate 20% QIQI promotion remains active.

### Production Lighthouse baseline, 15 July 2026

| Metric | Mobile | Desktop |
|---|---:|---:|
| Performance | 68 | 94 |
| Accessibility | 96 | 96 |
| Best Practices | 73 | 73 |
| SEO | 100 | 100 |
| FCP | 3.9 s | 1.0 s |
| LCP | 5.6 s | 1.2 s |
| CLS | 0 | 0.002 |
| TBT | 110 ms | 0 ms |

Mobile opportunities include 1.72 seconds of render-blocking savings, about 125 KiB of unused JavaScript, and 34 KiB of image-delivery savings. Desktop transferred about 3.6 MiB because the hero video is enabled on capable desktop clients.

### Responsive browser baseline

- 1440 px: no horizontal overflow, no broken images.
- 390 px: no horizontal overflow, no broken images.
- 320 px: no horizontal overflow, no broken images.
- Many visible controls are below the preferred 44 px touch-target height, including 32 px add-to-bag controls and 40 px mobile menu/search inputs.
- Current production has a SearchAtlas CSP console error and malformed LeadConnector widget request.

### Evidence files

- `D:/hermes-agent/home/client-work/hair-pinns/audit-2026-07-15/audit.json`
- `D:/hermes-agent/home/client-work/hair-pinns/audit-2026-07-15/desktop-1440.png`
- `D:/hermes-agent/home/client-work/hair-pinns/audit-2026-07-15/mobile-390.png`
- `D:/hermes-agent/home/client-work/hair-pinns/audit-2026-07-15/narrow-320.png`
- `D:/hermes-agent/home/client-work/hair-pinns/audit-2026-07-15/lighthouse-mobile-postpromo.json`
- `D:/hermes-agent/home/client-work/hair-pinns/audit-2026-07-15/lighthouse-desktop.json`

---

## 3. Executive findings

### Independent crawl reconciliation

A second live crawl completed after the initial roadmap was written and materially strengthened the priority order. Treat these figures as the current live-site baseline:

- The live sitemap has **273 URLs**, including 265 HTML URLs and 8 machine-readable or utility files. The local no-token build generated 145 URLs, so local and production sitemap generation are not equivalent.
- **All 265 HTML sitemap URLs redirect with HTTP 301** to trailing-slash URLs.
- **All 265 final pages canonicalize back to the redirecting non-trailing-slash form.**
- 8,135 internal-link occurrences across 259 unique targets produce a 301.
- Random unknown URLs and deleted content return a visible noindex 404 page with **HTTP 200**, creating soft 404s.
- A deleted Christmas article remains in the sitemap.
- Six indexed local articles publish the unfinished sentence: “Composite of client feedback, real quote to be added before publish.”
- Seven local articles contain pricing or experience claims that conflict with the live service menu, including a $30 under-12 price and an unverified Polaroid/lollipop promise.
- Eighteen area surfaces show `+61 468 093 991` while linking to the 0416 number.
- Broken service fragments include `#colour`, `#cuts`, and an individual service slug used as a section fragment.
- `/search/` is indexable and included in the sitemap.
- 139 titles exceed 60 characters, 143 descriptions exceed 160 characters, and 71 descriptions are under 120 characters. GSC data should determine which templates and pages are fixed first.
- Several area-page pairs have high five-word-shingle similarity, including Miranda versus Caringbah at 0.615 and Kirrawee versus Alfords Point at 0.611.
- `BestSellers.tsx` synthesizes struck-through comparison prices when Shopify has not supplied one. This should stop immediately because a premium store cannot imply an unverified prior price.

These findings move crawl integrity, public-claim integrity, real HTTP 404 behavior, NAP consistency, and pricing integrity ahead of visual expansion.

### Critical trust and technical findings

1. **NAP inconsistency:** live footer and rendered schema use `0416 037 663`, while `public/llms.txt` publishes `0468 093 991`. Confirm the correct public number with Jena, then update every human and machine-readable surface atomically.
2. **Canonical mismatch:** production redirects `/services` and `/blog` to trailing-slash URLs, while the sitemap lists non-trailing-slash URLs. Homepage canonical is `https://hairpinns.com/`, but `og:url` is `https://hairpinns.com`. Pick one URL form and align redirects, sitemap, canonicals, OG, schema, internal links and LLM files.
3. **Six collection prerender failures:** every full build currently times out on `/collections/best-sellers-nov`, `/collections/juuce`, `/collections/pure`, `/collections/styling`, `/collections/treatments` and `/collections/wet-brush`. The build exits successfully despite those failures. This weakens crawler parity and masks regressions.
4. **Malformed LeadConnector widget request:** Lighthouse recorded a 404 request whose URL is an encoded `<script>` tag. This indicates the widget snippet is being inserted as a URL instead of executable markup, likely through an external optimisation layer.
5. **SearchAtlas is blocked by CSP:** the configured dashboard script redirects to `storage.googleapis.com`, which is not allowed by the current CSP. Production logs the failure on every tested viewport.
6. **Stale machine-readable facts:** `public/llms.txt` says 62 posts in one place and 61 in another while the source has 60 summaries and 59 visible cards. AI discovery files need generated counts and one shared fact source.
7. **Mobile LCP is poor:** 5.6 seconds on Lighthouse mobile. Adding Three.js above the fold now would make the wrong problem worse.

### Why the site still feels templated

1. The hero background contains baked “Elevate your Hairstyle Journey” copy that competes with the live headline and looks like stock beauty-template creative.
2. The desktop header is crowded: Shop appears in navigation and again as a separate action, while search, cart and booking compete in one strip.
3. Inter plus Playfair/Fraunces is competent but familiar. The typography does not yet feel uniquely Hair Pinns.
4. The “Meet Jena” asset has baked title bars and resembles a social graphic placed inside a website rather than art-directed site photography.
5. Product cards use familiar ecommerce tiles, repeated purple pill buttons and inconsistent card dominance. The first product is oversized while later cards repeat the same composition.
6. Section numbering is inconsistent in the visible narrative, moving from 01 to 03 to 04.
7. The review section is visually underpowered relative to the strength of 762+ reviews.
8. The footer is functional but generic and visually disconnected from the salon atmosphere.
9. The site is long on mobile, roughly 11,410 px at 390 px width, but several sections do not create a new visual or narrative beat.
10. The design relies on centred headings, rounded cards and purple CTA pills across many routes, producing component-library sameness.

---

## 4. Prioritised implementation roadmap

## Phase 0: Facts, tracking and crawl integrity

### Task 0.0A: Quarantine unfinished local content

**Objective:** Stop publishing placeholders, composite testimonials, incorrect prices and unverifiable customer-experience claims.

**Files:**
- Modify: `src/data/blogPosts.ts`
- Modify: `src/data/blogSummaries.ts` if affected articles need temporary exclusion
- Inspect: local article components and any shared local FAQ source

**Immediate action:** Apply `noindex,follow` to the six affected articles until Jena reviews them. Remove every composite quotation unless replaced with a genuine, permissioned review. Correct or remove the under-12 price, Polaroid/lollipop claim, generic “15 minutes from Bangor” statements and Bangor-specific FAQs appearing on other suburb pages.

**Verification:** Add a content QA test that fails on `to be added`, `placeholder`, `composite`, `TBD`, `TODO` and `real quote`. Re-crawl all local articles before reindexing.

### Task 0.0B: Stop synthesized comparison pricing

**Objective:** Ensure every displayed discount is supported by Shopify pricing data.

**Files:**
- Modify: `src/components/home/BestSellers.tsx`
- Inspect all product-card components for comparable fallback logic.

**Behavior:** Render a struck-through price only when Shopify provides a verified `compareAtPrice`. Otherwise show the real current price alone and use Jena's selection context as the value signal.

**Verification:** Test products with and without `compareAtPrice`. No UI may generate a fictional prior price.

### Task 0.0C: Return real 404 and 410 responses

**Objective:** Eliminate soft 404s and remove deleted content from crawl surfaces.

**Files:**
- Modify: `netlify.toml`
- Generate or verify: `public/404.html`
- Modify: sitemap generation and any deleted-article redirect map.

**Approach:** Preserve explicit valid SPA rewrites only where required, then make the final unknown-route fallback return HTTP 404. Remove `/blog/christmas-gift-packs-at-hair-pinns/` from the sitemap. Use a relevant 301 only if a genuine replacement exists, otherwise return 404 or 410.

**Verification:** A randomized unknown URL returns HTTP 404, the visible 404 template, noindex, and no misleading canonical. Deleted URLs do not appear in the sitemap.

### Task 0.0D: Clean the live sitemap and noindex search

**Objective:** Make the sitemap a list of canonical, indexable HTTP 200 documents only.

**Files:**
- Modify: `scripts/generate-sitemap.js`
- Modify: `src/pages/SearchResults.tsx`
- Modify: route metadata and sitemap verification scripts.

**Remove from sitemap:** `/search/`, the deleted Christmas article, `.txt`, `.json` and `.well-known` utility resources.

**Add if verified:** `/collections/jenas-daily-trio/`.

**Search behavior:** Render `noindex,follow` for `/search/` and query variants.

**Verification:** Every sitemap URL returns 200 without redirect, is indexable and self-canonical. Machine-readable discovery paths remain in `robots.txt` and explicit discovery links instead.

### Task 0.0E: Repair broken service fragments

**Objective:** Make every local and article CTA land on real content.

**Files:**
- Modify links in area/local content sources.
- Verify IDs in `src/pages/Services.tsx`.

**Mappings:** Use `#colouring-packages`, `#smoothing` and `#cut-packages`. Link individual services directly to their canonical service-detail routes.

**Verification:** Add rendered DOM validation for every same-site URL fragment.

### Task 0.1: Create a single verified business fact source

**Objective:** Eliminate contradictory phone, hours, address, review and experience claims.

**Files:**
- Create: `src/config/businessFacts.ts`
- Modify: `src/components/Footer.tsx`
- Modify: `src/lib/schema.ts`
- Modify: `src/data/reviews.ts`
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`
- Modify: `public/llm.txt`
- Modify: `public/llms.json`
- Modify: `public/ai.txt`
- Modify: `public/humans.txt`

**Required input:** Jena must confirm the canonical public phone number, current review count, preferred email, and whether “20+ years” is approved wording.

**Verification:** Search source and built output for the old phone and stale counts. Render homepage, contact, schema and LLM files. All must match.

### Task 0.2: Fix malformed LeadConnector and SearchAtlas loading

**Objective:** Remove console errors and restore intended external integrations.

**Files and systems:**
- Inspect `index.html` SearchAtlas loader.
- Inspect SearchAtlas dashboard dynamic optimisation configuration.
- Inspect any GHL/LeadConnector widget setting that contains a literal `<script>` string.
- Modify `netlify.toml` CSP only after verifying the final SearchAtlas redirect host is intentional.

**Rules:** Do not simply allow every Google Storage origin. Verify the exact final script, integrity and business need first. If SearchAtlas is not producing measurable value, remove it instead of broadening CSP.

**Verification:** Zero console errors on homepage, contact and services at 1440, 390 and 320 px. No encoded `<script>` URL requests. Widget opens and closes correctly.

### Task 0.3: Align canonical URL forms

**Objective:** Remove redirecting sitemap URLs and mixed canonical signals.

**Files:**
- Modify: `scripts/generate-sitemap.js`
- Modify: `src/components/SEOHead.tsx`
- Modify: `src/lib/schema.ts`
- Modify: `src/lib/sitemap.ts`
- Modify: `public/llms*.txt`
- Modify internal URL constants where needed.

**Recommended decision:** Use trailing slashes for non-file routes because Netlify already redirects those URLs to trailing slashes.

**Verification:** Every sitemap URL returns 200 without a redirect. Canonical, OG URL, JSON-LD URL and internal prerendered links use the same form. Add a deterministic post-build URL audit.

### Task 0.4: Make collection prerendering deterministic

**Objective:** Get all intended routes to prerender successfully.

**Files:**
- Modify: `scripts/prerender.mjs`
- Inspect: `src/pages/CollectionDetail.tsx`
- Inspect Shopify loading/error state components.

**Approach:** Trace why the six fallback collection handles never emit `#prerender-ready-marker`. Fail the build when an indexable route fails, or explicitly remove invalid routes from the sitemap and prerender list.

**Verification:** `npm run build` reports all intended routes OK and zero failed. The six current routes return meaningful prerendered HTML or a deliberate 301/404.

### Task 0.5: Generate machine-readable facts instead of hand-editing

**Objective:** Stop blog counts, dates and business facts drifting.

**Files:**
- Create: `scripts/generate-ai-discovery.mjs`
- Generate: `public/llms.txt`, `public/llms-full.txt`, `public/llm.txt`, `public/llms.json`
- Modify: `package.json`

**Verification:** Counts are calculated from current source data. The build fails when generated files are stale.

---

## Phase 1: Mobile speed, accessibility and conversion foundations

### Task 1.1: Improve mobile LCP before adding motion

**Objective:** Move mobile LCP below 2.5 seconds and performance above 85.

**Files:**
- Modify: `index.html`
- Modify: `src/components/home/HeroHome.tsx`
- Modify: `src/index.css`
- Inspect: `vite.config.ts`

**Actions:**

1. Self-host and subset the required Inter/Fraunces/Playfair font files or reduce the number of families and weights.
2. Remove the redundant preload of `/hero-poster.avif` if the actual LCP candidate is the responsive imported hero still.
3. Preload the exact responsive mobile LCP image with matching `imagesrcset` and `imagesizes`.
4. Defer GA4, Clarity, SearchAtlas and chat until consent or first interaction where business requirements permit.
5. Reduce initial React/vendor execution and audit why 119 to 125 KiB is unused on first load.
6. Recheck whether all three fonts are needed above the fold.

**Verification:** Three repeated mobile Lighthouse runs. Median LCP below 2.5 seconds, CLS below 0.1, TBT below 200 ms.

### Task 1.2: Repair accessibility defects

**Objective:** Reach 100 Lighthouse accessibility without weakening visual hierarchy.

**Files:**
- Modify: `src/components/home/HeroHome.tsx`
- Modify: `src/components/home/HeroSocialProofBar.tsx`
- Modify: `src/components/design-system/SectionNumber.tsx`
- Modify: product card/button components.

**Actions:**

1. Make the hero booking accessible name include the visible “Book a chair” text.
2. Raise muted trust-strip contrast above 4.5:1.
3. Raise section-number and eyebrow contrast above 4.5:1 or increase size/weight where large-text rules apply.
4. Increase interactive controls to at least 44 by 44 CSS pixels on touch layouts.
5. Keep visible focus treatments on every custom control.

**Verification:** Lighthouse accessibility 100, keyboard path test, 320 and 390 px touch-target audit.

### Task 1.3: Simplify the desktop and mobile header

**Objective:** Make the first navigation decision obvious.

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/navigation/ShopDropdown.tsx`
- Modify: `src/components/product/ProductSearch.tsx`

**Recommended structure:**

- Brand mark.
- Shop, Services, About Jena, Advice.
- Search icon or expandable search.
- Cart.
- One strong “Book Jena” action.

Remove the duplicate standalone Shop action. Keep service areas accessible from Services or footer rather than forcing every route into the primary nav.

**Verification:** Desktop at 1280, 1366, 1440 and 1920 px. Mobile menu at 320 and 390 px. No truncation, overlap or duplicate paths.

### Task 1.4: Replace permanent promotional logic with a governed campaign system

**Objective:** Prevent expired offers from staying live.

**Files:**
- Refactor: `src/config/promotions.ts`
- Modify: `src/components/Header.tsx`

**Data model:** campaign ID, message, target URL, start date, end date, enabled flag, placements and analytics label.

**Behavior:** When no campaign is active, show the stable free-shipping value message or no strip. Expired campaigns render nowhere.

**Verification:** Time-bound tests for before, during and after campaign dates.

---

## Phase 2: Art-direction reset without a rebuild

### Task 2.1: Replace the templated hero asset

**Objective:** Make the first viewport unmistakably Hair Pinns.

**Files/assets:**
- Replace or re-edit `src/assets/images/hero-home-*` and `/hero-reel.mp4`.
- Modify: `src/components/home/HeroHome.tsx`.

**Creative brief:** Real Jena, real Bangor salon, real hands and hair. No baked headline, no stock “Hairstyle Journey” copy, no generic purple beauty composite. Reserve intentional negative space for live HTML text.

**Recommended shoot:**

- Jena in motion behind a client.
- Macro brush, foil, product and finished-hair details.
- One composed wide frame for desktop.
- One dedicated portrait composition for mobile, not a crop of desktop.

**Approval gate:** Approve one desktop still and one portrait still before producing video.

### Task 2.2: Replace the social-card “Meet Jena” treatment

**Objective:** Turn the founder section into an editorial portrait story.

**Files:**
- Modify: `src/components/home/JenaPromise.tsx`
- Replace baked-label image with a clean portrait and live caption.

**Composition:** Large candid portrait, handwritten or editorial pull quote, three proof statements integrated into the layout, not icon-list cards.

### Task 2.3: Create a distinctive Hair Pinns design system

**Objective:** Remove component-library sameness.

**Files:**
- Create: `DESIGN_SYSTEM.md`
- Modify: `src/index.css`
- Modify: `tailwind.config.ts`
- Consolidate: `src/components/design-system/*`

**System decisions:**

- One display family and one highly readable body family.
- A quieter plum/cream base with rose-copper used only for attention.
- Fewer pill buttons. Introduce a tailored rectangular editorial CTA and a text-link style.
- Reduce radius variety and card shadows.
- Introduce salon-specific rules: hairline dividers, foil-like metallic accents, crop rules, captions and image edge treatments.
- Use asymmetry and image-led layouts while preserving reading order.

### Task 2.4: Recompose the product shelf

**Objective:** Make shopping feel curated by Jena, not imported from a generic grid.

**Files:**
- Modify: `src/components/home/BestSellers.tsx`
- Modify: product card components.

**New pattern:** “Jena's shelf” editorial collection with one routine story, product-use context, hair concern filters and consistent image ratios. Avoid one oversized card followed by five repeated cards unless the featured item has a real editorial reason.

### Task 2.5: Turn reviews into evidence theatre

**Objective:** Make 762+ reviews one of the strongest visual moments.

**Files:**
- Modify: `src/components/home/ReviewsShowcase.tsx`
- Modify: review data/source handling.

**New pattern:** Three specific review stories tied to real services or product outcomes, followed by the verified aggregate. Do not fabricate images, dates or outcomes.

### Task 2.6: Fix narrative numbering and section ownership

**Objective:** Ensure every homepage act has one clear job.

**Proposed sequence:**

1. The promise.
2. Jena's shelf.
3. In the chair.
4. Proof.
5. Advice.
6. Book or shop.

Every visible number must be sequential. Every section must either explain, prove, help choose or drive the next action.

---

## Phase 3: SEO and content expansion tied to revenue

### Task 3.1: Rebuild service architecture around money pages

**Objective:** Turn the current long booking-system feed into clear search and booking journeys.

**Files:**
- Modify: `src/pages/Services.tsx`
- Modify: `src/data/serviceDetails.ts`
- Create or improve service hubs for smoothing, foils, colour, cuts, scalp and formal hair.

**Actions:**

- Remove or suppress irrelevant internal booking rows such as “OSTEO” from the public marketing surface unless Jena confirms they belong.
- Lead each service family with outcome, suitability, price range, duration, proof and booking path.
- Add real before/after evidence and service-specific FAQs.
- Keep exact Fresha pricing as the source of truth.

### Task 3.2: Audit local pages for real uniqueness

**Objective:** Prevent suburb pages becoming thin doorway pages.

**Files:**
- Inspect: `src/data/locationPages.ts`
- Inspect: `src/pages/LocationPage.tsx`

**Requirements per page:** real travel/local context, relevant proof, service differences where true, unique FAQs, internal links and one clear booking action. Consolidate any page that is only a suburb-name swap.

### Task 3.3: Build topic clusters that link advice to commerce and booking

**Clusters:**

- Smoothing: keratin, QIQI, Straight Up, longevity, price, aftercare.
- Colour: foils, brassiness, box-dye recovery, colour-safe routine.
- Scalp: detox, buildup, sauna/wellness where genuinely relevant.
- Product routines: blonde, frizz, curls, heat protection, bond repair.

Each article should point to one relevant service, one relevant routine/product collection and one related expert article.

### Task 3.4: Improve click-through and intent clarity

Use GSC to find:

- Positions 4 to 15 with strong commercial intent.
- High impressions and low CTR.
- Wrong-page ranking and cannibalisation.
- Pages with impressions but no conversions.

Do not rewrite titles blindly without GSC evidence.

### Task 3.5: Verify GBP and entity consistency

Actions requiring private access:

- Confirm categories, services, opening hours and phone.
- Compare against Blake & Kwan, Headgardeners and Studio B.
- Align GBP services with real website service hubs.
- Create a steady real-photo and review-response system.

---

## Phase 4: Motion and wow-factor prototypes

## Motion principle

Motion must express Jena's method, reveal evidence or help choose. If it merely decorates a card, it does not ship.

### Level 1: Low-risk GSAP editorial polish, recommended first

**Dependencies:** Add GSAP and ScrollTrigger only after mobile performance work.

**Opportunities:**

1. Hero headline mask reveal with “actually” arriving last.
2. Section numbers and hairline dividers drawing on entry.
3. Split-line text reveals on major headings only.
4. Slow real-image parallax capped to 6 to 10 percent travel.
5. Product shelf stagger tied to scroll, with transforms and opacity only.
6. Before/after slider caption transitions.
7. Reversible sticky “Jena's routine” section with three steps.

**Guardrails:**

- Base content visible without JavaScript.
- `prefers-reduced-motion` gets immediate static content.
- Mobile uses shorter distance and fewer effects.
- Use `gsap.matchMedia()` and component cleanup.
- Never animate layout properties when transforms work.

### Level 2: Signature scroll story, recommended prototype

**Concept: From the chair to your shelf**

A single 250 to 350 vh sequence connecting service and ecommerce:

1. A real finished-hair close-up.
2. Jena's hands reveal the technique or treatment.
3. The exact products used slide into the composition.
4. The scene resolves into a shoppable routine and “Book this finish” action.

**Best production method:** Real directed video converted into a bounded frame sequence, or a short WebM/MP4 scrub prototype. Hair realism is difficult and expensive in real-time 3D. Use real footage first.

**Prototype gate:** Build on `/labs/chair-to-shelf`, set `noindex,nofollow`, and validate start/middle/end captures at desktop, 390 and 320 px before homepage promotion.

### Level 3: Optional Blender/Three.js, only after proof

**Viable concept:** A stylised Hair Pinns shelf where real product bottle models assemble into Jena's recommended routine as scroll progresses.

**Do not model photoreal hair in WebGL for the homepage.** It is high-risk, heavy and likely to look less credible than real salon footage.

**Choose Blender frame sequence when:**

- Photoreal lighting and complete authored camera control matter most.
- The interaction is linear and scroll-scrubbed.
- Mobile can use a dedicated portrait render with fewer frames.

**Choose real-time Three.js when:**

- Visitors need to rotate or inspect a product.
- Object-level interaction creates shopping value.
- Accurate 3D bottle assets exist.

**Performance budget:**

- No WebGL in the first viewport until mobile LCP is below 2.5 seconds.
- Interaction-gated load on capable desktop only.
- Demand rendering, not continuous 60 fps.
- Poster and reduced-motion fallback.
- Dedicated mobile composition or static fallback.
- Maximum initial added JavaScript target: 35 KiB gzip for Level 1. Three.js must be lazy and excluded from initial route chunks.

---

## 5. Brainstormed design directions

### Direction A: The After-Hours Chair, recommended

- Deep plum, warm cream, copper edge light.
- Real salon close-ups, candid Jena frames and tactile product details.
- Editorial typography and restrained motion.
- Signature story: chair to shelf.
- Best balance of personality, credibility, conversion and performance.

### Direction B: The Working Colourist's Journal

- Contact-sheet photography, foil textures, handwritten annotations and service notes.
- Scroll behaves like turning through Jena's working notebook.
- Strong for advice, colour and education.
- Risk: can become visually busy if annotations are overused.

### Direction C: The Curated Shelf

- Product-first, clean studio art direction with Jena's voice as marginal notes.
- Optional Blender product assembly as a desktop-only signature scene.
- Strongest for ecommerce.
- Risk: could underplay the salon and become another beauty retailer.

**Recommendation:** Use Direction A as the site-wide north star, borrow the journal annotation language from Direction B for service and blog pages, and reserve Direction C for the shop and one prototype scene.

---

## 6. Competitor gap

### Blake & Kwan

Strengths: awards, team personalities, local authority, strong first-party salon photography.

Gap Hair Pinns can own: more personal founder trust, easier ecommerce, transparent service pricing and advice-to-product continuity.

### Headgardeners

Strengths: clear natural/low-toxic positioning, 30-year authority, long-term review proof.

Gap Hair Pinns can own: stronger modern usability, better education, online booking and curated commerce.

### Studio B

Strengths: decisive colour-specialist positioning, transformation confidence and cinematic salon imagery.

Gap Hair Pinns can own: warmer accessibility, transparent prices, founder-led recommendations and family-friendly credibility.

Hair Pinns should not imitate these sites visually. It should use their strongest commercial evidence while owning “the hairdresser who still does the work and ships what she actually uses.”

---

## 7. Measurement plan

Before redesign implementation, capture:

- GA4 organic landing pages and conversions.
- GSC clicks, impressions, CTR and positions for the last 90 days.
- GBP calls, website clicks, direction requests and search queries.
- Booking clicks by placement.
- Add-to-cart and checkout starts by landing page.
- Search usage, zero-result queries and article-result clicks.
- Mobile CWV from field data, not Lighthouse alone.

Success metrics:

- Mobile LCP below 2.5 seconds.
- Accessibility 100 in Lighthouse plus keyboard verification.
- Zero production console errors.
- All indexable prerender routes succeed.
- Higher booking-click rate from service and local pages.
- Higher product conversion from advice/blog traffic.
- Improved CTR for priority commercial queries.
- No decline in organic clicks after visual changes.

---

## 8. Recommended delivery order

1. Confirm the canonical public phone, review totals, pricing source and core business facts with Jena.
2. Noindex and clean the six unfinished local articles.
3. Remove synthesized comparison prices and unsupported local claims.
4. Implement real 404 responses and remove deleted content from the sitemap.
5. Clean the sitemap, noindex internal search and reconcile the 273-URL production build with local generation.
6. Align every canonical, sitemap, OG, schema and internal link on the trailing-slash form.
7. Repair broken service fragments, LeadConnector and SearchAtlas integration errors.
8. Fix collection prerender failures and make incomplete prerendering fail the build.
9. Improve mobile LCP and accessibility.
10. Approve Direction A desktop and 390 px visual boards.
11. Replace hero and Jena assets with real directed media.
12. Simplify the header and establish the custom design system.
13. Recompose homepage sections, services and the product shelf.
14. Consolidate or strengthen local pages using real proof and GSC demand.
15. Build the GSAP Level 1 motion layer.
16. Prototype `/labs/chair-to-shelf`.
17. Decide whether Blender or Three.js adds enough value to graduate.
18. Roll out page by page with SEO, conversion and performance regression checks.

---

## 9. Approval gates

Tyson should approve before implementation:

1. Correct public phone and business facts.
2. Direction A, B or C as the visual north star.
3. Desktop and 390 px representative visual boards.
4. Whether the active 20% QIQI strip stays, becomes scheduled, or is removed.
5. Which real salon assets can be commissioned or reused.
6. Whether the motion prototype is real-footage frame scrub or Blender product scene.

No full 3D production should begin before the mobile performance foundation and still-frame direction are approved.
