import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/projectConfig", () => ({
  projectConfig: {
    double_opt_in: true,
    gdpr_region: "AU",
    ghl: { inboundWebhookUrl: "/api/ghl-capture" },
  },
}));

import { hpCapture } from "./hpCapture";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
    clear: vi.fn(() => values.clear()),
  };
}

describe("hpCapture known-contact delivery", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    const localStorage = memoryStorage();
    const sessionStorage = memoryStorage();
    const location = {
      href: "https://hairpinns.com/products/test-product",
      pathname: "/products/test-product",
      search: "",
    };

    vi.stubGlobal("localStorage", localStorage);
    vi.stubGlobal("sessionStorage", sessionStorage);
    vi.stubGlobal("document", { referrer: "" });
    vi.stubGlobal("window", {
      __hpErrors: [],
      crypto: globalThis.crypto,
      location,
      localStorage,
      sessionStorage,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, type: "basic", status: 200 }),
    );
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("attaches buffered events to a known contact and clears them after delivery", async () => {
    await hpCapture.queueEvent("view_item", { product_id: "product-1" });
    await hpCapture.queueEvent("begin_checkout", { cart_total: 49.9 });

    await expect(
      hpCapture.postToGHL(
        {
          form_name: "newsletter_footer",
          email: "shopper@example.com",
          consent_marketing: true,
        },
        { event: "newsletter_signup", retryAttempts: 1 },
      ),
    ).resolves.toBe(true);

    const [, request] = vi.mocked(fetch).mock.calls[0];
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe("/api/ghl-capture");
    expect(request).not.toHaveProperty("mode");
    const payload = JSON.parse(String(request?.body));
    expect(payload.contact.email).toBe("shopper@example.com");
    expect(payload.engagement.events).toEqual([
      expect.objectContaining({ event_name: "view_item" }),
      expect.objectContaining({ event_name: "begin_checkout" }),
    ]);
    expect(JSON.stringify(vi.mocked(console.log).mock.calls)).not.toContain(
      "shopper@example.com",
    );
    expect(hpCapture.getQueuedEvents()).toEqual([]);
  });

  it("adds stable engagement summary fields for workflow notes", async () => {
    await hpCapture.queueEvent("view_item", { product_id: "product-1" });
    await hpCapture.queueEvent("begin_checkout", { cart_total: 49.9 });

    await hpCapture.postToGHL(
      {
        form_name: "newsletter_footer",
        email: "shopper@example.com",
        consent_marketing: true,
      },
      { event: "newsletter_signup", retryAttempts: 1 },
    );

    const [, request] = vi.mocked(fetch).mock.calls[0];
    const payload = JSON.parse(String(request?.body));
    expect(payload.engagement.event_count).toBe(2);
    expect(payload.engagement.event_names).toBe("view_item, begin_checkout");
  });

  it("retains buffered events after failure and redacts contact details from diagnostics", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      type: "basic",
      status: 500,
      text: vi.fn().mockResolvedValue("upstream failure"),
    } as Response);
    await hpCapture.queueEvent("add_to_cart", { product_id: "product-1" });

    await expect(
      hpCapture.postToGHL(
        {
          form_name: "newsletter_footer",
          first_name: "Private",
          email: "private@example.com",
          phone: "0400000000",
        },
        { event: "newsletter_signup", retryAttempts: 1 },
      ),
    ).resolves.toBe(false);

    expect(hpCapture.getQueuedEvents()).toHaveLength(1);
    const diagnostics = JSON.stringify(window.__hpErrors);
    expect(diagnostics).not.toContain("private@example.com");
    expect(diagnostics).not.toContain("0400000000");
    expect(diagnostics).not.toContain("Private");
    expect(diagnostics).toContain("[redacted]");
  });

  it("preserves events queued while a known-contact delivery is in flight", async () => {
    let resolveDelivery!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveDelivery = resolve;
      }),
    );
    await hpCapture.queueEvent("view_item", { product_id: "product-1" });

    const delivery = hpCapture.postToGHL(
      {
        form_name: "newsletter_footer",
        email: "shopper@example.com",
        consent_marketing: true,
      },
      { event: "newsletter_signup", retryAttempts: 1 },
    );

    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    await hpCapture.queueEvent("add_to_cart", { product_id: "product-2" });
    resolveDelivery(new Response(null, { status: 202 }));

    await expect(delivery).resolves.toBe(true);
    expect(hpCapture.getQueuedEvents()).toEqual([
      expect.objectContaining({
        event_name: "add_to_cart",
        data: { product_id: "product-2" },
      }),
    ]);
  });
});
