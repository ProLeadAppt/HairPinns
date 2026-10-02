import { resolveProductAvailability } from './productAvailability.js';

function pageNodes(connection, label) {
  const nodes = connection?.nodes ?? connection?.edges?.map(edge => edge.node);
  if (!Array.isArray(nodes) || typeof connection.pageInfo?.hasNextPage !== 'boolean') throw Error(`Incomplete ${label} connection`);
  if (connection.pageInfo.hasNextPage && (!nodes.length || !connection.pageInfo.endCursor)) throw Error(`Incomplete ${label} pagination`);
  return nodes;
}

export async function collectVariantConnection(initial, fetchNext, label = 'variants') {
  const nodes = [], ids = new Set(), cursors = new Set();
  let connection = initial;
  while (true) {
    for (const node of pageNodes(connection, label)) {
      if (!node?.id || ids.has(node.id)) throw Error(`Invalid or duplicate ${label} ID`);
      ids.add(node.id); nodes.push(node);
    }
    if (!connection.pageInfo.hasNextPage) return { nodes, pageInfo: connection.pageInfo };
    const cursor = connection.pageInfo.endCursor;
    if (cursors.has(cursor)) throw Error(`Repeated ${label} cursor`);
    cursors.add(cursor); connection = await fetchNext(cursor);
  }
}

export async function collectVariantSnapshotManifest(fetchProductsPage, fetchVariantsPage, excludeHandle = () => false) {
  const manifest = Object.create(null), handles = new Set(), cursors = new Set();
  let after = null;
  while (true) {
    const page = await fetchProductsPage(after);
    for (const product of pageNodes(page, 'products')) {
      const handle = product?.handle;
      if (typeof handle !== 'string' || !/^[a-z0-9][a-z0-9_-]*$/.test(handle) || handles.has(handle)) throw Error(`Invalid or duplicate product handle: ${handle}`);
      handles.add(handle);
      if (excludeHandle(handle)) continue;
      const variants = Object.create(null);
      const complete = await collectVariantConnection(product.variants, cursor => fetchVariantsPage(handle, cursor), `variants: ${handle}`);
      for (const node of complete.nodes) {
        const id = node.id.match(/^gid:\/\/shopify\/ProductVariant\/(\d+)$/)?.[1];
        const amount = node.price?.amount;
        if (!id || typeof amount !== 'string' || !amount.trim() || !Number.isFinite(Number(amount)) || Number(amount) < 0 || node.price.currencyCode !== 'AUD' || typeof node.availableForSale !== 'boolean' || typeof node.requiresShipping !== 'boolean') throw Error(`Invalid variant snapshot catalogue: ${handle}`);
        variants[id] = { amount, currencyCode: node.price.currencyCode, sku: node.sku || id, availability: resolveProductAvailability(node).schema, requiresShipping: node.requiresShipping };
      }
      if (!Object.keys(variants).length) throw Error(`Empty variants: ${handle}`);
      manifest[handle] = variants;
    }
    if (!page.pageInfo.hasNextPage) break;
    const cursor = page.pageInfo.endCursor;
    if (cursors.has(cursor)) throw Error('Repeated product cursor');
    cursors.add(cursor); after = cursor;
  }
  if (!Object.keys(manifest).length) throw Error('Empty public catalogue');
  return manifest;
}
