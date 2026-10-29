import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { readFileSync } from 'node:fs';
import GiftGuideBody, { ArticleParagraphs } from './GiftGuideBody';
import { BOOK_URL } from '@/config/bookingConfig';
const source = readFileSync(new URL('../../data/blog-posts/christmas-hair-gifts-2026.tsx', import.meta.url), 'utf8');
const post = JSON.parse(source.split('const post = ')[1].split(' as const;')[0]);
const html = renderToStaticMarkup(<MemoryRouter><GiftGuideBody content={post.content} destination={post.cta.productPath} /></MemoryRouter>);
describe('scoped Christmas gift guide', () => {
  it('renders separate semantic paragraphs rather than collapsed linebreaks', () => {
    const markup = renderToStaticMarkup(<ArticleParagraphs text={'First paragraph.\n\nSecond paragraph.'} />);
    expect(markup.match(/<p /g)).toHaveLength(2);
  });
  it('keeps chooser links and main actions simple without promotional injections', () => {
    expect(html.match(/<h3 /g)).toHaveLength(3);
    expect(html.match(/>Browse gifts/g)).toHaveLength(3); // early CTA, chooser route, closing CTA
    expect(html).not.toMatch(/15%|LeadMagnet|newsletter|Shop the recommendation/);
    expect(html).toContain('Brushes are sold individually.');
    expect(html).toContain(`href="${BOOK_URL}"`);
    expect(html.match(/target="_blank"/g)).toHaveLength(1); // only external booking
    for (const match of html.matchAll(/<a[^>]*>((?:(?!<\/a>)[\s\S])*)<\/a>/g)) expect(match[1]).not.toMatch(/<a[ >]|<button[ >]/);
  });
  it('activates only the explicit layout without changing other article defaults', () => {
    const template = readFileSync(new URL('../../pages/BlogPost.tsx', import.meta.url), 'utf8');
    expect(post.layout).toBe('gift-guide');
    expect(template).toContain('post.layout === "gift-guide"');
    expect(template).toContain('{isGiftGuide ? <GiftGuideBody');
    expect(template).toContain('{index === 4 && <LeadMagnetBox />}'); // legacy branch retained
  });
});
