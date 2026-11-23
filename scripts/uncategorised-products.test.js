import { describe, expect, it } from 'vitest';
import {
  productsMissingPublicCollection,
  renderUncategorisedProductsModule,
} from './uncategorised-products.js';

const isPublic = (handle) => handle === 'hair-tools-brushes' || handle === 'juuce-botanicals';

describe('products missing a public collection', () => {
  it('keeps a published product that no public collection lists', () => {
    expect(productsMissingPublicCollection([
      {
        handle: 'brushworx-mystique-round-brush',
        title: 'Brushworx Mystique Round Brush',
        collections: [],
      },
      {
        handle: 'juuce-smooth-protect-duo',
        title: 'Juuce Smooth & Protect Duo',
        collections: ['juuce-botanicals'],
      },
      {
        handle: 'hidden-only',
        title: 'Hidden only',
        collections: ['best-sellers-march'],
      },
    ], isPublic)).toEqual([
      { handle: 'brushworx-mystique-round-brush', title: 'Brushworx Mystique Round Brush' },
      { handle: 'hidden-only', title: 'Hidden only' },
    ]);
  });

  it('writes a module the HTML sitemap can import', () => {
    const source = renderUncategorisedProductsModule([
      { handle: 'brushworx-mystique-round-brush', title: 'Brushworx Mystique Round Brush' },
    ]);
    expect(source).toContain('export const UNCATEGORISED_PRODUCTS');
    expect(source).toContain('brushworx-mystique-round-brush');
  });
});
