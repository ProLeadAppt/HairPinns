import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { blogSummaries } from '@/data/blogSummaries';
import { BUSINESS_NAP } from '@/config/businessConfig';
const source = readFileSync(new URL('../data/blog-posts/plan-hair-appointment-before-event.tsx', import.meta.url), 'utf8');
const post = runInNewContext('(' + source.split('const post = ')[1].split(' as const;')[0] + ')', { BUSINESS_NAP });
describe('approved event blog', () => {
 it('registers once with matching reviewed title', () => {
  expect(post.title).toBe('Planning your hair for Christmas parties and special events');
  expect(blogSummaries.filter(p => p.slug === post.slug)).toHaveLength(1);
  expect(blogSummaries.find(p => p.slug === post.slug)?.title).toBe(post.title);
  expect(post.content.sections).toHaveLength(7);
  expect(post.publishedDate).toBe('2026-11-11');
 });
 it('does not add unreviewed promotions or FAQs', () => {
  expect(post.showLeadMagnet).toBe(false);
  expect(post.content.faqSection).toBeUndefined();
  expect(post.cta).toBeUndefined();
  expect(source).not.toMatch(/selling fast|limited stock|discount|\bcall\s+0/);
  expect(source).toContain('](/services/)');
 });
 it('reuses existing original portrait', () => {
  expect(readFileSync(new URL('../../public/blog-images/event-appointment-jena.webp', import.meta.url))).toEqual(readFileSync(new URL('../assets/images/jena-founder-1080w.webp', import.meta.url)));
 });
});
