import { describe, expect, it, vi } from 'vitest';
import { collectShopifyConnection } from './shopify-pagination.js';

describe('Shopify connection pagination', () => {
  it('collects every page in order', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ edges: [{ node: { handle: 'one' } }], pageInfo: { hasNextPage: true, endCursor: 'cursor-1' } })
      .mockResolvedValueOnce({ edges: [{ node: { handle: 'two' } }], pageInfo: { hasNextPage: false, endCursor: 'cursor-2' } });

    await expect(collectShopifyConnection(fetchPage, 'products')).resolves.toEqual([
      { handle: 'one' },
      { handle: 'two' },
    ]);
    expect(fetchPage).toHaveBeenNthCalledWith(1, null);
    expect(fetchPage).toHaveBeenNthCalledWith(2, 'cursor-1');
  });

  it('rejects a connection that claims another page without advancing', async () => {
    const fetchPage = vi.fn().mockResolvedValue({
      edges: [{ node: { handle: 'one' } }],
      pageInfo: { hasNextPage: true, endCursor: null },
    });

    await expect(collectShopifyConnection(fetchPage, 'collections')).rejects.toThrow('did not advance');
  });

  it('refuses an empty inventory', async () => {
    const fetchPage = vi.fn().mockResolvedValue({ edges: [], pageInfo: { hasNextPage: false, endCursor: null } });
    await expect(collectShopifyConnection(fetchPage, 'products')).rejects.toThrow('refusing an incomplete build');
  });
});
