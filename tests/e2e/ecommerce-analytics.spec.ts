import { expect, test, type Page } from "@playwright/test";

const product = {
  id: "gid://shopify/Product/100",
  title: "Mini Travel Hair Brush",
  handle: "analytics-test-brush",
  description: "A compact detangling brush.",
  descriptionHtml: "<p>A compact detangling brush.</p>",
  availableForSale: true,
  vendor: "Hair Pinns",
  productType: "Hair Brush",
  tags: [],
  priceRange: {
    minVariantPrice: { amount: "24.95", currencyCode: "AUD" },
    maxVariantPrice: { amount: "24.95", currencyCode: "AUD" },
  },
  compareAtPriceRange: {
    minVariantPrice: { amount: "29.95", currencyCode: "AUD" },
  },
  images: {
    edges: [
      {
        node: {
          id: "gid://shopify/ProductImage/1",
          url: "http://127.0.0.1:4177/placeholder.svg",
          altText: "Mini Travel Hair Brush",
          width: 800,
          height: 800,
        },
      },
    ],
  },
  variants: {
    edges: [
      {
        node: {
          id: "gid://shopify/ProductVariant/101",
          title: "Default Title",
          sku: "TEST-101",
          barcode: "",
          availableForSale: true,
          price: { amount: "24.95", currencyCode: "AUD" },
          compareAtPrice: { amount: "29.95", currencyCode: "AUD" },
          selectedOptions: [],
          image: null,
        },
      },
    ],
  },
};

const ecommerceEvents = async (page: Page, eventName: string) =>
  page.evaluate((name) => {
    const entries = (window.dataLayer || []) as ArrayLike<unknown>[];
    return entries
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === "event" && entry[1] === name)
      .map((entry) => entry[2]);
  }, eventName);

const installRoutes = async (page: Page) => {
  await page.route(
    /googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/,
    (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );
  await page.route("https://ghl.example.test/**", (route) =>
    route.fulfill({ status: 204, body: "" }),
  );
  await page.route(/\/api\/[^/]+\/graphql\.json$/, async (route) => {
    const requestBody = route.request().postData() || "";
    if (requestBody.includes("query getProduct")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { product } }),
      });
      return;
    }
    if (requestBody.includes("shop {")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            shop: {
              name: "Hair Pinns Test Store",
              primaryDomain: { url: "https://shop.example.test" },
            },
          },
        }),
      });
      return;
    }
    if (requestBody.includes("products(")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { products: { edges: [] } } }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: {} }),
    });
  });
};

test.beforeEach(async ({ page }) => {
  await installRoutes(page);
});

test.setTimeout(90_000);

test("product view and confirmed cart mutation emit GA4 ecommerce events once", async ({ page }) => {
  await page.route("**/api/checkout", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        cartId: "gid://shopify/Cart/200",
        checkoutUrl: "https://shop.example.test/checkouts/200",
        cart: {
          id: "gid://shopify/Cart/200",
          checkoutUrl: "https://shop.example.test/checkouts/200",
          totalQuantity: 1,
          discountCodes: [],
          lines: { edges: [] },
          cost: {
            subtotalAmount: { amount: "24.95", currencyCode: "AUD" },
            totalAmount: { amount: "24.95", currencyCode: "AUD" },
          },
        },
      }),
    }),
  );

  await page.goto("/products/analytics-test-brush", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { name: product.title })).toBeVisible({ timeout: 30_000 });

  await expect.poll(async () => (await ecommerceEvents(page, "view_item")).length).toBe(1);
  expect(await ecommerceEvents(page, "view_item")).toEqual([
    {
      currency: "AUD",
      value: 24.95,
      items: [
        {
          item_id: product.variants.edges[0].node.id,
          item_name: product.title,
          price: 24.95,
          quantity: 1,
        },
      ],
    },
  ]);

  await page.getByRole("button", { name: "Add to Bag" }).click();

  await expect.poll(async () => (await ecommerceEvents(page, "add_to_cart")).length).toBe(1);
  expect(await ecommerceEvents(page, "add_to_cart")).toEqual([
    {
      currency: "AUD",
      value: 24.95,
      items: [
        {
          item_id: product.variants.edges[0].node.id,
          item_name: product.title,
          price: 24.95,
          quantity: 1,
        },
      ],
    },
  ]);
});

test("a rejected cart mutation preserves the existing cart and does not retry or emit add_to_cart", async ({ page }) => {
  const existingCartId = "gid://shopify/Cart/keep-this-cart";
  await page.addInitScript((cartId) => localStorage.setItem("hp_cart_id", cartId), existingCartId);
  let checkoutRequests = 0;
  await page.route("**/api/checkout", (route) => {
    const body = route.request().postDataJSON();
    if (body.action === "get") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          cart: {
            id: existingCartId,
            checkoutUrl: "https://shop.example.test/checkouts/existing",
            totalQuantity: 1,
            discountCodes: [],
            lines: { edges: [{ node: { id: "existing-line", quantity: 1 } }] },
            cost: {
              subtotalAmount: { amount: "34.95", currencyCode: "AUD" },
              totalAmount: { amount: "34.95", currencyCode: "AUD" },
            },
          },
        }),
      });
    }
    checkoutRequests += 1;
    return route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({ code: "CART_USER_ERROR", error: "Variant unavailable" }),
    });
  });

  await page.goto("/products/analytics-test-brush", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { name: product.title })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Add to Bag" }).click();
  await expect.poll(() => checkoutRequests).toBe(1);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("hp_cart_id"))).toBe(existingCartId);
  expect(await ecommerceEvents(page, "add_to_cart")).toHaveLength(0);
});

test("buy now emits begin_checkout once without a false add_to_cart", async ({ page }) => {
  const observedEvents: unknown[][] = [];
  await page.exposeFunction("captureAnalyticsEvent", (event: unknown[]) => {
    observedEvents.push(event);
  });
  await page.addInitScript(() => {
    const queue: ArrayLike<unknown>[] = [];
    const push = queue.push.bind(queue);
    queue.push = (...entries: ArrayLike<unknown>[]) => {
      for (const entry of entries) {
        void (window as typeof window & {
          captureAnalyticsEvent: (event: unknown[]) => Promise<void>;
        }).captureAnalyticsEvent(Array.from(entry));
      }
      return push(...entries);
    };
    window.dataLayer = queue;
  });

  await page.route("**/.netlify/functions/checkout?redirect=true", (route) => route.abort());

  await page.goto("/products/analytics-test-brush", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { name: product.title })).toBeVisible({ timeout: 30_000 });

  await page.getByRole("button", { name: "Buy Now" }).click();

  await expect.poll(() => observedEvents.filter((event) => event[0] === "event" && event[1] === "begin_checkout").length).toBe(1);
  const beginCheckoutEvent = observedEvents.find(
    (event) => event[0] === "event" && event[1] === "begin_checkout",
  );
  expect(beginCheckoutEvent?.[2]).toMatchObject({
    currency: "AUD",
    value: 24.95,
    items: [
      {
        item_id: product.variants.edges[0].node.id,
        item_name: product.title,
        price: 24.95,
        quantity: 1,
      },
    ],
  });
  expect(observedEvents.filter((event) => event[0] === "event" && event[1] === "add_to_cart")).toHaveLength(0);
});
