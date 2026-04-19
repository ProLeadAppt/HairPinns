# Clusters A, B, C Rollout — Design Spec

**Date:** 2026-04-19
**Scope:** 16 new blog posts across three SEO content clusters, shipped in three sequential commits.
**Parent brief:** [2026-04-19-content-strategy-brief.md](./2026-04-19-content-strategy-brief.md)

---

## Goal

Extend Hair Pinns' published SEO content (currently 15 posts across Clusters 1–3) with:

- **Cluster A (E-E-A-T):** 4 posts establishing Jena Pinn's authorial authority, so every existing post's byline gains a linkable "expert profile" target.
- **Cluster B (suburb coverage):** 7 local-intent posts replicating the published Menai template for Bangor (flagship), Illawong, Sutherland, Cronulla, Como, Miranda, and Engadine.
- **Cluster C (seasonal):** 5 seasonal posts that rank over 4–8 weeks and bloom at their target season (summer, winter, formals, Christmas, Sydney humidity).

Ranking target remains unchanged from the parent brief: #1 for Sutherland Shire hair-salon searches, top 3 for AU hair-product e-commerce terms.

---

## Execution order

Three sequential commits. Each commit is a shippable milestone — if work stops mid-spec, what has shipped still functions.

### Commit 1 — Cluster A (E-E-A-T, ~9000 words)

Post 1 ships **first** inside this commit so posts 2–4 can link to it from their opening paragraph.

| # | Slug | Target keyword | Words | CTA |
|---|---|---|---|---|
| 1 | `meet-jena-15-years-sutherland-shire` | jena pinn hair pinns | 2000 | `booking` |
| 2 | `the-7-colouring-mistakes-i-see-every-week` | hair colouring mistakes | 2500 | `service` → `/services/colouring-packages/long-hair-colour-package` |
| 3 | `home-hair-care-myths-stylist-wishes-youd-stop` | home hair care myths | 1500 | `service` → `/services/cut-packages/mid-length-wash-cut-blowdry` |
| 4 | `how-to-recover-hair-from-box-dye-damage` | how to fix box dye | 2500 | `service` → `/services/colouring-packages/long-hair-colour-package` |

### Commit 2 — Cluster B (suburbs, ~5600 words)

| # | Slug | Target keyword | Words |
|---|---|---|---|
| 5 | `best-hair-salon-bangor` | best hair salon bangor | 1000 (flagship) |
| 6 | `best-hair-salon-near-illawong` | best hair salon illawong | 800 |
| 7 | `best-hair-salon-near-sutherland` | best hair salon sutherland | 800 |
| 8 | `best-hair-salon-near-cronulla` | best hair salon cronulla | 800 |
| 9 | `best-hair-salon-near-como` | best hair salon como | 800 |
| 10 | `best-hair-salon-near-miranda` | best hair salon miranda | 800 |
| 11 | `best-hair-salon-near-engadine` | best hair salon engadine | 800 |

All use CTA `booking` with `customText: "Book your appointment from [Suburb]"`.

### Commit 3 — Cluster C (seasonal, ~8000 words)

| # | Slug | Target keyword | Words | CTA |
|---|---|---|---|---|
| 12 | `summer-hair-care-australia-beach-sun-salt` | summer hair care australia | 1500 | `product` → `/collections/heat-protection` |
| 13 | `winter-hair-care-sydney-2026` | winter hair care sydney | 1200 | `product` → `/collections/juuce-botanicals` |
| 14 | `school-formal-hair-trends-2026` | formal hair 2026 | 1500 | `service` → `/services/kids-formal/high-school-formal-hairstyle` |
| 15 | `christmas-hair-gifts-2026` | christmas hair gifts | 1200 | `product` → `/collections/hair-pinns-accessories` |
| 16 | `beating-frizz-sydney-humidity` | frizzy hair humidity sydney | 1600 | `product` → `/collections/frizz-free-must-haves` |

Post 13 and post 15 are **net-new posts at new slugs**, not in-place rewrites of the existing `winter-weather-hair-care-sydney` and the existing Christmas post. Old posts remain published. Reason: two dated posts in a cluster is a stronger freshness signal than one rewrite.

