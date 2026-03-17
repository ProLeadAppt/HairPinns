# Content Pruning Audit Notes

Based on Caleb Ulku's concept: "Implement a pruning system for scaling content while maintaining quality." Avoid thin or duplicate content.

**Audit date:** 2025

---

## 1. Location Page Duplication: /near/ vs /areas/

### Current State

Two parallel location systems exist:

| System | Route | Data Source | Example URLs |
|--------|-------|-------------|-------------|
| SuburbPage | `/near/:suburb` | `suburbPages.ts` | /near/bangor, /near/menai |
| LocationPage | `/areas/:slug` | `locationPages.ts` | /areas/bangor-2234, /areas/menai-2234 |

### Overlap (Same Geographic Area, Different URLs)

| Area | SuburbPage | LocationPage |
|------|------------|--------------|
| Bangor | /near/bangor | /areas/bangor-2234 |
| Menai | /near/menai | /areas/menai-2234 |
| Illawong | /near/illawong | /areas/illawong-2234 |
| Como | /near/como | /areas/como-2226 |
| Gymea | /near/gymea | /areas/gymea-2227 |
| Kirrawee | /near/kirrawee | /areas/kirrawee-2232 |
| Kareela | /near/kareela | /areas/kareela-2232 |
| Miranda | /near/miranda | /areas/miranda-2228 |
| Sutherland | /near/sutherland | /areas/sutherland-2232 |

### Unique to Each System

- **SuburbPage only:** Woronora, Engadine, Heathcote, Alfords Point
- **LocationPage only:** Sydney, Padstow, Cronulla, Sylvania, Caringbah, Jannali, Oyster Bay, Barden Ridge

### Recommendation

1. **No immediate redirects** — Both systems serve different URL structures. SuburbPage uses Caleb Ulku–optimized content (quickAnswer, landmarks, seasonalNote, GEO). LocationPage uses postcode slugs.
2. **Internal linking:** Homepage and primary CTAs use `/near/` (Index.tsx). Header/Footer link to `/areas` (AreasIndex). Consider standardising to `/near/` for suburb pages and using `/areas` only as an index that links to `/near/` where overlap exists.
3. **Future consolidation:** If consolidating, add 301 redirects from `/areas/{slug}` to `/near/{slug}` for overlapping suburbs (e.g. /areas/bangor-2234 → /near/bangor). LocationPage-only areas (Sydney, Cronulla, etc.) would need to be migrated to suburbPages or kept on /areas/.

---

## 2. Blog Content

- Blog posts use `blogPosts.ts` with structured content.
- No thin posts (< 300 words) identified in initial audit.
- Consider running the [GBP Silo Audit](gbp-silo-audit-prompt.md) to ensure blog topics align with service silos.

---

## 3. SuburbRedirect

- `SuburbRedirect.tsx` handles 301 redirects from old `/suburbs/*` to `/near/*`. This is correct—no action needed.

---

## 4. Retail SEO: Blog Content Backlog

**Goal:** Support "hair products Australia" and national retail keywords.

### Post Ideas (Backlog)

- **"Best Hair Products Australia 2025"** — ✅ Done. Roundup of top salon-quality products with expert picks from Jena.
- **"Where to Buy Salon Hair Products in Australia"** — ✅ Done. Guide to buying professional hair care Australia-wide.
- **"Hair Products Melbourne Brisbane Perth Australia"** — ✅ Done. City-specific retail guide for Melbourne, Brisbane, Perth.

### Product Post Optimisation

- Consider adding "Australia" to product-focused post titles/excerpts where natural (e.g. "Salon vs Supermarket Hair Products in Australia").
- Product modules: use "Shop hair care Australia-wide" or similar anchor text occasionally when linking to collections.

---

## 5. Next Steps

- [ ] Decide: consolidate /areas and /near, or keep both with clear internal linking strategy
- [ ] Run GBP Silo Audit (see gbp-silo-audit-prompt.md) for full structure review
- [ ] Re-audit blog for thin or overlapping content annually
- [ ] Create retail-focused blog posts from backlog (see Section 4)
