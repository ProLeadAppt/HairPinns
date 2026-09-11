const TRANSIENT_BROWSER_ERROR_RE = /Connection closed|Target\.closeTarget timed out|Browser disconnected|Session closed|Protocol error/i;
const TRANSIENT_NAVIGATION_ERROR_RE = /Navigation timeout of \d+ ms exceeded/i;
const TRANSIENT_COMMERCE_FALLBACK_RE = /published (?:product|collection) rendered noindex|published product missing Product schema/i;

export function commercePrerenderIssue(route, html) {
  const isProduct = /^\/products\/[^/]+\/?$/.test(route);
  const isCollection = /^\/collections\/[^/]+\/?$/.test(route);
  if (!isProduct && !isCollection) return null;

  const noIndex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
  if (noIndex) {
    return `published ${isProduct ? 'product' : 'collection'} rendered noindex`;
  }

  if (isProduct && !/["']@type["']\s*:\s*["']Product["']/i.test(html)) {
    return 'published product missing Product schema';
  }

  return null;
}

export function isTransientBrowserError(error) {
  return TRANSIENT_BROWSER_ERROR_RE.test(String(error?.message || error || ""));
}

export function isTransientPrerenderRouteError(error) {
  const message = String(error?.message || error || "");
  return isTransientBrowserError(message)
    || TRANSIENT_NAVIGATION_ERROR_RE.test(message)
    || TRANSIENT_COMMERCE_FALLBACK_RE.test(message);
}
