import { expect, test, type Page, type Route } from '@playwright/test';

// Run against an isolated server with VITE_SF_STOREFRONT_TOKEN=public-test-token.
// Every remote request and local API call is intercepted. These tests never
// create a real cart, submit checkout, or need a production credential.
const handle = 'product-recovery-test';
const title = 'Product Recovery Test';
const path = `/products/${handle}`;
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="lavender"/></svg>';
const photo = (name: string) => ({ id: name, altText: name, url: `https://cdn.shopify.com/recovery-test/${name}.svg`, width: 800, height: 800 });
const photos = [photo('Yellow'), photo('Pink')];
const product = {
  id: 'gid://shopify/Product/901', handle, title, vendor: 'Test', productType: 'Brush',
  description: 'A product for isolated recovery tests.', descriptionHtml: '<p>A product for isolated recovery tests.</p>',
  availableForSale: true, tags: [],
  priceRange: { minVariantPrice: { amount: '19.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '22.95', currencyCode: 'AUD' } },
  compareAtPriceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'AUD' } },
  images: { edges: photos.map(node => ({ node })) },
  variants: { edges: [
    { node: { id: 'gid://shopify/ProductVariant/901', title: 'Yellow', availableForSale: true, quantityAvailable: 3, requiresShipping: true, price: { amount: '19.95', currencyCode: 'AUD' }, compareAtPrice: null, selectedOptions: [{ name: 'Style', value: 'Yellow' }], image: photos[0] } },
    { node: { id: 'gid://shopify/ProductVariant/902', title: 'Pink', availableForSale: false, quantityAvailable: 0, requiresShipping: true, price: { amount: '22.95', currencyCode: 'AUD' }, compareAtPrice: null, selectedOptions: [{ name: 'Style', value: 'Pink' }], image: photos[1] } },
  ] },
  collections: { edges: [] },
};

type ProductReply = (route: Route, attempt: number) => Promise<void>;

async function mockStore(page: Page, reply: ProductReply) {
  let attempts = 0;
  const writes: string[] = [];
  const abortedReads: string[] = [];
  page.on('requestfailed', request => {
    if (!request.url().endsWith('/graphql.json')) return;
    const body = request.postDataJSON() as { query?: string; variables?: { handle?: string } } | null;
    if (/query getProduct\(/.test(body?.query || '') && body?.variables?.handle === handle) {
      abortedReads.push(request.failure()?.errorText || 'failed');
    }
  });
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.endsWith('/graphql.json')) {
      const body = request.postDataJSON() as { query?: string; variables?: { handle?: string } };
      if (/\bmutation\b/.test(body.query || '')) {
        writes.push('GraphQL mutation');
        await route.abort('blockedbyclient');
      } else if (/query getProduct\(/.test(body.query || '') && body.variables?.handle === handle) {
        await reply(route, ++attempts);
      } else {
        await route.fulfill({ json: { data: {
          product: null, products: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } },
          collections: { edges: [] }, collection: null, productRecommendations: [],
          shop: { name: 'Isolated test store' },
        } } });
      }
      return;
    }
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/functions/')) {
      if (/checkout|cart/.test(url.pathname)) writes.push(url.pathname);
      await route.fulfill({ json: {} });
      return;
    }
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost' || url.hostname === '[::1]') {
      await route.continue();
      return;
    }
    if (request.resourceType() === 'image') {
      await route.fulfill({ contentType: 'image/svg+xml', body: svg });
    } else if (request.resourceType() === 'script') {
      await route.fulfill({ contentType: 'application/javascript', body: '' });
    } else {
      await route.fulfill({ status: 204, body: '' });
    }
  });
  return { attempts: () => attempts, writes, abortedReads };
}

const successfulRead = (route: Route, value: unknown = product) => route.fulfill({ json: { data: { product: value } } });
const purchaseActions = (page: Page) => page.locator('[data-product-purchase-actions]');
const productHeading = (page: Page) => page.getByRole('heading', { level: 1, name: title, exact: true });
const missingHeading = (page: Page) => page.getByRole('heading', { name: 'Product not found', exact: true });

