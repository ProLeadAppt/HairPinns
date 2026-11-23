import { describe, expect, it, vi } from 'vitest';
import {
  diffShopifyCatalogs,
  fetchOnlineStoreProducts,
  formatCatalogParityWarnings,
  reportOnlineStoreParity,
} from './shopify-catalog-parity.js';

describe('Shopify catalogue parity', () => {
  it('flags Online Store products that the Storefront API cannot see', () => {
    expect(
      diffShopifyCatalogs({
        onlineStoreHandles: ['hydrate-bundle', 'brushworx-mystique-round-brush', 'juuce-smooth-protect-duo'],
        storefrontHandles: ['hydrate-bundle'],
        retiredHandles: [],
      }),
    ).toEqual({
      missingFromStorefront: ['brushworx-mystique-round-brush', 'juuce-smooth-protect-duo'],
      missingFromOnlineStore: [],
      retiredButLiveOnStorefront: [],
      retiredButLiveOnOnlineStore: [],
    });
  });

  it('flags retired handles that are still published', () => {
    const diff = diffShopifyCatalogs({
      onlineStoreHandles: ['walnut-scrub-hair-scalp-pre-wash-treatment', 'hydrate-bundle'],
      storefrontHandles: ['walnut-scrub-hair-scalp-pre-wash-treatment', 'hydrate-bundle'],
      retiredHandles: ['walnut-scrub-hair-scalp-pre-wash-treatment'],
    });
    expect(diff.retiredButLiveOnStorefront).toEqual(['walnut-scrub-hair-scalp-pre-wash-treatment']);
    expect(diff.retiredButLiveOnOnlineStore).toEqual(['walnut-scrub-hair-scalp-pre-wash-treatment']);
    expect(formatCatalogParityWarnings(diff, {
      'walnut-scrub-hair-scalp-pre-wash-treatment': 'Pure Walnut Scrub Hair & Scalp Pre-wash Treatment',
    })[0]).toContain('walnut-scrub-hair-scalp-pre-wash-treatment');
  });

  it('pages through public products.json and reports a Storefront gap', async () => {
    const firstPage = Array.from({ length: 250 }, (_, index) => ({
      handle: `product-${index + 1}`,
      title: `Product ${index + 1}`,
    }));
    const fetchImpl = vi.fn(async (url) => {
      if (String(url).includes('page=1')) {
        return Response.json({ products: firstPage });
      }
      return Response.json({
        products: [
          { handle: 'brushworx-mystique-round-brush', title: 'Brushworx Mystique Round Brush' },
        ],
      });
    });
    const log = { warn: vi.fn(), log: vi.fn() };
    const storefrontHandles = firstPage.map((product) => product.handle);
    const diff = await reportOnlineStoreParity({
      domain: 'femtat-zu.myshopify.com',
      storefrontHandles,
      fetchImpl,
      log,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(diff.missingFromStorefront).toEqual(['brushworx-mystique-round-brush']);
    expect(log.warn).toHaveBeenCalledOnce();
    expect(log.warn.mock.calls[0][0]).toContain('Brushworx Mystique Round Brush');
  });

  it('skips the check when products.json is unavailable', async () => {
    const log = { warn: vi.fn(), log: vi.fn() };
    const diff = await reportOnlineStoreParity({
      domain: 'femtat-zu.myshopify.com',
      storefrontHandles: ['hydrate-bundle'],
      fetchImpl: async () => new Response('nope', { status: 503 }),
      log,
    });
    expect(diff).toBeNull();
    expect(log.warn.mock.calls[0][0]).toContain('skipped');
  });

  it('rejects a non-Shopify domain', async () => {
    await expect(fetchOnlineStoreProducts('example.com')).rejects.toThrow(/Invalid Shopify domain/);
  });
});
