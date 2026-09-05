/**
 * Exhaust a Shopify GraphQL connection without assuming the catalogue fits
 * within one page. The caller owns the query shape and returns a connection.
 */
export async function collectShopifyConnection(fetchPage, label) {
  const nodes = [];
  const seenCursors = new Set();
  let after = null;

  for (;;) {
    const connection = await fetchPage(after);
    if (!connection || !Array.isArray(connection.edges) || !connection.pageInfo) {
      throw new Error(`[shopify] ${label} returned an invalid connection`);
    }

    nodes.push(...connection.edges.map((edge) => edge?.node).filter(Boolean));

    if (!connection.pageInfo.hasNextPage) break;
    const nextCursor = connection.pageInfo.endCursor;
    if (!nextCursor || seenCursors.has(nextCursor)) {
      throw new Error(`[shopify] ${label} pagination did not advance`);
    }
    seenCursors.add(nextCursor);
    after = nextCursor;
  }

  if (nodes.length === 0) {
    throw new Error(`[shopify] Shopify returned no ${label}; refusing an incomplete build`);
  }
  return nodes;
}
