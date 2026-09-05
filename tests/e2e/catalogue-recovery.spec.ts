import { expect, test } from '@playwright/test';

test('shop hub provides three simple paths and direct Christmas links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/collections', { waitUntil: 'domcontentloaded' });

  const tabs = page.getByRole('tablist', { name: 'Ways to shop' });
  await expect(tabs.getByRole('tab')).toHaveCount(3);
  await expect(tabs.getByRole('tab', { name: 'Hair Need' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Hair Need' })).toBeVisible();

  const hairNeedTab = tabs.getByRole('tab', { name: 'Hair Need' });
  const productTab = tabs.getByRole('tab', { name: 'Product' });
  const brandTab = tabs.getByRole('tab', { name: 'Brand' });

  await hairNeedTab.focus();
  await hairNeedTab.press('ArrowRight');
  await expect(productTab).toBeFocused();
  await expect(productTab).toHaveAttribute('aria-selected', 'true');
  const productPanel = page.getByRole('tabpanel', { name: 'Product' });
  await expect(productPanel).toBeVisible();
  await expect(productPanel.getByRole('link', { name: /Bundles & Gifts/ })).toHaveAttribute('href', '/collections/haircare-bundles-gift-sets');

  await productTab.press('End');
  await expect(brandTab).toBeFocused();
  await expect(brandTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Brand' }).getByRole('link', { name: /Aromaganic/ })).toBeVisible();

  await brandTab.press('Home');
  await expect(hairNeedTab).toBeFocused();
  await expect(hairNeedTab).toHaveAttribute('aria-selected', 'true');
  await hairNeedTab.press('ArrowLeft');
  await expect(brandTab).toBeFocused();
  await expect(brandTab).toHaveAttribute('aria-selected', 'true');

  const seasonal = page.getByRole('region', { name: 'Christmas packs are here.' });
  await expect(seasonal.getByRole('link', { name: /Juuce Christmas Packs/ })).toHaveAttribute('href', '/products/christmas-packs');
  await expect(seasonal.getByRole('link', { name: /Pure Christmas Packs/ })).toHaveAttribute('href', '/products/pure-christmas-packs-2025');
  await expect(seasonal.getByRole('link', { name: /Festive Finish Gift Set Duo/ })).toHaveAttribute('href', '/products/festive-finish-gift-set-duo');

  await expect(page.getByText(/Jena's Daily Trio/i)).toHaveCount(0);
  await expect(page.getByRole('searchbox', { name: /Search collections/i })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('collection cards require option selection for Christmas packs and quick-add only an exact single variant', async ({ page }) => {
  await page.route('**/graphql.json', async (route) => {
    const requestBody = JSON.parse(route.request().postData() || '{}');
    if (!String(requestBody.query).includes('query getCollection')) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          collection: {
            id: 'collection-bundles',
            title: 'Haircare Bundles & Gift Sets',
            handle: 'haircare-bundles-gift-sets',
            description: 'Salon-selected haircare bundles and gifts for considered routines.',
            descriptionHtml: '<p>Salon-selected haircare bundles and gifts for considered routines.</p>',
            image: null,
            products: {
              edges: [
                {
                  node: {
                    id: 'product-christmas',
                    title: 'Juuce Christmas Packs',
                    handle: 'christmas-packs',
                    availableForSale: true,
                    priceRange: {
                      minVariantPrice: { amount: '45.00', currencyCode: 'AUD' },
                      maxVariantPrice: { amount: '75.00', currencyCode: 'AUD' },
                    },
                    compareAtPriceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'AUD' } },
                    images: { edges: [] },
                    variants: {
                      edges: [
                        { node: { id: 'hydrate', title: 'Hydrate', availableForSale: true, quantityAvailable: 0, price: { amount: '45.00', currencyCode: 'AUD' }, compareAtPrice: null } },
                        { node: { id: 'repair', title: 'Repair', availableForSale: true, quantityAvailable: 2, price: { amount: '75.00', currencyCode: 'AUD' }, compareAtPrice: null } },
                      ],
                      pageInfo: { hasNextPage: false },
                    },
                  },
                },
                {
                  node: {
                    id: 'product-single',
                    title: 'Festive Finish Gift Set Duo',
                    handle: 'festive-finish-gift-set-duo',
                    availableForSale: true,
                    priceRange: {
                      minVariantPrice: { amount: '45.00', currencyCode: 'AUD' },
                      maxVariantPrice: { amount: '45.00', currencyCode: 'AUD' },
                    },
                    compareAtPriceRange: { minVariantPrice: { amount: '55.00', currencyCode: 'AUD' } },
                    images: { edges: [] },
                    variants: {
                      edges: [
                        { node: { id: 'only-variant', title: 'Default Title', availableForSale: true, quantityAvailable: 3, price: { amount: '49.50', currencyCode: 'AUD' }, compareAtPrice: { amount: '55.00', currencyCode: 'AUD' } } },
                      ],
                      pageInfo: { hasNextPage: false },
                    },
                  },
                },
              ],
            },
          },
        },
      }),
    });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/collections/haircare-bundles-gift-sets', { waitUntil: 'domcontentloaded' });

  const christmasPack = page.locator('article').filter({ hasText: 'Juuce Christmas Packs' });
  await expect(christmasPack).toContainText('From $45');
  await expect(christmasPack.getByRole('link', { name: 'Choose options for Juuce Christmas Packs' })).toHaveAttribute('href', '/products/christmas-packs');
  await expect(christmasPack.getByRole('button', { name: 'Add to Bag' })).toHaveCount(0);

  const singleProduct = page.locator('article').filter({ hasText: 'Festive Finish Gift Set Duo' });
  await expect(singleProduct.getByText('$49.5', { exact: true })).toBeVisible();
  await expect(singleProduct.getByText('$45', { exact: true })).toHaveCount(0);
  await expect(singleProduct.getByRole('button', { name: 'Add to Bag' })).toBeVisible();
  await expect(singleProduct.getByRole('link', { name: /Choose options/ })).toHaveCount(0);
});

test('paused Daily Trio route stays truthful and out of search results', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/collections/jenas-daily-trio/', { waitUntil: 'domcontentloaded' });

  const trioMain = page.locator('main[data-trio-status="awaiting-update"]');
  await expect(trioMain.getByRole('heading', { name: 'A better daily trio is coming.' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);
  await expect(trioMain.getByText(/10%/)).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).not.toContainText('"@type":"Offer"');
});
