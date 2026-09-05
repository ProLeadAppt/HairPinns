import { beforeEach, describe, expect, it, vi } from "vitest";

const cartManagement = vi.hoisted(() => ({
  clearCartId: vi.fn(),
  getCartId: vi.fn(),
  saveCartId: vi.fn(),
}));

vi.mock("./cartManagement", () => cartManagement);

import { addCartLines, getCartSnapshot, removeCartLines } from "./cartApi";

const cart = {
  id: "gid://shopify/Cart/new",
  checkoutUrl: "https://shop.example.test/checkouts/new",
  totalQuantity: 1,
  lines: { edges: [] },
  cost: {
    subtotalAmount: { amount: "39.95", currencyCode: "AUD" },
    totalAmount: { amount: "39.95", currencyCode: "AUD" },
  },
  discountCodes: [],
};

describe("cart API boundary", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    cartManagement.getCartId.mockReturnValue("gid://shopify/Cart/expired");
  });

  it("gets the authoritative cart snapshot through the checkout endpoint", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ cart }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(getCartSnapshot("gid://shopify/Cart/new")).resolves.toEqual(cart);
    expect(JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body))).toEqual({
      action: "get",
      cartId: "gid://shopify/Cart/new",
    });
  });

  it("recovers one time from an expired persisted cart while adding", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: "STALE_CART", error: "Cart expired" }), {
          status: 410,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ cart }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    await expect(
      addCartLines([{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 }]),
    ).resolves.toEqual(cart);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body))).toMatchObject({
      action: "add",
      cartId: "gid://shopify/Cart/expired",
    });
    expect(JSON.parse(String(fetchSpy.mock.calls[1]?.[1]?.body))).toEqual({
      action: "add",
      lines: [{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 }],
    });
    expect(cartManagement.clearCartId).toHaveBeenCalledOnce();
    expect(cartManagement.saveCartId).toHaveBeenCalledWith(cart.id);
  });

  it("does not retry a non-stale add failure", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Unavailable" }), { status: 422 }),
    );

    await expect(
      addCartLines([{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 }]),
    ).rejects.toThrow("Unavailable");
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(cartManagement.clearCartId).not.toHaveBeenCalled();
  });

  it("removes lines using an explicit action and returns the full snapshot", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ cart }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(removeCartLines(cart.id, ["line-1"])).resolves.toEqual(cart);
    expect(JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body))).toEqual({
      action: "remove",
      cartId: cart.id,
      lineIds: ["line-1"],
    });
  });
});
