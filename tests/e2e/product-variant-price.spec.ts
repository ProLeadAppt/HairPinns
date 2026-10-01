import { expect, test } from '@playwright/test';

for (const digital of [false, true]) {
  for (const variant of ['202', '999', '101', 'base']) {
    test(`${digital ? 'digital' : 'physical'} variant ${variant} stays coherent`, async ({ page }) => {
      await page.route('**/graphql.json', route => route.fulfill({ json: { data: {
        product: {
          id: 'gid://shopify/Product/1', title: digital ? 'Hair Pinns Gift Card' : 'Juuce Mask', handle: 'test-product', vendor: 'Hair Pinns', tags: [],
          description: digital ? 'Delivered instantly via email.' : 'Hydration mask.', descriptionHtml: '', images: { edges: [] }, collections: { edges: [] }, availableForSale: true,
          priceRange: { minVariantPrice: { amount: '25.00', currencyCode: 'AUD' }, maxVariantPrice: { amount: '250.00', currencyCode: 'AUD' } },
          variants: { edges: ['101', '202'].map((id, index) => ({ node: { id: `gid://shopify/ProductVariant/${id}`, title: index ? 'Large' : 'Small', availableForSale: true, quantityAvailable: 5, requiresShipping: !digital, price: { amount: index ? '250.00' : '25.00', currencyCode: 'AUD' }, selectedOptions: [{ name: 'Size', value: index ? 'Large' : 'Small' }] } })) },
        }, products: { edges: [] }, collections: { edges: [] }, productRecommendations: [],
      } } }));
      await page.goto(`/products/test-product/?${variant === 'base' ? '' : `variant=${variant}&`}utm_source=google`);
      await expect(page.getByRole('heading', { name: digital ? 'Hair Pinns Gift Card' : 'Juuce Mask', exact: true })).toBeVisible();
      const getProducts = () => page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => {
        const data = JSON.parse(node.textContent || '{}'); return (data['@graph'] || [data]).filter(item => item['@type'] === 'Product');
      }));
      if (variant === '999') {
        await expect(page.getByText('This option is not available.', { exact: false })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Buy Now', exact: true })).toBeDisabled();
        expect(await getProducts()).toHaveLength(0);
      } else {
        await expect.poll(async () => (await getProducts())[0]?.offers?.price).toBe(variant === '202' ? '250' : '25');
        const schema = (await getProducts())[0];
        const resolvedVariant = variant === 'base' ? '101' : variant;
        expect(schema.offers.url).toBe(`https://hairpinns.com/products/test-product/?variant=${resolvedVariant}`);
        expect(schema.sku).toBe(resolvedVariant);
        await expect(page.getByRole('combobox', { name: 'Size', exact: true })).toContainText(resolvedVariant === '202' ? 'Large' : 'Small');
        expect(Boolean(schema.offers.shippingDetails)).toBe(!digital);
        await expect(page.locator('[data-product-purchase-actions]').locator('..')).toContainText(variant === '202' ? '$250.00' : '$25.00');
        if (digital) {
          await expect(page.getByText('Digital delivery', { exact: true })).toBeVisible();
          await expect(page.getByText('Shipping across Australia', { exact: true })).toHaveCount(0);
          await expect(page.getByText('$9.95 · 3–5 business days', { exact: true })).toHaveCount(0);
        } else {
          await expect(page.getByText('$9.95 · 3–5 business days', { exact: true })).toBeVisible();
          await expect(page.getByText('$14.95 · 1–2 business days', { exact: true })).toBeVisible();
        }
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://hairpinns.com/products/test-product/');
      if (variant === '202') {
        await page.getByRole('combobox', { name: 'Size', exact: true }).click();
        await page.getByRole('option', { name: 'Small', exact: true }).click();
        await expect.poll(async () => (await getProducts())[0]?.offers?.price).toBe('25');
        await page.getByRole('combobox', { name: 'Size', exact: true }).click();
        await page.getByRole('option', { name: 'Large', exact: true }).click();
        await expect.poll(async () => (await getProducts())[0]?.offers?.price).toBe('250');
        let checkoutLines: unknown;
        await page.route('**/.netlify/functions/checkout?redirect=true', async route => {
          checkoutLines = JSON.parse(new URLSearchParams(route.request().postData() || '').get('lines') || 'null');
          await route.fulfill({ contentType: 'text/html', body: '<p>Checkout test endpoint</p>' });
        });
        await page.getByRole('button', { name: 'Buy Now', exact: true }).click();
        await expect.poll(() => checkoutLines).toEqual([{ merchandiseId: 'gid://shopify/ProductVariant/202', quantity: 1 }]);
      }
    });
  }
}

test('an unavailable multi-option combination cannot advertise the prior variant', async ({ page }) => {
  await page.route('**/graphql.json', route => route.fulfill({ json: { data: { product: {
    id: 'gid://shopify/Product/2', title: 'Multi-option product', handle: 'multi-option', vendor: 'Hair Pinns', tags: [], description: 'Choose your size and colour.', descriptionHtml: '', images: { edges: [] }, collections: { edges: [] }, availableForSale: true,
    priceRange: { minVariantPrice: { amount: '25.00', currencyCode: 'AUD' } },
    variants: { edges: ['101', '202'].map((id, index) => ({ node: { id: `gid://shopify/ProductVariant/${id}`, title: index ? 'Large Blue' : 'Small Red', availableForSale: true, requiresShipping: true, price: { amount: index ? '50.00' : '25.00', currencyCode: 'AUD' }, selectedOptions: [{ name: 'Size', value: index ? 'Large' : 'Small' }, { name: 'Colour', value: index ? 'Blue' : 'Red' }] } })) },
  }, products: { edges: [] }, collections: { edges: [] }, productRecommendations: [] } } }));
  await page.goto('/products/multi-option/?variant=101');
  await expect(page.getByRole('combobox', { name: 'Size', exact: true })).toContainText('Small');
  await page.getByRole('combobox', { name: 'Size', exact: true }).click();
  await page.getByRole('option', { name: 'Large', exact: true }).click();
  await expect(page.getByText('This option is not available.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Buy Now', exact: true })).toBeDisabled();
  await page.getByRole('combobox', { name: 'Colour', exact: true }).click();
  await page.getByRole('option', { name: 'Blue', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Buy Now', exact: true })).toBeEnabled();
  await expect(page.locator('[data-product-purchase-actions]').locator('..')).toContainText('$50.00');
});
