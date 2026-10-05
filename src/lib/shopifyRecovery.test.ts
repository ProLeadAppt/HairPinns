import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/projectConfig", () => ({ projectConfig: { shopify: {
  domain: "shop.example.test", storefrontToken: "public-test-token", apiVersion: "2026-07", storeUrl: "https://example.test",
} } }));

import { getProductByHandle, loadProductByHandle, fetchShopify } from "./shopify";
const product = { id: "gid://shopify/Product/1", handle: "recovery-product" };
const response = (value: unknown) => new Response(JSON.stringify({ data: { product: value } }), { status: 200 });

describe("product request recovery", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("does not retain a null product across later visits", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(response(null)).mockResolvedValueOnce(response(product));
    expect(await getProductByHandle("negative-cache-regression")).toBeNull();
    expect(await getProductByHandle("negative-cache-regression")).toEqual(product);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it.each(["network", "graphql", "http"])("recovers a transient %s failure with one fresh read", async failure => {
    const fetch = vi.spyOn(globalThis, "fetch");
    if (failure === "network") fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    else if (failure === "graphql") fetch.mockResolvedValueOnce(Response.json({ errors: [{ message: "Temporarily unavailable" }] }));
    else fetch.mockResolvedValueOnce(new Response("Unavailable", { status: 503 }));
    fetch.mockResolvedValueOnce(response(product));
    expect(await getProductByHandle(`transient-${failure}`)).toEqual(product);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("throws exhausted temporary failures rather than claiming a product is absent", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(getProductByHandle("persistent-network")).rejects.toThrow("Failed to fetch");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("rejects a malformed successful payload rather than reporting absence", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ data: {} }));
    await expect(getProductByHandle("missing-product-field")).rejects.toThrow();
  });
  it.each([false, "", 0, {}, []])("rejects a malformed product value %j", async value => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => response(value));
    await expect(getProductByHandle("invalid-product-value")).rejects.toThrow("invalid product response");
  });
  it("bounds the actual request with an abortable timeout and recovers", async () => {
    vi.useFakeTimers();
    let firstSignal: AbortSignal | undefined;
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementationOnce((_url, init) => {
      firstSignal = init?.signal as AbortSignal;
      return new Promise((_resolve, reject) => firstSignal!.addEventListener("abort", () => reject(firstSignal!.reason), { once: true }));
    }).mockResolvedValueOnce(response(product));
    const pending = getProductByHandle("timeout-recovery");
    await vi.advanceTimersByTimeAsync(8000);
    expect(firstSignal?.aborted).toBe(true);
    expect(await pending).toEqual(product);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("never retries a mutation through generic fetchShopify", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(fetchShopify("mutation { example }", {}, { cache: false })).rejects.toThrow();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("cancels on navigation without retrying or committing a late response", async () => {
    const controller = new AbortController();
    let finish: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const pending = loadProductByHandle("navigate-away", controller.signal);
    const rejected = expect(pending).rejects.toMatchObject({ name: "AbortError" });
    controller.abort();
    finish!(response(product));
    await rejected;
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("discards a successful late result after the actual timeout", async () => {
    vi.useFakeTimers();
    let finish: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, "fetch")
      .mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }))
      .mockResolvedValueOnce(response({ ...product, id: "fresh-result" }));
    const pending = loadProductByHandle("late-success");
    await vi.advanceTimersByTimeAsync(8000);
    finish!(response({ ...product, id: "stale-result" }));
    expect(await pending).toMatchObject({ id: "fresh-result" });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("does not reuse a cancelled request when revisiting the same handle", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(response(product));
    await expect(loadProductByHandle("cancel-revisit", controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(await loadProductByHandle("cancel-revisit")).toEqual(product);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
