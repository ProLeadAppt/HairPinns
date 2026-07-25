# Hair Pinns 10x SEO, Local SEO, AEO/GEO and Editorial-System Implementation Plan

> **For Hermes:** Use subagent-driven-development to implement this plan task-by-task. Each phase ships as a separate, unmerged PR with a remote Netlify preview, mobile screenshots, and two-stage review before Tyson merges it.

**Goal:** Remove the remaining legacy system and build one truthful, machine-readable, locally authoritative growth system that improves organic visibility, map-pack relevance, AI citation likelihood, ecommerce discovery, and conversion without sacrificing the current Lighthouse, accessibility, or design gains.

**Architecture:** Replace duplicated business facts, schema emitters, route manifests, AI files, and ad-hoc page styles with shared typed registries. Generate every crawler-facing surface from those registries, enforce the After-Hours editorial language in CI, and restructure local/content pages around one primary URL per search intent. Pair on-site work with citation cleanup, verified review proof, supplier/local authority, question-led publishing, and measurement.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind, React Router, prerendered static HTML, Netlify, Shopify Storefront API, Vitest, Playwright, GA4, Google Search Console, Google Business Profile, Bing Webmaster Tools/IndexNow, Fresha, GoHighLevel.

---

## 1. Executive audit verdict

Hair Pinns has a technically strong base. Production currently has 271 indexed sitemap URLs. The audited crawl returned HTTP 200 for every sitemap URL, with one H1, canonical URLs, matching Open Graph URLs, and parseable JSON-LD. Prerendering, true 404 handling, cross-browser coverage, image handling, and the new After-Hours direction are materially better than the average local salon site.

The remaining problem is not a lack of pages or schema. It is fragmentation:

1. The same business is represented with conflicting coordinates, profile URLs, names, review counts, experience claims, and entity IDs.
2. Legacy UI remains on active location and review routes while old and new design tokens coexist globally.
3. The review funnel is explicit review gating, which conflicts with Google Maps policy.
4. Local pages and “best salon near” articles overlap heavily and risk cannibalisation/doorway-page classification.
5. AI files are manually maintained, stale, internally contradictory, and contain unsupported review claims and dead links.
6. Internal link equity leaks into eight unresolved targets, while 28 prerendered pages have no HTML inbound link.
7. Hair Pinns has meaningful off-site proof, especially roughly 936 Fresha venue reviews, 9,200+ completed appointments shown on Fresha’s Jena profile, and Sustainable Salons membership, but the site does not convert those into a coherent, source-attributed authority graph.
8. Hair Pinns appears for Bangor and some one-on-one local intent, but broader Sutherland Shire colour, balayage, smoothing, and national Juuce ecommerce searches are dominated by competitors and marketplaces.

**Strategic order:** repair trust and policy risk first, consolidate entity and intent architecture second, then scale content and authority. Publishing more templated local pages before fixing the truth layer would make the site larger but weaker.

---

## 2. Evidence baseline

### Production and crawl integrity

- Sitemap URLs audited: **271**
- Non-200 sitemap URLs: **0**
- Missing canonical: **0**
- Canonical mismatches: **0**
- Missing or multiple H1s: **0**
- Malformed JSON-LD documents: **0**
- Missing JSON-LD: **0**
- Titles over 65 characters: **100**
- Meta descriptions over 165 characters: **155**
- Duplicate/near-empty meta-description groups: **11 URLs**
- `QAPage` emitters: **38 pages**
- `SpeakableSpecification` emitters: **240 pages**
- `FAQPage` emitters: **262 pages**
- Prerendered HTML documents: **273**, including `/search/` and a canonicalised retired Christmas alias outside the sitemap
- Internal unresolved targets in prerendered HTML: **8**
- Prerendered routes with zero HTML inbound links: **28**

### Internal-link defects

True unresolved targets with no redirect coverage:

- `/areas/sydney/`
- `/collections/styling/`
- `/products/solar-enz/`
- `/products/heat-shield/`
- `/products/dry-heat-guard/`
- `/collections/accessories/`
- `/collections/treatments/`
- `/products/pure-precious-ends-leave-in-treatment/`

A separate high-value external backlink from Sustainable Salons points to the dead `/super-inquiry/` route.

### Programmatic-content similarity

- Area pages: **18 pages**, average **595 words**, average pairwise five-word-shingle similarity **55.1%**; several pairs are **64%–68%** identical.
- “Best hair salon near …” articles: **8 pages**, average pairwise similarity **41.5%**; several pairs exceed **50%**.
- Shipping pages: **20 pages**, average **451 words**, average pairwise similarity **25.8%**; state/city pairs still overlap materially.

### Entity inconsistencies

- Homepage/area coordinates are approximately **617 metres** from the independently verified address pin.
- Contact coordinates are approximately **378 metres** from the verified pin.
- Sustainable Salons publishes `-34.02116155, 151.0389639` for 60 Goorgool Road.
- Fresha/Mapbox publishes approximately `-34.0213547, 151.0391083`.
- Homepage, Contact, and Area pages emit different `sameAs` URLs.
- Homepage emits duplicate Organization nodes, one without an `@id`.
- Contact HairSalon has no stable `@id`.
- Area pages treat the area landing URL as the salon’s business URL.
- Blog posts emit both `BlogPosting` and `Article` for the same content.
- Author Person points to a blog-article fragment instead of a canonical Jena entity.
- The AI corpus claims both 53 and 762 reviews; Fresha currently surfaces roughly 936 venue reviews. No static number should be published without source, scope, and timestamp.

### Off-site NAP/name drift

Canonical proposed identity, subject to Tyson/Jena approval:

- Name: **Hair Pinns**
- Address: **60 Goorgool Road, Bangor NSW 2234**
- Phone: **0416 037 663**
- Public positioning: **appointment-only, one-on-one Bangor hair salon and Australia-wide professional haircare store**