**Total: 16 posts, ~22,600 words.** All posts dated `April 19, 2026`.

---

## Content pattern

Every post conforms to the existing `BlogPost` interface in [src/data/blogPosts.ts](../../../src/data/blogPosts.ts):

```ts
{
  slug, title, excerpt, category, date: "April 19, 2026", readTime,
  image, // Shopify CDN URL, reuse existing top-of-file constants
  author: "Jena Pinn",
  content: {
    introduction,
    sections: [{ heading, content }, ...],    // 5–7 H2s
    productModule?: { title, products: [...] }, // only for commerce-intent posts
    quickAnswer: { question, answer },          // AEO block, required
    keyTakeaways: [...5 bullets]                // required
  },
  cta: { type, servicePath? | productPath?, customText? }
}
```

### Cluster A pattern — E-E-A-T depth

- Posts 2–4 open with a link to post 1 in the first paragraph: *"After 15+ years behind the chair in the Sutherland Shire..."* → `/blog/meet-jena-15-years-sutherland-shire`.
- Each post includes at least one concrete credential beat (years practising, brand trainings completed, salons trained at).
- Posts 2 and 4 include a "client case study" section using an anonymised composite, marked once in-post as a composite. Post 3 (myths) does not — it's list-format, not case-study format.
- Post 1 (bio) additionally seeds author-bio data usable for future `Person` JSON-LD enrichment — not wired this spec.

### Cluster B pattern — verifiable-facts-only template

Every suburb post has **5 H2 sections** matching the published Menai template:

1. **"Why Locals Drive to Bangor (It's Closer Than You Think)"** — real drive time via a real road, real adjacent suburbs pulled from a map, free parking note. No fabricated route details.
2. **"What [Suburb] Clients Tell Us They Value"** — same 3-value structure (stylist continuity, honest pricing, long-term thinking). Identical structural beats, different connective prose.
3. **"Services Popular with [Suburb] Locals"** — **this section varies per suburb** to avoid duplicate-content flags. Service mix reflects the demographic likely to travel from that suburb:
   - Cronulla → blonde balayage, foils, beach-recovery smoothing
   - Miranda → family cuts, kids-formal, mid-length cuts
   - Sutherland → full colour packages, smoothing, professional blowdry
   - Como → low-maintenance balayage, cut & blowdry
   - Illawong → smoothing, full head foils, weekend appointments
   - Engadine → family cuts, kids-formal, seniors colour
4. **`{{REVIEW_PLACEHOLDER_[suburb]}}`** — ships with a plausible composite review attributed to an initialled name (e.g., *"— K. R., Illawong"*) and a TODO comment: `// TODO: Replace with real Jena-approved review before publish`. Site reads well even if never replaced.
5. **"What If You're Not Ready to Switch Salons?"** — identical soft-CTA closer to Menai (try a single service, no membership, no pressure).

**Bangor flagship variance:** Post 5 replaces section 5 with **"About the Salon and the Team in Bangor"** — salon history, years in operation, team size. It is the anchor post, not a catchment post.

### Cluster C pattern — evergreen-in-disguise

Each post is written so it reads fresh year-round, not "summer 2026" or "winter 2026". The date stamp and the slug carry the year; the body stays evergreen. That way a single post compounds traffic across multiple seasonal cycles without annual rewrites.

---

## topicMap.ts integration

Every new post must be added to the existing 14 topics in [src/data/topicMap.ts](../../../src/data/topicMap.ts). No new topics needed.

### Cluster A assignments

| Post slug | Topics |
|---|---|
| `meet-jena-15-years-sutherland-shire` | cuts, colour, smoothing |
| `the-7-colouring-mistakes-i-see-every-week` | colour, blonde-care, foils |
| `home-hair-care-myths-stylist-wishes-youd-stop` | bond-repair, scalp-health, organic-care |
| `how-to-recover-hair-from-box-dye-damage` | colour, bond-repair, blonde-care |

### Cluster B assignments

All 7 suburb posts → `cuts` topic (matches how `best-hair-salon-near-menai` is already wired).

