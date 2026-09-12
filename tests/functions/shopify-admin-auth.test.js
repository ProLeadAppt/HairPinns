import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let getShopifyAdminAuth;
const tokenResponse = (overrides = {}) => new Response(JSON.stringify({
  access_token: "test-ephemeral-token",
  expires_in: 86399,
  scope: "read_customers,write_customers",
  ...overrides,
}), { status: 200 });

describe("server-only Shopify subscriber authentication", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv("SHOPIFY_MYSHOPIFY_DOMAIN", "femtat-zu.myshopify.com");
    vi.stubEnv("SHOPIFY_NEWSLETTER_CLIENT_ID", "test-client-id");
    vi.stubEnv("SHOPIFY_NEWSLETTER_CLIENT_SECRET", "test-client-secret");
    vi.stubEnv("SHOPIFY_ADMIN_ACCESS_TOKEN", "");
    ({ getShopifyAdminAuth } = await import("../../netlify/lib/shopify-admin-auth.js"));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("exchanges private app credentials and reuses its unexpired token", async () => {
    const request = vi.fn().mockResolvedValue(tokenResponse());
    vi.stubGlobal("fetch", request);
    expect(await getShopifyAdminAuth()).toEqual({ domain: "femtat-zu.myshopify.com", token: "test-ephemeral-token" });
    await getShopifyAdminAuth();
    expect(request).toHaveBeenCalledTimes(1);
    const [url, options] = request.mock.calls[0];
    expect(url).toBe("https://femtat-zu.myshopify.com/admin/oauth/access_token");
    expect(options.body.get("grant_type")).toBe("client_credentials");
    expect(options.body.get("client_secret")).toBe("test-client-secret");
    expect(options.redirect).toBe("error");
  });

  it("renews before expiry and shares concurrent exchanges", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000);
    const request = vi.fn().mockImplementation(() => Promise.resolve(tokenResponse({ expires_in: 120 })));
    vi.stubGlobal("fetch", request);
    await Promise.all([getShopifyAdminAuth(), getShopifyAdminAuth()]);
    expect(request).toHaveBeenCalledTimes(1);
    now.mockReturnValue(62_000);
    await getShopifyAdminAuth();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("invalidates cached credentials when the configured identity changes", async () => {
    const request = vi.fn().mockImplementation(() => Promise.resolve(tokenResponse()));
    vi.stubGlobal("fetch", request);
    await getShopifyAdminAuth();
    vi.stubEnv("SHOPIFY_NEWSLETTER_CLIENT_SECRET", "replacement-test-secret");
    await getShopifyAdminAuth();
    await getShopifyAdminAuth({ forceRefresh: true });
    expect(request).toHaveBeenCalledTimes(3);
  });

  it("does not cache failures or expose Shopify error bodies", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response("sensitive upstream details", { status: 403 }))
      .mockResolvedValueOnce(tokenResponse()));
    await expect(getShopifyAdminAuth()).rejects.toThrow("ShopifyAuthHttp403");
    await expect(getShopifyAdminAuth()).resolves.toMatchObject({ token: "test-ephemeral-token" });
  });

  it.each([
    { scope: "read_customers" },
    { access_token: "" },
    { expires_in: 0 },
  ])("rejects unusable token responses: %j", async (response) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(tokenResponse(response)));
    await expect(getShopifyAdminAuth()).rejects.toThrow("ShopifyAuthInvalidResponse");
  });

  it("fails closed for an invalid domain or partial credentials", async () => {
    const request = vi.fn();
    vi.stubGlobal("fetch", request);
    vi.stubEnv("SHOPIFY_MYSHOPIFY_DOMAIN", "femtat-zu.myshopify.com.attacker.example");
    await expect(getShopifyAdminAuth()).rejects.toThrow("ShopifyNotConfigured");
    vi.stubEnv("SHOPIFY_MYSHOPIFY_DOMAIN", "femtat-zu.myshopify.com");
    vi.stubEnv("SHOPIFY_NEWSLETTER_CLIENT_SECRET", "");
    await expect(getShopifyAdminAuth()).rejects.toThrow("ShopifyNotConfigured");
    expect(request).not.toHaveBeenCalled();
  });

  it("preserves existing legacy installations without requesting a new token", async () => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubEnv("SHOPIFY_NEWSLETTER_CLIENT_ID", "");
    vi.stubEnv("SHOPIFY_NEWSLETTER_CLIENT_SECRET", "");
    vi.stubEnv("SHOPIFY_ADMIN_ACCESS_TOKEN", "legacy-test-token");
    await expect(getShopifyAdminAuth()).resolves.toMatchObject({ token: "legacy-test-token" });
    expect(fetch).not.toHaveBeenCalled();
  });
});
