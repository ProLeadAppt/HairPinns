import { describe, expect, it } from 'vitest';
import { articleDates } from './articleDates';
import { generateBlogPostSchema } from './schema';
const fixture = { title: 'Guide', description: 'Advice', author: 'Jena Pinn', image: '/image.jpg', url: '/blog/guide/' };
describe('editorial article dates', () => {
  it('keeps the publication day and rewrite day without inventing a time', () => {
    const dates = articleDates({ date: 'July 26, 2026', publishedDate: '2026-07-26', updatedDate: '2026-10-17' });
    const schema = generateBlogPostSchema({ ...fixture, ...dates });
    expect(schema.datePublished).toBe('2026-07-26');
    expect(schema.dateModified).toBe('2026-10-17');
    expect(dates.updatedLabel).toBe('17 October 2026');
  });
  it('leaves legacy posts without editorial dates unchanged', () => {
    const dates = articleDates({ date: 'July 26, 2026' });
    expect(dates.datePublished).toBe(new Date('July 26, 2026').toISOString());
    expect(dates.updatedLabel).toBeUndefined();
    expect(generateBlogPostSchema({ ...fixture, ...dates }).dateModified).toBe(dates.datePublished);
  });
});
