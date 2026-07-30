import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/projectConfig", () => ({
  projectConfig: {
    double_opt_in: true,
    gdpr_region: "AU",
    ghl: { inboundWebhookUrl: "" },
  },
}));

import { hpCapture, trackConversionEvent } from "./hpCapture";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("hpCapture CRM event buffer", () => {
  it("buffers anonymous events in session storage without requiring a webhook URL", async () => {
    const values = new Map<string, string>();
    const sessionStorage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      removeItem: vi.fn((key: string) => values.delete(key)),
    };
    vi.stubGlobal("window", { sessionStorage });

    await expect(
      hpCapture.queueEvent("add_to_cart", { product_id: "product-1" }),
    ).resolves.toBe(true);

    expect(hpCapture.getQueuedEvents()).toEqual([
      expect.objectContaining({
        event_name: "add_to_cart",
        data: { product_id: "product-1" },
      }),
    ]);
  });
});

describe("hpCapture anonymous event API", () => {
  it("buffers trackEvent calls instead of sending anonymous CRM requests", async () => {
    const values = new Map<string, string>();
    const sessionStorage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      removeItem: vi.fn((key: string) => values.delete(key)),
    };
    vi.stubGlobal("window", { sessionStorage });
    vi.stubGlobal("fetch", vi.fn());

    await expect(
      hpCapture.trackEvent("add_to_cart", { product_id: "product-1" }),
    ).resolves.toBe(true);

    expect(fetch).not.toHaveBeenCalled();
    expect(hpCapture.getQueuedEvents()).toEqual([
      expect.objectContaining({
        event_name: "add_to_cart",
        data: { product_id: "product-1" },
      }),
    ]);
  });

  it("buffers product-hover helpers instead of sending anonymous CRM requests", async () => {
    const values = new Map<string, string>();
    const sessionStorage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      removeItem: vi.fn((key: string) => values.delete(key)),
    };
    vi.stubGlobal("window", { sessionStorage });
    vi.stubGlobal("fetch", vi.fn());

    await expect(
      hpCapture.trackProductHover("product-1", "Hydrating Shampoo"),
    ).resolves.toBe(true);

    expect(fetch).not.toHaveBeenCalled();
    expect(hpCapture.getQueuedEvents()).toEqual([
      expect.objectContaining({
        event_name: "product_card_hover",
        data: {
          product_id: "product-1",
          product_title: "Hydrating Shampoo",
        },
      }),
    ]);
  });

  it("buffers every anonymous helper instead of posting directly to the CRM relay", async () => {
    const values = new Map<string, string>();
    const sessionStorage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      removeItem: vi.fn((key: string) => values.delete(key)),
    };
    vi.stubGlobal("window", {
      location: { href: "https://hairpinns.com/products/test-product" },
      sessionStorage,
    });
    vi.stubGlobal("fetch", vi.fn());

    await Promise.all([
      trackConversionEvent("conversion_event", { source: "test" }),
      hpCapture.trackHeroCTA("shop_now"),
      hpCapture.trackQuickView("product-1"),
      hpCapture.trackUrgencySeen("product-1", "low_stock"),
      hpCapture.trackSocialProof("review", "product_card"),
      hpCapture.trackHeroVideoPlayed("/hero.mp4"),
      hpCapture.trackHeroCTAVisible("shop_now"),
      hpCapture.trackQuickAddClicked("product-1", "Hydrating Shampoo"),
      hpCapture.trackLocationDetected("Sydney", "NSW", "AU"),
      hpCapture.trackScrollDepth(50),
      hpCapture.trackHeroEngagement("click", "shop_now"),
    ]);

    expect(fetch).not.toHaveBeenCalled();
    expect(hpCapture.getQueuedEvents().map((event) => event.event_name)).toEqual([
      "conversion_event",
      "hero_cta_click",
      "quick_view_open",
      "urgency_indicator_seen",
      "social_proof_click",
      "hero_video_played",
      "hero_cta_visible",
      "quick_add_clicked",
      "location_detected",
      "scroll_depth_50",
      "hero_engagement",
    ]);
  });
});
