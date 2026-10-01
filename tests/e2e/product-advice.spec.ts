import { expect, test } from '@playwright/test';

for (const width of [344, 390, 768, 1440]) {
  test(`Shopify-authored advice and comparison work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/graphql.json', route => route.fulfill({ json: { data: {
      product: {
        id: 'gid://shopify/Product/1', title: 'Juuce Repair Smooth Enz', handle: 'juuce-repair-smooth-enz', vendor: 'Juuce', tags: [],
        description: 'A creamy leave-in for softer-feeling ends.',
        descriptionHtml: '<p>A creamy leave-in.</p><h3>Who it suits</h3><p>People who prefer a cream.</p><h3>What it does</h3><p>Helps soften lengths and ends.</p><h3>How to use it</h3><p>Follow your bottle instructions.</p><p>Compare with <a href="/products/juuce-20-in-one-miracle/">20 in One</a>.</p>',
        images: { edges: [] }, collections: { edges: [] }, availableForSale: true,
        priceRange: { minVariantPrice: { amount: '33.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '33.95', currencyCode: 'AUD' } },
        variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/101', title: '150ml', availableForSale: true, quantityAvailable: 3, requiresShipping: true,
          price: { amount: '33.95', currencyCode: 'AUD' }, selectedOptions: [{ name: 'Size', value: '150ml' }] } }] },
      }, products: { edges: [] }, collections: { edges: [] }, productRecommendations: [],
    } } }));
    await page.goto('/products/juuce-repair-smooth-enz/');
    const advice = page.getByLabel('Product advice');
    await expect(advice).toContainText('Who it suits');
    await expect(advice).toContainText('Follow your bottle instructions.');
    await expect(page.getByText(/Select a labelled style|Choose your size above/)).toHaveCount(0);
    await expect(page.getByRole('link', { name: '20 in One', exact: true })).toHaveAttribute('href', '/products/juuce-20-in-one-miracle/');
    await expect(page.locator('[data-product-purchase-actions]').getByRole('button', { name: 'Add to Bag', exact: true })).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `output/playwright/advice-${test.info().project.name}-${width}.png`, fullPage: true });
  });
}
