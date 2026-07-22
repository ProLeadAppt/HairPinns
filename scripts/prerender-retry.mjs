const TRANSIENT_BROWSER_ERROR_RE = /Connection closed|Target\.closeTarget timed out|Browser disconnected|Session closed|Protocol error/i;
const TRANSIENT_NAVIGATION_ERROR_RE = /Navigation timeout of \d+ ms exceeded/i;

export function isTransientBrowserError(error) {
  return TRANSIENT_BROWSER_ERROR_RE.test(String(error?.message || error || ""));
}

export function isTransientPrerenderRouteError(error) {
  const message = String(error?.message || error || "");
  return isTransientBrowserError(message) || TRANSIENT_NAVIGATION_ERROR_RE.test(message);
}