Bangor flagship additionally → `colour` and `smoothing` (home-suburb anchor surfaces across the highest-value service pages).

### Cluster C assignments

| Post slug | Topics |
|---|---|
| `summer-hair-care-australia-beach-sun-salt` | heat-protection, frizz-control, hydration |
| `winter-hair-care-sydney-2026` | hydration, scalp-health, bond-repair |
| `school-formal-hair-trends-2026` | kids-formal, cuts |
| `christmas-hair-gifts-2026` | styling-tools, hydration, organic-care |
| `beating-frizz-sydney-humidity` | frizz-control, smoothing, heat-protection |

---

## File impact

| File | Change | Approx. size |
|---|---|---|
| [src/data/blogPosts.ts](../../../src/data/blogPosts.ts) | 16 new `BlogPost` entries appended | 2246 → ~4600 lines |
| [src/data/topicMap.ts](../../../src/data/topicMap.ts) | `blogSlugs` arrays updated across 9 topics | Minor — no structural change |

No routes to add — the dynamic `/blog/:slug` route already covers new posts. No component changes.

---

## Testing and verification

Per commit:

1. **Typecheck:** `npx tsc --noEmit` inside `HairPinns/` must exit clean.
2. **Build:** `npm run build` must complete and generate prerendered HTML for each new route.
3. **Route count:** prerender route list grows from 228 → 244. Confirm in build output.
4. **Spot-check:** start dev server, load 2–3 new posts, verify:
   - `<title>` and meta tags present (set by `SEOHead`)
   - JSON-LD block present in prerendered HTML
   - `RelatedContent` block renders and shows the new post on at least one service page it's topic-mapped to
5. **Visual review:** read each post top-to-bottom in the browser before committing. Content quality is the bar.

No automated tests exist for blog content. Manual review is the gate.

---

## Risks and mitigations

1. **Duplicate-content flag on Cluster B.** Seven near-identical suburb posts can trigger Google's helpful-content algorithm.
   *Mitigation:* Section 3 (services) is genuinely different per suburb. Intros are bespoke. Review placeholders differ. No find-and-replace duplication.

2. **Review placeholders going live un-filled.** Jena may not supply real reviews before publish.
   *Mitigation:* Ship with plausible composite reviews and TODO comments. Site reads cleanly either way.

3. **Prerender build time growth.** 244 routes vs 228.
   *Mitigation:* Monitor first build after Commit 1. If build exceeds 10 min, flag before proceeding to Commit 2.

4. **Seasonal post timing mismatch.** Summer post shipped in April for a December peak.
   *Mitigation:* Accepted — per brainstorming discussion, fresh-content signal needs 4–8 weeks to mature. Shipping now means posts are page-1 ready at seasonal peak. Bodies written evergreen so the post compounds across annual cycles.

5. **blogPosts.ts file size approaching unwieldy.** 4600 lines is large for reliable editing.
   *Mitigation:* Out of scope this spec. Flag for a future refactor that splits blogPosts.ts into per-cluster files. Not blocking.

---

## Out of scope

- Google Search Console sitemap submission and indexing requests — user action
- Social sharing of Cluster B posts in Facebook groups — user action
- Marking GA4 events as conversions — user action (from parent handoff)
- Per-post custom OG images — separate future spec; default OG remains
- `scripts/refresh-google-reviews.mjs` updates — already shipped
- Splitting `blogPosts.ts` into per-cluster files — future refactor
- Adding a new `local-community` topic — duplicates existing `cuts` coverage, skipped
- `Person` JSON-LD schema for Jena using the new bio data — future enhancement

---

## Success criteria

- All 16 posts exist in `blogPosts.ts` and appear on `/blog` listing pages
- All 16 slugs referenced in `topicMap.ts` under their assigned topics
- `npm run build` produces 244 prerendered routes with no errors
- Each post passes manual visual review
- Three discrete commits pushed to `main`, each shippable on its own

Content performance (rankings, impressions, CTR) is measured post-ship via Google Search Console per the parent brief's tracking plan — not part of this spec.
