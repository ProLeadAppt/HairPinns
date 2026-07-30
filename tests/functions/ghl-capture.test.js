import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import handler, { config } from "../../netlify/functions/ghl-capture.js";

const validPayload = {
  contact: {
    first_name: "Jena",
    last_name: "Example",
    email: "jena@example.com",
    phone: "",
  },
  context: {
    form_name: "newsletter_footer",
    event_name: "newsletter_subscription",
    timestamp: "2026-07-30T00:00:00.000Z",
  },
  consent: { marketing: true },
  engagement: {
    events: [
      {
        event_name: "view_item",
        data: { product_id: "gid://shopify/Product/1" },
        timestamp: "2026-07-30T00:00:00.000Z",
      },
    ],
  },
};

const requestFor = (payload = validPayload, options = {}) =>
  new Request("https://hairpinns.com/api/ghl-capture", {
    method: options.method || "POST",
    headers: {
      origin: options.origin || "https://hairpinns.com",
      "content-type": "application/json",
    },
    body: options.method === "OPTIONS" ? undefined : JSON.stringify(payload),
  });

describe("GHL capture relay", () => {
  beforeEach(() => {
    process.env.GHL_INBOUND_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/example";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );
  });

  afterEach(() => {
    delete process.env.GHL_INBOUND_WEBHOOK_URL;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses a same-origin route with native per-IP rate limiting", () => {
    expect(config).toEqual(
      expect.objectContaining({
        path: "/api/ghl-capture",
        rateLimit: expect.objectContaining({
          action: "rate_limit",
          aggregateBy: ["ip"],
          windowLimit: 10,
          windowSize: 60,
        }),
      }),
    );
  });

  it("forwards a validated known-contact payload to the private webhook", async () => {
    const response = await handler(requestFor());

    expect(response.status).toBe(202);
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      process.env.GHL_INBOUND_WEBHOOK_URL,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(validPayload),
      }),
    );
    expect(await response.text()).not.toContain("leadconnectorhq.com");
  });

  it("forwards service enquiries without converting declined marketing consent", async () => {
    const payload = {
      ...validPayload,
      context: {
        ...validPayload.context,
        form_name: "contact_page",
        event_name: "contact_form_submit",
      },
      consent: { marketing: false },
    };

    const response = await handler(requestFor(payload));

    expect(response.status).toBe(202);
    expect(fetch).toHaveBeenCalledWith(
      process.env.GHL_INBOUND_WEBHOOK_URL,
      expect.objectContaining({ body: JSON.stringify(payload) }),
    );
  });

  it("rejects anonymous payloads without contacting HighLevel", async () => {
    const response = await handler(
      requestFor({ ...validPayload, contact: { email: "", phone: "" } }),
    );

    expect(response.status).toBe(422);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects requests from unapproved origins", async () => {
    const response = await handler(
      requestFor(validPayload, { origin: "https://attacker.example" }),
    );

    expect(response.status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects the legacy direct function route", async () => {
    const request = new Request(
      "https://hairpinns.com/.netlify/functions/ghl-capture",
      {
        method: "POST",
        headers: {
          origin: "https://hairpinns.com",
          "content-type": "application/json",
        },
        body: JSON.stringify(validPayload),
      },
    );

    const response = await handler(request);

    expect(response.status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects unsupported methods and malformed JSON", async () => {
    const getResponse = await handler(
      new Request("https://hairpinns.com/api/ghl-capture", {
        method: "GET",
        headers: { origin: "https://hairpinns.com" },
      }),
    );
    const malformedResponse = await handler(
      new Request("https://hairpinns.com/api/ghl-capture", {
        method: "POST",
        headers: {
          origin: "https://hairpinns.com",
          "content-type": "application/json",
        },
        body: "{",
      }),
    );

    expect(getResponse.status).toBe(405);
    expect(malformedResponse.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects payloads larger than 64 KiB", async () => {
    const response = await handler(
      requestFor({ ...validPayload, message: "x".repeat(65 * 1024) }),
    );

    expect(response.status).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("quietly consumes honeypot submissions", async () => {
    const response = await handler(
      requestFor({ ...validPayload, website: "bot.example" }),
    );

    expect(response.status).toBe(202);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed when the private destination host is invalid", async () => {
    process.env.GHL_INBOUND_WEBHOOK_URL = "https://attacker.example/hook";

    const response = await handler(requestFor());

    expect(response.status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed when the private destination is unavailable", async () => {
    delete process.env.GHL_INBOUND_WEBHOOK_URL;

    const response = await handler(requestFor());

    expect(response.status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
});
