# PR5 — Local Route & Article Cannibalisation Inventory

> Branch: `refactor/local-seo-consolidation`
> Commit: `c202e8c`
> Scope: All `/areas/:slug` location pages + all `Local` category blog posts + the regional guide.

> **Analytics status (2026-07-26): BLOCKED.** No authorised GSC or GA4 reporting connection was available locally. All performance fields below are deliberately blank. Structural overlap is confirmed from repository evidence; merge, `noindex`, redirect, canonical, and new-location decisions remain unapproved until first-party query and conversion data is supplied.

---

## 1. Route Structure (source of truth)

| Route | Page Component | Data Source | Type |
|-------|---------------|-------------|------|
| `/` | `Index.tsx` | — | Home |
| `/areas` | `AreasIndex.tsx` | `locationPages.ts` | Hub |
| `/areas/:slug` | `LocationPage.tsx` | `locationPages.ts` | **Area page** |
| `/blog` | `Blog.tsx` | `blogSummaries.ts` | Blog hub |
| `/blog/:slug` | `BlogPost.tsx` | `blog-posts/*.tsx` via glob import | **Article** |
| `/suburbs/:suburb` | `SuburbRedirect.tsx` | legacy map → 301 to `/areas/:slug` | Redirect |
| `/sitemap` | `Sitemap.tsx` | hardcoded link list | Sitemap |

Legacy doc `SUBURB_PAGES_GUIDE.md` describes an old `/near/:suburb` scheme that no longer exists in the live codebase. The current scheme is `/areas/:slug`.

---

## 2. Area Pages Inventory

### 2.1 All 17 live area pages (`/areas/:slug`)

All share identical `popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"]`.

All use the SEO title template: `"Hairdresser & Hair Salon near {name} | Hair Pinns"`.

| # | Slug | Name | Postcode | Drive Time | In Sitemap? |
|---|------|------|----------|------------|-------------|
| 1 | `bangor-2234` | Bangor | 2234 | On-site | ✅ |
| 2 | `menai-2234` | Menai | 2234 | 5–8 min | ✅ |
| 3 | `illawong-2234` | Illawong | 2234 | 8–10 min | ✅ |
| 4 | `alfords-point-2234` | Alfords Point | 2234 | 6–8 min | ✅ |
| 5 | `sutherland-2232` | Sutherland | 2232 | 8–10 min | ✅ |
| 6 | `kirrawee-2232` | Kirrawee | 2232 | 12–15 min | ✅ |
| 7 | `kareela-2232` | Kareela | 2232 | 10–12 min | ✅ |
| 8 | `como-2226` | Como | 2226 | 12–15 min | ✅ |
| 9 | `gymea-2227` | Gymea | 2227 | 10–12 min | ✅ |
| 10 | `miranda-2228` | Miranda | 2228 | 15–20 min | ✅ |
| 11 | `cronulla-2230` | Cronulla | 2230 | 20–25 min | ✅ |
| 12 | `caringbah-2229` | Caringbah | 2229 | 15–20 min | ✅ |
| 13 | `sylvania-2224` | Sylvania | 2224 | 18–22 min | ✅ |
| 14 | `jannali-2226` | Jannali | 2226 | 15–18 min | ✅ |
| 15 | `oyster-bay-2225` | Oyster Bay | 2225 | 15–18 min | ✅ |
| 16 | `padstow-2211` | Padstow | 2211 | 30–35 min | ✅ |
| 17 | `barden-ridge-2234` | Barden Ridge | 2234 | 5–7 min | ✅ |

**Implementation status:** sitemap generation now derives all 17 area routes from `locationPages.ts`; the production build and source-derived parity check both report zero missing area slugs.

---

## 3. Blog Article Inventory (Local category)

### 3.1 "Best Hair Salon Near" series (8 articles)

All share the same **template**: 5-section structure with local drive rationale, client values breakdown, popular services, why-the-trip-works, and "try us first" offer. All end with an identical FAQ block (kids cuts, same-day availability, older clients, parking) — reused verbatim across all articles except Menai which has suburb-specific FAQ questions.

All use the H1 pattern: `"Best Hair Salon Near {Suburb}: What the Locals Say"`.

