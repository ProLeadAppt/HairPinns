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

test('shared business claims and schemas stay truthful', async ({ page }) => {
  for (const route of ['/', '/services', '/reviews']) {
    await page.goto(route);
    const schemaPayloads = await page.locator('script[type="application/ld+json"]').allTextContents();
    const serialized = schemaPayloads.join('\n');

    expect(serialized).not.toContain('"reviewCount":"762"');
    expect(serialized).not.toContain('"ratingValue":"4.9"');
    expect(serialized).not.toContain('Over 762 five-star reviews');
    expect(serialized).not.toContain('Available 24/7 via Fresha');
    expect(serialized).not.toContain('"totalTime":"PT2M"');

    if (route === '/') {
      expect(serialized).not.toContain('"@type":"FAQPage"');
      expect(serialized).not.toContain('"@type":"HowTo"');
      await expect(page.getByText(/762\+? reviews/i)).toHaveCount(0);
      await expect(page.getByText('unopened products', { exact: true })).toBeVisible();
    }
  }
});

test('shared typography and motion policy respects user preferences', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__scrollBehaviors = [];
    window.scrollTo = ((...args: any[]) => {
      const options = typeof args[0] === 'object' ? args[0] : undefined;
      (window as any).__scrollBehaviors.push(options?.behavior);
    }) as typeof window.scrollTo;
  });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/services');
  await page.locator('[data-services-nav] a').nth(1).click();
  expect(await page.evaluate(() => (window as any).__scrollBehaviors.at(-1))).toBe('auto');

  await page.goto('/');
  const reducedReveal = page.locator('main .reveal').first();
  await expect(reducedReveal).toHaveClass(/visible/);
  const reducedAnimationSeconds = await reducedReveal.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).animationDuration),
  );
  expect(reducedAnimationSeconds).toBeLessThanOrEqual(0.00001);

  await page.goto('/privacy');
  const editorialHeading = page.locator('main h1').first();
  await expect(editorialHeading).toBeVisible();
  expect(await editorialHeading.evaluate((element) => getComputedStyle(element).fontFamily)).toContain('Playfair Display');
  expect(await page.evaluate(() => performance.getEntriesByType('resource').some((entry) => /fraunces/i.test(entry.name)))).toBe(false);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/services');
  await page.locator('[data-services-nav] a').nth(1).click();
  expect(await page.evaluate(() => (window as any).__scrollBehaviors.at(-1))).toBe('smooth');
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

