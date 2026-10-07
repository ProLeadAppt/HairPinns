import { expect, test, type Page } from '@playwright/test';
const description = 'A complete introduction with a price of $19.95. ' + 'Verified collection information stays readable without truncation. '.repeat(6);
const photo = { id: 'image', url: 'https://cdn.shopify.com/test.svg', altText: 'Product', width: 800, height: 800 };
const makeProduct = (handle: string, title: string, range: string, id: string) => ({
  id: `gid://shopify/Product/${id}`, handle, title, vendor: 'Hair Pinns Home Hair Care', productType: 'Hair care', availableForSale: true, tags: [],
  description: 'Complete catalogue description.', descriptionHtml: '<p>Complete catalogue description.</p>',
  priceRange: { minVariantPrice: { amount: '19.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '19.95', currencyCode: 'AUD' } },
  images: { edges: [{ node: photo }] }, variants: { edges: [{ node: { id: `gid://shopify/ProductVariant/${id}`, title: 'Default Title', availableForSale: true, quantityAvailable: 3, requiresShipping: true, price: { amount: '19.95', currencyCode: 'AUD' }, selectedOptions: [{ name: 'Title', value: 'Default Title' }], image: photo } }] },
  collections: { edges: [{ node: { handle: 'sale', title: 'Sale' } }, { node: { handle: range, title: range === 'juuce' ? 'Juuce Botanical Hair Care' : 'Wet Brush' } }] },
});
const heat = makeProduct('test-heat', 'Juuce Heat Shield', 'juuce', '1');
const repair = makeProduct('test-repair', 'Juuce Repair', 'juuce', '3');
const brush = makeProduct('test-brush', 'Wet Brush Detangler', 'wet-brush', '2');
const spare = makeProduct('test-spare', 'Wet Brush Spare', 'wet-brush', '4');
async function mockStore(page: Page) {
  const reads: string[] = []; const writes: string[] = [];
  await page.route('**/*', async route => {
    const request = route.request(); const url = new URL(request.url());
    if (url.pathname.endsWith('/graphql.json')) {
      const { query, variables } = request.postDataJSON();
      if (/mutation/.test(query)) { writes.push('mutation'); return route.abort(); }
      let product = null; let collection = null;
      if (/query getProduct/.test(query)) {
        expect(query).toContain('collections(first: 20)'); reads.push(variables.handle);
        product = [heat, repair, brush, spare].find(p => p.handle === variables.handle) || null;
      }
      if (/query getCollection/.test(query)) collection = { id: 'collection', handle: variables.handle, title: variables.handle === 'juuce' ? 'Juuce' : 'Empty', description: variables.handle === 'empty' ? '   ' : description, products: { edges: (variables.handle === 'juuce' ? [heat, repair] : [brush, spare]).map(node => ({ node })), pageInfo: { hasNextPage: false, endCursor: null } } };
      return route.fulfill({ json: { data: { product, collection, products: { edges: [] }, collections: { edges: [] } } } });
    }
    if (/\/(api|\.netlify\/functions)\//.test(url.pathname)) { writes.push(url.pathname); return route.fulfill({ json: {} }); }
    if (['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue();
    if (request.resourceType() === 'image') return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"/>' });
    return route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  return { reads, writes };
}

test('draft article metadata, H3, lists, stylist tip and verified destinations render through Back', async ({ page }) => {
  const store = await mockStore(page);
  const metaDescription = 'Draft advice with verified booking and product destinations. '.repeat(3).slice(0, 145);
  const post = {
    slug: 'kids-hair-gift-ideas', title: 'Draft article test', seoTitle: 'Draft article test | Hair Pinns', metaDescription,
    excerpt: 'Draft excerpt.', date: 'October 7, 2026', author: 'Jena Pinn', image: photo.url, category: 'Draft', readTime: '8 min read',
    cta: { type: 'booking' },
    content: { introduction: 'A draft only.', stylistTip: 'Follow verified directions for the selected product.', sections: [{ heading: 'A verified routine', content: 'Draft body '.repeat(600), subsections: [{ heading: 'The next step', content: 'Check the current product instructions.' }], bullets: ['Confirm the option', 'Read the directions'], steps: ['Choose the verified product', 'Review your choice'] }], productModule: { title: 'Verified option', products: [{ name: 'Juuce Heat Shield', link: '/products/test-heat?variant=1', description: 'A fixture with an exact variant.' }] } },
  };
  await page.route('**/src/data/blog-posts/kids-hair-gift-ideas.tsx*', route => route.fulfill({ contentType: 'application/javascript', body: `import React from '/node_modules/.vite/deps/react.js'; import { BlogPostTemplate } from '/src/pages/BlogPost.tsx'; export default function Page(){return React.createElement(BlogPostTemplate,{post:${JSON.stringify(post)}});}` }));
  await page.goto('/blog/kids-hair-gift-ideas');
  await expect(page.getByRole('heading', { level: 1, name: 'Draft article test' })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', metaDescription);
  await expect(page.getByRole('heading', { level: 3, name: 'The next step' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Pro Stylist Tip' })).toContainText('Follow verified directions');
  await expect(page.locator('#article-content ul li')).toHaveCount(2); await expect(page.locator('#article-content ol li')).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Book with Jena' }).first()).toHaveAttribute('href', /fresha\.com\/a\/hair-pinns/);
  const link = page.locator('#article-products').getByRole('link', { name: /Juuce Heat Shield/ });
  await expect(link).toHaveAttribute('href', '/products/test-heat?variant=1');
  await link.click();await expect(page.getByRole('heading', { level: 1, name: 'Juuce Heat Shield' })).toBeVisible();
  await page.goBack();await expect(page.getByRole('heading', { level: 1, name: 'Draft article test' })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', metaDescription);
  expect(store.writes).toEqual([]);
});

test('loaded reviews remain truthful after timeout and SPA Back', async ({ page }) => {
  const store = await mockStore(page);
  await page.clock.install();
  await page.route('**/widget_preloader.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.jdgmCacheServer={reloadAll(){document.querySelectorAll('.jdgm-review-widget').forEach(host=>{if(!host.querySelector('.jdgm-rev-widg')){const widget=document.createElement('div');widget.className='jdgm-rev-widg';widget.textContent='Verified fixture reviews';host.appendChild(widget);}})}};` }));
  await page.goto('/products/test-heat');
  await page.locator('#product-reviews').scrollIntoViewIfNeeded();
  await expect(page.locator('.jdgm-rev-widg')).toHaveCount(1);
  await page.clock.fastForward(22000);
  await expect(page.getByText(/Reviews could not load/)).toHaveCount(0);
  await page.locator('[data-product-recommendations]').getByRole('link', { name: /Juuce Repair/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Juuce Repair' })).toBeVisible();
  await page.goBack();await expect(page.getByRole('heading', { level: 1, name: 'Juuce Heat Shield' })).toBeVisible();
  await page.locator('#product-reviews').scrollIntoViewIfNeeded();await expect(page.locator('.jdgm-rev-widg')).toHaveCount(1);
  await page.clock.fastForward(22000);await expect(page.getByText(/Reviews could not load/)).toHaveCount(0);
  expect(store.writes).toEqual([]);
});
for (const width of [390, 1280]) {
  test(`full and empty collection introductions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 }); const store = await mockStore(page);
    await page.goto('/collections/juuce');
    await expect(page.locator('main').getByText(description, { exact: true })).toBeVisible();
    await expect(page.getByText('About this collection', { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.goto('/collections/empty');
    await expect(page.locator('h1')).toHaveText('Empty');
    await expect(page.getByText('Browse this hair care collection', { exact: true })).toHaveCount(0);
    expect(store.writes).toEqual([]);
  });
  test(`declared range and brand survive repeat navigation and Back at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 }); const store = await mockStore(page);
    await page.goto('/products/test-heat');
    await expect(page.getByText('Product / Juuce', { exact: true })).toBeVisible();
    const shelf = page.locator('[data-product-recommendations]');
    await expect(shelf).toContainText('Juuce Repair'); await expect(shelf).not.toContainText('Wet Brush');
    await shelf.getByRole('link', { name: /Juuce Repair/ }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'Juuce Repair' })).toBeVisible();
    await page.goBack();await expect(page.getByRole('heading', { level: 1, name: 'Juuce Heat Shield' })).toBeVisible();
    await expect(shelf).toContainText('Juuce Repair');
    await expect.poll(() => store.reads.filter(h => h === 'test-heat').length).toBe(2);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schema.join(' ')).toContain('"name":"Juuce"'); expect(schema.join(' ')).not.toContain('"name":"Hair Pinns Home Hair Care"');
    await page.goto('/products/test-brush');
    await expect(page.getByText('Product / Wet Brush', { exact: true })).toBeVisible();
    await expect(shelf).toContainText('Wet Brush Spare');await expect(shelf).not.toContainText('Juuce Repair');
    expect(store.writes).toEqual([]);
  });
}
