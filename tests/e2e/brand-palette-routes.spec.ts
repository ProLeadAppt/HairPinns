import { expect, test } from '@playwright/test';

// Customer-facing colour contract from Jena's latest approved reference.
// Photograph pixels are deliberately excluded: genuine hair colour is preserved.
for (const route of ['/', '/collections', '/about', '/services', '/booking', '/blog', '/contact', '/faq', '/reviews', '/policies/returns']) {
  test(`light identity replaces the old palette on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    const heading = page.locator('main h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS('color', 'rgb(53, 37, 62)');
    expect(await heading.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(42);
    const retired = await page.evaluate(() => {
      const colours = new Set(['rgb(189, 118, 80)', 'rgb(45, 22, 43)', 'rgb(245, 238, 230)', 'rgb(139, 63, 32)', 'rgb(239, 229, 223)', 'rgb(243, 232, 223)']);
      return Array.from(document.querySelectorAll('main *, header, footer, footer *'))
        .filter(el => el.getBoundingClientRect().width > 0 && !(el instanceof SVGElement))
        .flatMap(el => {
          const s = getComputedStyle(el);
          return ['color', 'backgroundColor', 'borderTopColor'].filter(key => colours.has(s[key as keyof CSSStyleDeclaration] as string)).map(key => `${el.tagName}.${el.className}: ${key}`);
        });
    });
    expect(retired).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
}

test('the app chrome declares the same approved purple and lavender', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#753D91');
  const manifest = await (await page.request.get('/manifest.json')).json();
  expect(manifest.theme_color).toBe('#753D91');
  expect(manifest.background_color).toBe('#F7F1FA');
});

test('contact and service actions retain white text on purple', async ({ page }) => {
  await page.goto('/contact');
  const submit = page.locator('main form button[type="submit"]').first();
  await expect(submit).toHaveCSS('background-color', 'rgb(117, 61, 145)');
  await expect(submit).toHaveCSS('color', 'rgb(255, 255, 255)');
  await page.goto('/services');
  const book = page.getByRole('link', { name: /Book now, .* on Fresha/ }).first();
  await expect(book).toHaveCSS('background-color', 'rgb(117, 61, 145)');
  await expect(book).toHaveCSS('color', 'rgb(255, 255, 255)');
});
