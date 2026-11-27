import { describe, expect, it } from 'vitest';
import { canonicalCommerceHref } from './canonicalCommerceHref';

describe('canonical commerce links', () => {
  it('normalizes first-party commerce links while retaining destination and query', () => {
    expect(canonicalCommerceHref('https://hairpinns.com/products/juuce-botanic-oil-serum')).toBe('https://hairpinns.com/products/juuce-botanic-oil-serum/');
    expect(canonicalCommerceHref('/collections/pure-certified-organic-hair-care')).toBe('/collections/pure-certified-organic-hair-care/');
    expect(canonicalCommerceHref('/collections')).toBe('/collections/');
    expect(canonicalCommerceHref('/products/juuce-heat-shield?variant=123#buy')).toBe('/products/juuce-heat-shield/?variant=123#buy');
    expect(canonicalCommerceHref('/collections/juuce-botanicals/')).toBe('/collections/juuce-botanicals/');
  });
  it('leaves external links, file assets and service or checkout destinations unchanged', () => {
    for (const href of [
      'https://wa.me/61416037663', 'https://munyal.com.au/',
      'https://hairpinns.com.example/products/juuce-heat-shield',
      '//example.com/products/example', '/collections/feed.xml',
      '/cart', '/discount/offer', '/services/smoothing',
    ]) expect(canonicalCommerceHref(href)).toBe(href);
  });
});
