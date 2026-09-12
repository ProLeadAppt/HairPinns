import { getShopifyAdminAuth } from "../lib/shopify-admin-auth.js";

const MAX_BODY_BYTES = 64 * 1024;
const REQUEST_TIMEOUT_MS = 8_000;
const SHOPIFY_API_VERSION = "2026-07";
const WEBSITE_SUBSCRIBER_TAG = "website-subscriber";
const ALLOWED_PRODUCTION_ORIGINS = new Set([
  "https://hairpinns.com",
  "https://www.hairpinns.com",
]);
const NETLIFY_ORIGIN = /^https:\/\/(?:deploy-preview-\d+|[a-z0-9-]+)--hairpinns\.netlify\.app$/i;
const SAFE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_NAME = /^[a-z0-9_-]{1,64}$/i;

export const config = {
  path: "/api/newsletter-subscribe",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip"],
    windowLimit: 5,
    windowSize: 60,
  },
};

const isAllowedOrigin = (origin) =>
  ALLOWED_PRODUCTION_ORIGINS.has(origin) || NETLIFY_ORIGIN.test(origin);

const jsonResponse = (status, body, origin = "") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...(isAllowedOrigin(origin)
        ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
        : {}),
    },
  });

const isValidPayload = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;

  const email = payload.contact?.email;
  const formName = payload.context?.form_name;
  const eventName = payload.context?.event_name;

  return (
    typeof email === "string" &&
    email.length <= 254 &&
    SAFE_EMAIL.test(email.trim()) &&
    typeof formName === "string" &&
    SAFE_NAME.test(formName) &&
    typeof eventName === "string" &&
    SAFE_NAME.test(eventName) &&
    payload.consent?.marketing === true
  );
};

const shopifyGraphql = async (query, variables, retryAuthentication = true) => {
  const shopify = await getShopifyAdminAuth();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://${shopify.domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopify.token,
          "User-Agent": "HairPinns-Netlify-Newsletter/1.0",
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      },
    );

    // An authentication rejection has not executed the mutation. Refresh once
    // if a cached token was revoked early; never retry other mutation failures.
    if (response.status === 401 && retryAuthentication) {
      await getShopifyAdminAuth({ forceRefresh: true });
      return shopifyGraphql(query, variables, false);
    }
    if (!response.ok) throw new Error(`ShopifyHttp${response.status}`);

    const result = await response.json();
    if (result.errors?.length) throw new Error("ShopifyGraphqlError");
    return result.data;
  } finally {
    clearTimeout(timeout);
  }
};

const upsertShopifySubscriber = async (email) => {
  const upsertData = await shopifyGraphql(
    `mutation WebsiteSubscriberUpsert($identifier: CustomerSetIdentifiers, $input: CustomerSetInput!) {
      customerSet(identifier: $identifier, input: $input) {
        customer { id }
        userErrors { field message }
      }
    }`,
    {
      identifier: { email },
      input: { email, locale: "en-AU" },
    },
  );

  const upsert = upsertData?.customerSet;
  if (!upsert?.customer?.id || upsert.userErrors?.length) {
    throw new Error("ShopifyCustomerUpsertFailed");
  }

  const customerId = upsert.customer.id;
  const consentData = await shopifyGraphql(
    `mutation WebsiteSubscriberConsent(
      $input: CustomerEmailMarketingConsentUpdateInput!
      $customerId: ID!
      $tags: [String!]!
    ) {
      customerEmailMarketingConsentUpdate(input: $input) {
        customer {
          id
          emailMarketingConsent { marketingState marketingOptInLevel }
        }
        userErrors { field message }
      }
      tagsAdd(id: $customerId, tags: $tags) {
        userErrors { message }
      }
    }`,
    {
      input: {
        customerId,
        emailMarketingConsent: {
          consentUpdatedAt: new Date().toISOString(),
          marketingOptInLevel: "SINGLE_OPT_IN",
          marketingState: "SUBSCRIBED",
        },
      },
      customerId,
      tags: [WEBSITE_SUBSCRIBER_TAG],
    },
  );

  const consent = consentData?.customerEmailMarketingConsentUpdate;
  const tagging = consentData?.tagsAdd;
  if (
    !consent?.customer?.id ||
    consent.userErrors?.length ||
    tagging?.userErrors?.length ||
    consent.customer.emailMarketingConsent?.marketingState !== "SUBSCRIBED"
  ) {
    throw new Error("ShopifyConsentUpdateFailed");
  }
};

export default async function handler(request) {
  if (new URL(request.url).pathname !== config.path) {
    return jsonResponse(404, { error: "Not found" });
  }

  const origin = request.headers.get("origin") || "";
  if (!isAllowedOrigin(origin)) {
    return jsonResponse(403, { error: "Forbidden" });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      },
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, origin);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse(415, { error: "JSON required" }, origin);
  }

  const statedLength = Number(request.headers.get("content-length") || 0);
  if (statedLength > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: "Payload too large" }, origin);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: "Payload too large" }, origin);
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" }, origin);
  }

  if (payload.context?.website || payload.website) {
    return jsonResponse(202, { accepted: true }, origin);
  }

  if (!isValidPayload(payload)) {
    return jsonResponse(422, { error: "Valid email and consent required" }, origin);
  }

  try {
    await upsertShopifySubscriber(payload.contact.email.trim().toLowerCase());
  } catch (error) {
    const code = error instanceof Error ? error.message : "UnknownError";
    console.error(`[newsletter-subscribe] Shopify subscription failed: ${code}.`);
    return jsonResponse(503, { error: "Subscription unavailable" }, origin);
  }

  return jsonResponse(202, { accepted: true }, origin);
}
