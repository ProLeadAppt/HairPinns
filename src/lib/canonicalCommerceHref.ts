/**
 * Use the final first-party commerce URL at render time. The audit identified
 * 301s from unslashed /products and /collections routes to their slash forms.
 * Leave external, relative non-commerce, file and checkout links unchanged.
 */
export function canonicalCommerceHref(href: string): string {
  const match = href.match(/^(https:\/\/hairpinns\.com)?(\/(?:products|collections)(?:\/[a-z0-9-]+)?)([?#].*)?$/);
  return match ? (match[1] || '') + match[2] + '/' + (match[3] || '') : href;
}
