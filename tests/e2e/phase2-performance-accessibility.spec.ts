import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import * as path from 'node:path';

const evidenceDir = process.env.PLAYWRIGHT_EVIDENCE_DIR ||
  'D:/hermes-agent/home/client-work/hair-pinns/performance-phase-2/browser-matrix';

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'fold-344', width: 344, height: 882 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
];

test.beforeEach(async ({ page }) => {
  await page.route(
    /googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/,
    route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
});

for (const viewport of viewports) {
  test(`homepage is stable at ${viewport.name}`, async ({ page }, testInfo) => {
    await mkdir(evidenceDir, { recursive: true });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    const consoleErrors: string[] = [];
    const malformedRequests: string[] = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('request', request => {
      if (request.url().includes('%3Cscript') || request.url().includes('<script')) {
        malformedRequests.push(request.url());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', {
      level: 1,
      name: 'Hair care from someone who actually does hair.',
    })).toBeVisible();
    await expect(page.getByRole('link', { name: /Book a chair at Hair Pinns/ })).toBeVisible();

    if (viewport.width < 500) {
      const skipLink = page.getByRole('link', { name: 'Skip to main content' });
      if (testInfo.project.name === 'chromium') {
        await page.keyboard.press('Tab');
      } else {
        // WebKit and Firefox runners do not enable the host OS setting that
        // lets Tab focus links, so verify the same focus state directly.
        await skipLink.focus();
      }
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeVisible();
    }

    // Exercise IntersectionObserver and native lazy-loading boundaries the
    // same way a real reader does. Full-page screenshots alone do not scroll
    // in Firefox/WebKit, which can leave valid lazy images uncaptured.
    await page.evaluate(async () => {
      const step = Math.max(300, Math.floor(window.innerHeight * 0.75));
      for (let sweep = 0; sweep < 2; sweep += 1) {
        for (let y = 0, passes = 0; y < document.documentElement.scrollHeight && passes < 80; y += step, passes += 1) {
          window.scrollTo(0, y);
          await new Promise(resolve => window.setTimeout(resolve, 75));
        }
        await new Promise(resolve => window.setTimeout(resolve, 500));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter(image => image.complete && image.naturalWidth === 0)
        .map(image => image.currentSrc || image.src),
    );
    expect(brokenImages).toEqual([]);

    const overflow = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(overflow.document).toBeLessThanOrEqual(overflow.viewport + 1);
    expect(overflow.body).toBeLessThanOrEqual(overflow.viewport + 1);

    await page.screenshot({
      path: path.join(evidenceDir, `${testInfo.project.name}-${viewport.name}.png`),
      fullPage: true,
    });

    expect(malformedRequests).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('operational routes still render the React application', async ({ page }) => {
  const routes = [
    '/confirm?token=test&email=test%40example.com',
    '/order-confirmation?order_id=test',
    '/reviews/feedback',
    '/reviews/google',
  ];

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('#root')).not.toBeEmpty();
  }
});

test('mobile navigation is a named dialog without nested controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Open menu' }).click();

  const menu = page.getByRole('dialog', { name: 'Mobile menu' });
  await expect(menu).toBeVisible();
  await expect(menu.locator('a button, button a')).toHaveCount(0);
  await expect(page.locator('input:focus')).toHaveCount(0);
  expect(await menu.evaluate((element) => element.contains(document.activeElement))).toBe(true);

  await menu.getByRole('button', { name: 'Cart' }).click();
  await expect(menu).toBeHidden();
  const cart = page.getByRole('dialog', { name: 'Your Bag' });
  await expect(cart).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(cart).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});

test('GA4 configuration is queued before the provider script is deferred', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const configEntries = await page.evaluate(() =>
    ((window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer || [])
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === 'config' && entry[1] === 'G-N6Y1TJMWGG'),
  );
  expect(configEntries).toHaveLength(1);
});

test('product gallery zoom is keyboard accessible and modal', async ({ page }) => {
  await page.goto('/products/juuce-bond-repair-shampoo', { waitUntil: 'domcontentloaded' });
  const zoom = page.getByRole('button', { name: /Open .*full screen/i });
  await expect(zoom).toBeVisible();
  await zoom.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: /Expanded product image/i });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(zoom).toBeFocused();

  const next = page.getByRole('button', { name: 'Next image' });
  if (await next.count()) {
    await next.click();
    await expect(dialog).toBeHidden();
  }
});

test('cart drawer is a keyboard-contained named dialog', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const cartButton = page.getByRole('button', { name: /^View cart/ });
  await cartButton.focus();
  await cartButton.click();

  const cart = page.getByRole('dialog', { name: 'Your Bag' });
  await expect(cart).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(cart).toBeHidden();
  await expect(cartButton).toBeFocused();
});

test('search and collection controls have persistent accessible names', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('searchbox', { name: 'Search products and articles' })).toBeVisible();

  await page.goto('/collections', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('textbox', { name: 'Search collections' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Sort collections' })).toBeVisible();
});
