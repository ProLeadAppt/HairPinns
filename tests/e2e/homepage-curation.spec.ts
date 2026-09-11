import { expect, test } from '@playwright/test';

const money = (amount: string) => ({ amount, currencyCode: 'AUD' });
const products = Array.from({ length: 6 }, (_, index) => ({
  id: `product-${index}`, handle: `jena-pick-${index}`, title: `Jena pick ${index + 1}`, availableForSale: true,
  priceRange: { minVariantPrice: money('20.00'), maxVariantPrice: money(index === 0 ? '25.00' : '20.00') },
  images: { edges: [] }, variants: { pageInfo: { hasNextPage: false }, edges: (index === 0 ? [1, 2] : [1]).map(id => ({ node: {
    id: `variant-${index}-${id}`, title: `Style ${id}`, availableForSale: true, quantityAvailable: 5, price: money('20.00'),
  } })) },
}));

for (const width of [344, 390, 768, 1440]) {
  test(`Shopify controls shelf order and safe card actions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/graphql.json', route => {
      const { variables } = route.request().postDataJSON();
      return route.fulfill({ json: { data: {
        product: null, products: { edges: [] }, collections: { edges: [] },
        collection: variables.handle === 'hair-pinns-homepage-picks'
          ? { id: 'homepage-picks', handle: variables.handle, title: 'Hair Pinns — Homepage picks', products: { edges: products.map(node => ({ node })) } }
          : null,
      } } });
    });
    await page.goto('/');
    // The homepage intentionally defers below-the-fold components until scroll intent.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const shelf = page.getByRole('region', { name: 'Popular picks from the shelf' });
    for (let y = 0; y <= 6500; y += 450) {
      if (await shelf.locator('article').count()) break;
      await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(100);
    }
    await expect(shelf.locator('article')).toHaveCount(6);
    expect(await shelf.locator('h3').allTextContents()).toEqual(products.map(product => product.title));
    await expect(shelf.locator('article').first().getByRole('link', { name: 'Choose options for Jena pick 1' })).toHaveAttribute('href', '/products/jena-pick-0');
    await expect(shelf.locator('article').first().getByRole('button', { name: /Add to Bag/ })).toHaveCount(0);
    await expect(shelf.locator('article').nth(1).getByRole('button', { name: /Add to Bag/ })).toBeEnabled();
    const addButton = shelf.locator('article').nth(1).getByRole('button', {name:/Add to Bag/});
    await addButton.hover();
    await expect(addButton).toHaveCSS('color', 'rgb(255, 255, 255)');
    const first = await shelf.locator('article').nth(0).boundingBox();
    const second = await shelf.locator('article').nth(1).boundingBox();
    expect(Math.abs(first!.width - second!.width)).toBeLessThan(2);
    expect(Math.abs(first!.y - second!.y)).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
