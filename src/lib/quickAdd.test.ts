import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCartId: vi.fn(),
  saveCartId: vi.fn(),
  trackAddToCart: vi.fn(),
  trackCartCreated: vi.fn(),
  getHpCapture: vi.fn(),
  trackQuickAddClicked: vi.fn(),
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

vi.mock("./cartManagement", () => ({
  getCartId: mocks.getCartId,
  saveCartId: mocks.saveCartId,
}));
vi.mock("./ecommerceTracking", () => ({
  trackAddToCart: mocks.trackAddToCart,
}));
vi.mock("./cartAbandonment", () => ({
  trackCartCreated: mocks.trackCartCreated,
}));
vi.mock("./loadHpCapture", () => ({
  getHpCapture: mocks.getHpCapture,
}));
vi.mock("@/hooks/use-toast", () => ({
  notify: {
    success: mocks.notifySuccess,
    error: mocks.notifyError,
  },
}));

import { quickAddToCart, type QuickAddProduct } from "./quickAdd";

const product: QuickAddProduct = {
  variantId: "gid://shopify/ProductVariant/101",
  productId: "gid://shopify/Product/100",
  productTitle: "Mini Travel Hair Brush",
  price: 24.95,
  currency: "AUD",
  quantity: 1,
};

describe("quickAddToCart analytics boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCartId.mockReturnValue(null);
    mocks.getHpCapture.mockResolvedValue({
      trackQuickAddClicked: mocks.trackQuickAddClicked,
    });
    mocks.trackQuickAddClicked.mockResolvedValue(true);
    mocks.trackAddToCart.mockResolvedValue(undefined);
    mocks.trackCartCreated.mockResolvedValue(undefined);
  });

  it("emits add_to_cart once after Shopify confirms the cart mutation", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          cartId: "gid://shopify/Cart/200",
          checkoutUrl: "https://shop.example.test/checkouts/200",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(quickAddToCart(product, false)).resolves.toEqual({
      cartId: "gid://shopify/Cart/200",
      checkoutUrl: "https://shop.example.test/checkouts/200",
    });

    expect(mocks.trackAddToCart).toHaveBeenCalledOnce();
    expect(mocks.trackAddToCart).toHaveBeenCalledWith({
      product_id: product.productId,
      title: product.productTitle,
      variant_id: product.variantId,
      price: product.price,
      currency: product.currency,
      quantity: product.quantity,
    });
  });

  it("does not emit add_to_cart when Shopify rejects the cart mutation", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "unavailable" }), { status: 503 }),
    );

    await expect(quickAddToCart(product, false)).resolves.toBeNull();

    expect(mocks.trackAddToCart).not.toHaveBeenCalled();
    expect(mocks.notifyError).toHaveBeenCalledOnce();
  });
});