Observed variants:

- Fresha: “Hair Pinns- Bangor Studio”
- Instagram: “Hair Pinn’s Boutique Salon”
- Yellow Pages, TrueLocal, Whereis, and derivative pages: old **14 Burley Close, Illawong** address
- ShowMeLocal: current address but incorrect **0468 020 624** phone
- Historic supplier/social citations: “Home Studio,” “Private Studio,” old Gmail references
- Sustainable Salons: current NAP and useful authority, but a dead booking/action link

### Review-policy risk

`src/pages/Reviews.tsx` routes 1–3 star selections to private feedback and 4–5 star selections to a celebratory Google-review prompt. Google’s official Maps policy prohibits discouraging negative reviews or selectively soliciting positive reviews. This is P0.

### Search-market observations

- Hair Pinns is visible for Bangor and some “near Menai/Illawong” queries.
- Hair Pinns did not surface in the audited natural-language results for “best Bangor salon for colour and smoothing” or Straight Up smoothing in the Sutherland Shire.
- Broader Sutherland Shire colour/balayage/salon SERPs are occupied by Blake & Kwan, Folie, Hair Design by Lara, By ARA, B Hair Collective, Karizma, Sheena’s, Celtic Rootz, directories, and Fresha.
- National Juuce ecommerce SERPs are dominated by the brand, Price Attack, Oz Hair & Beauty, Hairhouse, Catwalk, Chemist Warehouse/Ultra Beauty, and specialist ecommerce retailers.
- One-on-one salon intent works: Hair Pinns surfaced for the audited Menai query.
- Quiet/sensory-friendly appointment demand exists, but it must not be targeted unless Jena confirms the exact accommodations offered.

---

## 3. Non-negotiable implementation rules

1. **Truth before scale.** No experience year, review count, rating, price, service result, duration, climate claim, accessibility claim, team claim, or product claim ships without an owner and source.
2. **One intent, one primary URL.** Supporting articles may answer adjacent questions but must not duplicate the commercial landing page.
3. **No self-awarded “best” claims without an objective methodology and independent evidence.** Existing local “best salon” pages must be consolidated or reframed.
4. **No review gating.** Every customer gets the same choices regardless of rating.
5. **No fake freshness.** `dateModified` and sitemap `lastmod` come from editorial or Shopify update data, never build/deploy timestamps.
6. **Schema mirrors visible content.** No hidden FAQ answers, unsupported ratings, duplicate Article nodes, or ineligible QAPage markup.
7. **LLM files are supplementary, not the strategy.** Keep them accurate and generated, but prioritise crawlable evidence, entity consistency, links, reputation, and useful content.
8. **No blanket programmatic expansion.** New area/shipping pages require distinct demand, content evidence, and conversion purpose.
9. **After-Hours everywhere.** Route surfaces use semantic design roles. Circular avatars/icons and native controls may be explicitly allowlisted, but generic pills, gradient cards, glass cards, ad-hoc shadows, and old token usage fail CI.
10. **Protect current performance and accessibility.** No phase may reduce the agreed Lighthouse baseline or cross-browser/accessibility coverage.
11. **Separate unmerged PRs.** Each phase gets a remote preview, mobile/Fold screenshots, test evidence, and independent review before Tyson merges.

---

## 4. Phase 0: Trust, policy, and crawl-risk repair

### Task 0.1: Replace review gating with a neutral review and feedback experience

**Objective:** Remove Google-policy risk and rebuild the review flow in the After-Hours system.

**Files:**
- Modify: `src/pages/Reviews.tsx`
- Modify: `src/pages/ReviewFeedback.tsx`
- Modify: `src/pages/ReviewGoogle.tsx`
- Modify: `src/App.tsx`
- Modify: `scripts/quality-regression.mjs`
- Test: create `src/pages/reviewFlow.test.tsx` or equivalent focused tests
- Test: add Playwright review-flow scenarios

**Steps:**

1. Add a failing test proving all rating values receive the same two choices: “Leave a public Google review” and “Send private feedback.”
2. Add a failing test proving no branch condition uses rating to decide public-review visibility.
3. Remove the `rating <= 3` versus positive-rating redirect split.
4. Replace the celebratory positive-only page with one neutral thank-you handoff, or remove `/reviews/google` entirely after redirect mapping.
5. Keep private feedback available to everyone and keep the Google action equally prominent to everyone.
6. Remove score-conditioned confetti, “Awesome! Glad You Loved It,” animated social-proof counters, sentiment steering, and positive-only copy.
7. Rebuild all review surfaces with After-Hours semantic classes and accessible, low-motion interactions.
8. Keep feedback submission to GHL, but review whether draft PII needs to persist in `localStorage`; minimise or remove it unless there is a documented requirement.
9. Mark utility review pages `noindex, follow` unless `/reviews/` becomes a genuine public testimonial/review evidence page.
10. Add CI assertions that prohibit rating-conditioned Google-review routing.

**Verification:**

- Test ratings 1 through 5 in Chromium, Firefox, and WebKit.
- Confirm identical public/private options for all five ratings.
- Confirm GHL feedback submission still succeeds.
- Confirm no indexable page contains review-gating copy.
- Confirm no legacy gradient, glass-card, arbitrary shadow, or old brand utility remains in the three review files.

### Task 0.2: Create one canonical business and proof registry

**Objective:** Make every visible and machine-readable business fact derive from one typed source.

**Files:**
- Create: `src/config/entityRegistry.ts`
- Create: `src/config/proofRegistry.ts`
- Modify or replace: `src/config/businessConfig.ts`
- Modify: `src/lib/schema.ts`
- Modify: `src/pages/Index.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/LocationPage.tsx`
- Modify: `src/components/Footer.tsx`
- Modify relevant About, Booking, Service, and Area renderers
- Test: create registry and schema graph tests