| # | Slug | Suburb | Has Area Page? | Intents Overlap? |
|---|------|--------|---------------|-------------------|
| 1 | `best-hair-salon-bangor` | **Bangor** | ✅ `bangor-2234` | **Direct overlap** |
| 2 | `best-hair-salon-near-menai` | Menai | ✅ `menai-2234` | **Direct overlap** |
| 3 | `best-hair-salon-near-illawong` | Illawong | ✅ `illawong-2234` | **Direct overlap** |
| 4 | `best-hair-salon-near-sutherland` | Sutherland | ✅ `sutherland-2232` | **Direct overlap** |
| 5 | `best-hair-salon-near-cronulla` | Cronulla | ✅ `cronulla-2230` | **Direct overlap** |
| 6 | `best-hair-salon-near-como` | Como | ✅ `como-2226` | **Direct overlap** |
| 7 | `best-hair-salon-near-miranda` | Miranda | ✅ `miranda-2228` | **Direct overlap** |
| 8 | `best-hair-salon-near-engadine` | Engadine | ❌ (no area page) | **No overlap** |

**7 of 8 articles directly compete with their corresponding `/areas/:slug` page** for the same Google search intent: `"best hair salon near {suburb}"` / `"hairdresser near {suburb}"`.

### 3.2 Regional guide (1 article)

| Slug | Intent | Overlaps With |
|------|--------|---------------|
| `sutherland-shire-hair-salon-guide` | "Sutherland Shire hair salon guide" | **All 17 area pages** (umbrella intent) |

This article targets a broader informational intent (how to choose a salon) rather than transactional (book now), but its meta description and content still reference specific suburbs (Menai, Illawong, Bangor, Miranda, Cronulla), creating soft overlaps.

---

## 4. Cannibalisation Matrix

### 4.1 Direct intent conflicts (high priority)

| Query Intent | Competing URLs | Count |
|-------------|----------------|-------|
| `hair salon near Menai` | `/areas/menai-2234` + `/blog/best-hair-salon-near-menai` | **2** |
| `hair salon near Illawong` | `/areas/illawong-2234` + `/blog/best-hair-salon-near-illawong` | **2** |
| `hair salon near Sutherland` | `/areas/sutherland-2232` + `/blog/best-hair-salon-near-sutherland` | **2** |
| `hair salon near Cronulla` | `/areas/cronulla-2230` + `/blog/best-hair-salon-near-cronulla` | **2** |
| `hair salon near Como` | `/areas/como-2226` + `/blog/best-hair-salon-near-como` | **2** |
| `hair salon near Miranda` | `/areas/miranda-2228` + `/blog/best-hair-salon-near-miranda` | **2** |
| `hair salon near Bangor` / `hair salon in Bangor` | `/areas/bangor-2234` + `/blog/best-hair-salon-bangor` | **2** |
| `hair salon Sutherland Shire` | `/areas/*` (17 pages) + `/blog/sutherland-shire-hair-salon-guide` | **18** |

### 4.2 Near-duplicate content issues (medium priority)

The "best hair salon near X" blog articles share **identical FAQ blocks** (kids cuts, same-day appointment, older clients, parking) across 7 of 8 articles. Menai is the exception with suburb-specific FAQs. This is a near-duplicate content risk — 7 pages with the same 4 Q&As.

### 4.3 Topic map overlap

In `src/data/topicMap.ts`, the `cuts` topic includes **all** "best hair salon near" articles plus `best-hair-salon-bangor`. The `smoothing` and `colour` topics include `best-hair-salon-bangor` and `sutherland-shire-hair-salon-guide`. This means the `RelatedContent` component on area pages (which calls `RelatedContent topics={["smoothing", "cuts", "colour", "frizz-control"]}`) may surface these competing blog articles as "related", further confusing intent:

- `/areas/menai-2234` → `RelatedContent` suggests blog article `best-hair-salon-near-menai` (same intent)
- `/areas/cronulla-2230` → `RelatedContent` suggests blog article `best-hair-salon-near-cronulla` (same intent)

### 4.3 GSC/GA4 decision matrix

`—` means unavailable, not zero. No action in the final column is approved while these fields are blank.

