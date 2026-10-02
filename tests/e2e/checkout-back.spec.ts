import { expect, test } from "@playwright/test";

const cart = {
  id: "gid://shopify/Cart/return-test",
  checkoutUrl: "https://checkout.example.test/return-test",
  totalQuantity: 1,
  discountCodes: [],
  lines: { edges: [{ node: {
    id: "line-1", quantity: 1,
    merchandise: { id: "gid://shopify/ProductVariant/101", title: "Default Title", price: { amount: "19.95", currencyCode: "AUD" },
      product: { id: "gid://shopify/Product/1", title: "Mini Pamper Pack", handle: "mother-s-day-pamper-pack", tags: [] } },
  } }] },
  cost: { subtotalAmount: { amount: "19.95", currencyCode: "AUD" }, totalAmount: { amount: "19.95", currencyCode: "AUD" } },
};

test("restoring a page from checkout re-enables the same bag without reload", async ({ page }) => {
  await page.addInitScript(id => localStorage.setItem("hp_cart_id", id), cart.id);
  await page.route(/googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/, route => route.fulfill({ contentType: "application/javascript", body: "" }));
  await page.route("**/graphql.json", route => route.fulfill({ json: { data: { products: { edges: [] }, collections: { edges: [] } } } }));
  let checkoutRequests = 0;
  await page.route("**/api/checkout", async route => {
    if (route.request().postDataJSON().action === "checkout") checkoutRequests++;
    await route.fulfill({ json: { cart } });
  });
  // Keep the real checkout handler and its state, replacing only navigation.
  // Browser routes disable BFCache, so restore via its actual persisted event.
  await page.route("**/src/lib/checkout.ts*", route => route.fulfill({
    contentType: "application/javascript",
    body: "export function gotoCheckout(url) { window.__checkoutNavigation = url; }",
  }));
  await page.goto("/services/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /View cart/ }).filter({ visible: true }).click();
  const bag = page.locator("[data-mini-cart]");
  const checkout = bag.getByRole("button", { name: "Checkout", exact: true });
  await expect(checkout).toBeEnabled();
  await checkout.click();
  await expect.poll(() => checkoutRequests).toBe(1);
  await expect(bag.getByRole("button", { name: "Opening checkout…", exact: true })).toBeDisabled();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await expect(checkout).toBeEnabled();
  await expect(bag).toContainText("Mini Pamper Pack");
  expect(await page.evaluate(() => localStorage.getItem("hp_cart_id"))).toBe(cart.id);
  await checkout.click();
  await expect.poll(() => checkoutRequests).toBe(2);
});
