import { describe, expect, it } from 'vitest';
import { generateCollectionPageSchema, generateSearchResultsItemListSchema } from './schema';

describe('product listing eligibility', () => {
  const item = { name: 'Detangler', description: 'A detangling brush', url: 'https://hairpinns.com/products/detangler/', price: '25' };
  it('keeps collection product discovery without emitting incomplete merchant offers', () => {
    const schema = generateCollectionPageSchema({ name: 'Brushes', description: 'Brushes', url: 'https://hairpinns.com/collections/brushes/', items: [item] });
    expect(schema.mainEntity.itemListElement[0]).toMatchObject({ '@type': 'ListItem', position: 1, name: item.name, url: item.url });
    expect(JSON.stringify(schema)).not.toContain('"@type":"Product"');
    expect(JSON.stringify(schema)).not.toContain('"offers"');
  });
  it('keeps search result links without asserting unverified stock or merchant policies', () => {
    const schema = generateSearchResultsItemListSchema({ query: 'brush', url: 'https://hairpinns.com/search?q=brush', items: [{ name: item.name, url: '/products/detangler/', price: 25 }] });
    expect(schema.itemListElement[0]).toMatchObject({ name: item.name, url: item.url });
    expect(JSON.stringify(schema)).not.toContain('"offers"');
  });
});
