import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/projectConfig", () => ({
  projectConfig: {
    shopify: {
      domain: "shop.example.test",
      storefrontToken: "public-test-token",
      apiVersion: "2026-07",
      storeUrl: "https://example.test",
    },
  },
}));

import { cartDiscountCodesUpdate, getCart, getCollectionByHandle, getProductByHandle } from "./shopify";

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

describe("cartDiscountCodesUpdate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the exact code list and returns Shopify applicability, warnings and discounted total", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            cartDiscountCodesUpdate: {
              cart: {
                id: "gid://shopify/Cart/promo",
                checkoutUrl: "https://shop.example.test/checkout",
                cost: { totalAmount: { amount: "71.90", currencyCode: "AUD" } },
                discountCodes: [{ code: "HP-FREE-EXTRA-2026-08", applicable: true }],
              },
              userErrors: [],
              warnings: [],
            },
          },
        }),
        { status: 200 },
      ),
    );

    const result = await cartDiscountCodesUpdate("gid://shopify/Cart/promo", ["HP-FREE-EXTRA-2026-08"]);
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body));

    expect(body.variables).toEqual({
      cartId: "gid://shopify/Cart/promo",
      discountCodes: ["HP-FREE-EXTRA-2026-08"],
    });
    expect(body.query).toContain("cartDiscountCodesUpdate");
    expect(body.query).toContain("totalAmount");
    expect(result.cart.discountCodes[0]).toEqual({ code: "HP-FREE-EXTRA-2026-08", applicable: true });
    expect(result.cart.cost.totalAmount).toEqual({ amount: "71.90", currencyCode: "AUD" });
    expect(result.warnings).toEqual([]);
  });

  it("fails closed when Shopify returns a mutation error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            cartDiscountCodesUpdate: {
              cart: null,
              userErrors: [{ field: ["discountCodes"], message: "Discount unavailable" }],
              warnings: [],
            },
          },
        }),
        { status: 200 },
      ),
    );

    await expect(
      cartDiscountCodesUpdate("gid://shopify/Cart/promo", ["HP-FREE-EXTRA-2026-08"]),
    ).rejects.toThrow("Discount unavailable");
  });
});

describe("getProductByHandle", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("requests enough images and variants for Jena's published bow styles", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { product: { id: "bow-product" } } }), { status: 200 }),
    );
    await getProductByHandle("hair-bows-choose-your-fave-size-style");
    const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(body.query).toContain("images(first: 100)");
    expect(body.query).toContain("variants(first: 100)");
  });
});

describe("getCollectionByHandle", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("requests enough variant information to make collection-card purchases safe", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { collection: { products: { edges: [] } } } }), { status: 200 }),
    );

    await getCollectionByHandle("variant-safety-query-test");

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body));
    expect(body.query).toContain("variants(first: 100)");
    expect(body.query).toMatch(/variants\(first: 100\)[\s\S]*title/);
    expect(body.query).toMatch(/variants\(first: 100\)[\s\S]*price\s*\{/);
    expect(body.query).toMatch(/variants\(first: 100\)[\s\S]*compareAtPrice\s*\{/);
    expect(body.query).toMatch(/variants\(first: 100\)[\s\S]*pageInfo\s*\{\s*hasNextPage/);
    expect(body.query).toMatch(/priceRange[\s\S]*maxVariantPrice/);
    expect(body.query).toContain("productType");
    expect(body.query).toContain("tags");
    expect(body.query).toContain("after: $cursor");
  });

  it("loads every collection page without losing Shopify's product order", async () => {
    const response = (edges: { node: { id: string } }[], hasNextPage: boolean, endCursor: string | null) =>
      new Response(JSON.stringify({ data: { collection: { products: { edges, pageInfo: { hasNextPage, endCursor } } } } }), { status: 200 });
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response([{ node: { id: "first" } }], true, "cursor-one"))
      .mockResolvedValueOnce(response([{ node: { id: "first" } }, { node: { id: "second" } }], false, "cursor-two"));

    const collection = await getCollectionByHandle("many-kids-gifts");
    expect(collection.products.edges.map(({ node }: { node: { id: string } }) => node.id)).toEqual(["first", "second"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const secondQuery = JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body));
    expect(secondQuery.variables.cursor).toBe("cursor-one");
  });

  it("refreshes collection availability on repeat visits in the same browser session", async () => {
    const response = (availableForSale: boolean) => new Response(JSON.stringify({
      data: { collection: { products: { edges: [{ node: { id: "gid://shopify/Product/stock-test", availableForSale } }] } } },
    }), { status: 200 });
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response(true))
      .mockResolvedValueOnce(response(false));

    const first = await getCollectionByHandle("gift-stock-refresh-test");
    const second = await getCollectionByHandle("gift-stock-refresh-test");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(first.products.edges[0].node.availableForSale).toBe(true);
    expect(second.products.edges[0].node.availableForSale).toBe(false);
  });
});
