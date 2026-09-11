import { expect, test } from '@playwright/test';

// Shopify is the external boundary. Exercise the real page, selectors and cart API.
const image = (id: string, altText: string) => ({ id, altText, url: `https://cdn.shopify.com/test/${id}.jpg`, width: 800, height: 800 });
const photos = [image('yellow', 'Yellow'), image('minnie', 'Minnie Mouse'), image('lifestyle', 'Brush collection'), image('sold-out', 'Sold-out Pink')];
const variant = (id: string, title: string, amount: string, photo: typeof photos[number], availableForSale = true) => ({
  id: `gid://shopify/ProductVariant/${id}`, title, availableForSale, quantityAvailable: availableForSale ? 3 : 0,
  price: { amount, currencyCode: 'AUD' }, compareAtPrice: null, image: photo,
  selectedOptions: [{ name: 'Style', value: title }],
});
const variants = [variant('101', 'Yellow', '19.95', photos[0]), variant('102', 'Minnie Mouse', '24.95', photos[1]), variant('103', 'Pink', '22.95', photos[3], false)];
const product = {
  id: 'gid://shopify/Product/1', handle: 'wet-brush-test', title: 'Wet Brush Test', vendor: 'Wet Brush',
  description: 'A detangling brush.', descriptionHtml: '<p>A detangling brush.</p>', tags: [], availableForSale: true,
  priceRange: { minVariantPrice: { amount: '19.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '24.95', currencyCode: 'AUD' } },
  images: { edges: photos.map(node => ({ node })) }, variants: { edges: variants.map(node => ({ node })) },
  collections: { edges: [] },
};

test.beforeEach(async ({ page }) => {
  await page.route('**/graphql.json', route => route.fulfill({ json: { data: { product, products: { edges: [] }, collections: { edges: [] }, collection: null, productRecommendations: [] } } }));
  await page.route('https://cdn.shopify.com/test/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="lavender"/></svg>' }));
  await page.route('**/api/checkout', route => route.fulfill({ json: { cart: {
    id: 'test-cart', checkoutUrl: 'https://example.com/checkout', lines: { edges: [] }, cost: { totalAmount: { amount: '24.95', currencyCode: 'AUD' } },
  } } }));
});

test('a unique product photograph changes the option, price and merchandise added to bag', async ({ page }) => {
  await page.goto('/products/wet-brush-test');
  await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Yellow');
  await page.locator('button').filter({ has: page.locator('img[alt="Minnie Mouse"]') }).click();
  await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Minnie Mouse');
  await expect(page.locator('main').getByText('$24.95', { exact: true }).first()).toBeVisible();
  await expect(page.locator('main').getByText('$24.95', { exact: true }).first()).toHaveCSS('color', 'rgb(117, 61, 145)');
  const request = page.waitForRequest(req => req.url().endsWith('/api/checkout') && req.postDataJSON()?.action === 'add');
  await page.locator('[data-product-purchase-actions]').getByRole('button', { name: 'Add to Bag', exact: true }).click();
  expect((await request).postDataJSON().lines).toEqual([{ merchandiseId: variants[1].id, quantity: 1 }]);
});

test('a sold-out variant link keeps its option, image and price without substituting available stock', async ({ page }) => {
  await page.goto('/products/wet-brush-test?variant=103');
  await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Pink');
  await expect(page.getByRole('button', { name: /Open Wet Brush Test image 4 full screen/ })).toBeVisible();
  await expect(page.locator('main').getByText('$22.95', { exact: true }).first()).toBeVisible();
  await expect(page.locator('[data-product-purchase-actions]').getByRole('button', { name: 'Add to Bag', exact: true })).toBeDisabled();
});

test('a gallery-only photograph does not change the selected style', async ({ page }) => {
  await page.goto('/products/wet-brush-test?variant=102');
  await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Minnie Mouse');
  await page.locator('button').filter({ has: page.locator('img[alt="Brush collection"]') }).click();
  await expect(page.getByRole('combobox', { name: 'Style' })).toContainText('Minnie Mouse');
});

test('mobile photographs stay in one compact row above product options', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 844 });
  await page.goto('/products/wet-brush-test');
  const thumbnails = page.locator('[data-product-thumbnails]');
  await expect(thumbnails).toBeVisible();
  const bounds = await thumbnails.boundingBox();
  expect(bounds!.height).toBeLessThanOrEqual(100);
  const buttons = await thumbnails.locator('button').all();
  const tops = await Promise.all(buttons.map(button => button.evaluate(el => el.getBoundingClientRect().top)));
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(344);
});