| Area URL | Competing article | GSC clicks | GSC impressions | Top query split | GA4 sessions | Booking conversions | Approved action |
|----------|-------------------|------------|-----------------|-----------------|--------------|---------------------|-----------------|
| `/areas/bangor-2234` | `/blog/best-hair-salon-bangor` | — | — | — | — | — | **Pending access** |
| `/areas/menai-2234` | `/blog/best-hair-salon-near-menai` | — | — | — | — | — | **Pending access** |
| `/areas/illawong-2234` | `/blog/best-hair-salon-near-illawong` | — | — | — | — | — | **Pending access** |
| `/areas/sutherland-2232` | `/blog/best-hair-salon-near-sutherland` | — | — | — | — | — | **Pending access** |
| `/areas/cronulla-2230` | `/blog/best-hair-salon-near-cronulla` | — | — | — | — | — | **Pending access** |
| `/areas/como-2226` | `/blog/best-hair-salon-near-como` | — | — | — | — | — | **Pending access** |
| `/areas/miranda-2228` | `/blog/best-hair-salon-near-miranda` | — | — | — | — | — | **Pending access** |
| `/areas/*` | `/blog/sutherland-shire-hair-salon-guide` | — | — | — | — | — | **Pending access** |

---

## 5. Page-by-Page Assessment

| URL | Route | Conversion Role | Unique Content | Repeated Claims | Internal Links | Recommendation |
|-----|-------|----------------|---------------|-----------------|---------------|---------------|
| `/areas/` (index) | hub | Top-of-funnel directory | Lists all 17 suburbs with intros & drive times | None | Links to each `/areas/:slug` | **Keep** — canonical hub |
| `/areas/bangor-2234` | area | **Transactional** — book/directions | Unique intro mentioning On-site, address, 4 unique FAQs, Jena tip | Bangor is "practically your neighborhood salon" | Nearby: Menai, Barden Ridge, Illawong, Alfords Point | **Keep** — canonical area page |
| `/areas/menai-2234` | area | **Transactional** — book/directions | Unique intro, 4 unique FAQs, Jena tip | None | Nearby: Bangor, Illawong, Alfords Point, Sutherland | **Keep** — canonical |
| `/areas/illawong-2234` | area | **Transactional** | Unique intro, 4 unique FAQs, Jena tip | None | Nearby: Menai, Alfords Point, Bangor, Barden Ridge | **Keep** — canonical |
| `/areas/sutherland-2232` | area | **Transactional** | Unique intro, 4 unique FAQs, Jena tip | None | Nearby: Kirrawee, Kareela, Menai, Miranda | **Keep** — canonical |
| `/areas/cronulla-2230` | area | **Transactional** | Unique intro, 4 unique FAQs, Jena tip | None | Nearby: Caringbah, Miranda, Sylvania, Gymea | **Keep** — canonical |
| `/areas/como-2226` | area | **Transactional** | Unique intro, 4 unique FAQs, Jena tip | None | Nearby: Oyster Bay, Jannali, Sutherland, Gymea | **Keep** — canonical |
| `/areas/miranda-2228` | area | **Transactional** | Unique intro, 4 unique FAQs, Jena tip | None | Nearby: Caringbah, Gymea, Sutherland, Kirrawee | **Keep** — canonical |
| `/areas/engadine` | **404** | — | No area page exists | N/A | N/A | **Pending GSC/GA4 demand evidence** — do not create or redirect yet |
| `/blog/best-hair-salon-bangor` | article | **Informational → transactional** | "A Bangor Salon Since 2009" section, transparent pricing angle | Parking info, service list (shared with area page) | Internal links to `/booking` | **Merge into area page content** or add `noindex` if it doesn't earn unique traffic |
| `/blog/best-hair-salon-near-menai` | article | **Informational → transactional** | Real review snippet (Sarah M., Menai), "5-minute drive" detail | FAQ block (4 of 5 identical to other articles), same service list | Internal links to `/booking` | **Reframe** as unique long-form content or add `noindex` for suburb queries |
| `/blog/best-hair-salon-near-illawong` | article | **Informational → transactional** | "Short drive from Illawong via Alfords Point Road" path info | FAQ block (4/5 identical), same service list | Internal links to `/booking` | **Reframe** or **merge** into area page |
| `/blog/best-hair-salon-near-sutherland` | article | **Informational → transactional** | "Full colour packages" focus, Sutherland-specific angle | FAQ block (4/5 identical), same service list | Internal links to `/booking` | **Reframe** or **merge** |
| `/blog/best-hair-salon-near-cronulla` | article | **Informational → transactional** | "Beach-and-sun hair" angle, salt/chlorine/UV focus | FAQ block (4/5 identical), same service list | Internal links to `/booking` | **Keep as distinct content** — ocean/beach angle is unique, **reframe FAQ** to be unique |
| `/blog/best-hair-salon-near-como` | article | **Informational → transactional** | "Como Bridge" route detail, riverside focus | FAQ block (4/5 identical), same service list | Internal links to `/booking` | **Reframe** or **merge** |
| `/blog/best-hair-salon-near-miranda` | article | **Informational → transactional** | Family-appointment angle, Westfield parking contrast | FAQ block (4/5 identical), same service list | Internal links to `/booking` | **Keep as distinct content** — family focus is unique, **reframe FAQ** |
| `/blog/best-hair-salon-near-engadine` | article | **Informational → transactional** | Family multi-gen angle (kids, mum, seniors), unique positioning since no area page exists | FAQ block (4/5 identical) | Internal links to `/booking` | **KEEP** — only page targeting Engadine. **Create area page** for Engadine or keep blog as canonical. |
| `/blog/sutherland-shire-hair-salon-guide` | article | **Informational** (editorial guide) | How-to-choose-a-salon advice, no hard sell | References individual suburbs | Links to `/blog/meet-jena` | **Keep** — different intent (informational vs transactional). Ensure area pages don't link here for same-suburb queries. |

