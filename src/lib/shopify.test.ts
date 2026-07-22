import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/projectConfig", () => ({
  projectConfig: {
    shopify: {
      domain: "shop.example.test",
      storefrontToken: "public-test-token",
      apiVersion: "2025-01",
      storeUrl: "https://example.test",
    },
  },
}));

import { getCart } from "./shopify";

const cartResponse = (quantity: number) => ({
  data: {
    cart: {
      id: "gid://shopify/Cart/cache-regression",
      checkoutUrl: "https://shop.example.test/checkout",
      lines: {
        edges: [{ node: { id: "line-1", quantity } }],
      },
      cost: {
        subtotalAmount: { amount: String(quantity * 10), currencyCode: "AUD" },
        totalAmount: { amount: String(quantity * 10), currencyCode: "AUD" },
      },
    },
  },
});

describe("getCart", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("always fetches mutable cart state instead of returning a cached snapshot", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(cartResponse(1)), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(cartResponse(2)), { status: 200 }));

    const first = await getCart("gid://shopify/Cart/cache-regression");
    const second = await getCart("gid://shopify/Cart/cache-regression");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(first.lines.edges[0].node.quantity).toBe(1);
    expect(second.lines.edges[0].node.quantity).toBe(2);
  });
});
