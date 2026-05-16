/**
 * Service detail page routes — single source of truth.
 * Imported by:
 *   - scripts/generate-sitemap.js  (emits /services/<cat>/<svc> URLs in sitemap)
 *   - scripts/collect-prerender-routes.js  (prerenders these routes at build)
 *
 * Mirrors the [categorySlug, serviceSlug] pairs in src/data/serviceDetails.ts.
 * Update here when adding/removing service pages, then both sitemap and
 * prerender pick it up automatically.
 */

export const SERVICE_ROUTES = [
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
