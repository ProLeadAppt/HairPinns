import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnvironment = {
  SHOPIFY_MYSHOPIFY_DOMAIN: process.env.SHOPIFY_MYSHOPIFY_DOMAIN,
  SF_STOREFRONT_TOKEN: process.env.SF_STOREFRONT_TOKEN,
};

const eventFor = (body) => ({
  httpMethod: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
  queryStringParameters: {},
});

const shopifyCart = {
  id: "gid://shopify/Cart/valid",
  checkoutUrl: "https://femtat-zu.myshopify.com/checkouts/valid",
  totalQuantity: 1,
  lines: { edges: [] },
  discountCodes: [],
  cost: {
    subtotalAmount: { amount: "39.95", currencyCode: "AUD" },
    totalAmount: { amount: "39.95", currencyCode: "AUD" },
  },
};

describe("checkout function action contract", () => {
  let handler;

  beforeAll(async () => {
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN = "femtat-zu.myshopify.com";
    process.env.SF_STOREFRONT_TOKEN = "test-token";
    ({ handler } = await import("../../netlify/functions/checkout.js?checkout-contract-test"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    if (originalEnvironment.SHOPIFY_MYSHOPIFY_DOMAIN === undefined) delete process.env.SHOPIFY_MYSHOPIFY_DOMAIN;
    else process.env.SHOPIFY_MYSHOPIFY_DOMAIN = originalEnvironment.SHOPIFY_MYSHOPIFY_DOMAIN;
    if (originalEnvironment.SF_STOREFRONT_TOKEN === undefined) delete process.env.SF_STOREFRONT_TOKEN;
    else process.env.SF_STOREFRONT_TOKEN = originalEnvironment.SF_STOREFRONT_TOKEN;
  });

  it("returns a complete snapshot for get", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { cart: shopifyCart } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const response = await handler(eventFor({ action: "get", cartId: shopifyCart.id }), {});
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      cart: shopifyCart,
      cartId: shopifyCart.id,
      checkoutUrl: shopifyCart.checkoutUrl,
    });
  });

  it("marks a missing cart as stale so the client can recover", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { cart: null } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const response = await handler(eventFor({ action: "get", cartId: "gid://shopify/Cart/expired" }), {});
    expect(response.statusCode).toBe(410);
    expect(JSON.parse(response.body)).toMatchObject({ code: "STALE_CART" });
  });

  it("recovers a legacy add from an expired cart without losing the requested line", async () => {
    const replacementCart = { ...shopifyCart, id: "gid://shopify/Cart/replacement" };
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({
          data: {
            cartLinesAdd: {
              cart: null,
              userErrors: [{ message: "Cart does not exist", code: "CART_DOES_NOT_EXIST" }],
            },
          },
        }), { status: 200, headers: { "Content-Type": "application/json" } }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({
          data: { cartCreate: { cart: replacementCart, userErrors: [] } },
        }), { status: 200, headers: { "Content-Type": "application/json" } }),
      );

    const line = { merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 };
    const response = await handler(eventFor({
      action: "add",
      cartId: "gid://shopify/Cart/expired",
      lines: [line],
    }), {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).cart.id).toBe(replacementCart.id);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchSpy.mock.calls[1][1].body).variables.input.lines).toEqual([line]);
  });

  it("updates a cart line quantity and returns Shopify's complete cart snapshot", async () => {
    const updatedCart = { ...shopifyCart, totalQuantity: 3 };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({
        data: { cartLinesUpdate: { cart: updatedCart, userErrors: [] } },
      }), { status: 200, headers: { "Content-Type": "application/json" } }),
    );

    const response = await handler(eventFor({
      action: "update",
      cartId: shopifyCart.id,
      lines: [{ id: "gid://shopify/CartLine/1", quantity: 3 }],
    }), {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      cart: updatedCart,
      cartId: updatedCart.id,
      checkoutUrl: updatedCart.checkoutUrl,
    });
    const request = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(request.query).toContain("cartLinesUpdate");
    expect(request.variables.lines).toEqual([{ id: "gid://shopify/CartLine/1", quantity: 3 }]);
  });

  it("rejects an invalid updated quantity before contacting Shopify", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const response = await handler(eventFor({
      action: "update",
      cartId: shopifyCart.id,
      lines: [{ id: "gid://shopify/CartLine/1", quantity: 0 }],
    }), {});

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ code: "INVALID_UPDATE_LINES" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects an unknown action", async () => {
    const response = await handler(eventFor({ action: "replace" }), {});
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ code: "INVALID_ACTION" });
  });

  it('saves campaign labels on a new cart and decorates checkout without recipient data', async () => {
    const attributes = [{ key: 'hp_utm_source', value: 'shopify_email' }, { key: 'hp_utm_campaign', value: 'tips' }];
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({
      data: { cartCreate: { cart: { ...shopifyCart, attributes }, userErrors: [] } },
    })));
    const response = await handler(eventFor({ action: 'add', lines: [{ merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 1 }],
      campaign: { utm_source: 'shopify_email', utm_campaign: 'tips', email: 'private@example.test', token: 'secret' },
    }));
    expect(response.statusCode).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body).variables.input.attributes).toEqual(attributes);
    const url = new URL(JSON.parse(response.body).checkoutUrl);
    expect(url.searchParams.get('utm_campaign')).toBe('tips');
    expect(url.searchParams.has('email')).toBe(false);
  });

  it('updates campaign on existing checkout while preserving unrelated cart attributes', async () => {
    const cart = { ...shopifyCart, attributes: [{ key: 'gift_note', value: 'Keep' }, { key: 'hp_utm_content', value: 'old' }] };
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { cart } })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { cartAttributesUpdate: { cart, userErrors: [] } } })));
    const response = await handler(eventFor({ action: 'checkout', cartId: cart.id, campaign: { utm_source: 'email' } }));
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(fetchSpy.mock.calls[1][1].body).variables.attributes).toEqual([
      { key: 'gift_note', value: 'Keep' }, { key: 'hp_utm_source', value: 'email' },
    ]);
  });

  it('still returns usable checkout if saving attribution fails', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { cart: shopifyCart } })))
      .mockRejectedValueOnce(new Error('attribution unavailable'));
    const response = await handler(eventFor({ action: 'checkout', cartId: shopifyCart.id, campaign: { utm_source: 'email' } }));
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).checkoutUrl).toContain('utm_source=email');
  });

  it('preserves campaign on the Buy Now form redirect', async () => {
    const attributes = [{ key: 'hp_utm_source', value: 'email' }];
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({
      data: { cartCreate: { cart: { ...shopifyCart, attributes }, userErrors: [] } },
    })));
    const response = await handler({ httpMethod: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      queryStringParameters: { redirect: 'true' }, body: new URLSearchParams({
        lines: JSON.stringify([{ merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 1 }]),
        campaign: JSON.stringify({ utm_source: 'email' }),
      }).toString(),
    });
    expect(response.statusCode).toBe(303);
    expect(response.headers.Location).toContain('utm_source=email');
  });
});
