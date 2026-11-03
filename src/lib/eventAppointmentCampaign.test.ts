import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { BUSINESS_NAP } from '@/config/businessConfig';
import { describe, expect, it } from 'vitest';
import { articleDates } from './articleDates';
import { articleWordCount } from './articleContent';
import { blogSummaries } from '@/data/blogSummaries';
const source = readFileSync(new URL('../data/blog-posts/plan-hair-appointment-before-event.tsx', import.meta.url), 'utf8');
const post = runInNewContext('(' + source.split('const post = ')[1].split(' as const;')[0] + ')', { BUSINESS_NAP });

describe('Event appointment campaign', () => {
  it('registers the article with honest publication and search metadata', () => {
    expect(post.slug).toBe('plan-hair-appointment-before-event');
    expect(articleDates(post).datePublished).toBe('2026-11-03');
    expect(post.author).toBe('Jena Pinn');
    expect(post.metaDescription.length).toBeLessThanOrEqual(160);
    expect(post.seoTitle.length).toBeLessThanOrEqual(60);
    expect(blogSummaries.filter(summary => summary.slug === post.slug)).toHaveLength(1);
    expect(blogSummaries.find(summary => summary.slug === post.slug)?.title).toBe(post.title);
    expect(articleWordCount(post.content)).toBeGreaterThan(650);
    expect(articleWordCount(post.content)).toBeLessThan(1000);
  });
  it('uses an existing original portrait and useful internal destinations', () => {
    expect(post.image).toBe('https://hairpinns.com/assets/images/jena-founder-1080w-Ky6yef-B.webp');
    expect(readFileSync(new URL('../assets/images/jena-founder-1080w.webp', import.meta.url)).byteLength).toBeGreaterThan(10000);
    expect(source).toContain('](/services/)');
    expect(source).toContain('](/blog/how-to-use-juuce-hair-products/)');
    expect(source).toContain('](/products/juuce-heat-shield/)');
    expect(post.cta.servicePath).toBe('/services/');
    expect(source).not.toMatch(/\/(?:booking|book)\b|selling fast|limited stock|15%|discount|240°C|200°C|\$33\.95/i);
  });
  it('keeps FAQs visible and omits inherited promotional sign-up from this guide', () => {
    expect(post.content.faqSection).toHaveLength(3);
    expect(post.showLeadMagnet).toBe(false);
    const template = readFileSync(new URL('../pages/BlogPost.tsx', import.meta.url), 'utf8');
    expect(template).toContain('index === 4 && post.showLeadMagnet !== false && <LeadMagnetBox />');
    expect(post.content.sections.find((section: { heading: string }) => section.heading === 'Your quick appointment checklist').bullets).toHaveLength(5);
  });
});