**Registry fields:**

- canonical business name and approved aliases
- canonical `@id` values for Organization, HairSalon, Store, WebSite, Jena Person, and physical Place
- complete NAP
- verified geo coordinate pair
- opening hours and special-hours override structure
- official email and public terminology
- canonical Google Business/Profile/review/directions links
- canonical Fresha venue and professional links
- Instagram, Facebook, TikTok, YouTube, Sustainable Salons and approved supplier profiles
- founding/experience wording, with “Behind the chair since 2009” as the current safe claim unless Jena verifies earlier professional experience
- source URL, source type, scope, checked date, and expiry date for dynamic proof
- verified service names/prices sourced from Fresha

**Steps:**

1. Write failing tests showing all current schema emitters disagree on coordinates, IDs, or profile URLs.
2. Agree the canonical display name and venue terminology with Tyson/Jena.
3. Use the Sustainable Salons coordinate pair as the provisional source, then verify against the Google Business Profile pin before production.
4. Move all NAP, hours, geo, links, IDs, and proof metadata into the typed registries.
5. Replace hard-coded facts in components and schema functions.
6. Add a build-time validator that rejects duplicate IDs, conflicting coordinates, conflicting phone/address values, unsupported review counts, expired proof, and noncanonical social handles.
7. Remove parallel constants once every consumer is migrated.

**Verification:**

- Snapshot every LocalBusiness/HairSalon/Organization/Person schema node.
- Assert one coordinate pair and one NAP across every prerendered route.
- Assert every entity reference resolves to a canonical `@id`.
- Compare visible hours against schema hours.
- Verify Google Maps directions open the exact premises pin.

### Task 0.3: Repair broken links and reclaim external authority

**Objective:** Eliminate crawler dead ends and recover backlink value.

**Files:**
- Modify the source links in `src/data/blog-posts/*.tsx`, `src/data/serviceDetails.ts`, `src/data/locationPages.ts`, and `src/pages/Sitemap.tsx`
- Modify: `netlify.toml` for intentional retired-handle redirects
- Modify: `scripts/seo-smoke-test.js` or create `scripts/internal-link-audit.mjs`

**Steps:**

1. Add a failing offline prerender-link test for all eight unresolved targets.
2. Map each stale product/collection handle to the current equivalent product, collection, or useful parent page.
3. Remove `/areas/sydney/` from the HTML sitemap or create a genuine Sydney page only if it has a distinct business purpose.
4. Replace the nonexistent `/collections/styling/` location-page link with an existing relevant collection.
5. Add a permanent redirect from `/super-inquiry/` to the correct booking destination immediately.
6. Ask Sustainable Salons to update the source link to the canonical booking URL rather than relying permanently on the redirect.
7. Run the link checker against generated HTML and Netlify redirect mappings.
8. Fail CI on unresolved internal hrefs and permit explicit, tested aliases only.

**Verification:**

- Missing internal target count: **0**.
- Every redirect is one hop and permanent where appropriate.
- Sustainable Salons action reaches a booking/contact destination.
- No internal link points to a redirect when a direct canonical URL is available.

### Task 0.4: Correct factual contradictions before further publishing

**Objective:** Remove inaccurate or contradictory claims that weaken E-E-A-T and AI citation reliability.

**Files:**
- Modify: `src/data/blog-posts/*.tsx`
- Modify: `src/data/blogSummaries.ts`
- Remove or archive if unused: `src/data/blogPosts.ts`
- Modify: `src/data/locationPages.ts`
- Modify: `src/data/suburbs.ts`
- Modify: `src/data/shippingStates.ts`
- Modify: `src/data/serviceDetails.ts`
- Modify: `src/components/blog/AuthorBio.tsx`
- Modify public AI files temporarily, then replace them with generation in Task 2.5
- Create: `scripts/content-claims-audit.mjs`

**Known claim classes to resolve:**

- “20+ years,” “over 20 years,” “15+ years,” and “since 2009” conflicts
- references to team, staff, senior/junior stylists, or services not currently offered
- stale prices such as old $25/$30 kids-cut examples
- Bangor pages saying both “right here in Bangor” and “15 minutes from Bangor”
- “home salon,” “shopfront,” “studio,” and “boutique salon” inconsistency
- suburb-specific hard-water, humidity, bushland-dryness, commute, and durability claims without sources
- exact treatment duration/result claims not grounded in manufacturer guidance or Jena’s verified protocol
- static review and customer counts without source/scope/date

**Steps:**

1. Add a claim scanner with prohibited legacy phrases and an allowlisted evidence format.
2. Export a claim ledger: claim, URL, source, owner, verified date, expiry, action.
3. Ask Jena one structured fact-confirmation questionnaire rather than interrupting implementation repeatedly.
4. Replace unsupported claims with precise, defensible wording or remove them.
5. Make one blog-content source authoritative. Delete or generate the duplicate monolithic source.
6. Add explicit `datePublished`, `dateModified`, author, reviewer where appropriate, and source references to article records.
7. Require citations for medical/scientific/chemical claims and manufacturer claims.

**Verification:**

- No conflicting experience claims.
- No stale team/price/distance claim in generated HTML.
- Every dynamic proof value has attribution and checked date.
- Content-data compilation and prerender pass.

---

## 5. Phase 1: Extinguish the legacy visual system

### Task 1.1: Define the After-Hours semantic contract

