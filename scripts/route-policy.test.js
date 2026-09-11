import { describe, expect, it } from 'vitest';
import { isIndexableRoute } from './route-policy.js';

describe('catalogue route policy', () => {
  it('keeps customer-facing catalogue routes indexable', () => {
    expect(isIndexableRoute('/collections/haircare-bundles-gift-sets')).toBe(true);
    expect(isIndexableRoute('/collections/juuce-botanicals')).toBe(true);
    expect(isIndexableRoute('/products/christmas-packs')).toBe(true);
  });

  it.each([
    '/collections/hair-care-must-haves-sale-items',
    '/collections/free-extra-eligible',
    '/collections/free-extra-gifts',
    '/collections/best-sellers-march',
    '/collections/jenas-daily-trio',
  ])('excludes internal or paused collection %s', (route) => {
    expect(isIndexableRoute(route)).toBe(false);
  });

  it('keeps the retired Christmas URL out while allowing the verified guide', () => {
    expect(isIndexableRoute('/blog/christmas-gift-packs-at-hair-pinns')).toBe(false);
    expect(isIndexableRoute('/blog/christmas-hair-gifts-2026')).toBe(true);
  });
});
