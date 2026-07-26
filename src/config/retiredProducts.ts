export const RETIRED_PRODUCT_HANDLES = new Set([
  "walnut-scrub-hair-scalp-pre-wash-treatment",
]);

export const isRetiredProductHandle = (handle: string): boolean =>
  RETIRED_PRODUCT_HANDLES.has(handle);

export const excludeRetiredProductEdges = <T extends { node?: { handle?: string } }>(
  edges: T[],
): T[] => edges.filter((edge) => !edge.node?.handle || !isRetiredProductHandle(edge.node.handle));
