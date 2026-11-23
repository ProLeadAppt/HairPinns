import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const netlifyToml = readFileSync(resolve(root, 'netlify.toml'), 'utf8');

const forcedRedirect = (from, to) => {
  const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedTo = to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`from = "${escapedFrom}"\\s+to = "${escapedTo}"`, 'm');
};

describe('Walnut Scrub product redirects', () => {
  it('does not send the live product URL to a collection', () => {
    expect(netlifyToml).not.toMatch(
      forcedRedirect('/products/walnut-scrub-hair-scalp-pre-wash-treatment', '/collections/scalp-health-care/'),
    );
    expect(netlifyToml).not.toMatch(
      forcedRedirect('/products/walnut-scrub-hair-scalp-pre-wash-treatment/', '/collections/scalp-health-care/'),
    );
  });

  it('sends the legacy singular /product/ URL to the canonical product page', () => {
    expect(netlifyToml).toMatch(
      forcedRedirect('/product/walnut-scrub-hair-scalp-pre-wash-treatment', '/products/walnut-scrub-hair-scalp-pre-wash-treatment/'),
    );
    expect(netlifyToml).toMatch(
      forcedRedirect('/product/walnut-scrub-hair-scalp-pre-wash-treatment/', '/products/walnut-scrub-hair-scalp-pre-wash-treatment/'),
    );
  });
});