async function assertLoaded(page: Page) {
  await expect(productHeading(page)).toBeVisible();
  await expect(missingHeading(page)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toHaveCount(0);
}

async function assertCannotPurchase(page: Page) {
  await expect(purchaseActions(page).getByRole('button', { name: 'Add to Bag', exact: true })).toBeDisabled();
  await expect(purchaseActions(page).getByRole('button', { name: 'Buy Now', exact: true })).toBeDisabled();
}

function delayedRead() {
  let release!: () => void;
  let complete!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const completed = new Promise<void>(resolve => { complete = resolve; });
  return {
    release,
    completed,
    reply: async (route: Route) => {
      await pending;
      // A genuine AbortController cancellation can already have closed this
      // intercepted request. Late fulfillment is deliberately allowed to fail.
      try { await successfulRead(route, { ...product, title: 'Stale response must never render' }); }
      catch { /* Expected when the browser discarded the cancelled transport. */ }
      finally { complete(); }
    },
  };
}

async function settlePaint(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

for (const failure of ['network', 'HTTP', 'GraphQL'] as const) {
  test(`a transient ${failure} failure retries once and renders the product`, async ({ page }) => {
    const store = await mockStore(page, async (route, attempt) => {
      if (attempt > 1) return successfulRead(route);
      if (failure === 'network') return route.abort('failed');
      if (failure === 'HTTP') return route.fulfill({ status: 503, json: { error: 'temporary outage' } });
      return route.fulfill({ json: { errors: [{ message: 'temporary outage' }] } });
    });
    await page.goto(path);
    await assertLoaded(page);
    expect(store.attempts()).toBe(2);
    await expect(purchaseActions(page).getByRole('button', { name: 'Add to Bag', exact: true })).toBeEnabled();
    expect(store.writes).toEqual([]);
  });
}

for (const failure of ['HTTP', 'GraphQL', 'incomplete response'] as const) {
  test(`persistent ${failure} failure has a manual retry and does not claim the product is missing`, async ({ page }) => {
    let recovered = false;
    const store = await mockStore(page, async route => {
      if (recovered) return successfulRead(route);
      if (failure === 'HTTP') return route.fulfill({ status: 503, json: { error: 'temporary outage' } });
      if (failure === 'GraphQL') return route.fulfill({ json: { errors: [{ message: 'temporary outage' }] } });
      return route.fulfill({ json: { data: {} } });
    });
    await page.goto(`${path}?variant=902&utm_source=recovery-test#product`);
    await expect(page.getByRole('alert')).toContainText('temporary problem');
    await expect(missingHeading(page)).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    expect(store.attempts()).toBe(2);
    expect(await purchaseActions(page).count()).toBe(0);

    recovered = true;
    await page.getByRole('button', { name: 'Try again', exact: true }).click();
    await assertLoaded(page);
    expect(store.attempts()).toBe(3);
    await expect(page).toHaveURL(`${path}?variant=902&utm_source=recovery-test#product`);
    await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Pink');
    await expect(page.locator('main').getByText('$22.95', { exact: true }).first()).toBeVisible();
    await assertCannotPurchase(page);
    expect(store.writes).toEqual([]);
  });
}

test('a confirmed missing product is refetched after an SPA revisit', async ({ page }) => {
  const store = await mockStore(page, (route, attempt) => successfulRead(route, attempt === 1 ? null : product));
  await page.goto(path);
  await expect(missingHeading(page)).toBeVisible();
  expect(store.attempts()).toBe(1);
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toHaveCount(0);
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.getByRole('link', { name: 'Browse Collections', exact: true }).click();
  await expect(page.getByRole('tablist', { name: 'Ways to shop' })).toBeVisible();
  await page.goBack();
  await assertLoaded(page);
  expect(store.attempts()).toBe(2);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(timeOrigin);
  expect(store.writes).toEqual([]);
});

test('a request exceeding eight seconds aborts, retries, and cannot overwrite the recovered product', async ({ page }) => {
  const delayed = delayedRead();
  const store = await mockStore(page, (route, attempt) => attempt === 1 ? delayed.reply(route) : successfulRead(route));
  try {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'Loading product', exact: true })).toBeAttached();
    await expect(productHeading(page)).toBeVisible({ timeout: 15_000 });
    expect(store.attempts()).toBe(2);
    await expect.poll(() => store.abortedReads.length).toBe(1);
    delayed.release();
    await delayed.completed;
    await settlePaint(page);
    await assertLoaded(page);
    await expect(page.getByText('Stale response must never render', { exact: true })).toHaveCount(0);
    expect(store.writes).toEqual([]);
  } finally {
    delayed.release();
  }
});

test('navigation away cancels a pending request and back/forward performs fresh reads', async ({ page }) => {
  const delayed = delayedRead();
  const store = await mockStore(page, (route, attempt) => attempt === 1 ? delayed.reply(route) : successfulRead(route));
  try {
    await page.goto(path);
    await expect.poll(store.attempts).toBe(1);
    const timeOrigin = await page.evaluate(() => performance.timeOrigin);
    await page.getByRole('link', { name: 'Hair Pinns home', exact: true }).first().click();
    await expect(page).toHaveURL('/');
    await expect.poll(() => store.abortedReads.length).toBe(1);
    // This is cancellation, not the reader's network-failure retry path.
    expect(store.attempts()).toBe(1);
    await page.goBack();
    await assertLoaded(page);
    expect(store.attempts()).toBe(2);
    delayed.release();
    await delayed.completed;
    await settlePaint(page);
    await assertLoaded(page);
    await expect(page.getByText('Stale response must never render', { exact: true })).toHaveCount(0);
    await page.goForward();
    await expect(page).toHaveURL('/');
    await page.goBack();
    await assertLoaded(page);
    expect(store.attempts()).toBe(3);
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(timeOrigin);
    expect(store.writes).toEqual([]);
  } finally {
    delayed.release();
  }
});

