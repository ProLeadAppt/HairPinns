import { describe, expect, it } from 'vitest';
import {
  excludeRetiredProductHandles,
  isRetiredProductHandle,
} from './retired-products.js';

describe('retired product routing', () => {
  it('excludes the discontinued walnut scrub handle', () => {
    expect(isRetiredProductHandle('walnut-scrub-hair-scalp-pre-wash-treatment')).toBe(true);
    expect(
      excludeRetiredProductHandles([
        'juuce-deep-cleanse-shampoo',
        'walnut-scrub-hair-scalp-pre-wash-treatment',
      ]),
    ).toEqual(['juuce-deep-cleanse-shampoo']);
  });

  it('leaves active product handles unchanged', () => {
    expect(isRetiredProductHandle('juuce-super-soft-hydration-moisture-mask')).toBe(false);
  });
});
