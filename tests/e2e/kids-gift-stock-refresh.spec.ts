import { expect, test } from '@playwright/test';

const cachedProduct = {
  id: 'gid://shopify/Product/old',
  handle: 'old-ponytail',
  title: 'Old Ponytail',
  availableForSale: true,
  priceRange: { minVariantPrice: { amount: '15.00', currencyCode: 'AUD' }, maxVariantPrice: { amount: '15.00', currencyCode: 'AUD' } },
  images: { edges: [] },
  variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/old', title: 'Purple', availableForSale: true, quantityAvailable: 1, price: { amount: '15.00', currencyCode: 'AUD' } } }] },
};

test('kids gift choices wait for current Shopify stock instead of displaying a cached variant', async ({ page }) => {
  await page.addInitScript((product) => {
    const collection = {
      id: 'gid://shopify/Collection/old',
      handle: 'diy-kids-gift-packs',
      title: 'DIY Kids Gift Packs',
      description: 'Choose their favourites.',
      products: { edges: [{ node: product }] },
    };
    sessionStorage.setItem('hp_col_v2_diy-kids-gift-packs', JSON.stringify({
      collection,
      products: [{ id: product.id, handle: product.handle, title: product.title, price: 15, currency: 'AUD', availableForSale: true }],
    }));
  }, cachedProduct);

  let releaseShopify!: () => void;
  const shopifyGate = new Promise<void>((resolve) => { releaseShopify = resolve; });
  let collectionRequestSeen = false;
  await page.route('**/graphql.json', async (route) => {
    const body = route.request().postDataJSON();
    if (body?.operationName === 'getCollection' || body?.query?.includes('query getCollection')) {
      collectionRequestSeen = true;
      await shopifyGate;
      await route.fulfill({ json: { data: { collection: null } } });
      return;
    }
    await route.fulfill({ json: { data: {} } });
  });

  await page.goto('/collections/diy-kids-gift-packs');
  await expect(page.getByRole('heading', { name: 'Make it their kind of gift.' })).toHaveCount(0);
  await expect(page.getByText('Old Ponytail')).toHaveCount(0);

  await expect.poll(() => collectionRequestSeen).toBe(true);
  releaseShopify();
  await expect(page.getByText('Old Ponytail')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Collection Unavailable' })).toBeVisible();
});
