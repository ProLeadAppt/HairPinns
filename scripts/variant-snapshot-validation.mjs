export function variantSnapshotIssue(html, expected) {
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap(match => {
    try { const data = JSON.parse(match[1]); return data['@graph'] || [data]; } catch { return []; }
  });
  const products = schemas.filter(schema => schema['@type'] === 'Product');
  if (!expected) return products.length || !html.includes('This option is not available.') ? 'Unavailable variant snapshot advertises a product or lacks its unavailable message' : null;
  const offer = products[0]?.offers;
  if (products.length !== 1 || Number(offer?.price) !== Number(expected.amount) || offer?.priceCurrency !== expected.currencyCode) return 'Variant snapshot price/schema does not match the current catalogue';
  if (expected.variantId && !offer?.url?.endsWith(`?variant=${expected.variantId}`)) return 'Variant snapshot offer URL identifies a different variant';
  if (expected.sku !== undefined && products[0].sku !== expected.sku) return 'Variant snapshot SKU does not match the current catalogue';
  if (expected.availability && offer?.availability !== `https://schema.org/${expected.availability}`) return 'Variant snapshot availability does not match the current catalogue';
  if (typeof expected.requiresShipping === 'boolean' && Boolean(offer?.shippingDetails) !== expected.requiresShipping) return 'Variant snapshot shipping state does not match the current catalogue';
  if (expected.handle) {
    const canonical = `https://hairpinns.com/products/${expected.handle}/`;
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]);
    const actual = links.find(link => /\brel=["']canonical["']/i.test(link))?.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (actual !== canonical || offer?.url !== `${canonical}?variant=${expected.variantId}`) return 'Variant snapshot canonical or Offer URL does not match the public product URL';
  }
  const purchaseSection = html.match(/data-product-detail-core[\s\S]*?<\/section>/)?.[0] || '';
  const displayedPrice = new Intl.NumberFormat('en-AU', { style: 'currency', currency: expected.currencyCode }).format(Number(expected.amount));
  if (!purchaseSection.includes(displayedPrice)) return 'Variant snapshot visible price does not match its schema';
  return null;
}