test('same-product option changes retain truthful prices and disable unavailable checkout', async ({ page }) => {
  const store = await mockStore(page, route => successfulRead(route));
  await page.goto(`${path}?variant=902`);
  await assertLoaded(page);
  await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Pink');
  await assertCannotPurchase(page);
  await page.getByRole('combobox', { name: 'Style' }).click();
  await page.getByRole('option', { name: 'Yellow', exact: true }).click();
  await expect(page).toHaveURL(`${path}?variant=901`);
  await expect(page.locator('main').getByText('$19.95', { exact: true }).first()).toBeVisible();
  await expect(purchaseActions(page).getByRole('button', { name: 'Add to Bag', exact: true })).toBeEnabled();
  await expect(purchaseActions(page).getByRole('button', { name: 'Buy Now', exact: true })).toBeEnabled();
  await page.getByRole('combobox', { name: 'Style' }).click();
  await page.getByRole('option', { name: 'Pink', exact: true }).click();
  await expect(page).toHaveURL(`${path}?variant=902`);
  await expect(page.locator('main').getByText('$22.95', { exact: true }).first()).toBeVisible();
  await assertCannotPurchase(page);
  expect(store.attempts()).toBe(1);
  expect(store.writes).toEqual([]);
});

test('an invalid direct variant remains unpurchasable after successful recovery', async ({ page }) => {
  const store = await mockStore(page, (route, attempt) => attempt === 1
    ? route.fulfill({ status: 503, json: { error: 'temporary outage' } })
    : successfulRead(route));
  await page.goto(`${path}?variant=does-not-exist`);
  await assertLoaded(page);
  await expect(page.getByRole('status').filter({ hasText: 'This option is not available' })).toBeVisible();
  await assertCannotPurchase(page);
  expect(store.attempts()).toBe(2);
  expect(store.writes).toEqual([]);
});

function mainDocumentCounter(page: Page) {
  let documents = 0;
  page.on('request', request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents += 1;
  });
  return () => documents;
}

// These import-failure tests intentionally use the Vite dev-module URL. Start
// the isolated Vite server described above, rather than a production preview.
test('a failed product module reloads once and preserves variant, attribution and fragment', async ({ page }) => {
  const store = await mockStore(page, route => successfulRead(route));
  const documents = mainDocumentCounter(page);
  let modules = 0;
  await page.route('**/src/pages/ProductDetail.tsx*', async route => {
    if (++modules === 1) await route.abort('failed');
    else await route.fallback();
  });
  const requestedPath = `${path}?variant=902&utm_source=import-recovery#product`;
  await page.goto(requestedPath, { waitUntil: 'commit' });
  await assertLoaded(page);
  await expect(page).toHaveURL(requestedPath);
  expect(documents()).toBe(2);
  expect(modules).toBe(2);
  expect(await page.evaluate(target => sessionStorage.getItem(`hp:lazy-route-reloaded:v1:${target}`), path)).toBe('1');
  await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Pink');
  await assertCannotPurchase(page);
  expect(store.attempts()).toBe(1);
  expect(store.writes).toEqual([]);
});

test('persistent product module failure stops after one automatic reload and permits a manual reload', async ({ page }) => {
  const store = await mockStore(page, route => successfulRead(route));
  const documents = mainDocumentCounter(page);
  let unavailable = true;
  let modules = 0;
  await page.route('**/src/pages/ProductDetail.tsx*', async route => {
    modules += 1;
    if (unavailable) await route.abort('failed');
    else await route.fallback();
  });
  await page.goto(path, { waitUntil: 'commit' });
  await expect.poll(documents).toBe(2);
  await expect(page.getByRole('button', { name: 'Reload Product', exact: true })).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: "We couldn't load this product", exact: true })).toBeVisible();
  await expect(missingHeading(page)).toHaveCount(0);
  expect(documents()).toBe(2);
  expect(modules).toBe(2);
  expect(store.attempts()).toBe(0);

  unavailable = false;
  await page.getByRole('button', { name: 'Reload Product', exact: true }).click();
  await assertLoaded(page);
  expect(documents()).toBe(3);
  expect(modules).toBe(3);
  expect(store.attempts()).toBe(1);
  expect(store.writes).toEqual([]);
});

test('denied session storage prevents automatic reload loops and retains manual product recovery', async ({ page }) => {
  const store = await mockStore(page, route => successfulRead(route));
  const documents = mainDocumentCounter(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() { throw new DOMException('Session storage denied for this test', 'SecurityError'); },
    });
  });
  let unavailable = true;
  let modules = 0;
  await page.route('**/src/pages/ProductDetail.tsx*', async route => {
    modules += 1;
    if (unavailable) await route.abort('failed');
    else await route.fallback();
  });
  await page.goto(path, { waitUntil: 'commit' });
  await expect(page.getByRole('button', { name: 'Reload Product', exact: true })).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(missingHeading(page)).toHaveCount(0);
  expect(documents()).toBe(1);
  expect(modules).toBe(1);
  expect(store.attempts()).toBe(0);

  unavailable = false;
  await page.getByRole('button', { name: 'Reload Product', exact: true }).click();
  await assertLoaded(page);
  expect(documents()).toBe(2);
  expect(modules).toBe(2);
  expect(store.attempts()).toBe(1);
  expect(store.writes).toEqual([]);
});
