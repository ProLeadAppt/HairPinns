export const RETIRED_PRODUCT_HANDLES = new Set<string>([]);

export const isRetiredProductHandle = (handle: string): boolean =>
  RETIRED_PRODUCT_HANDLES.has(handle);

export const excludeRetiredProductEdges = <T extends { node?: { handle?: string } }>(
  edges: T[],
): T[] => edges.filter((edge) => !edge.node?.handle || !isRetiredProductHandle(edge.node.handle));
