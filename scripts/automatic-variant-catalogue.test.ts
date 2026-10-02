import { describe, expect, it } from 'vitest';
import { collectVariantSnapshotManifest } from '../shared/variantSnapshotCatalogue.js';
import { isRetiredProductHandle } from './retired-products.js';

const variant = (id = '1') => ({ id: `gid://shopify/ProductVariant/${id}`, availableForSale: true, requiresShipping: true, quantityAvailable: 2, price: { amount: '9.95', currencyCode: 'AUD' } });
const page = (nodes: any[], next = false, cursor: string | null = null) => ({ nodes, pageInfo: { hasNextPage: next, endCursor: cursor } });
const product = (handle = 'new-product', variants = page([variant()])) => ({ handle, variants });
const make = (products: any[]) => collectVariantSnapshotManifest(async () => page(products), async () => null);

describe('complete automatic catalogue discovery', () => {
  it('paginates products and variants instead of truncating future variants', async () => {
    const result = await collectVariantSnapshotManifest(async cursor => cursor === null ? page([product('one', page([variant()], true, 'v1'))], true, 'p1') : page([product('two')]), async (handle, cursor) => { expect([handle, cursor]).toEqual(['one', 'v1']); return page([variant('2')]); });
    expect(Object.keys(result)).toEqual(['one', 'two']);
    expect(Object.keys(result.one)).toEqual(['1', '2']);
  });
  it('uses the existing retired-product rule without creating retired snapshots', async () => {
    const result = await collectVariantSnapshotManifest(async () => page([product('walnut-scrub-hair-scalp-pre-wash-treatment'), product()]), async () => null, isRetiredProductHandle);
    expect(Object.keys(result)).toEqual(['new-product']);
  });
  it('preserves sold-out, backorder and digital inventory semantics', async () => {
    const sold = { ...variant('1'), availableForSale: false };
    const backorder = { ...variant('2'), quantityAvailable: 0 };
    const digital = { ...variant('3'), quantityAvailable: 0, requiresShipping: false };
    const result = await make([product('state-product', page([sold, backorder, digital]))]);
    expect(Object.values(result['state-product']).map((v: any) => v.availability)).toEqual(['OutOfStock', 'BackOrder', 'InStock']);
    expect(result['state-product']['3'].requiresShipping).toBe(false);
  });
  it.each(['mask--treatment-', 'untitled-sep30_09-20-43'])('accepts existing safe public handle %s', async handle => expect((await make([product(handle)]))[handle]).toBeDefined());
  it.each(['../escape', '__proto__', 'UPPER'])('rejects unsafe handle %s', async handle => { await expect(make([product(handle)])).rejects.toThrow('Invalid'); });
  it('rejects duplicate handles', async () => { await expect(make([product(), product()])).rejects.toThrow('duplicate'); });
  it('rejects duplicate variants', async () => { await expect(make([product('one', page([variant(), variant()]))])).rejects.toThrow('duplicate'); });
  it('rejects empty variants', async () => { await expect(make([product('one', page([]))])).rejects.toThrow('Empty variants'); });
  it('rejects an empty public catalogue', async () => { await expect(make([])).rejects.toThrow('Empty public catalogue'); });
  it('rejects a missing product cursor', async () => { await expect(collectVariantSnapshotManifest(async () => page([product()], true), async () => null)).rejects.toThrow('Incomplete'); });
  it('rejects repeated product cursors', async () => { let i = 0; await expect(collectVariantSnapshotManifest(async () => page([product(`item-${++i}`)], true, 'same'), async () => null)).rejects.toThrow('Repeated product cursor'); });
  it('rejects repeated variant cursors', async () => { let i = 0; await expect(collectVariantSnapshotManifest(async () => page([product('one', page([variant('0')], true, 'same'))]), async () => page([variant(String(++i))], true, 'same'))).rejects.toThrow('Repeated'); });
  it('rejects missing availability instead of guessing sale state', async () => { const v: any = variant(); delete v.availableForSale; await expect(make([product('one', page([v]))])).rejects.toThrow('Invalid'); });
});
