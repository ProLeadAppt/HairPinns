# PR5 Baseline — Local SEO Consolidation

**Branch:** `refactor/local-seo-consolidation`
**Baseline commit:** `c202e8c`
**Captured:** 2026-07-26
**External listing changes submitted:** none

## Access baseline

| System | Status | Evidence / limitation |
|---|---|---|
| Repository | Available | Dedicated PR5 worktree at `D:\hermes-agent\worktrees\hairpinns-pr5` |
| Website build and tests | Available | Local production build completed successfully |
| GSC | Blocked | No Search Console OAuth/client configuration or environment variables found in the worktree |
| GA4 | Blocked | No GA4 property credentials or reporting configuration found in the worktree |
| GBP performance | Blocked | No authorised Business Profile API access available |
| Citation platforms | Read-only | Public sources inspected; no claims, forms, or edits submitted |

Analytics fields in the intent ledger are intentionally blank. URL removal, redirect, canonical, or `noindex` decisions are prohibited until query and conversion evidence is available or Tyson explicitly authorises a non-analytics exception.

## Route baseline

- 17 live `/areas/:slug` pages.
- 8 `best hair salon near` local articles.
- 1 regional Sutherland Shire salon guide.
- 7 direct area/article intent pairs.
- 1 article-only suburb: Engadine.
- 26 rows in the intent ledger.
- All 17 area routes are restored to generated sitemap/prerender discovery after the data-model refactor.

Primary route inventory: `docs/ROUTE_ARTICLE_CANNIBALISATION_INVENTORY.md`
Decision ledger: `.hermes/research/hairpinns-local-intent-ledger.csv`

## Citation baseline

- 13 public sources recorded.
- Critical stale-address conflict spans Yellow Pages, TrueLocal, and Whereis through Sensis listing `580653434`.
- Wrong phone `0468 020 624` appears on ShowMeLocal and Acompio instead of canonical `0416 037 663`.
- Sustainable Salons publishes aligned NAP but links to the retired `/super-inquiry/` route.
- No external corrections were submitted.

Evidence report: `docs/PR5_CITATION_CONFLICT_INVENTORY.md`
Correction ledger: `.hermes/research/hairpinns-citation-ledger.csv`

## Safe implementation completed

- Replaced unsupported suburb-specific travel durations with live-directions guidance.
- Removed invented climate, availability, walk-in, and first-person owner-tip claims from area data.
- Added evidence status to location data.
- Limited local FAQ content and FAQ schema to evidence-backed content.
- Removed unsupported `popular with locals` and suburb-tailored service wording.
- Added source-shape-tolerant route discovery shared by sitemap and prerender collection.

No local article was redirected, removed, canonicalised to another URL, or changed to `noindex`.

## Verified build evidence

- Unit/script tests: 91 passed across 20 files.
- Sitemap: 271 URLs.
- AI discovery and prerender manifest: 273 routes.
- Prerender: 273 passed, 0 failed.
- SEO smoke: 273 passed.
- Internal links: 273 HTML files, 0 unresolved, 0 indirect.
- Crawler hardening: 272 rendered pages, 0 review warnings.

## Remaining phase gates

1. Obtain GSC and GA4 read access and populate the 26-row intent ledger.
2. Make evidence-backed decisions for the 7 direct intent pairs.
3. Implement only approved consolidation actions using RED-GREEN-REFACTOR.
4. Complete independent review and cross-browser desktop/mobile/Fold verification.
5. Publish an unmerged protected preview for Tyson’s explicit review before merge.