test('after-hours cart preserves Shopify lines, removal and truthful checkout handoff at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.addInitScript(() => localStorage.setItem('hp_cart_id', 'gid://shopify/Cart/after-hours-test'));

  const lineOne = {
    node: {
      id: 'line-1',
      quantity: 2,
      merchandise: {
        id: 'variant-1',
        title: '250ml',
        price: { amount: '34.95', currencyCode: 'AUD' },
        product: { id: 'product-1', title: 'Juuce Bond Repair Shampoo', handle: 'juuce-bond-repair-shampoo' },
        image: { url: '/placeholder.svg', altText: 'Juuce Bond Repair Shampoo bottle' },
      },
    },
  };
  const lineTwo = {
    node: {
      id: 'line-2',
      quantity: 1,
      merchandise: {
        id: 'variant-2',
        title: 'Default Title',
        price: { amount: '49.95', currencyCode: 'AUD' },
        product: { id: 'product-2', title: 'Pure Precious Ends', handle: 'pure-precious-ends' },
        image: { url: '/placeholder.svg', altText: 'Pure Precious Ends bottle' },
      },
    },
  };
  const makeCart = (edges: typeof lineOne[]) => ({
    id: 'gid://shopify/Cart/after-hours-test',
    checkoutUrl: 'https://checkout.example.test',
    lines: { edges },
    cost: {
      subtotalAmount: { amount: edges.length === 2 ? '119.85' : '49.95', currencyCode: 'AUD' },
      totalAmount: { amount: edges.length === 2 ? '119.85' : '49.95', currencyCode: 'AUD' },
    },
  });
  let removalBody: Record<string, unknown> | null = null;

  await page.route('**/graphql.json', async (route) => {
    const body = route.request().postDataJSON();
    if (body.query.includes('query getCart')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { cart: makeCart([lineOne, lineTwo]) } }) });
      return;
    }
    await route.continue();
  });
  await page.route('**/api/checkout', async (route) => {
    removalBody = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ cart: makeCart([lineTwo]) }) });
  });

  await page.goto('/privacy', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^View cart/ }).click();

  const drawer = page.locator('[data-mini-cart]');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('heading', { name: 'Your bag / 3' })).toBeVisible();
  await expect(drawer.locator('[data-cart-lines] li')).toHaveCount(2);
  await expect(drawer.getByText('Juuce Bond Repair Shampoo')).toBeVisible();
  await expect(drawer.getByText('250ml')).toBeVisible();
  await expect(drawer.getByText('Default Title')).toHaveCount(0);
  await expect(drawer.getByText('$30.15 until free standard shipping')).toBeVisible();
  await expect(drawer.getByRole('progressbar', { name: 'Free standard shipping progress' })).toHaveAttribute('aria-valuenow', '119.85');
  await expect(drawer.getByRole('link', { name: 'Shipping details' })).toHaveAttribute('href', '/policies/shipping');
  await expect(drawer.getByRole('link', { name: '14-day returns on unopened products' })).toHaveAttribute('href', '/policies/returns');
  await expect(drawer.getByText('You might also like')).toHaveCount(0);
  await expect(drawer.getByText(/Estimated delivery/)).toHaveCount(0);

  const removeFirst = drawer.getByRole('button', { name: 'Remove Juuce Bond Repair Shampoo from bag' });
  const removeBox = await removeFirst.boundingBox();
  expect(Math.round(removeBox?.width || 0)).toBeGreaterThanOrEqual(44);
  expect(Math.round(removeBox?.height || 0)).toBeGreaterThanOrEqual(44);
  await removeFirst.click();
  await expect(drawer.locator('[data-cart-lines] li')).toHaveCount(1);
  expect(removalBody).toEqual({ cartId: 'gid://shopify/Cart/after-hours-test', removeLineIds: ['line-1'] });
  await expect(drawer.getByRole('heading', { name: 'Your bag / 1' })).toBeVisible();

  const checkout = drawer.getByRole('button', { name: 'Checkout' });
  await expect(checkout).toBeEnabled();
  const checkoutBox = await checkout.boundingBox();
  expect(checkoutBox?.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('search and collection controls have persistent accessible names', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('searchbox', { name: 'Search products and articles' })).toBeVisible();

  await page.goto('/collections', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('textbox', { name: 'Search collections' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Sort collections' })).toBeVisible();
});

test('after-hours predictive search debounces, dismisses and submits without losing the query', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let productSearchCalls = 0;
  const products = [
    {
      id: 'product-1', title: 'Juuce Bond Repair Shampoo', handle: 'juuce-bond-repair-shampoo', availableForSale: true,
      priceRange: { minVariantPrice: { amount: '34.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '34.95', currencyCode: 'AUD' } },
      images: { edges: [{ node: { id: 'image-1', url: '/placeholder.svg', altText: 'Juuce Bond Repair Shampoo' } }] },
    },
    {
      id: 'product-2', title: 'Juuce Smooth Enz', handle: 'juuce-smooth-enz', availableForSale: true,
      priceRange: { minVariantPrice: { amount: '29.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '32.95', currencyCode: 'AUD' } },
      images: { edges: [{ node: { id: 'image-2', url: '/placeholder.svg', altText: 'Juuce Smooth Enz' } }] },
    },
  ];
  await page.route('**/graphql.json', async (route) => {
    productSearchCalls += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { products: { edges: products.map((node) => ({ node })) } } }) });
  });

  await page.goto('/privacy', { waitUntil: 'domcontentloaded' });
  const input = page.getByRole('searchbox', { name: 'Search products and articles' });
  await input.pressSequentially('Juuce', { delay: 25 });
  const suggestions = page.locator('[data-search-suggestions]');
  await expect(suggestions).toBeVisible();
  await expect(suggestions.locator('[data-search-products] li')).toHaveCount(2);
  await expect(suggestions.locator('[data-search-articles] li').first()).toBeVisible();
  expect(productSearchCalls).toBe(1);
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(input).toHaveAttribute('aria-controls');
  const clearBox = await page.getByRole('button', { name: 'Clear search' }).boundingBox();
  expect(clearBox?.height).toBeGreaterThanOrEqual(44);

  await input.press('Escape');
  await expect(suggestions).toHaveCount(0);
  await expect(input).toHaveValue('Juuce');
  await expect(input).toBeFocused();
  await input.press('Enter');
  await expect(page).toHaveURL(/\/search\?q=Juuce$/);
});

test('after-hours search results preserve product, guide, sorting and schema contracts at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  const products = [
    {
      id: 'product-1', title: 'Juuce Bond Repair Shampoo', handle: 'juuce-bond-repair-shampoo', availableForSale: true,
      priceRange: { minVariantPrice: { amount: '34.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '34.95', currencyCode: 'AUD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '39.95', currencyCode: 'AUD' } },
      images: { edges: [{ node: { id: 'image-1', url: '/placeholder.svg', altText: 'Juuce Bond Repair Shampoo' } }] },
      variants: { edges: [{ node: { id: 'variant-1' } }] },
    },
    {
      id: 'product-2', title: 'Juuce Smooth Enz', handle: 'juuce-smooth-enz', availableForSale: true,
      priceRange: { minVariantPrice: { amount: '29.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '32.95', currencyCode: 'AUD' } },
      images: { edges: [{ node: { id: 'image-2', url: '/placeholder.svg', altText: 'Juuce Smooth Enz' } }] },
      variants: { edges: [{ node: { id: 'variant-2' } }] },
    },
  ];
  let shopifyCalls = 0;
  await page.route('**/graphql.json', async (route) => {
    shopifyCalls += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { products: { edges: products.map((node) => ({ node })) } } }) });
  });

  await page.goto('/search?q=Juuce', { waitUntil: 'domcontentloaded' });
  const results = page.locator('[data-search-page-results]');
  await expect(results).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Results for “Juuce”');
  await expect(page.locator('[data-search-product-results] article')).toHaveCount(2);
  await expect(page.locator('[data-search-article-results] article').first()).toBeVisible();
  await expect(page.locator('[data-search-product-results] img').first()).toHaveCSS('object-fit', 'contain');
  expect(shopifyCalls).toBe(1);

  await page.getByRole('combobox', { name: 'Sort products' }).selectOption('price-low');
  await expect(page.locator('[data-search-product-results] article h3').first()).toHaveText('Juuce Smooth Enz');
  expect(shopifyCalls).toBe(1);

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent || '{}')['@type']));
  expect(schemas).toContain('BreadcrumbList');
  expect(schemas).toContain('ItemList');
  expect(schemas).not.toContain('FAQPage');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('[data-search-page]')).not.toContainText('Where can I buy');
  await expect(page.locator('[data-search-page]')).not.toContainText('Does Hair Pinns ship');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
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

  const recommendations = page.locator('[data-product-recommendations]');
  await expect(recommendations.getByRole('heading', { name: 'More to browse' })).toBeVisible({ timeout: 30_000 });
  await recommendations.scrollIntoViewIfNeeded();
  const recommendedProducts = recommendations.locator('[data-recommended-product]');
  await expect(recommendedProducts).toHaveCount(3);
  const firstRecommendationBox = await recommendedProducts.nth(0).boundingBox();
  const secondRecommendationBox = await recommendedProducts.nth(1).boundingBox();
  expect(firstRecommendationBox).not.toBeNull();
  expect(secondRecommendationBox).not.toBeNull();
  expect(Math.abs(firstRecommendationBox!.y - secondRecommendationBox!.y)).toBeLessThan(2);
  expect(secondRecommendationBox!.x).toBeGreaterThan(firstRecommendationBox!.x + firstRecommendationBox!.width - 2);
  for (let index = 0; index < 2; index++) {
    const image = recommendedProducts.nth(index).locator('img');
    await expect.poll(async () => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
    expect(await image.evaluate(element => getComputedStyle(element).objectFit)).toBe('contain');
  }
  await expect(recommendedProducts.getByRole('link', { name: 'View product' })).toHaveCount(3);
  await expect(recommendations.locator('[data-recommendation-catalogue]')).toBeVisible();
  await expect(recommendations.getByRole('link', { name: 'Browse catalogue' })).toHaveAttribute('href', '/collections');
  const recommendationTitleColor = await recommendedProducts.first().locator('h3 a').evaluate(element => getComputedStyle(element).color);
  const recommendationHeadingColor = await recommendations.locator('h2').evaluate(element => getComputedStyle(element).color);
  expect(recommendationTitleColor).toBe(recommendationHeadingColor);
  await expect(page.locator('[data-product-sticky-purchase]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);

  const shareClose = page.locator('[data-product-share-close]');
  await shareClose.scrollIntoViewIfNeeded();
  await expect(shareClose.getByRole('heading', { name: 'Send this shelf find' })).toBeVisible();
  await expect(shareClose.locator('[data-share-variant="inline"]')).toBeVisible();
  const shareControls = shareClose.locator('a, button');
  await expect(shareControls).toHaveCount(5);
  for (let index = 0; index < 5; index++) {
    const box = await shareControls.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
  await expect(shareClose.getByRole('link', { name: 'Share on Facebook' })).toHaveAttribute('href', /facebook\.com\/sharer\/sharer\.php\?u=https%3A%2F%2Fhairpinns\.com%2Fproducts%2Fjuuce-bond-repair-shampoo/);
  await expect(shareClose.getByRole('link', { name: 'Share via Email' })).toHaveAttribute('href', /^mailto:/);
  await expect(page.locator('[data-product-sticky-purchase]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);
  const footer = page.locator('[data-home-footer]');
  expect(await shareClose.evaluate(element => Boolean(element.compareDocumentPosition(document.querySelector('[data-home-footer]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  expect(await shareClose.evaluate(element => getComputedStyle(element).backgroundColor)).toBe(await footer.evaluate(element => getComputedStyle(element).backgroundColor));

  await footer.scrollIntoViewIfNeeded();
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

test('after-hours About journey keeps founder proof truthful and bookable at Fold width', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/about');

  const main = page.locator('[data-about-page]');
  await expect(main.getByRole('heading', { level: 1, name: 'Hair care, without the hard sell.' })).toBeVisible();
  const hero = page.locator('[data-about-hero]');
  const heroPortrait = hero.getByRole('img', { name: 'Jena, founder and hairdresser at Hair Pinns in Bangor' });
  await expect.poll(async () => heroPortrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
  expect(await heroPortrait.getAttribute('src')).not.toContain('jena-headshot');

  const heroBooking = hero.getByRole('link', { name: /Book now/ });
  await expect(heroBooking).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
  await expect(heroBooking).toHaveAttribute('target', '_blank');
  await expect(heroBooking).toHaveAttribute('rel', /noopener/);
  await expect(hero.getByRole('link', { name: /Shop Jena’s shelf/ })).toHaveAttribute('href', '/collections');
  const heroBookingBox = await heroBooking.boundingBox();
  expect(heroBookingBox).not.toBeNull();
  expect(heroBookingBox!.height).toBeGreaterThanOrEqual(44);

  const work = page.locator('[data-about-work]');
  await work.scrollIntoViewIfNeeded();
  const gallery = work.locator('[data-gallery-variant="editorial"]');
  const galleryButtons = gallery.getByRole('button');
  await expect(galleryButtons).toHaveCount(6);
  for (let index = 0; index < 2; index++) {
    const image = galleryButtons.nth(index).locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(async () => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
  }
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);

  const firstGalleryButton = galleryButtons.first();
  await firstGalleryButton.click();
  const lightbox = page.getByRole('dialog', { name: 'Expanded work image' });
  await expect(lightbox).toBeVisible();
  await expect(lightbox.getByRole('button', { name: 'Close image gallery' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(lightbox).toHaveCount(0);
  await expect(firstGalleryButton).toBeFocused();

  const close = page.locator('[data-about-close]');
  await close.scrollIntoViewIfNeeded();
  const closeBooking = close.getByRole('link', { name: /Book now/ });
  const phone = close.getByRole('link', { name: '0416 037 663' });
  await expect(closeBooking).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
  await expect(phone).toHaveAttribute('href', /^tel:\+614\d+7663$/);
  await expect(close.getByText('60 Goorgool Rd, Bangor NSW 2234', { exact: true })).toBeVisible();
  await expect(close.locator('details')).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsedSchemas = schemas.flatMap(text => {
    try {
      const value = JSON.parse(text);
      return Array.isArray(value) ? value : [value];
    } catch {
      return [];
    }
  });
  const faqSchema = parsedSchemas.find(schema => schema['@type'] === 'FAQPage');
  const personSchema = parsedSchemas.find(schema => schema['@type'] === 'Person' && schema.name === 'Jena Pinn');
  expect(faqSchema?.mainEntity).toHaveLength(5);
  expect(personSchema?.image).toContain('jena-founder-1080w');
  expect(personSchema?.image).not.toContain('jena-headshot');

  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(9_000);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('after-hours service directory preserves the complete Fresha menu at Fold width', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/services');

  const main = page.locator('[data-services-page]');
  await expect(main.getByRole('heading', { level: 1, name: 'Find the right time in Jena’s chair.' })).toBeVisible();
  await expect(page.locator('[data-services-hero]').getByText('59', { exact: true })).toBeVisible();
  await expect(page.locator('[data-services-hero]').getByText('14', { exact: true })).toBeVisible();

  const categoryNav = page.locator('[data-services-nav]');
  const categoryLinks = categoryNav.getByRole('link');
  await expect(categoryLinks).toHaveCount(14);
  await expect(categoryLinks.first()).toHaveAttribute('href', '#smoothing');
  await expect(categoryLinks.last()).toHaveAttribute('href', '#blow-dry');
  for (const link of await categoryLinks.all()) {
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  const directory = page.locator('[data-services-directory]');
  await expect(directory.locator(':scope > section')).toHaveCount(14);
  const serviceRows = directory.locator('article');
  await expect(serviceRows).toHaveCount(59);
  const bookingLinks = directory.locator('a[aria-label^="Book "]');
  await expect(bookingLinks).toHaveCount(59);
  await expect(directory.getByRole('link', { name: 'Service guide' })).toHaveCount(15);

  const firstBooking = bookingLinks.first();
  await expect(firstBooking).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
  await expect(firstBooking).toHaveAttribute('target', '_blank');
  await expect(firstBooking).toHaveAttribute('rel', /noopener/);
  const firstBookingBox = await firstBooking.boundingBox();
  expect(firstBookingBox).not.toBeNull();
  expect(firstBookingBox!.height).toBeGreaterThanOrEqual(44);

  const detailedService = serviceRows.filter({ hasText: 'Long/Thick Straight Up Smoothing Treatment' }).first();
  await detailedService.scrollIntoViewIfNeeded();
  const disclosure = detailedService.locator('details');
  await expect(disclosure).not.toHaveAttribute('open', '');
  await disclosure.locator('summary').click();
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(disclosure.getByText('Straight Up is the first natural hair smoothing treatment', { exact: false })).toBeVisible();
  await expect(detailedService.getByText('A$ 349', { exact: true })).toBeVisible();
  await expect(detailedService.getByText('2h 20min · 2 services', { exact: true })).toBeVisible();

  const close = page.locator('[data-services-close]');
  await close.scrollIntoViewIfNeeded();
  await expect(close.getByRole('link', { name: /Book now/ })).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
  await expect(close.getByRole('link', { name: '0416 037 663' })).toHaveAttribute('href', /^tel:\+614\d+7663$/);
  await expect(close.getByText('60 Goorgool Rd, Bangor NSW 2234', { exact: true })).toBeVisible();
  await expect(close.getByRole('link', { name: /See service areas/ })).toHaveAttribute('href', '/areas');
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsedSchemas = schemas.flatMap(text => {
    try {
      const value = JSON.parse(text);
      return Array.isArray(value) ? value : [value];
    } catch {
      return [];
    }
  });
  const itemListSchema = parsedSchemas.find(schema => schema['@type'] === 'ItemList');
  const faqSchema = parsedSchemas.find(schema => schema['@type'] === 'FAQPage');
  expect(itemListSchema?.itemListElement).toHaveLength(15);
  expect(faqSchema?.mainEntity?.length).toBeGreaterThan(0);

  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(22_500);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('after-hours service detail keeps booking, guidance and schemas intact at Fold width', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/services/smoothing/mid-length-straight-up-smoothing');

  const detail = page.locator('[data-service-detail]');
  await expect(detail.getByRole('heading', { level: 1, name: 'Mid-Length Straight Up Smoothing Treatment' })).toBeVisible();
  await expect(page.locator('[data-service-detail-hero]').getByText('A$ 324', { exact: true })).toBeVisible();
  await expect(page.locator('[data-service-detail-hero]').getByText('2h 20min', { exact: true })).toBeVisible();
  await expect(page.locator('[data-service-detail-hero] .speakable-quick-answer')).toBeVisible();

  const heroBooking = page.locator('[data-service-detail-hero]').getByRole('link', { name: 'Book now' });
  const closeBooking = page.locator('[data-service-detail-close]').getByRole('link', { name: 'Book now' });
  for (const booking of [heroBooking, closeBooking]) {
    await expect(booking).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
    await expect(booking).toHaveAttribute('target', '_blank');
    await expect(booking).toHaveAttribute('rel', /noopener/);
    const box = await booking.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await expect(page.locator('[data-service-detail-overview] h3')).toHaveCount(2);
  await expect(page.locator('[data-service-detail-process] li')).toHaveCount(3);
  await expect(page.locator('[data-service-detail-benefits] li')).toHaveCount(6);
  await expect(page.locator('[data-service-detail-homecare] a')).toHaveCount(4);
  await expect(page.locator('[data-service-detail-related] a')).toHaveCount(3);

  const faq = page.locator('[data-service-detail-faq]');
  await expect(faq.locator('details')).toHaveCount(4);
  const firstFaq = faq.locator('details').first();
  await firstFaq.locator('summary').click();
  await expect(firstFaq).toHaveAttribute('open', '');
  await expect(firstFaq.getByText('Typically 3-5 months', { exact: false })).toBeVisible();

  const close = page.locator('[data-service-detail-close]');
  await close.scrollIntoViewIfNeeded();
  await expect(close.getByRole('link', { name: '0416 037 663' })).toHaveAttribute('href', /^tel:\+614\d+7663$/);
  await expect(close.getByText('60 Goorgool Rd, Bangor NSW 2234', { exact: true })).toBeVisible();
  await expect(close.getByRole('link', { name: /Back to the service menu/ })).toHaveAttribute('href', '/services');
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);
  await expect(detail.getByText(/same-day appointments/i)).toHaveCount(0);
  await expect(detail.getByText(/starting from/i)).toHaveCount(0);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsedSchemas = schemas.flatMap(text => {
    try {
      const value = JSON.parse(text);
      return Array.isArray(value) ? value : [value];
    } catch {
      return [];
    }
  });
  for (const type of ['Service', 'BreadcrumbList', 'FAQPage', 'HowTo', 'WebPage']) {
    expect(parsedSchemas.some(schema => schema['@type'] === type)).toBe(true);
  }
  const serviceSchema = parsedSchemas.find(schema => schema['@type'] === 'Service');
  expect(serviceSchema?.offers?.price).toBe('324');
  expect(serviceSchema?.offers?.priceCurrency).toBe('AUD');

  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(11_000);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);

  for (const variant of [
    { path: '/services/foil-packages/full-head-foils-package', heading: 'Full Head of Foils Package' },
    { path: '/services/kids-formal/primary-formal-hairstyle', heading: 'Primary Formal Hairstyle' },
  ]) {
    await page.goto(variant.path);
    await expect(page.locator('[data-service-detail]').getByRole('heading', { level: 1, name: variant.heading })).toBeVisible();
    await expect(page.locator('[data-service-detail-hero]').getByRole('link', { name: 'Book now' })).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
    await expect(page.locator('[data-service-detail-faq] details')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  }
});

test('after-hours booking handoff keeps Fresha and direct help truthful at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/booking');

  const booking = page.locator('[data-booking-page]');
  await expect(booking.getByRole('heading', { level: 1, name: 'Your appointment starts here.' })).toBeVisible();

  const freshaLinks = booking.locator('a[href="https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb"]');
  await expect(freshaLinks).toHaveCount(2);
  for (const link of await freshaLinks.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }

  await expect(page.locator('[data-booking-hero]').getByRole('link', { name: 'Browse the service menu' })).toHaveAttribute('href', '/services');
  await expect(page.locator('[data-booking-steps] li')).toHaveCount(3);
  await expect(page.locator('[data-booking-notes] ol > li')).toHaveCount(4);

  const faqs = page.locator('[data-booking-faq] details');
  await expect(faqs).toHaveCount(5);
  await faqs.nth(1).locator('summary').click();
  await expect(faqs.nth(1)).toHaveAttribute('open', '');
  await expect(faqs.nth(1).getByText('Fresha shows live appointment availability')).toBeVisible();

  for (const unsupportedClaim of ['762+ five-star reviews', 'Same-day available', 'Klarna', 'Afterpay', '50% fee', 'Takes about 2 minutes']) {
    await expect(booking).not.toContainText(unsupportedClaim);
  }

  const close = page.locator('[data-booking-close]');
  await expect(close.locator('a[href="tel:+61416037663"]')).toContainText('0416 037 663');
  await expect(close.locator('a[href^="https://wa.me/61416037663"]')).toHaveAttribute('target', '_blank');
  await expect(close.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  await expect(close.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      try {
        const parsed = JSON.parse(node.textContent || '{}');
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }),
  );
  expect(schemas.some((schema) => schema['@type'] === 'FAQPage' && schema.mainEntity?.length === 5)).toBe(true);
  expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(true);

  await close.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: /scroll to top/i })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(6_000);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('after-hours contact journey preserves canonical visit details and the live form at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/contact');

  const contact = page.locator('[data-contact-page]');
  await expect(contact.getByRole('heading', { level: 1, name: 'Come by. Call. Or leave a note.' })).toBeVisible();
  await expect(page.locator('[data-contact-hero] a[href="tel:+61416037663"]')).toContainText('0416 037 663');
  await expect(page.locator('[data-contact-hero] a[href="sms:+61416037663"]')).toContainText('Send a text');
  await expect(page.locator('[data-contact-hero] a[href="mailto:hairpinns1@gmail.com"]')).toContainText('Email Jena');

  const visit = page.locator('[data-contact-visit]');
  await expect(visit).toContainText('60 Goorgool Rd, Bangor NSW 2234');
  await expect(visit.locator('li')).toHaveCount(6);
  await expect(visit.locator('iframe')).toHaveAttribute('loading', 'lazy');
  await expect(visit.locator('iframe')).toHaveAttribute('title', 'Hair Pinns at 60 Goorgool Rd, Bangor');
  await expect(visit.getByRole('link', { name: 'Open directions' })).toHaveAttribute('target', '_blank');

  const form = page.locator('[data-contact-message] form');
  await expect(form.getByLabel('Your Name *')).toBeVisible();
  await expect(form.getByLabel('Email Address *')).toBeVisible();
  await expect(form.getByLabel('Phone Number')).toBeVisible();
  await expect(form.getByLabel('Your Message *')).toBeVisible();
  const topic = form.getByRole('combobox', { name: 'What can we help you with? *' });
  await topic.click();
  await page.getByRole('option', { name: 'Service Question' }).click();
  await expect(topic).toContainText('Service Question');
  await expect(form.getByText('I agree to receive updates from Hair Pinns.')).toBeVisible();
  expect((await form.getByRole('button', { name: 'Send Message' }).boundingBox())?.height).toBeGreaterThanOrEqual(44);

  const faqs = page.locator('[data-contact-faq] details');
  await expect(faqs).toHaveCount(4);
  await faqs.last().locator('summary').click();
  await expect(faqs.last()).toContainText('60 Goorgool Rd, Bangor NSW 2234');

  for (const unsupportedClaim of ['within 24 hours', 'within 2 hours', 'rear entrance', 'Wheelchair accessible', 'available 24/7', 'Open now']) {
    await expect(contact).not.toContainText(unsupportedClaim);
  }

  const close = page.locator('[data-contact-close]');
  await expect(close.getByRole('link', { name: 'Book now' })).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
  await expect(close.getByRole('link', { name: 'Browse services' })).toHaveAttribute('href', '/services');

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent || '{}')));
  const salonSchema = schemas.find((schema) => schema['@type'] === 'HairSalon');
  expect(salonSchema?.telephone).toBe('+61416037663');
  expect(salonSchema?.address?.streetAddress).toBe('60 Goorgool Rd');
  expect(salonSchema?.openingHoursSpecification).toHaveLength(5);
  expect(schemas.some((schema) => schema['@type'] === 'FAQPage' && schema.mainEntity?.length === 4)).toBe(true);
  expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(true);

  await close.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: /scroll to top/i })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(6_500);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});
