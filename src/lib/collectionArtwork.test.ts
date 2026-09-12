import { afterEach, expect, it, vi } from 'vitest';
import { getCollectionArtwork } from './collectionArtwork';

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

it('uses the merchant collection image before a product photograph', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ data: { card0: {
    handle: 'test-brand-image', image: { url: 'https://cdn.shopify.com/brand.jpg', altText: 'Jena’s chosen image' },
    products: { edges: [{ node: { handle: 'comb', images: { edges: [{ node: { url: 'https://cdn.shopify.com/comb.jpg' } }] } } }] },
  } } })));
  expect(await getCollectionArtwork(['test-brand-image'])).toEqual({ 'test-brand-image': { url: 'https://cdn.shopify.com/brand.jpg', altText: 'Jena’s chosen image' } });
});

it('falls back only to an image within the same published collection', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ data: { card0: {
    handle: 'test-ponytails', image: null,
    products: { edges: [{ node: { handle: 'coloured-ponytail', images: { edges: [{ node: { url: 'https://cdn.shopify.com/ponytail.jpg', altText: 'Coloured ponytail' } }] } } }] },
  }, card1: null } })));
  expect(await getCollectionArtwork(['test-ponytails', 'missing-brand'])).toEqual({ 'test-ponytails': { url: 'https://cdn.shopify.com/ponytail.jpg', altText: 'Coloured ponytail' } });
});

it('bounds a stalled artwork request so it cannot hold prerender indefinitely', async () => {
  vi.useFakeTimers();
  vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(new Error('Artwork request aborted')), { once: true });
  }));
  const result = expect(getCollectionArtwork(['stalled-artwork'])).rejects.toThrow('aborted');
  await vi.advanceTimersByTimeAsync(8000);
  await result;
});
