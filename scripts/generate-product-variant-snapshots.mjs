import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectVariantSnapshotManifest } from '../shared/variantSnapshotCatalogue.js';
import { variantSnapshotRoutes } from '../shared/productVariantSnapshots.js';
import { isRetiredProductHandle } from './retired-products.js';
export { collectVariantSnapshotManifest } from '../shared/variantSnapshotCatalogue.js';

const variantFields = 'id sku availableForSale quantityAvailable requiresShipping price { amount currencyCode }';
export const productQuery = `query VariantSnapshotProducts($after: String) {
  products(first: 20, after: $after) {
    nodes { handle variants(first: 20) { nodes { ${variantFields} } pageInfo { hasNextPage endCursor } } }
    pageInfo { hasNextPage endCursor }
  }
}`;
export const variantQuery = `query VariantSnapshotVariants($handle: String!, $after: String) {
  product(handle: $handle) { variants(first: 100, after: $after) { nodes { ${variantFields} } pageInfo { hasNextPage endCursor } } }
}`;

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
  let requests = 0;
  async function query(operation, variables) {
    requests++;
    const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({ query: operation, variables }), signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Variant catalogue request failed: HTTP ${response.status}`);
    const result = await response.json();
    if (result.errors) throw new Error('Variant catalogue query failed');
    return result.data;
  }
  const manifest = await collectVariantSnapshotManifest(
    async after => (await query(productQuery, { after }))?.products,
    async (handle, after) => (await query(variantQuery, { handle, after }))?.product?.variants,
    isRetiredProductHandle,
  );
  const serialized = JSON.stringify(manifest);
  writeFileSync(resolve(root, 'shared/productVariantSnapshots.generated.js'), `// Public catalogue snapshot, regenerated before each production build.\nexport default ${JSON.stringify(manifest, null, 2)};\n`);
  const report = {
    catalogueAsOf: new Date().toISOString(), products: Object.keys(manifest).length,
    variants: Object.values(manifest).reduce((sum, variants) => sum + Object.keys(variants).length, 0),
    snapshotRoutes: variantSnapshotRoutes(manifest).length, requests,
    manifestBytes: Buffer.byteLength(serialized), manifestSha256: createHash('sha256').update(serialized).digest('hex'),
  };
  writeFileSync(resolve(root, 'public/product-variant-snapshot-report.json'), JSON.stringify(report, null, 2));
  console.log(`[variant snapshots] ${report.products} products, ${report.variants} variants, ${report.snapshotRoutes} routes, ${requests} catalogue requests`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
