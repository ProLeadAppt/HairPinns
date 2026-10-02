import { beforeAll, describe, expect, it } from 'vitest';
import fixture from './fixtures/merchant-variant-coverage.json';
import { collectVariantSnapshotManifest } from '../shared/variantSnapshotCatalogue.js';
import { variantSnapshotRoutes, variantSnapshotTarget } from '../shared/productVariantSnapshots.js';
import { variantSnapshotIssue } from './variant-snapshot-validation.mjs';

let manifest: any;
beforeAll(async () => {
  const nodes = Object.entries(fixture.products).map(([handle, variants]) => ({ handle, variants: {
    nodes: Object.entries(variants).map(([id, v]) => ({ id: `gid://shopify/ProductVariant/${id}`, sku: v.sku, price: { amount: v.amount, currencyCode: v.currencyCode }, availableForSale: v.availability !== 'OutOfStock', requiresShipping: v.requiresShipping, quantityAvailable: v.availability === 'BackOrder' ? 0 : 1 })),
    pageInfo: { hasNextPage: false },
  } }));
  manifest = await collectVariantSnapshotManifest(async () => ({ nodes, pageInfo: { hasNextPage: false } }), async () => null);
});

describe.each(Object.entries(fixture.products))('previously uncovered catalogue product %s', (handle, variants) => {
  it('retains every recorded variant ID, exact AUD price, SKU and sale/shipping state', () => {
    expect(manifest[handle]).toEqual(variants);
    for (const [id, expected] of Object.entries(variants)) {
      const submitted = new URL(`https://hairpinns.com/products/${handle}?variant=${id}&country=AU&currency=AUD&utm_source=google&utm_campaign=sag_organic`);
      expect(variantSnapshotTarget(submitted, manifest)).toBe(`/_product-variants/${handle}/${id}/index.html`);
      expect(variantSnapshotRoutes(manifest).find(route => route.route === `/products/${handle}/?variant=${id}`)?.expected).toEqual({ ...expected, variantId: id, handle });
    }
    expect(variantSnapshotTarget(new URL(`https://hairpinns.com/products/${handle}?variant=999999999`), manifest)).toContain('/unavailable/');
  });
});

it('includes both price extremes for all twelve differing-price products', () => {
  expect(fixture.differentPriceHandles).toHaveLength(12);
  for (const handle of fixture.differentPriceHandles) {
    const prices = Object.values(manifest[handle]).map((v: any) => Number(v.amount));
    expect(Math.max(...prices)).toBeGreaterThan(Math.min(...prices));
  }
});

describe('publication guards reject catalogue/render drift', () => {
  const expected = { amount: '9.95', currencyCode: 'AUD', sku: 'mask-small', availability: 'BackOrder', requiresShipping: true, handle: 'new-mask', variantId: '101' };
  const html = (overrides: any = {}, canonical = 'https://hairpinns.com/products/new-mask/') => `<link rel="canonical" href="${canonical}"><script type="application/ld+json">${JSON.stringify({ '@type': 'Product', sku: expected.sku, ...overrides.product, offers: { price: '9.95', priceCurrency: 'AUD', url: 'https://hairpinns.com/products/new-mask/?variant=101', availability: 'https://schema.org/BackOrder', shippingDetails: {}, ...overrides.offer } })}</script><section data-product-detail-core="">$9.95</section>`;
  it('accepts the matching existing backorder state', () => expect(variantSnapshotIssue(html(), expected)).toBeNull());
  it('rejects a stale same-price variant identity', () => expect(variantSnapshotIssue(html({ product: { sku: 'mask-large' } }), expected)).toContain('SKU'));
  it('rejects stale availability', () => expect(variantSnapshotIssue(html({ offer: { availability: 'https://schema.org/OutOfStock' } }), expected)).toContain('availability'));
  it('rejects stale physical/digital delivery state', () => expect(variantSnapshotIssue(html({ offer: { shippingDetails: null } }), expected)).toContain('shipping'));
  it('rejects a variant-specific or external canonical', () => {
    expect(variantSnapshotIssue(html({}, 'https://hairpinns.com/products/new-mask/?variant=101'), expected)).toContain('canonical');
    expect(variantSnapshotIssue(html({}, 'https://example.test/products/new-mask/'), expected)).toContain('canonical');
  });
});
