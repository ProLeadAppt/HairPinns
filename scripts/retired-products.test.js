import { describe, expect, it } from 'vitest';
import {
  RETIRED_PRODUCT_HANDLES,
  excludeRetiredProductHandles,
  isRetiredProductHandle,
} from './retired-products.js';

describe('retired product routing', () => {
  it('treats the live Pure Walnut Scrub product as active', () => {
    expect(isRetiredProductHandle('walnut-scrub-hair-scalp-pre-wash-treatment')).toBe(false);
    expect(RETIRED_PRODUCT_HANDLES.size).toBe(0);
  });

  it('leaves active product handles unchanged when none are retired', () => {
    expect(isRetiredProductHandle('juuce-super-soft-hydration-moisture-mask')).toBe(false);
    expect(
      excludeRetiredProductHandles([
        'juuce-deep-cleanse-shampoo',
        'walnut-scrub-hair-scalp-pre-wash-treatment',
      ]),
    ).toEqual([
      'juuce-deep-cleanse-shampoo',
      'walnut-scrub-hair-scalp-pre-wash-treatment',
    ]);
  });
});
