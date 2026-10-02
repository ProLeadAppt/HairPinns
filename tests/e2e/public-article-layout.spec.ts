import { expect, test } from '@playwright/test';

const image = '/hair-pinns-logo.webp';
const paragraph = 'Choose something they will use, and check the individual product directions before ordering.';
const fixtures = [
  { name: 'semantic future article', html: `<section><h2>Start with their routine</h2><p>${paragraph}</p><p>A second paragraph gives the reader room to pause.</p></section><section><h2>A useful little gift</h2><p><strong>Mini Pamper Pack · $19.95</strong></p><p>${paragraph}</p><p><a href="/products/mother-s-day-pamper-pack/?variant=123">See the pack →</a></p><figure><img src="${image}" alt="Example gift"><figcaption>The pictured pack.</figcaption></figure></section><p class="price-note"><small>Prices and availability can change.</small></p>` },
  { name: 'older flat editor article', html: `<p>A short introduction from Jena.</p><h2>Getting started</h2><p>${paragraph}</p><p>Keep your usual routine in mind.</p><ul><li>Read the directions</li><li>Choose your option</li></ul><h2>What comes next</h2><p>${paragraph}</p><figure><img src="${image}" alt="Example gift"><figcaption>An older image caption.</figcaption></figure>` },
];

for (const fixture of fixtures) for (const width of [375, 1440]) {
  test(`${fixture.name} has readable rhythm at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/graphql.json', route => route.fulfill({ json: { data: {
      blog: { articleByHandle: { id: 'gid://shopify/Article/1', title: 'Thoughtful little gifts for everyday hair', handle: 'layout-test', contentHtml: fixture.html, excerpt: 'Useful picks for the people you know best.', publishedAt: '2026-10-01T22:00:00Z', author: { name: 'Jena Pinn' }, image: null, seo: null } },
      collections: { edges: [] }, products: { edges: [] },
    } } }));
    await page.goto('/blog/layout-test/');
    const body = page.locator('[data-public-article-body]');
    await expect(body.getByRole('heading', { level: 2 })).toHaveCount(2);
    await expect(body.locator('.journal-section')).toHaveCount(2);
    await expect(body.locator('.journal-section--illustrated')).toHaveCount(1);
    await expect(body).toContainText(paragraph);
    const metrics = await body.evaluate(element => {
      const p = element.querySelector('p')!;
      const style = getComputedStyle(p);
      return { overflow: document.documentElement.scrollWidth > innerWidth, font: parseFloat(style.fontSize), line: parseFloat(style.lineHeight), margin: parseFloat(style.marginBottom), columns: getComputedStyle(element.querySelector('.journal-section--illustrated')!).gridTemplateColumns, copy: element.textContent?.replace(/\s+/g, ' ').trim() };
    });
    expect(metrics.overflow).toBe(false);
    expect(metrics.font).toBeGreaterThanOrEqual(17);
    expect(metrics.line / metrics.font).toBeGreaterThanOrEqual(1.8);
    expect(metrics.margin).toBeGreaterThanOrEqual(20);
    const originalCopy = await page.evaluate(html => new DOMParser().parseFromString(html, 'text/html').body.textContent?.replace(/\s+/g, ' ').trim(), fixture.html);
    expect(metrics.copy).toBe(originalCopy);
    if (width === 1440) expect(metrics.columns.split(' ')).toHaveLength(2);
    else expect(metrics.columns).toBe('none');
    if (fixture.name.includes('semantic')) await expect(body.getByRole('link', { name: 'See the pack →' })).toHaveAttribute('href', '/products/mother-s-day-pamper-pack/?variant=123');
    await expect(body.locator('img')).toHaveAttribute('alt', 'Example gift');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://hairpinns.com/blog/layout-test/');
  });
}
