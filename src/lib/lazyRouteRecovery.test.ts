import { afterEach, describe, expect, it, vi } from "vitest";
import { loadLazyRoute, recoverLazyRoute } from "./lazyRouteRecovery";

function browser(pathname = "/products/shampoo", entries = new Map<string, string>()) {
  const location = {
    pathname,
    href: `https://hairpinns.com${pathname}?variant=123&utm_source=email#details`,
    reload: vi.fn(),
  };
  const sessionStorage = {
    getItem: vi.fn((key: string) => entries.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { entries.set(key, value); }),
  };
  vi.stubGlobal("window", { location, sessionStorage });
  return { location, sessionStorage, entries };
}

async function failedImport(message = "Failed to fetch dynamically imported module: /assets/ProductDetail-old.js") {
  try {
    await loadLazyRoute(() => Promise.reject(new TypeError(message)));
  } catch (error) {
    return error;
  }
  throw new Error("Expected importer to reject");
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("bounded lazy route recovery", () => {
  it("returns a successful import without touching browser storage", async () => {
    const { sessionStorage } = browser();
    const module = { default: () => null };
    expect(await loadLazyRoute(() => Promise.resolve(module))).toBe(module);
    expect(sessionStorage.getItem).not.toHaveBeenCalled();
  });

  it.each([
    "Failed to fetch dynamically imported module: /assets/ProductDetail-old.js",
    "error loading dynamically imported module: /assets/ProductDetail-old.js",
    "Importing a module script failed.",
    "Unable to preload CSS for /assets/ProductDetail-old.css",
  ])("recovers a recognized import failure once: %s", async (message) => {
    const { location } = browser();
    const href = location.href;
    expect(recoverLazyRoute(await failedImport(message))).toBe(true);
    expect(location.reload).toHaveBeenCalledTimes(1);
    expect(location.href).toBe(href);
  });

  it("persists the guard before reload and blocks repeated failures across page loads", async () => {
    const first = browser();
    first.location.reload.mockImplementation(() => {
      expect([...first.entries.values()]).toEqual(["1"]);
    });
    expect(recoverLazyRoute(await failedImport())).toBe(true);
    expect(recoverLazyRoute(await failedImport())).toBe(false);
    expect(first.location.reload).toHaveBeenCalledTimes(1);

    const nextPage = browser("/products/shampoo", first.entries);
    expect(recoverLazyRoute(await failedImport())).toBe(false);
    expect(nextPage.location.reload).not.toHaveBeenCalled();
  });

  it("lets a different product recover from the same cached rejection", async () => {
    const { location } = browser();
    const error = await failedImport();
    expect(recoverLazyRoute(error)).toBe(true);
    location.pathname = "/products/conditioner";
    expect(recoverLazyRoute(error)).toBe(true);
    location.pathname = "/products/shampoo";
    expect(recoverLazyRoute(error)).toBe(false);
    expect(location.reload).toHaveBeenCalledTimes(2);
  });

  it("does not reset the guard for query, fragment, or trailing slash changes", async () => {
    const { location } = browser();
    const error = await failedImport();
    expect(recoverLazyRoute(error)).toBe(true);
    location.href = "https://hairpinns.com/products/shampoo/?variant=456#reviews";
    location.pathname = "/products/shampoo/";
    expect(recoverLazyRoute(error)).toBe(false);
    expect(location.reload).toHaveBeenCalledTimes(1);
  });

  it("does not reload for ordinary render exceptions, even with import-like wording", () => {
    const { location, sessionStorage } = browser();
    expect(recoverLazyRoute(new TypeError("Cannot read properties of undefined"))).toBe(false);
    expect(recoverLazyRoute(new TypeError("Failed to fetch dynamically imported module: render bug"))).toBe(false);
    expect(location.reload).not.toHaveBeenCalled();
    expect(sessionStorage.getItem).not.toHaveBeenCalled();
  });

  it.each([new Error("Failed to fetch"), new SyntaxError("Unexpected token"), "offline", null])(
    "leaves unrecognized importer errors unchanged: %s", async (error) => {
      const { location } = browser();
      await expect(loadLazyRoute(() => Promise.reject(error))).rejects.toBe(error);
      expect(recoverLazyRoute(error)).toBe(false);
      expect(location.reload).not.toHaveBeenCalled();
    },
  );

  it("does not reload merely because a route import rejects before a boundary mounts", async () => {
    const { location } = browser();
    await failedImport();
    expect(location.reload).not.toHaveBeenCalled();
  });

  it.each(["getItem", "setItem"] as const)("does not auto-reload when sessionStorage.%s is denied", async (method) => {
    const { location, sessionStorage } = browser();
    sessionStorage[method].mockImplementation(() => { throw new Error("Storage denied"); });
    const error = await failedImport();
    expect(recoverLazyRoute(error)).toBe(false);
    expect(recoverLazyRoute(error)).toBe(false);
    expect(location.reload).not.toHaveBeenCalled();
  });

  it("does not auto-reload when accessing sessionStorage itself is denied", async () => {
    const { location } = browser();
    Object.defineProperty(window, "sessionStorage", { get() { throw new Error("SecurityError"); } });
    expect(recoverLazyRoute(await failedImport())).toBe(false);
    expect(location.reload).not.toHaveBeenCalled();
  });

  it("does not auto-reload if a storage write silently fails", async () => {
    const { location, sessionStorage } = browser();
    sessionStorage.setItem.mockImplementation(() => {});
    expect(recoverLazyRoute(await failedImport())).toBe(false);
    expect(location.reload).not.toHaveBeenCalled();
  });

  it("keeps the guard if reload throws and leaves fallback recovery possible", async () => {
    const { location } = browser();
    location.reload.mockImplementation(() => { throw new Error("Reload unavailable"); });
    const error = await failedImport();
    expect(recoverLazyRoute(error)).toBe(false);
    expect(recoverLazyRoute(error)).toBe(false);
    expect(location.reload).toHaveBeenCalledTimes(1);
  });

  it("is safe without a browser", async () => {
    vi.stubGlobal("window", undefined);
    expect(recoverLazyRoute(await failedImport())).toBe(false);
  });
});
