import { expect, test } from '@playwright/test';

for (const width of [344, 390, 768, 1440]) {
  test(`article shortcuts and readable layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/googletagmanager\.com|google-analytics\.com|clarity\.ms/, route =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
    );
    await page.goto('/blog/sulfate-free-shampoo-australia/', { waitUntil: 'domcontentloaded' });
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText('Sulfate-Free Shampoo');
    expect(await heading.evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeLessThanOrEqual(64);
    const shortcuts = page.getByRole('navigation', { name: 'Article shortcuts' });
    const read = shortcuts.getByRole('link', { name: 'Read the guide', exact: true });
    const picks = shortcuts.getByRole('link', { name: 'See the product picks', exact: true });
    await expect(read).toHaveAttribute('href', '#article-content');
    await expect(picks).toHaveAttribute('href', '#article-products');
    for (const link of [read, picks]) {
      expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
    await read.click();
    await expect(page.locator('#article-content')).toBeInViewport();
    await picks.click();
    await expect(page.locator('#article-products')).toBeInViewport();
    await expect(page.locator('#article-products')).toContainText('Aromaganic');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const hero = page.locator('main picture img').first();
    await expect(hero).toHaveAttribute('src', /Aromaganics-12\.jpg/);
  });
}