---

## 6. Evidence Requirements Per Recommendation

| Action | Needs GSC/GA4 Evidence? | What to Check |
|--------|------------------------|--------------|
| Merge blog → area page | ✅ | Which URL ranks for `hair salon near [suburb]`? If blog outranks area page → merge content into area page and `noindex` blog |
| `noindex` blog article | ✅ | Check blog article has <20% of area page's traffic AND no unique keyword rankings |
| Reframe blog (different angle) | ✅ | Confirm blog ranks for unique secondary keywords not targeted by area page |
| Create Engadine area page | ✅ | Confirm meaningful Engadine query demand, article landing traffic, and conversion role before introducing another competing URL |
| Keep both (different intent) | ✅ | Confirm blog ranks for informational queries, area page for transactional queries |
| Fix FAQ duplication across 7 articles | ❌ | Clear content quality issue — rewrite each FAQ block to be suburb-specific |

---

## 7. TDD / Test Seams

Any refactoring (merge, `noindex`, canonical redirects) should add/update these test seams:

| Test | File | What It Covers |
|------|------|----------------|
| Blog slug → module loader match | `BlogPost.tsx` `import.meta.glob` | Verifying each `best-hair-salon-near-*` slug resolves to a `.tsx` module |
| Location redirect mapping | `SuburbRedirect.tsx` | All legacy suburb slugs map to the correct `/areas/:slug` |
| Location data integrity | `locationPages.ts` | Every location has `slug`, `name`, `nearbyLocations` that reference existing slugs |
| No orphaned `nearbyLocations` | `locationPages.ts` | Every slug in `nearbyLocations[]` must have a corresponding entry in `locationPages` |
| Blog-to-area-page intent dedup | New test | When a blog article exists for a suburb with an area page, verify `noindex` or canonical is set |
| FAQ uniqueness across blog | New test | Each `local`-category blog post's FAQ answers should not be identical to any other post's |
| Sitemap parity | `Sitemap.tsx` | All 17 location slugs should appear in the sitemap (current gap: 4 missing) |

---

## 8. Summary of Recommended Actions (priority order)

1. **HIGH — Resolve 7 direct intent conflicts**: For Menai, Illawong, Sutherland, Cronulla, Como, Miranda, Bangor — decide per pair whether to reframe the blog article or `noindex` it in favour of the area page. GSC evidence needed.
2. **HIGH — Resolve Engadine ownership after analytics access**: Engadine is covered only by the article. Do not add an area page, redirect, or canonical change until query demand and conversion role are verified.
3. **MEDIUM — Fix FAQ duplication**: Rewrite the shared FAQ block (kids cuts, same-day, older clients, parking) to be suburb-unique in each of the 7 affected blog articles.
4. **COMPLETED — Add all area pages to generated sitemaps**: Barden Ridge, Jannali, Oyster Bay, and Padstow now flow from `locationPages.ts`; verified 17/17.
5. **LOW — Fix `RelatedContent` self-conflict**: Area pages currently suggest their competing blog article as "related". Consider filtering out same-suburb blog articles from `RelatedContent` on area pages.
6. **LOW — Archive or prune legacy `SUBURB_PAGES_GUIDE.md`**: Documents a `/near/:suburb` scheme that no longer exists.
7. **TDD SEAMS — Add blog-to-area dedup test** and FAQ-uniqueness test to the test suite.