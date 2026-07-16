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
    await expect(page.getByRole('link', { name: "Shop Jena's shelf", exact: true })).toBeVisible();

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

    // Mount the live product shelf before racing through the rest of the page.
    // This prevents fast automated scrolling from outrunning Shopify data and
    // producing misleading blank full-page screenshots.
    await page.evaluate(() => window.scrollTo(0, Math.max(1000, window.innerHeight)));
    const sellerHeading = page.getByRole('heading', { name: /popular picks from the shelf/i });
    await expect(sellerHeading).toBeVisible({ timeout: 15_000 });
    await sellerHeading.scrollIntoViewIfNeeded();

    // Exercise IntersectionObserver and native lazy-loading boundaries the
    // same way a real reader does. Full-page screenshots alone do not scroll
    // in Firefox/WebKit, which can leave valid lazy images uncaptured.
    await page.evaluate(async () => {
      const step = Math.max(300, Math.floor(window.innerHeight * 0.75));
      for (let sweep = 0; sweep < 2; sweep += 1) {
        for (let y = 0, passes = 0; y < document.documentElement.scrollHeight && passes < 80; y += step, passes += 1) {
          window.scrollTo(0, y);
          await new Promise(resolve => window.setTimeout(resolve, 140));
        }
        await new Promise(resolve => window.setTimeout(resolve, 900));
      }
      window.scrollTo(0, 0);
    });
    for (const heading of [
      /a short shelf, chosen by a working hairdresser/i,
      /notes from behind the chair/i,
      /come in and see me/i,
    ]) {
      const sectionHeading = page.getByRole('heading', { name: heading }).first();
      await sectionHeading.scrollIntoViewIfNeeded();
      await expect(sectionHeading).toBeVisible({ timeout: 15_000 });
    }
    // Full-page screenshots capture offscreen pixels without re-entering each
    // viewport. Disable paint skipping only for evidence so every already-
    // verified section appears in the composite image.
    await page.addStyleTag({
      content: '.content-visibility-auto, [style*="content-visibility"] { content-visibility: visible !important; }',
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);

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
    const actionableConsoleErrors = consoleErrors.filter(message => !(
      process.env.PLAYWRIGHT_BASE_URL?.includes('deploy-preview-') &&
      message.includes('app.netlify.com') &&
      (message.includes('Content Security Policy') || message.includes('Content-Security-Policy') || message.includes('frame-src'))
    ));
    expect(actionableConsoleErrors).toEqual([]);
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

test('after-hours header preserves commerce paths across tablet and desktop navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const promo = page.locator('[data-cta="header-promo-strip"]');
  await expect(promo).toHaveAttribute('href', '/collections/qiqi');
  await expect(promo).toContainText('20% off QIQI range, shop now');
  expect(await promo.evaluate(element => getComputedStyle(element.parentElement!).backgroundColor)).toBe('rgb(24, 0, 31)');

  const directCart = page.getByRole('button', { name: 'View cart' });
  const menuTrigger = page.getByRole('button', { name: 'Open menu' });
  await expect(directCart).toBeVisible();
  await expect(menuTrigger).toBeVisible();
  expect((await directCart.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();

  await menuTrigger.click();
  const drawer = page.getByRole('dialog', { name: 'Mobile menu' });
  await expect(drawer).toBeVisible();
  const close = drawer.getByRole('button', { name: 'Close' });
  expect((await close.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  const drawerTargets = await drawer.locator('a, button, input').evaluateAll(elements =>
    elements.filter(element => element.getBoundingClientRect().height > 0).map(element => element.getBoundingClientRect().height),
  );
  expect(Math.min(...drawerTargets)).toBeGreaterThanOrEqual(44);
  const drawerHrefs = await drawer.getByRole('navigation', { name: 'Mobile navigation' }).locator('a').evaluateAll(links =>
    links.map(link => link.getAttribute('href')),
  );
  expect(drawerHrefs).toEqual([
    '/collections',
    '/collections/frizz-free-must-haves',
    '/collections/heat-protection',
    '/collections/blonde-bombshells',
    '/collections/pump-up-the-volume',
    '/blog', '/about', '/services', '/contact',
    'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb',
  ]);
  await close.click();
  await expect(menuTrigger).toBeFocused();

  await directCart.click();
  const cart = page.getByRole('dialog', { name: 'Your Bag' });
  await expect(cart).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(directCart).toBeFocused();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const desktopNav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(desktopNav).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveCount(0);
  await expect(page.getByRole('searchbox', { name: 'Search products and articles' })).toBeVisible();
  await desktopNav.getByRole('button', { name: 'Shop', exact: true }).click();
  const shopMenu = page.getByRole('menu');
  await expect(shopMenu).toBeVisible();
  await page.waitForTimeout(250);
  const shopHrefs = await shopMenu.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(shopHrefs).toEqual([
    '/collections/frizz-free-must-haves',
    '/collections/heat-protection',
    '/collections/blonde-bombshells',
    '/collections/pump-up-the-volume',
    '/collections/curly-girlys',
    '/collections/juuce-botanicals',
    '/collections/qiqi',
    '/collections/pure-certified-organic-hair-care',
    '/collections/wet-brush-detanglers',
    '/collections',
  ]);
  const shopTargets = await shopMenu.locator('a').evaluateAll(links => links.map(link => link.getBoundingClientRect().height));
  expect(Math.min(...shopTargets)).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
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
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('searchbox', { name: 'Search products and articles' })).toBeVisible();

  await page.goto('/collections', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('textbox', { name: 'Search collections' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Sort collections' })).toBeVisible();
});

test('after-hours collection system stays truthful and shoppable at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/collections', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /Shop collections/i })).toBeVisible();

  const collectionPlates = page.locator('main a[href^="/collections/"]').filter({ has: page.locator('img') });
  await expect(collectionPlates.first()).toBeVisible({ timeout: 30_000 });
  expect(await collectionPlates.count()).toBeGreaterThanOrEqual(8);

  const firstCollectionBox = await collectionPlates.nth(0).boundingBox();
  const secondCollectionBox = await collectionPlates.nth(1).boundingBox();
  expect(firstCollectionBox).not.toBeNull();
  expect(secondCollectionBox).not.toBeNull();
  expect(Math.abs(firstCollectionBox!.y - secondCollectionBox!.y)).toBeLessThan(2);
  expect(secondCollectionBox!.x).toBeGreaterThan(firstCollectionBox!.x + firstCollectionBox!.width - 2);

  const collectionSearch = page.getByRole('textbox', { name: 'Search collections' });
  const collectionSort = page.getByRole('combobox', { name: 'Sort collections' });
  for (const control of [collectionSearch, collectionSort]) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await collectionSort.click();
  await expect(page.getByRole('option', { name: 'Most Products' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);

  await page.goto('/collections/qiqi', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'QIQI', exact: true })).toBeVisible({ timeout: 30_000 });
  const products = page.locator('article');
  await expect(products.first()).toBeVisible({ timeout: 30_000 });
  expect(await products.count()).toBe(7);

  const firstProductBox = await products.nth(0).boundingBox();
  const secondProductBox = await products.nth(1).boundingBox();
  expect(firstProductBox).not.toBeNull();
  expect(secondProductBox).not.toBeNull();
  expect(Math.abs(firstProductBox!.y - secondProductBox!.y)).toBeLessThan(2);
  expect(secondProductBox!.x).toBeGreaterThan(firstProductBox!.x + firstProductBox!.width - 2);

  await products.first().scrollIntoViewIfNeeded();
  await expect.poll(async () => products.locator('img').nth(0).evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
  await expect.poll(async () => products.locator('img').nth(1).evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
  await expect(products.first()).toContainText('$');

  for (const control of [
    page.getByRole('combobox', { name: 'Filter by price' }),
    page.getByRole('combobox', { name: 'Sort products' }),
    products.first().getByRole('button', { name: 'Quick View' }),
    products.first().getByRole('button', { name: 'Add to Bag' }),
  ]) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.getByRole('combobox', { name: 'Sort products' }).click();
  await expect(page.getByRole('option', { name: 'Newest First' })).toHaveCount(0);
  await page.keyboard.press('Escape');

  await products.first().getByRole('button', { name: 'Quick View' }).click();
  await expect(page.getByRole('dialog', { name: 'Quick View' })).toBeVisible({ timeout: 30_000 });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Quick View' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('after-hours product detail keeps the Fold purchase path truthful and unobscured', async ({ page }) => {
  test.setTimeout(75_000);
  await page.setViewportSize({ width: 344, height: 882 });
  await page.route('**/api/checkout', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ checkoutUrl: 'https://checkout.example.test/cart', cartId: 'test-cart-id' }),
    });
  });

  await page.goto('/products/juuce-bond-repair-shampoo', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Juuce Bond Repair Shampoo', level: 1 })).toBeVisible({ timeout: 30_000 });

  const core = page.locator('[data-product-detail-core]');
  const actions = page.locator('[data-product-purchase-actions]');
  const productImage = core.locator('picture img').first();
  await expect.poll(async () => productImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
  expect(await productImage.evaluate(image => getComputedStyle(image).objectFit)).toBe('contain');

  await expect(core).not.toContainText('Default Title');
  await expect(page.getByText('762+ five-star reviews')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Calculate Shipping' })).toHaveCount(0);
  await expect(page.getByText(/Estimated delivery:/)).toHaveCount(0);
  await expect(core.getByText('$9.95 · 3–5 business days')).toBeVisible();
  await expect(core.getByText('$14.95 · 1–2 business days')).toBeVisible();
  await expect(core.getByText('Orders $150+')).toBeVisible();
  await expect(core.getByRole('link', { name: 'Read shipping policy' })).toHaveAttribute('href', '/policies/shipping');

  const addToBag = actions.getByRole('button', { name: 'Add to Bag' });
  const buyNow = actions.getByRole('button', { name: 'Buy Now' });
  for (const button of [addToBag, buyNow]) {
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  const zoom = core.getByRole('button', { name: /Open Juuce Bond Repair Shampoo image 1 full screen/ });
  await zoom.click();
  await expect(page.getByRole('dialog', { name: /Expanded product image/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(zoom).toBeFocused();

  await actions.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-product-sticky-purchase]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);

  await core.getByRole('tab', { name: 'Description' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);

  const recommendations = page.getByRole('heading', { name: 'Complete the Set' });
  await expect(recommendations).toBeVisible({ timeout: 30_000 });
  await recommendations.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-product-sticky-purchase]')).toBeVisible();

  await page.locator('[data-home-footer]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-product-sticky-purchase]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);

  await actions.scrollIntoViewIfNeeded();
  const checkoutRequest = page.waitForRequest(request => request.url().includes('/api/checkout') && request.method() === 'POST');
  await addToBag.click();
  const request = await checkoutRequest;
  const payload = request.postDataJSON();
  expect(payload.lines).toHaveLength(1);
  expect(payload.lines[0].quantity).toBe(1);
  expect(payload.lines[0].merchandiseId).toBeTruthy();
});
