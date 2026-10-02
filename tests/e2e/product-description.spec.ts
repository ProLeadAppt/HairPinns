import { expect, test } from '@playwright/test';

const descriptions = [
  { name: 'plain decimals and all sentences', html: '', text: 'First sentence. Second sentence. Third sentence. Fourth sentence. Only $19.95. Sixth sentence! Final instructions?', expected: 'Final instructions?' },
  { name: 'ordinary HTML paragraphs and lists', html: '<p>Only $19.95.</p><p>A complete pamper session.</p><ul><li>Hair towel</li><li>Hair mask</li></ul><ol><li>Apply for 2.5 minutes.</li></ol>', text: 'Flattened fallback', expected: 'Apply for 2.5 minutes.' },
  { name: 'unsafe and malformed markup', html: '<p onclick="alert(1)">Only $19.95.</p><script>bad script</script><svg onload="alert(1)"><text>bad svg</text></svg><a href=javascript:alert(1)>Unsafe link</a><a href="jav&#x61;script:alert(1)">Encoded</a><a href="/products/example/?variant=123&amp;preview_token=secret">Compare</a><img src=x onerror=alert(1)><p>Final instructions?', text: 'Fallback', expected: 'Final instructions?' },
  { name: 'empty HTML falls back to text', html: '   ', text: 'Only $19.95.\n\nFinal instructions?', expected: 'Final instructions?' },
  { name: 'empty description', html: '', text: '', expected: 'Professional hair care product designed for great results at home.' },
];
for (const fixture of descriptions) {
  test(fixture.name, async ({ page }) => {
    await page.route('**/graphql.json', route => route.fulfill({ json: { data: {
      product: {
        id: 'gid://shopify/Product/1', title: 'Mini Pamper Pack', handle: 'mother-s-day-pamper-pack', vendor: 'Hair Pinns', tags: [],
        description: fixture.text, descriptionHtml: fixture.html,
        images: { edges: [] }, collections: { edges: [] }, availableForSale: true,
        priceRange: { minVariantPrice: { amount: '19.95', currencyCode: 'AUD' }, maxVariantPrice: { amount: '19.95', currencyCode: 'AUD' } },
        variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/101', title: 'Default Title', availableForSale: true, quantityAvailable: 3, requiresShipping: true, price: { amount: '19.95', currencyCode: 'AUD' }, selectedOptions: [] } }] },
      }, products: { edges: [] }, collections: { edges: [] }, productRecommendations: [],
    } } }));
    await page.goto('/products/mother-s-day-pamper-pack/');
    const description = page.getByRole('tabpanel', { name: 'Description', exact: true });
    await expect(description).toContainText(fixture.expected);
    if (fixture.text || fixture.html) await expect(description).toContainText('Only $19.95.');
    if (fixture.name.includes('lists')) {
      await expect(description.locator('ul li')).toHaveCount(2);
      await expect(description.locator('ol li')).toHaveCount(1);
      await expect(description.locator('p')).toHaveCount(2);
      await expect(description).not.toContainText('Flattened fallback');
    }
    if (fixture.name.includes('unsafe')) {
      await expect(description.locator('script, svg, img, [onclick], [onerror], [style]')).toHaveCount(0);
      await expect(description.getByText('Unsafe link')).not.toHaveAttribute('href');
      await expect(description.getByText('Encoded', { exact: true })).not.toHaveAttribute('href');
      await expect(description.getByRole('link', { name: 'Compare' })).toHaveAttribute('href', '/products/example/?variant=123');
      await expect(description).not.toContainText('bad script');
      await expect(description).not.toContainText('bad svg');
      await expect(description.locator('a[href*=preview_token]')).toHaveCount(0);
    }
  });
}
