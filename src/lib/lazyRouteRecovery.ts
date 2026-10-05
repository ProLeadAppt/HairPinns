// Only mark known transport failures from an actual route import. Render errors
// (including ones with similar wording) must never trigger automatic navigation.
const ROUTE_ASSET_FAILURE = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS for/i;
const RELOAD_KEY_PREFIX = "hp:lazy-route-reloaded:v1:";

class RouteAssetLoadError extends Error {
  readonly cause: Error;

  constructor(cause: Error) {
    super(cause.message);
    this.name = "RouteAssetLoadError";
    this.cause = cause;
  }
}

export async function loadLazyRoute<T>(importer: () => Promise<T>): Promise<T> {
  try {
    return await importer();
  } catch (error) {
    if (error instanceof Error && ROUTE_ASSET_FAILURE.test(error.message)) {
      throw new RouteAssetLoadError(error);
    }
    throw error;
  }
}

/**
 * Called by the mounted route boundary, not by the importer: an import may finish
 * after the user has already navigated away. React.lazy caches rejected imports,
 * so resetting the boundary alone cannot retry them; a new document is needed.
 */
export function recoverLazyRoute(error: unknown): boolean {
  if (!(error instanceof RouteAssetLoadError) || typeof window === "undefined") return false;

  try {
    // One automatic reload per path per tab, retained even after a success.
    // Query/hash changes do not grant more attempts. Never clear this on mount:
    // the HTML or asset may still be stale after a reload.
    const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
    const key = `${RELOAD_KEY_PREFIX}${pathname}`;
    const storage = window.sessionStorage;
    if (storage.getItem(key) === "1") return false;
    storage.setItem(key, "1");
    if (storage.getItem(key) !== "1") return false;

    // Reload in place, preserving the product, variant, campaign query and hash.
    window.location.reload();
    return true;
  } catch {
    // Without a persisted guard, fail closed to the manual reload affordance.
    // An in-memory guard would be lost on reload and could create a reload loop.
    return false;
  }
}
