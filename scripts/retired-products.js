export const RETIRED_PRODUCT_HANDLES = new Set([
  'walnut-scrub-hair-scalp-pre-wash-treatment',
]);

export const isRetiredProductHandle = (handle) => RETIRED_PRODUCT_HANDLES.has(handle);

export const excludeRetiredProductHandles = (handles) =>
  handles.filter((handle) => !isRetiredProductHandle(handle));