**Objective:** Make the new design system the only route-level styling language.

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.ts`
- Create: `src/styles/editorialRoles.ts` if shared class composition is useful
- Create: `scripts/editorial-system-audit.mjs`
- Modify: `scripts/quality-regression.mjs`

**Semantic roles:**

- page paper, dark canvas, section wash
- display hero, route title, section title, body, caption, ledger label
- primary/secondary/text actions
- editorial rule, framed media, evidence ledger, data table
- product plate, service row, article card, local proof block
- form field, disclosure, notification, utility state

**Steps:**

1. Inventory all old token consumers before deleting tokens.
2. Define the allowed semantic tokens and documented exceptions.
3. Migrate old `--brand-*`, generic `--bg`, `--card`, radius, shadow, glass, and gradient primitives route by route.
4. Remove global legacy aliases only after zero active consumers remain.
5. Add a route-code CI scan that rejects `bg-gradient*`, `from-*`, `to-*`, `glass-card`, generic `shadow-*`, `rounded-card`, `rounded-2xl/3xl`, old brand tokens, and arbitrary RGB/HSL values unless explicitly allowlisted.
6. Allow `rounded-full` only for genuine circles such as avatars, radio dots, progress dots, or icon affordances. Require an inline allowlist comment or semantic utility.
7. Add route-family markers and an audit requiring every route to use the approved shell.

### Task 1.2: Rebuild active legacy route families

**Priority files:**

- `src/pages/LocationPage.tsx`
- `src/pages/Reviews.tsx`
- `src/pages/ReviewFeedback.tsx`
- `src/pages/ReviewGoogle.tsx`
- `src/pages/OrderConfirmation.tsx`
- inspect and migrate residuals in Shipping, ShippingStatePage, Search, Checkout, Confirm, ServerError, Sitemap, NotFound, and utility states

**Known LocationPage legacy patterns:** gradient cards, blurred decorative orbs, pill badges, rounded cards, hover lift/scale, arbitrary shadow, and generic purple token usage.

**Steps per route:**

1. Capture desktop, 390px mobile, and Fold baseline screenshots.
2. Write a route-specific regression assertion for banned legacy classes.
3. Recompose the page using editorial roles, not class substitution.
4. Keep its search intent, structured data, internal links, CTA attribution, and accessibility intact.
5. Verify visual hierarchy, text contrast, focus order, reduced motion, long headings, and no horizontal overflow.
6. Add the route to cross-browser screenshot and interaction tests.

### Task 1.3: Remove dormant legacy renderers and components

**Objective:** Remove old design code that edge redirects make unreachable but that remains importable/bundleable.

**Files to investigate/remove after import proof:**

- `src/pages/SuburbPage.tsx`
- legacy suburb data and obsolete route handlers
- unconditionally registered production dev routes `/dev/collections` and `/dev/shopify`; remove them from production routing or gate the routes and lazy imports behind `import.meta.env.DEV`
- 30 dormant Shopify-theme CSS files under `src/assets/design/`, after proving there are no runtime/build imports
- dormant home/conversion components not imported by the current experience
- dead generic card helpers and old CSS utilities

**Steps:**

1. Build an import graph for `src/`.
2. Generate a list of zero-import components, excluding entries/tests and deliberate dynamic imports.
3. Confirm Netlify redirects cover every legacy public URL.
4. Remove obsolete App lazy imports and route branches.
5. Delete dead components/data and rerun typecheck/build/prerender/E2E.
6. Add a CI check that stops deleted legacy route types from being reintroduced.

**Phase 1 acceptance:**

- Zero unallowlisted legacy-style violations in route code.
- Every App route is represented in the route-style audit.
- Old visual tokens are removed or confined to a documented compatibility boundary with a deletion date.
- All routes pass Chromium, Firefox, WebKit on desktop/mobile/Fold.

---

## 6. Phase 2: Technical SEO and coherent entity graph

### Task 2.1: Emit one connected schema graph per page

**Objective:** Replace arrays of disconnected/duplicate schema objects with a stable `@graph`.

**Files:**
- Refactor: `src/lib/schema.ts`
- Modify: `src/components/SEOHead.tsx`
- Modify page-specific schema calls across Index, Contact, About, Booking, Services, ServiceDetail, Areas, LocationPage, BlogPost, ProductDetail, CollectionDetail, FAQ
- Test: create schema eligibility and graph-reference tests

**Graph rules:**

- Global IDs: `/#website`, `/#organization`, `/#salon`, `/#store`, `/about/#jena-pinn`
- Every WebPage points to WebSite and relevant publisher/provider.
- Every Article/BlogPosting points to canonical Jena Person and Organization.
- Every Service points to canonical salon/provider and a visible Offer when price is exact.
- Every Product points to canonical brand, Offer, merchant return policy, and shipping details when supplied.
- Area pages describe `areaServed`; they do not create a new salon entity at each suburb URL.
- Use one `BlogPosting` type per article, not both Article and BlogPosting.

### Task 2.2: Remove ineligible and low-value schema

1. Delete `QAPage` from first-party editorial answers. Use visible FAQ content plus `FAQPage` only where appropriate, or no special type.
2. Remove site-wide `SpeakableSpecification`. Do not treat it as a generic AI-search lever.
3. Stop emitting FAQ schema on every product/page by default. Keep FAQs for users, but only mark up visible, page-specific questions where it adds semantic clarity.
4. Retire obsolete SearchAction assumptions; Google removed the sitelinks search-box visual feature. Keep WebSite schema simple.
5. Do not add LocalBusiness self-review aggregate markup. Visible, source-attributed review proof may be published without trying to manufacture a star rich result.
6. Validate Product merchant-listing fields and add GTIN/MPN/SKU only where Shopify data is present and accurate.

### Task 2.3: Fix metadata quality at generation time

**Objective:** Replace mechanical character slicing with intent-written metadata and enforce quality thresholds.

**Files:**
- Modify metadata generation in `ProductDetail.tsx`, `CollectionDetail.tsx`, Blog data, Location data, Shipping data, and SEO utilities
- Create: `scripts/metadata-audit.mjs`

