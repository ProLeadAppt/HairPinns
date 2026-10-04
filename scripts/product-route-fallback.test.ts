import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import productVariant from '../netlify/edge-functions/product-variant.js';

const handle = 'newly-published-product';
const request = (path = `/products/${handle}/?variant=123&utm_source=google`, method = 'GET') => new Request(`https://hairpinns.com${path}`, { method });
const env = { SF_STOREFRONT_TOKEN: 'test-public-token', SHOPIFY_MYSHOPIFY_DOMAIN: 'test.myshopify.com', SF_API_VERSION: '2026-07' };
const publicProduct = { data: { product: { id: 'gid://shopify/Product/123' } } };

describe('products published after the static build', () => {
  beforeEach(() => {
    vi.stubGlobal('Netlify', { env: { get: (key: string) => env[key] } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(publicProduct)));
  });
  afterEach(() => vi.unstubAllGlobals());

  it.each(['GET', 'HEAD'])('opens a confirmed public product on a fresh %s request without changing its query', async method => {
    const original = request(undefined, method);
    const next = vi.fn().mockResolvedValue(new Response('Not found', { status: 404 }));
    const result = await productVariant(original, { next });
    expect(result.href).toBe('https://hairpinns.com/_product-shell.html');
    expect(original.url).toContain('?variant=123&utm_source=google');
    expect(next).toHaveBeenCalledOnce();
    const [endpoint, options] = vi.mocked(fetch).mock.calls[0];
    expect(endpoint).toBe('https://test.myshopify.com/api/2026-07/graphql.json');
    expect(JSON.parse(options.body as string).variables).toEqual({ handle });
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([200, 301, 500])('preserves existing HTTP %s responses without querying Shopify', async status => {
    const response = new Response('Existing document', { status });
    expect(await productVariant(request(), { next: () => response })).toBe(response);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    { data: { product: null } },
    { errors: [{ message: 'Denied' }], ...publicProduct },
    { data: { product: { id: 'unexpected' } } },
  ])('keeps a real 404 when Shopify cannot confirm a public product', async payload => {
    vi.mocked(fetch).mockResolvedValue(Response.json(payload));
    const response = new Response('Not found', { status: 404 });
    expect(await productVariant(request(), { next: () => response })).toBe(response);
  });

  it.each(['network', 'timeout', 'http', 'invalid-json'])('fails closed on %s errors', async failure => {
    if (failure === 'network' || failure === 'timeout') vi.mocked(fetch).mockRejectedValue(new Error(failure));
    else vi.mocked(fetch).mockResolvedValue(new Response('Invalid', { status: failure === 'http' ? 503 : 200 }));
    const response = new Response('Not found', { status: 404 });
    expect(await productVariant(request(), { next: () => response })).toBe(response);
  });

  it('keeps a real 404 without existing runtime configuration', async () => {
    vi.stubGlobal('Netlify', { env: { get: () => undefined } });
    const response = new Response('Not found', { status: 404 });
    expect(await productVariant(request(), { next: () => response })).toBe(response);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(['/products/walnut-scrub-hair-scalp-pre-wash-treatment', '/products/new/product', '/products/%2e%2e', '/products/bad_handle', '/collections/example'])('does not recover retired or malformed route %s', async path => {
    const next = vi.fn();
    expect(await productVariant(request(path), { next })).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('leaves POST requests untouched', async () => {
    const next = vi.fn();
    expect(await productVariant(request(undefined, 'POST'), { next })).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

});
