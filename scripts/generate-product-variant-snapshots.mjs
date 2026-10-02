import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VARIANT_SNAPSHOT_HANDLES } from '../shared/productVariantSnapshots.js';

export async function collectVariantSnapshotManifest(fetchProduct) {
  const manifest = {};
  for (const handle of VARIANT_SNAPSHOT_HANDLES) {
    const product = await fetchProduct(handle);
    if (!product || product.variants?.pageInfo?.hasNextPage || !product.variants?.edges?.length) {
      throw new Error(`Incomplete variant snapshot catalogue: ${handle}`);
    }
    manifest[handle] = {};
    for (const { node } of product.variants.edges) {
      const id = node.id?.match(/^gid:\/\/shopify\/ProductVariant\/(\d+)$/)?.[1];
      if (!id || !Number.isFinite(Number(node.price?.amount)) || Number(node.price.amount) < 0 || node.price?.currencyCode !== 'AUD') {
        throw new Error(`Invalid variant snapshot catalogue: ${handle}`);
      }
      manifest[handle][id] = { amount: node.price.amount, currencyCode: node.price.currencyCode };
    }
  }
  return manifest;
}

async function main() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const envPath = resolve(root, '.env');
  if (existsSync(envPath)) for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  const token = process.env.VITE_SF_STOREFRONT_TOKEN;
  if (!token) throw new Error('Missing Shopify Storefront configuration for variant snapshots');
  const domain = process.env.VITE_SHOPIFY_MYSHOPIFY_DOMAIN || 'femtat-zu.myshopify.com';
  const version = process.env.VITE_SF_API_VERSION || '2026-07';
  const manifest = await collectVariantSnapshotManifest(async handle => {
    const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({ query: 'query VariantSnapshotProduct($handle: String!) { product(handle: $handle) { variants(first: 100) { edges { node { id price { amount currencyCode } } } pageInfo { hasNextPage } } } }', variables: { handle } }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Variant catalogue request failed: HTTP ${response.status}`);
    const result = await response.json();
    if (result.errors) throw new Error('Variant catalogue query failed');
    return result.data?.product;
  });
  writeFileSync(resolve(root, 'shared/productVariantSnapshots.generated.js'), `// Public catalogue snapshot, regenerated before each production build.\nexport default ${JSON.stringify(manifest, null, 2)};\n`);
  console.log(`[variant snapshots] ${Object.keys(manifest).length} products, ${Object.values(manifest).reduce((sum, variants) => sum + Object.keys(variants).length, 0)} variants`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
