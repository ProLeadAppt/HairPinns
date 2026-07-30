import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getHpCapture: vi.fn(),
  hpTrackEvent: vi.fn(),
  trackProductView: vi.fn(),
  trackAddToCart: vi.fn(),
  trackBeginCheckout: vi.fn(),
}));

vi.mock("./loadHpCapture", () => ({
  getHpCapture: mocks.getHpCapture,
}));

vi.mock("./pixelTracking", () => ({
  pixelTracking: {
    trackProductView: mocks.trackProductView,
    trackAddToCart: mocks.trackAddToCart,
    trackBeginCheckout: mocks.trackBeginCheckout,
  },
}));

import {
  trackAddToCart,
  trackBeginCheckout,
  trackProductView,
} from "./ecommerceTracking";

const item = {
  product_id: "gid://shopify/Product/100",
  variant_id: "gid://shopify/ProductVariant/101",
  title: "Mini Travel Hair Brush",
  price: 24.95,
  currency: "AUD",
  quantity: 2,
};

describe("ecommerceTracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getHpCapture.mockResolvedValue({ trackEvent: mocks.hpTrackEvent });
    mocks.hpTrackEvent.mockResolvedValue(true);
  });

  it("sends view_item to pixels and preserves the product-view GHL event", async () => {
    await trackProductView(item);

    expect(mocks.trackProductView).toHaveBeenCalledOnce();
    expect(mocks.trackProductView).toHaveBeenCalledWith({
      id: item.variant_id,
      title: item.title,
      price: item.price,
      currency: item.currency,
    });
    expect(mocks.hpTrackEvent).toHaveBeenCalledWith(
      "micro_conversion_product_view",
      expect.objectContaining({
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_title: item.title,
        price: item.price,
        currency: item.currency,
      }),
    );
  });

  it("sends add_to_cart to pixels even when GHL delivery fails", async () => {
    mocks.hpTrackEvent.mockRejectedValueOnce(new Error("GHL unavailable"));

    await expect(trackAddToCart(item)).resolves.toBeUndefined();

    expect(mocks.trackAddToCart).toHaveBeenCalledOnce();
    expect(mocks.trackAddToCart).toHaveBeenCalledWith({
      id: item.variant_id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      currency: item.currency,
    });
  });

  it("sends begin_checkout with complete GA4 line items and the existing GHL summary", async () => {
    await trackBeginCheckout({
      cart_total: 49.9,
      item_count: 2,
      currency: "AUD",
      items: [item],
    });

    expect(mocks.trackBeginCheckout).toHaveBeenCalledOnce();
    expect(mocks.trackBeginCheckout).toHaveBeenCalledWith({
      total: 49.9,
      currency: "AUD",
      items: [
        {
          id: item.variant_id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    });
    expect(mocks.hpTrackEvent).toHaveBeenCalledWith(
      "begin_checkout",
      expect.objectContaining({
        cart_total: 49.9,
        item_count: 2,
        currency: "AUD",
      }),
    );
  });
});