**Steps:**

1. Add tests for missing, duplicate, short, long, mid-word-truncated, and boilerplate descriptions.
2. Write human-curated metadata for priority commercial/local pages.
3. Generate fallback product descriptions on sentence or word boundaries, not raw `.slice()` cuts.
4. Do not append shipping boilerplate when it creates 180–190 character descriptions.
5. Set practical editorial targets: distinctive titles generally 35–65 characters and descriptions generally 120–165 characters, with exceptions reviewed rather than blindly rejected.
6. Add duplicate title/description clustering to CI.

**Target:** reduce 100 overlong titles and 155 overlong descriptions to reviewed exceptions only; remove all 11 duplicate/near-empty groups.

### Task 2.4: Make sitemap freshness truthful

**Files:**
- Modify: `scripts/generate-sitemap.js`
- Modify content/product/collection route records
- Test: add sitemap freshness tests

**Steps:**

1. Add explicit `dateModified` to content records.
2. Use Shopify `updatedAt` for products/collections.
3. Use reviewed config dates for static legal/local/service pages.
4. Never derive editorial freshness from checkout file mtimes or deployment dates.
5. Omit `lastmod` where no trustworthy value exists.
6. Add a test that rejects suspicious bulk date assignment.

### Task 2.5: Generate AI-discovery files from live data

**Objective:** Keep `llms.txt`, `llms-full.txt`, `llms.json`, and `ai.txt` accurate without treating them as a ranking shortcut.

**Files:**
- Create: `scripts/generate-ai-discovery.mjs`
- Generate: `public/llms.txt`, `public/llms-full.txt`, `public/llms.json`, `public/ai.txt`
- Modify: `package.json`
- Modify: SEO smoke tests

**Steps:**

1. Generate route lists from the same manifest used by prerender/sitemap.
2. Generate business facts from `entityRegistry` and proof from `proofRegistry`.
3. Exclude dead service-category links and retired handles.
4. Include provenance and checked dates for review/proof claims, or omit dynamic counts.
5. Use canonical trailing-slash URLs.
6. Validate every linked route exists or has a tested redirect.
7. Fail the build if AI files disagree with visible content, route counts, NAP, or schema.

### Task 2.6: Upgrade the offline SEO crawler

**Files:**
- Expand: `scripts/seo-smoke-test.js`
- Create: `scripts/internal-link-audit.mjs`
- Create: `scripts/schema-eligibility-audit.mjs`
- Create: `scripts/content-similarity-audit.mjs`

**Required checks:**

- sitemap-to-prerender parity
- explicit async-data readiness gates for collection/product prerendering; generated collection HTML must contain real product content rather than loading skeletons
- true-404 and noindex utility behavior
- all internal href targets and redirect hops
- canonical/OG equivalence
- title/description quality and duplication
- one H1
- parseable graph with allowed schema matrix by route family
- stable IDs and references
- entity fact consistency
- orphan and low-inbound pages with allowlist
- content similarity thresholds
- stale product/service handles
- AI-file parity
- review-gating prohibition
- truthful `dateModified`

---

## 7. Phase 3: Local SEO consolidation and map-pack strength

### Task 3.1: Build and execute a citation-cleanup ledger

**Create:** `.hermes/research/hairpinns-citation-ledger.csv` during implementation, with platform, URL, current name/address/phone/email/category, desired value, login/owner, action, submitted date, verified date, status, and notes.

**Priority corrections:**

1. Yellow Pages
2. TrueLocal
3. Whereis and syndicated Sensis surfaces
4. ShowMeLocal
5. Yelp
6. MapQuest
7. Beautihost/Acompio/other indexed directories if editable
8. Fresha display name and profile description
9. Instagram display name and bio
10. Supplier stockist pages and old campaign references where practical
11. Sustainable Salons booking/action link

Do not blast low-quality directories. Correct indexed conflicts first, then add only relevant Australian/local/industry citations.

### Task 3.2: Reconcile Google Business Profile

**Requires owner access and explicit approval for external changes.**

1. Confirm name, primary category, secondary categories, address, pin, service area, phone, hours, holiday hours, website, booking URL, products, services, attributes, description, and opening date.
2. Add UTM parameters to website and appointment links without changing canonical URLs.
3. Align service names and current prices with Fresha/site.
4. Publish high-quality first-party interior, Jena-at-work, finished-result, parking/arrival, and product images.
5. Seed and answer genuine Q&A using actual customer questions. Do not fabricate customer personas.
6. Establish a review-response SLA and response style that naturally reinforces services/location without keyword stuffing.
7. Track calls, directions, website clicks, and bookings monthly.
8. Document all changes in the citation ledger.

### Task 3.3: Replace the local doorway-like cluster with a tiered local architecture

**Primary pages:**

- `/areas/bangor-2234/`: definitive location/visit page
- `/areas/`: service-area overview
- selected high-value nearby area pages only when backed by demand/conversion evidence
- core service pages for smoothing, colour, cuts, styling/formal services

**Decision framework per current area page:**

- **Keep and deeply differentiate** if it has impressions, clicks, bookings, meaningful distance/arrival content, local proof, and unique internal links.
- **Merge and 301** if it targets the same intent as a stronger page.
- **Reframe** if it can answer a distinct local question.
- **Noindex temporarily** if weak but awaiting evidence.
- **Remove/301** if it has no demand, links, conversion purpose, or unique content.

Use Search Console and GA4 data before URL retirement. Create a redirect map before changes.

### Task 3.4: Resolve suburb-page/article cannibalisation

