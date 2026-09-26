import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
// This file has one universal group. Exercise its actual wildcard rules against
// URLs shared by ads and product links, so Google can read their canonical tags.
const disallowed = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map(([, rule]) =>
  new RegExp('^' + rule.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')),
);

describe('canonical discovery through robots.txt', () => {
  it.each([
    '/?utm_source=google', '/?gclid=example', '/?fbclid=example',
    '/products/wet-brush-pro-detangler/?variant=123',
    '/collections/shampoo/?sort=price', '/collections/shampoo/?filter=colour',
    '/products/wet-brush-pro-detangler/?country=AU&currency=AUD',
    '/collections/shampoo/?phcursor=example',
  ])('lets search engines inspect canonical tags on %s', (url) => {
    expect(disallowed.some((rule) => rule.test(url))).toBe(false);
  });

  it.each(['/checkout', '/account', '/cart', '/dev/example'])('keeps %s blocked', (url) => {
    expect(disallowed.some((rule) => rule.test(url))).toBe(true);
  });
});
