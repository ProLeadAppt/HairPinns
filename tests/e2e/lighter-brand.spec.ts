import { expect, test } from '@playwright/test';

test('homepage uses Jena’s light lavender surface and purple primary action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hero = page.locator('main section').first();
  await expect(hero).toHaveCSS('background-color', 'rgb(247, 241, 250)');
  await expect(hero.getByRole('link', { name: "Shop Jena's shelf" })).toHaveCSS('background-color', 'rgb(117, 61, 145)');
  await expect(hero.getByRole('link', { name: "Shop Jena's shelf" })).toHaveCSS('color', 'rgb(255, 255, 255)');
  const heading = hero.getByRole('heading', { level: 1 });
  expect(await heading.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(42);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('promotion-strip text remains readable when hovered', async ({ page }) => {
  await page.goto('/');
  const promotion = page.locator('[data-cta-placement="header_promo_strip"]');
  await expect(promotion).toBeVisible();
  await promotion.hover();
  await expect(promotion).toHaveCSS('color', 'rgb(117, 61, 145)');
});

test('Christmas collection feature uses the same light surface and readable text', async ({ page }) => {
  await page.goto('/collections');
  const feature = page.locator('section[aria-labelledby="christmas-packs-heading"]');
  await expect(feature).toHaveCSS('background-color', 'rgb(247, 241, 250)');
  await expect(feature.getByRole('heading')).toHaveCSS('color', 'rgb(53, 37, 62)');
});
