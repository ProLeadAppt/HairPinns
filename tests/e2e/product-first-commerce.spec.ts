import { expect, test } from '@playwright/test';

const blockThirdParties = async (page: import('@playwright/test').Page) => {
  await page.route(
    /googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/,
    route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
};

test.beforeEach(async ({ page }) => {
  await blockThirdParties(page);
});

test('homepage leads with shopping and keeps booking secondary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const hero = page.locator('main section').first();
  const heroLinks = hero.getByRole('link');
  await expect(heroLinks.first()).toHaveAccessibleName(/shop/i);
  await expect(heroLinks.first()).toHaveAttribute('href', '/collections');
  await expect(hero.getByRole('link', { name: /book the bangor salon/i })).toBeVisible();
});

test('product discovery appears before founder and salon content', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.scrollTo(0, Math.max(900, window.innerHeight)));
  const concernHeading = page.getByRole('heading', { name: /start with what your hair needs/i });
  await expect(concernHeading).toBeVisible({ timeout: 15_000 });
  await concernHeading.scrollIntoViewIfNeeded();
  for (let y = 900; y < 5000; y += 500) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
  }

  const positions = await page.evaluate(() => {
    const textPosition = (text: string) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node = walker.nextNode() as HTMLElement | null;
      while (node) {
        if (node.matches('h1, h2') && node.textContent?.toLowerCase().includes(text)) {
          return node.getBoundingClientRect().top + window.scrollY;
        }
        node = walker.nextNode() as HTMLElement | null;
      }
      return -1;
    };
    return {
      concerns: textPosition('start with what your hair needs'),
      sellers: textPosition("what's selling right now"),
      founder: textPosition('a short shelf'),
    };
  });

  expect(positions.concerns).toBeGreaterThanOrEqual(0);
  expect(positions.sellers).toBeGreaterThan(positions.concerns);
  expect(positions.founder).toBeGreaterThan(positions.sellers);
});

test('mobile menu and sticky action remain commerce first', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Mobile menu' });
  await expect(menu.getByRole('link', { name: 'Shop all products' })).toBeVisible();
  const frizzLink = menu.getByRole('link', { name: 'Shop frizz control' });
  await expect(frizzLink).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Salon services' })).toBeVisible();

  await frizzLink.click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/collections\/frizz-free-must-haves\/?$/);

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.evaluate(() => window.scrollTo(0, 900));
  const bar = page.getByRole('region', { name: 'Quick shop bar' });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('link', { name: 'Shop all products' })).toBeVisible();
  await expect(bar.getByRole('link', { name: /book salon/i })).toBeVisible();
});
