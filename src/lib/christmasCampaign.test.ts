import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { articleDates } from './articleDates';
const source = readFileSync(new URL('../data/blog-posts/christmas-hair-gifts-2026.tsx', import.meta.url), 'utf8');
const post = JSON.parse(source.split('const post = ')[1].split(' as const;')[0]);
describe('Christmas campaign refresh', () => {
  it('preserves the canonical article and original publication date', () => {
    expect(post.slug).toBe('christmas-hair-gifts-2026');
    expect(articleDates(post).datePublished).toBe('2026-09-05');
    expect(articleDates(post).dateModified).toBe('2026-10-29');
    expect(post.author).toBe('Jena Pinn');
  });
  it('keeps service details consistent without old shipping promises', () => {
    expect(source).toContain('free gift wrapping');
    expect(source).toContain('free local pickup');
    expect(source).not.toMatch(/\$150|cut-off|selling fast|limited stock/i);
    expect(post.content.faqSection.some((faq: { answer: string }) => faq.answer.includes('on request'))).toBe(true);
    expect(post.content.sections.some((section: { booking?: boolean }) => section.booking)).toBe(true);
    expect(post.metaDescription.length).toBeLessThanOrEqual(160);
  });
});
