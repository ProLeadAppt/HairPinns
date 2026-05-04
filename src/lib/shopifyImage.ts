/**
 * Shopify CDN image URL helpers.
 *
 * Shopify's image CDN serves resized variants when you append `width=N`
 * (and optionally `height=N` and `format=webp`) to the URL. Using these
 * lets the browser fetch only the bytes it needs instead of a 2000px
 * master image for a 400px display.
 *
 * Pattern: append `&width=N` if there are existing query params, otherwise
 * `?width=N`. Preserve any existing `v=` cache-buster.
 */

const isShopifyUrl = (url: string): boolean =>
  url.includes("cdn.shopify.com") || url.includes("/cdn/shop/");

const appendParam = (url: string, key: string, value: string | number): string => {
  if (!isShopifyUrl(url)) return url;
  if (url.includes(`${key}=`)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${key}=${value}`;
};

/** Append `width=N` to a Shopify CDN URL. No-op for non-Shopify URLs. */
export const shopifyImage = (url: string, width: number): string =>
  appendParam(url, "width", width);

/** Append `width=N&format=webp` for browsers that support it. Shopify CDN
 *  delivers WebP automatically with this hint. */
export const shopifyImageWebp = (url: string, width: number): string =>
  appendParam(appendParam(url, "width", width), "format", "webp");
