import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import handler, { config } from "../../netlify/functions/newsletter-subscribe.js";

const validPayload = {
  contact: { email: "reader@example.com" },
  context: {
    form_name: "newsletter_footer",
    event_name: "newsletter_subscription",
  },
  consent: { marketing: true },
};

const requestFor = (payload = validPayload, options = {}) =>
  new Request("https://hairpinns.com/api/newsletter-subscribe", {
    method: options.method || "POST",
    headers: {
      origin: options.origin || "https://hairpinns.com",
      "content-type": "application/json",
    },
    body: options.method === "OPTIONS" ? undefined : JSON.stringify(payload),
  });

const shopifyResponse = (data) =>
  new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

describe("newsletter subscriber relay", () => {
  beforeEach(() => {
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN = "femtat-zu.myshopify.com";
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN = "test-admin-token";
  });

  afterEach(() => {
    delete process.env.SHOPIFY_MYSHOPIFY_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses a same-origin route with strict per-IP rate limiting", () => {
    expect(config).toEqual(
      expect.objectContaining({
        path: "/api/newsletter-subscribe",
        rateLimit: expect.objectContaining({
          aggregateBy: ["ip"],
          windowLimit: 5,
          windowSize: 60,
        }),
      }),
    );
  });

  it("upserts, subscribes and tags the Shopify customer", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        shopifyResponse({
          customerSet: { customer: { id: "gid://shopify/Customer/1" }, userErrors: [] },
        }),
      )
      .mockResolvedValueOnce(
        shopifyResponse({
          customerEmailMarketingConsentUpdate: {
            customer: {
              id: "gid://shopify/Customer/1",
              emailMarketingConsent: {
                marketingState: "SUBSCRIBED",
                marketingOptInLevel: "SINGLE_OPT_IN",
              },
            },
            userErrors: [],
          },
          tagsAdd: { userErrors: [] },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const response = await handler(requestFor());

    expect(response.status).toBe(202);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://femtat-zu.myshopify.com/admin/api/2026-07/graphql.json",
    );
    const consentRequest = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(consentRequest.variables.input.emailMarketingConsent).toEqual(
      expect.objectContaining({
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
      }),
    );
    expect(consentRequest.variables.tags).toEqual(["website-subscriber"]);
  });

  it("fails closed without a server-only Shopify Admin token", async () => {
    delete process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    vi.stubGlobal("fetch", vi.fn());

    const response = await handler(requestFor());

    expect(response.status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("preserves existing subscribers without another consent event or welcome trigger", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(shopifyResponse({
        customerSet: {
          customer: { id: "gid://shopify/Customer/1", emailMarketingConsent: { marketingState: "SUBSCRIBED" } },
          userErrors: [],
        },
      }))
      .mockResolvedValueOnce(shopifyResponse({ tagsAdd: { userErrors: [] } }));
    vi.stubGlobal("fetch", fetchMock);
    expect((await handler(requestFor())).status).toBe(202);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const tagging = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(tagging.query).toContain("WebsiteSubscriberTag");
    expect(tagging.query).not.toContain("customerEmailMarketingConsentUpdate");
    expect(tagging.variables.tags).toEqual(["website-subscriber"]);
  });

  it("rejects missing consent, invalid origins and oversized payloads", async () => {
    vi.stubGlobal("fetch", vi.fn());

    expect(
      (await handler(requestFor({ ...validPayload, consent: { marketing: false } }))).status,
    ).toBe(422);
    expect(
      (await handler(requestFor(validPayload, { origin: "https://attacker.example" }))).status,
    ).toBe(403);
    expect(
      (await handler(requestFor({ ...validPayload, padding: "x".repeat(65 * 1024) }))).status,
    ).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("quietly consumes honeypot submissions", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const response = await handler(
      requestFor({ ...validPayload, context: { ...validPayload.context, website: "bot" } }),
    );

    expect(response.status).toBe(202);
    expect(fetch).not.toHaveBeenCalled();
  });
});
