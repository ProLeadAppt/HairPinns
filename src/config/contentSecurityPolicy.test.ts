import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const policy = readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8')
  .split('\n')
  .find((line) => line.includes('Content-Security-Policy')) || '';

const directive = (name: string) =>
  policy.split(';').map((part) => part.trim()).find((part) => part.includes(`${name} `)) || '';

describe('content security policy', () => {
  it('lets the Meta pixel load and beacon without widening the default source', () => {
    expect(directive('script-src')).toContain('https://connect.facebook.net');
    expect(directive('img-src')).toContain('https://www.facebook.com');
    expect(directive('connect-src')).toContain('https://connect.facebook.net');
    expect(directive('connect-src')).toContain('https://www.facebook.com');
    expect(directive('default-src')).not.toContain('facebook');
  });

  it('lets the Shopify Customer Privacy script load from the Shopify CDN', () => {
    expect(directive('script-src')).toContain('https://cdn.shopify.com');
  });
});