1. Map every area page and “best salon near” article to query intent and GSC performance.
2. Choose one primary URL per suburb-commercial intent.
3. Merge self-promotional “best salon” content into the area page where appropriate.
4. Reframe supporting articles into useful, distinct topics such as pricing expectations, travel/parking, smoothing suitability, consultation preparation, or haircare questions for that audience.
5. Remove unsupported “what locals say” phrasing unless supported by quoted, approved, attributed reviews.
6. Add self-referencing canonical, contextual links, and one clear conversion action.

### Task 3.5: Build a policy-compliant review engine

1. Request honest reviews from every completed customer through the same neutral message.
2. Use Fresha’s verified post-appointment review system as the primary authenticity layer.
3. Offer Google and private feedback equally to all recipients.
4. Never incentivise, pre-screen, or selectively solicit positive reviews.
5. Ask permission before reusing review excerpts and transformation images.
6. Store review source, URL/ID, date, permission, services mentioned, and last-verified date.
7. Publish a visible, source-attributed proof page or module without false aggregate schema.
8. Use service-specific proof on relevant service pages where permission allows.

---

## 8. Phase 4: AEO/GEO and question-led content operating system

### Task 4.1: Create an evidence-backed editorial model

**Files:**
- Create a typed content schema for article frontmatter/records
- Create: `src/data/editorialPolicy.ts` or a public `/editorial-policy/` page
- Create a canonical `/about/` Jena profile entity section or dedicated author page
- Add source, reviewedBy, dateModified, fact-check status, service/product relationships, and intent fields

**Required article structure:**

1. Direct 40–80 word answer under the H1.
2. Clear scope and who the answer applies to.
3. Jena’s first-hand perspective or result where truthful.
4. Evidence/source links for factual claims.
5. Comparison/table/checklist where useful.
6. Service/product recommendation only where it solves the question.
7. Visible updated date and author credentials.
8. Related questions and internal links to the primary hub.
9. Original image/video or diagram when it adds evidence.
10. Clear next action without turning every answer into an ad.

### Task 4.2: Build the real-question pipeline

**Sources, in priority order:**

1. Google Search Console queries
2. GHL chat and contact-form questions
3. Fresha messages and verified review language
4. Google Business Profile Q&A and review themes
5. Instagram/TikTok comments and DMs with privacy-safe aggregation
6. Sales/consultation objections recorded by Jena
7. People Also Ask, autocomplete, Reddit, public local groups, and competitor gaps

**Create a question ledger:** question, exact wording, source, frequency, commercial intent, local intent, evidence available, primary URL, status, publish date, update date, impressions/citations/conversions.

### Task 4.3: Establish four defensible content hubs

#### Hub A: Straight Up Smoothing and frizz management

Primary commercial page: the canonical Straight Up Smoothing service page.

Supporting answer topics:

- what Straight Up Smoothing is and is not
- who it suits and who should avoid it
- expected result range by hair type
- aftercare and wash timing
- compatible shampoo/conditioner
- colour timing before/after smoothing
- Straight Up vs keratin vs nanoplasty, using accurate neutral comparisons
- maintenance timeline and cost factors
- Sydney humidity/frizz guidance using defensible general sources, not invented suburb microclimates
- real case studies with consent, treatment protocol, starting condition, result, and follow-up

#### Hub B: Colour, correction, and lived-in maintenance

- colour consultation preparation
- corrective-colour expectations and why quotes vary
- permanent vs demi vs semi vs gloss
- brunette dimension, grey blending, blonde maintenance, colour-safe routines
- strand tests, patch tests, bond repair, and realistic timelines
- local case studies and before/after evidence

Do not claim balayage specialism unless Jena wants that positioning and the portfolio supports it.

#### Hub C: One-on-one Bangor salon experience

- what appointment-only/one-on-one means
- parking and arrival
- who a private/small salon environment suits
- consultation process
- children, teens, formal styling, mature clients, and accessibility only where current services support them
- quiet/sensory-friendly appointments only after Jena confirms the exact available accommodations
- sustainability practices backed by Sustainable Salons evidence

#### Hub D: Hairdresser-curated Australian ecommerce

- hair-concern hubs: dry, damaged, colour-treated, frizzy, fine, scalp care
- brand hubs for Juuce, Pure, Wet Brush, and other stocked brands
- routine builders and “what goes first” guidance
- product comparisons with selection criteria, not generic affiliate-style copy
- usage guides connected to real products in stock
- salon-service aftercare bundles
- shipping, returns, authenticity, and “why buy from a hairdresser” proof

National competition is strong. Focus on expert curation, first-hand use, service aftercare, and unique routines rather than trying to out-range major retailers.

### Task 4.4: Upgrade or prune existing articles

**Triage each article:**

- Keep/update: earns traffic, links, conversions, or fills a real question.
- Merge: overlaps another page.
- Reframe: useful topic but self-promotional/duplicative.
- Retire/301: obsolete promotion, unavailable product, stale claim, or no demand.

**Immediate candidates:**

- merge/reframe the eight “best salon near” articles
- repair all stale product links
- consolidate seasonal Christmas pages into an evergreen gift hub plus seasonally refreshed module
- update unsupported experience claims
- add inbound links to the 14 orphaned blog posts only if they survive triage
- add inbound links or merge the eight orphaned collection pages

### Task 4.5: Build answer-extraction and citation readiness

1. Add concise answer blocks that stand alone when quoted.
2. Use descriptive headings phrased as real questions where natural.
3. Add tables for comparisons, cost factors, maintenance, and suitability.
4. Use stable anchors for subanswers.
5. Cite first-party evidence, manufacturers, Sustainable Salons, and reputable technical sources.
6. Add author/entity references and update history.
7. Avoid unsupported superlatives and vague “expert” repetition.
8. Test monthly natural-language prompts in Google AI Overviews where available, ChatGPT Search, Bing Copilot, Perplexity, and Gemini; record whether Hair Pinns is mentioned/cited and which URL is used.
9. Treat citation tracking as directional, not deterministic ranking proof.

