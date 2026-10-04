import { describe, expect, it } from 'vitest';
import { variantSnapshotTarget, variantSnapshotRoutes } from '../shared/productVariantSnapshots.js';
import { collectVariantSnapshotManifest } from './generate-product-variant-snapshots.mjs';
import { variantSnapshotIssue } from './variant-snapshot-validation.mjs';
import productVariant, { config } from '../netlify/edge-functions/product-variant.js';
import generatedManifest from '../shared/productVariantSnapshots.generated.js';

const manifest = { 'hair-pinns-gift-card': { '45178788085941': { amount: '250.0', currencyCode: 'AUD' }, '10': { amount: '25.0', currencyCode: 'AUD' } } };
const url = (query = '', handle = 'hair-pinns-gift-card') => new URL(`https://hairpinns.com/products/${handle}/${query}`);
describe('variant snapshot routing', () => {
  it('handles HEAD in the function without an unsupported manifest enum', () => {
    expect(config).toEqual({ path: '/products/*' });
    const previous = generatedManifest['hair-pinns-gift-card'];
    generatedManifest['hair-pinns-gift-card'] = manifest['hair-pinns-gift-card'];
    try {
      const request = new Request(url('?variant=45178788085941&utm_source=google'), { method: 'HEAD' });
      const rewritten = productVariant(request);
      expect(rewritten.pathname).toBe('/_product-variants/hair-pinns-gift-card/45178788085941/index.html');
      expect(rewritten.search).toBe('');
      expect(request.url).toContain('variant=45178788085941&utm_source=google');
      expect(productVariant(new Request(url('?variant=10'), { method: 'POST' }))).toBeUndefined();
    } finally {
      if (previous) generatedManifest['hair-pinns-gift-card'] = previous;
      else delete generatedManifest['hair-pinns-gift-card'];
    }
  });
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
  it('rejects another variant even when its price is identical', () => {
    const expected = { amount: '4.95', currencyCode: 'AUD', variantId: '45194473013429' };
    const snapshot = (id: string) => html('4.95', '$4.95').replace('"priceCurrency":"AUD"', `"priceCurrency":"AUD","url":"https://hairpinns.com/products/purple-wide-tooth-combs/?variant=${id}"`);
    expect(variantSnapshotIssue(snapshot('45194472980661'), expected)).toContain('different variant');
    expect(variantSnapshotIssue(snapshot(expected.variantId), expected)).toBeNull();
  });
});

describe('variant catalogue generation', () => {
  it('builds both PetBrush landing pages with their exact distinct public prices', async () => {
    const handle = 'pet-brush-by-wet-brush-pet-detangling-brushes';
    const prices = { '53421957808309': '25.95', '53421957841077': '15.95' };
    const result = await collectVariantSnapshotManifest(async () => ({ variants: {
      pageInfo: { hasNextPage: false },
      edges: Object.entries(prices).map(([id, amount]) => ({ node: { id: `gid://shopify/ProductVariant/${id}`, price: { amount, currencyCode: 'AUD' } } })),
    } }));
    for (const [id, amount] of Object.entries(prices)) {
      expect(result[handle][id]).toEqual({ amount, currencyCode: 'AUD' });
      for (const slash of ['', '/']) {
        expect(variantSnapshotTarget(new URL(`https://hairpinns.com/products/${handle}${slash}?variant=${id}&utm_source=google`), result)).toBe(`/_product-variants/${handle}/${id}/index.html`);
      }
    }
  });
  const product = { variants: { pageInfo: { hasNextPage: false }, edges: [{ node: { id: 'gid://shopify/ProductVariant/123', price: { amount: '19.95', currencyCode: 'AUD' } } }] } };
  it('generates the Lamellar mask and routes the exact submitted Google query', async () => {
    const handle = 'lamellar-vitality-butter-mask-treatment';
    const id = '53403784380597';
    const fixture = { variants: { pageInfo: { hasNextPage: false }, edges: [
      { node: { id: `gid://shopify/ProductVariant/${id}`, price: { amount: '9.95', currencyCode: 'AUD' } } },
      { node: { id: 'gid://shopify/ProductVariant/123', price: { amount: '49.95', currencyCode: 'AUD' } } },
    ] } };
    const result = await collectVariantSnapshotManifest(async () => fixture);
    expect(result[handle]).toEqual({ [id]: { amount: '9.95', currencyCode: 'AUD' }, '123': { amount: '49.95', currencyCode: 'AUD' } });
    const query = `?variant=${id}&country=AU&currency=AUD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic`;
    for (const slash of ['', '/']) {
      const submitted = new URL(`https://hairpinns.com/products/${handle}${slash}${query}`);
      expect(variantSnapshotTarget(submitted, result)).toBe(`/_product-variants/${handle}/${id}/index.html`);
      expect(submitted.search).toBe(query);
    }
    expect(variantSnapshotRoutes(result).find(route => route.route === `/products/${handle}/?variant=${id}`)?.expected).toEqual({ amount: '9.95', currencyCode: 'AUD', variantId: id });
    expect(variantSnapshotTarget(url('?variant=999', handle), result)).toContain('/unavailable/');
    expect(variantSnapshotTarget(url('', handle), result)).toBeNull();
  });
  it('retains exact public catalogue prices rather than inventing them', async () => {
    const result = await collectVariantSnapshotManifest(async () => product);
    expect(result['hair-pinns-gift-card']['123']).toEqual({ amount: '19.95', currencyCode: 'AUD' });
  });
  it('routes all four additional Merchant Center products using catalogue IDs', async () => {
    const handles = ['poppet-locks-little-plaited-piggy-tails', 'purple-wide-tooth-combs', 'wet-brush-original-detangler', 'aromaganic-clean-hair-colour-organics'];
    const result = await collectVariantSnapshotManifest(async () => product);
    for (const handle of handles) {
      expect(result[handle]['123'].amount).toBe('19.95');
      expect(variantSnapshotTarget(url('?utm_source=google&variant=123&currency=AUD', handle), result)).toBe(`/_product-variants/${handle}/123/index.html`);
      expect(variantSnapshotTarget(url('?variant=999', handle), result)).toContain('/unavailable/');
      expect(variantSnapshotTarget(url('', handle), result)).toBeNull();
    }
  });
  it.each([null, { variants: { edges: [] } }, { variants: { ...product.variants, pageInfo: { hasNextPage: true } } }])('rejects missing or incomplete data', async fixture => {
    await expect(collectVariantSnapshotManifest(async () => fixture)).rejects.toThrow('Incomplete');
  });
  it('rejects bad prices and unexpected currencies', async () => {
    await expect(collectVariantSnapshotManifest(async () => ({ variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/123', price: { amount: 'NaN', currencyCode: 'AUD' } } }] } }))).rejects.toThrow('Invalid');
  });
});
