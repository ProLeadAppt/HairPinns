import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

describe('26 November Ahrefs crawl follow-up', () => {
  it('expands the three static short descriptions without changing routes or prices', () => {
    const updates = read('src/pages/Updates.tsx');
    const service = read('src/data/serviceDetails.ts');
    expect(updates).toContain('Read Jena’s public Hair Pinns email editions');
    for (const descriptor of [
      'Book a long hair wash, cut and blow-dry at Hair Pinns in Bangor.',
      'Book a kids haircut and blow-dry at Hair Pinns in Bangor.',
    ]) expect(service).toContain(descriptor);
    expect(service).toContain('price: "A$ 104"');
    expect(service).toContain('price: "A$ 67"');
  });

  it('retains authoritative references and removes obsolete source URLs', () => {
    const olaplex = read('src/data/blog-posts/olaplex-vs-k18-vs-juuce-bond-repair.tsx');
    const water = read('src/data/blog-posts/best-shampoo-colour-treated-hair-australia.tsx');
    expect(olaplex).not.toContain('/blogs/manual/home-use-with-olaplex-no-3-hair-perfector');
    expect(olaplex).toContain('https://olaplex.com/blogs/news/no3-vs-no3plus');
    expect(water).not.toContain('/water-analysis.html');
    expect(water).toContain('https://www.sydneywater.com.au/about/what-we-do/safe-drinking-water/whats-in-your-water.html');
  });
});

import { auditImageUrl } from '../shared/auditImageUrl.js';
import { renderSitemapUrl } from './sitemap-utils.js';

describe('specific oversized image URL remediation', () => {
  const source = 'https://cdn.shopify.com/s/files/1/0691/6079/6341/files/D7229097-061F-44DC-B88D-E012559483EB.jpg?v=1744176660';
  it('preserves asset and version while constraining the derivative', () => {
    expect(auditImageUrl(source)).toBe(source + '&width=1200');
    expect(auditImageUrl(source + '&width=600')).toBe(source + '&width=600');
    expect(auditImageUrl(source + '&width=2400')).toBe(source + '&width=1200');
    expect(auditImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
  });
  it('emits XML-escaped resized image and leaves smaller unrelated images untouched', () => {
    const normal = 'https://cdn.shopify.com/s/files/1/0691/6079/6341/files/other.jpg?v=1';
    const xml = renderSitemapUrl({loc:'https://hairpinns.com/products/pure-colour-angel-conditioner/', changefreq:'weekly', priority:0.8, images:[{url:source},{url:normal}]});
    expect(xml).toContain(source + '&amp;width=1200');
    expect(xml).toContain(normal + '</image:loc>');
  });
});