---

## 9. Phase 5: Authority, links, partnerships, and digital PR

### Task 5.1: Link reclamation first

1. Fix Sustainable Salons `/super-inquiry/` and request source correction.
2. Find external links to old Illawong pages/addresses and redirect/update them.
3. Request corrected links from suppliers and stockist directories.
4. Reclaim links to retired product handles where backlinks exist.
5. Monitor 404 logs and Search Console linked-page reports monthly.

### Task 5.2: Supplier and industry authority

Target legitimate profile/stockist links from stocked brands and partners:

- Juuce
- Pure
- Wet Brush/distributors
- Island Vibes
- Poppet Locks
- Sustainable Salons
- other verified stocked brands

Offer useful assets suppliers may link to: approved usage guide, stylist routine, case study, stockist profile, or interview. Never buy links or exchange manipulative anchor text.

### Task 5.3: Local authority

Pursue real relationships rather than directory volume:

- Sutherland Shire business/community publications
- local event/formal/school partnerships where appropriate
- wedding/formal vendors
- sustainability/community initiatives
- local charity campaigns
- complementary Bangor/Menai businesses
- local podcasts or founder profiles

Each partnership should create a real public artifact: event page, interview, case study, guide, scholarship/community contribution, or co-authored resource.

### Task 5.4: First-party data and PR assets

Potential assets, only with verified source data:

- anonymised trends from 9,000+ Fresha appointments
- most common smoothing/colour consultation questions
- Hair Pinns annual Sustainable Salons impact report
- seasonal Shire hair-concern survey
- salon-vs-home routine cost/maintenance calculator
- Australian professional-haircare routine study from customer questions

Do not publish a number simply because Fresha or a title displays it. Capture the source, date, scope, methodology, and permission first.

---

## 10. Phase 6: Ecommerce discovery and merchant visibility

### Task 6.1: Product data quality

1. Audit Shopify product titles, descriptions, brand, vendor, SKU, GTIN/MPN, variants, availability, price, compare-at price, image alt text, updatedAt, and product-type taxonomy.
2. Remove templated FAQs and metadata that do not describe the product.
3. Add unique stylist notes only where Jena has genuinely used/recommends the product.
4. Ensure discontinued/out-of-stock handles have a deliberate retain, alternative, or redirect policy.
5. Add ProductGroup/variant schema only if variants warrant it and data is accurate.

### Task 6.2: Google Merchant Center and Bing shopping readiness

1. Confirm Merchant Center ownership, feed health, shipping, returns, tax, availability, identifiers, and free listings.
2. Match site structured data to feed values.
3. Add merchant return/shipping policy organisation schema from canonical policy data.
4. Set up Bing Webmaster Tools and Bing Merchant Center if commercially justified.
5. Implement IndexNow for genuinely changed/added URLs, not every deployment.

### Task 6.3: Collection architecture

1. Keep collections that map to real demand and a useful shopping decision.
2. Merge duplicated synonym collections.
3. Add concise buyer guidance, differentiators, and contextual links.
4. Repair the eight orphaned collection pages or remove/merge them.
5. Build brand and concern hubs before more promotional collections.

---

## 11. Phase 7: Measurement and operating cadence

### Task 7.1: Establish baselines before URL changes

Export and preserve:

- 16-month GSC query/page/country/device data
- indexed/not-indexed reasons and Core Web Vitals
- top linked pages and internal-link report
- GA4 organic landing pages, bookings, calls, contact submissions, product views, add-to-cart, checkout, and revenue
- GBP calls, directions, website clicks, bookings, query categories, photo views, and review velocity
- Fresha bookings/reviews where exportable
- Shopify organic revenue and product performance
- Bing Webmaster baseline

### Task 7.2: Measurement plan

Before adding dashboards, audit `src/lib/ecommerceTracking.ts` and related trackers. Remove or rename synthetic event types such as `featured_snippet_view` and `zero_click_search`; the browser cannot directly observe those search-engine outcomes. Internal answer-block impressions must be labelled as on-site component events, not AI/SEO visibility.

**Primary local KPIs:**

- non-brand organic clicks to service/local pages
- GBP calls, directions, site clicks, and bookings
- booked appointments by organic landing page and suburb
- Google/Fresha review velocity and response rate
- map-pack/local-finder visibility from a small fixed geo-grid, tracked consistently

**Primary ecommerce KPIs:**

- non-brand product/collection clicks
- product rich-result/merchant eligibility
- organic product views, add-to-cart, checkout, revenue
- brand/concern hub assisted conversions

**AEO/GEO indicators:**

- citations/mentions across a fixed monthly prompt set
- cited URL and claim accuracy
- referral traffic from AI assistants where available
- growth in natural-language and long-tail query impressions

**Quality guardrails:**

- Lighthouse Performance ≥ existing accepted baseline; Accessibility 100 target
- zero true broken internal links
- zero schema parse/eligibility errors
- zero review-gating branches
- zero fact-registry contradictions
- zero unapproved legacy-style violations
- no decline in conversion rate from high-value landing pages without investigation

### Task 7.3: Reporting cadence

- Weekly during migration: crawl, indexation, redirects, errors, conversion anomalies.
- Monthly: SEO/local/AEO scorecard, query clusters, content decay, citation statuses, reviews, GBP actions, links won/lost.
- Quarterly: content prune/merge/update cycle, competitor/AI citation benchmark, schema and design-system audit.

---

## 12. PR sequence

### PR 1: Policy and trust hotfix

- neutral review flow
- `/super-inquiry/` redirect
- eight internal-link repairs
- minimal P0 factual corrections
- tests and Netlify preview

### PR 2: Canonical entity/fact registry

- one NAP/geo/hours/social/proof source
- connected schema IDs
- visible/schema parity
- AI files still patched manually only until PR 4

