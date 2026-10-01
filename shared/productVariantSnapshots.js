// Only these diagnosed Google landing pages opt in to variant prerendering.
export const VARIANT_SNAPSHOT_HANDLES = [
  'juuce-super-soft-hydration-moisture-mask',
  'hair-pinns-gift-card',
  'poppet-locks-little-plaited-piggy-tails',
  'purple-wide-tooth-combs',
  'wet-brush-original-detangler',
  'aromaganic-clean-hair-colour-organics',
];

export function variantSnapshotTarget(url, manifest, method = 'GET') {
  if (!['GET', 'HEAD'].includes(method)) return null;
  const match = url.pathname.match(/^\/products\/([^/]+)\/?$/);
  if (!match || !Object.hasOwn(manifest, match[1]) || !url.searchParams.has('variant')) return null;
  const values = url.searchParams.getAll('variant');
  const id = values.length === 1 ? values[0].replace(/^gid:\/\/shopify\/ProductVariant\//, '') : '';
  const key = /^\d+$/.test(id) && Object.hasOwn(manifest[match[1]], id) ? id : 'unavailable';
  return `/_product-variants/${match[1]}/${key}/index.html`;
}

export function variantSnapshotRoutes(manifest) {
  return Object.entries(manifest).flatMap(([handle, variants]) => [
    ...Object.entries(variants).map(([id, expected]) => ({ route: `/products/${handle}/?variant=${id}`, path: variantSnapshotTarget(new URL(`https://hairpinns.com/products/${handle}/?variant=${id}`), manifest), expected: { ...expected, variantId: id } })),
    { route: `/products/${handle}/?variant=unavailable`, path: `/_product-variants/${handle}/unavailable/index.html`, expected: null },
  ]);
}
