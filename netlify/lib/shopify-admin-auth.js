// Server-only Shopify authentication. Dev Dashboard credentials exchange for
// short-lived tokens, so a copied token must never become a permanent setting.
const REQUEST_TIMEOUT_MS = 8_000;
const REFRESH_BUFFER_MS = 60_000;
let cached;
let pending;

export async function getShopifyAdminAuth({ forceRefresh = false } = {}) {
  const domain = (process.env.SHOPIFY_MYSHOPIFY_DOMAIN || "").trim().toLowerCase();
  const clientId = (process.env.SHOPIFY_NEWSLETTER_CLIENT_ID || "").trim();
  const clientSecret = (process.env.SHOPIFY_NEWSLETTER_CLIENT_SECRET || "").trim();
  const legacyToken = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "").trim();

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new Error("ShopifyNotConfigured");
  }
  if (!clientId || !clientSecret) {
    if (clientId || clientSecret || !legacyToken) throw new Error("ShopifyNotConfigured");
    return { domain, token: legacyToken };
  }

  // The identity includes the secret so changing credentials invalidates any
  // previous warm-function cache. Neither this value nor tokens are logged.
  const identity = JSON.stringify([domain, clientId, clientSecret]);
  if (!forceRefresh && cached?.identity === identity && Date.now() < cached.expiresAt - REFRESH_BUFFER_MS) {
    return { domain, token: cached.token };
  }
  if (pending?.identity === identity) return pending.promise;

  const promise = (async () => {
    const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      redirect: "error",
    });
    if (!response.ok) throw new Error(`ShopifyAuthHttp${response.status}`);
    const result = await response.json();
    if (
      typeof result.access_token !== "string" || !result.access_token ||
      !Number.isFinite(result.expires_in) || result.expires_in <= 60 ||
      typeof result.scope !== "string" || !result.scope.split(",").map(scope => scope.trim()).includes("write_customers")
    ) {
      throw new Error("ShopifyAuthInvalidResponse");
    }
    cached = {
      identity,
      token: result.access_token,
      expiresAt: Date.now() + result.expires_in * 1000,
    };
    return { domain, token: result.access_token };
  })();
  pending = { identity, promise };
  try {
    return await promise;
  } finally {
    if (pending?.promise === promise) pending = undefined;
  }
}
