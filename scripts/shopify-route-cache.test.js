import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  readShopifyRouteCache,
  writeShopifyRouteCache,
} from './shopify-route-cache.js';

const tempDirectories = [];

const makeCachePath = () => {
  const directory = mkdtempSync(join(tmpdir(), 'hairpinns-route-cache-'));
  tempDirectories.push(directory);
  return join(directory, 'shopify-handles.json');
};

afterEach(() => {
  while (tempDirectories.length > 0) {
    rmSync(tempDirectories.pop(), { recursive: true, force: true });
  }
});

describe('Shopify route cache', () => {
  it('replaces a stale inventory with the sitemap inventory for the current build', () => {
    const cachePath = makeCachePath();
    writeFileSync(cachePath, JSON.stringify({
      createdAt: 1,
      products: ['stale-product'],
      collections: ['stale-collection'],
    }));

    writeShopifyRouteCache({
      products: ['current-product'],
      collections: ['current-collection'],
    }, { cachePath, now: 10_000 });

    expect(readShopifyRouteCache('products', { cachePath, now: 10_001 })).toEqual([
      'current-product',
    ]);
    expect(readShopifyRouteCache('collections', { cachePath, now: 10_001 })).toEqual([
      'current-collection',
    ]);
  });

  it('preserves the other inventory when one Shopify query refreshes the cache', () => {
    const cachePath = makeCachePath();
    writeShopifyRouteCache({
      products: ['product-a'],
      collections: ['collection-a'],
    }, { cachePath, now: 20_000 });

    writeShopifyRouteCache({ products: ['product-b'] }, { cachePath, now: 20_100 });

    expect(readShopifyRouteCache('products', { cachePath, now: 20_101 })).toEqual([
      'product-b',
    ]);
    expect(readShopifyRouteCache('collections', { cachePath, now: 20_101 })).toEqual([
      'collection-a',
    ]);
  });

  it('rejects inventories outside the allowed cache age', () => {
    const cachePath = makeCachePath();
    writeShopifyRouteCache({ products: ['product-a'] }, { cachePath, now: 30_000 });

    expect(readShopifyRouteCache('products', {
      cachePath,
      now: 40_001,
      maxAgeMs: 10_000,
    })).toBeUndefined();
  });
});
