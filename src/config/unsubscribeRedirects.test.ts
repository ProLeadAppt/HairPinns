import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('real Shopify campaign unsubscribe route is delegated to Shopify', () => {
  const config = readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8');
  const redirects = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');
  expect(config).toContain('from = "/services/account/unsubscribe"');
  expect(config).toContain('to = "https://femtat-zu.myshopify.com/services/account/unsubscribe"');
  expect(redirects).toMatch(/\/services\/account\/unsubscribe\s+https:\/\/femtat-zu\.myshopify\.com\/services\/account\/unsubscribe\s+302!/);
});
