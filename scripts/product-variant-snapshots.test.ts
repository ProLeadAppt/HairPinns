import { describe, expect, it } from 'vitest';
import { variantSnapshotTarget, variantSnapshotRoutes } from '../shared/productVariantSnapshots.js';
import { collectVariantSnapshotManifest } from './generate-product-variant-snapshots.mjs';
import { variantSnapshotIssue } from './variant-snapshot-validation.mjs';

const manifest = { 'hair-pinns-gift-card': { '45178788085941': { amount: '250.0', currencyCode: 'AUD' }, '10': { amount: '25.0', currencyCode: 'AUD' } } };
const url = (query = '', handle = 'hair-pinns-gift-card') => new URL(`https://hairpinns.com/products/${handle}/${query}`);
describe('variant snapshot routing', () => {
  it('selects the requested snapshot with arbitrary tracking parameters and order', () => {
    expect(variantSnapshotTarget(url('?utm_source=google&variant=45178788085941&country=AU&currency=AUD&utm_extra=a'), manifest)).toBe('/_product-variants/hair-pinns-gift-card/45178788085941/index.html');
    expect(variantSnapshotTarget(url('?variant=10'), manifest, 'HEAD')).toContain('/10/');
    expect(variantSnapshotTarget(url('?variant=gid%3A%2F%2Fshopify%2FProductVariant%2F10'), manifest)).toContain('/10/');
  });
  it('leaves normal product URLs and other methods untouched', () => {
    expect(variantSnapshotTarget(url(), manifest)).toBeNull();
    expect(variantSnapshotTarget(url('?variant=10', 'other-product'), manifest)).toBeNull();
    expect(variantSnapshotTarget(url('?variant=10'), manifest, 'POST')).toBeNull();
  });
  it.each(['', '999', '../10', '10&variant=45178788085941', '__proto__'])('fails closed for invalid or ambiguous variant %s', value => {
    expect(variantSnapshotTarget(url(`?variant=${value}`), manifest)).toContain('/unavailable/');
  });
  it('writes separate known and unavailable snapshots without adding them to the sitemap', () => {
    const routes = variantSnapshotRoutes(manifest);
    expect(routes).toHaveLength(3);
    expect(new Set(routes.map(item => item.path)).size).toBe(3);
    expect(routes[2].expected).toBeNull();
  });
});

describe('snapshot publication guard', () => {
  const html = (price: string, visible: string) => `<script type="application/ld+json">${JSON.stringify({ '@type': 'Product', offers: { price, priceCurrency: 'AUD' } })}</script><section data-product-detail-core="">${visible}</section>`;
  it('requires matching initial visible and schema prices, including decimals', () => {
    const expected = { amount: '4.95', currencyCode: 'AUD' };
    expect(variantSnapshotIssue(html('4.95', '$4.95'), expected)).toBeNull();
    expect(variantSnapshotIssue(html('41.95', '$41.95'), expected)).toContain('schema');
    expect(variantSnapshotIssue(html('4.95', '$41.95'), expected)).toContain('visible');
  });
  it('rejects an unavailable snapshot that advertises another variant', () => {
    expect(variantSnapshotIssue(html('25', '$25.00'), null)).toContain('Unavailable');
    expect(variantSnapshotIssue('This option is not available.', null)).toBeNull();
  });
});

describe('variant catalogue generation', () => {
  const product = { variants: { pageInfo: { hasNextPage: false }, edges: [{ node: { id: 'gid://shopify/ProductVariant/123', price: { amount: '19.95', currencyCode: 'AUD' } } }] } };
  it('retains exact public catalogue prices rather than inventing them', async () => {
    const result = await collectVariantSnapshotManifest(async () => product);
    expect(result['hair-pinns-gift-card']['123']).toEqual({ amount: '19.95', currencyCode: 'AUD' });
  });
  it.each([null, { variants: { edges: [] } }, { variants: { ...product.variants, pageInfo: { hasNextPage: true } } }])('rejects missing or incomplete data', async fixture => {
    await expect(collectVariantSnapshotManifest(async () => fixture)).rejects.toThrow('Incomplete');
  });
  it('rejects bad prices and unexpected currencies', async () => {
    await expect(collectVariantSnapshotManifest(async () => ({ variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/123', price: { amount: 'NaN', currencyCode: 'AUD' } } }] } }))).rejects.toThrow('Invalid');
  });
});