### PR 3: Legacy design extinction

- LocationPage and review/utility routes
- token migration
- dormant legacy route/component deletion
- route-wide design CI

### PR 4: SEO generation and crawler hardening

- connected schema graph
- QAPage/Speakable/duplicate Article removal
- metadata generator
- truthful sitemap dates
- generated AI files
- internal-link/orphan/similarity/schema/content checks

### PR 5: Local architecture consolidation

- GSC-informed area/article decisions
- redirect map
- primary Bangor and selected area pages
- internal linking and proof modules

### PR 6: Editorial authority foundation

- Jena entity/author page
- editorial policy and source model
- question ledger
- first smoothing/colour/one-on-one pillar upgrades

### PR 7: Ecommerce discovery

- product data/schema/feed improvements
- brand/concern collection architecture
- orphaned collection resolution

Off-site citation/GBP/supplier work runs as a separately approved operations track because it changes external profiles and must be verified one platform at a time.

---

## 13. Verification matrix for every implementation PR

### Local commands

```bash
node node_modules/typescript/bin/tsc --noEmit
npm run lint
npm run quality
npm test -- --run
npm run generate-sitemap
node node_modules/vite/bin/vite.js build
npm run prerender
npm run seo-smoke
npm run test:e2e
```

Use the direct Vite build above for local and preview verification. The repository's `npm run build` script invokes IndexNow, so reserve it for the approved production deployment path after merge; do not submit preview or unmerged URLs.

Add and run when created:

```bash
npm run audit:links
npm run audit:metadata
npm run audit:schema
npm run audit:content
npm run audit:design
npm run audit:similarity
npm run audit:ai-files
```

### Browser matrix

- Chromium, Firefox, WebKit
- desktop 1440px
- mobile 390px
- narrow mobile 320px
- Galaxy Fold-sized viewport
- keyboard-only and reduced-motion checks
- JS error, broken image, overflow, route-navigation, and focus checks

### Production/preview checks

- remote Netlify preview for every PR
- preview crawl before merge
- true 404 status and no soft 404
- canonical/redirect checks
- Rich Results Test for representative Product, Service, Article, LocalBusiness and Breadcrumb pages
- Schema.org validator for the full graph
- PageSpeed/Lighthouse comparison against baseline
- Merchant Center/feed diagnostics for ecommerce changes
- GSC URL Inspection after high-value merges

### Regression thresholds

- no reduction from the accepted performance/accessibility baseline without Tyson approval and documented tradeoff
- zero horizontal overflow and zero broken images
- zero newly orphaned indexable page
- zero unresolved internal target
- zero unsupported review/rating value
- zero duplicate entity ID with conflicting facts
- zero unapproved legacy-style violation

---

## 14. Open decisions required before implementation reaches external profiles

1. Confirm the canonical public display name: “Hair Pinns” versus “Hair Pinns Bangor Studio.” Recommendation: use **Hair Pinns** everywhere and “Bangor Studio” only as a descriptor.
2. Confirm preferred premises terminology: home salon, private studio, boutique salon, or one-on-one salon. Recommendation: **appointment-only, one-on-one Bangor salon** unless Jena prefers otherwise.
3. Confirm Jena’s earliest professional hairdressing year. Until verified, use **Behind the chair since 2009**.
4. Confirm current Google rating and review count directly from GBP, and whether the site may publish source-attributed counts.
5. Confirm current Fresha venue/profile counts and permission for approved excerpts.
6. Confirm exact current service menu, prices, duration ranges, and which services Jena wants to grow.
7. Confirm whether quiet/sensory-friendly appointments are genuinely offered and what accommodations can be promised.
8. Confirm access to GSC, GA4, GBP, Merchant Center, Bing Webmaster Tools, Fresha exports, and citation logins.
9. Confirm whether old Gmail remains the public support email or should be migrated to a domain email.
10. Confirm which stocked brands will cooperate on stockist/profile links and expert content.

---

## 15. What not to do

- Do not create another 50 suburb pages.
- Do not mass-submit to low-quality directories.
- Do not publish AI-written articles without Jena’s evidence and review.
- Do not stuff FAQ schema, `QAPage`, speakable markup, or city names.
- Do not expose dynamic review totals without source and update process.
- Do not claim “best,” “award-winning,” “specialist,” accessibility, or treatment outcomes without evidence.
- Do not redirect all weak content to the homepage.
- Do not redesign page-by-page without CI enforcement.
- Do not merge a large SEO migration without a redirect map, GSC baseline, preview crawl, and staged monitoring.
- Do not sacrifice conversion clarity or performance for content volume.

---

## 16. Definition of 10x complete

The next evolution is complete when:

1. Every active route uses the After-Hours semantic system and legacy route styling cannot pass CI.
2. One canonical registry controls all business, person, place, profile, hours, and proof facts.
3. Every schema node belongs to one connected entity graph and mirrors visible content.
4. Review solicitation is neutral and policy-compliant.
5. All internal links resolve directly, external legacy links are reclaimed, and indexable orphans are eliminated or explicitly justified.
6. Local pages are unique, evidence-backed, conversion-relevant, and not competing with duplicate blog intent.
7. AI files are generated, truthful, canonical, and secondary to the real content/entity system.
8. Jena has a clear, verifiable author/entity profile and a repeatable question-led publishing workflow.
9. Hair Pinns owns a defensible smoothing/colour/one-on-one local topic set and expert ecommerce concern/brand hubs.
10. GBP, Fresha, social profiles, citations, supplier listings, and the site agree on the same entity.
11. Organic bookings, local actions, non-brand clicks, ecommerce revenue, and citation visibility are measured against a preserved baseline.
12. Performance, accessibility, true-404 behavior, cross-browser quality, and conversion paths remain at or above the current standard.
