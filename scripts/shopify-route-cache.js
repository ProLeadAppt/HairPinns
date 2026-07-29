import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const SHOPIFY_ROUTE_CACHE_PATH = resolve(
  root,
  'node_modules/.cache/hairpinns/shopify-handles.json',
);
export const SHOPIFY_ROUTE_CACHE_MAX_AGE_MS = 10 * 60 * 1000;

const readCacheDocument = (cachePath) => {
  if (!existsSync(cachePath)) return undefined;
  try {
    const cache = JSON.parse(readFileSync(cachePath, 'utf8'));
    return cache && typeof cache === 'object' ? cache : undefined;
  } catch {
    return undefined;
  }
};

export function readShopifyRouteCache(type, options = {}) {
  const {
    cachePath = SHOPIFY_ROUTE_CACHE_PATH,
    now = Date.now(),
    maxAgeMs = SHOPIFY_ROUTE_CACHE_MAX_AGE_MS,
  } = options;
  const cache = readCacheDocument(cachePath);
  const handles = cache?.[type];
  if (
    !Number.isFinite(cache?.createdAt)
    || now - cache.createdAt >= maxAgeMs
    || !Array.isArray(handles)
    || handles.length === 0
  ) {
    return undefined;
  }
  return handles;
}

export function writeShopifyRouteCache(inventory, options = {}) {
  const {
    cachePath = SHOPIFY_ROUTE_CACHE_PATH,
    now = Date.now(),
  } = options;
  const existing = readCacheDocument(cachePath) || {};
  const cache = {
    ...existing,
    ...inventory,
    createdAt: now,
  };
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cache), 'utf8');
  return cache;
}
