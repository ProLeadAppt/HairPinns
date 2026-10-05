import { expect, test, type Page } from "@playwright/test";
import type { CartSnapshot } from "../../src/lib/cartApi";

const money = (amount: string) => ({ amount, currencyCode: "AUD" });
const fixture = (discounted = true): CartSnapshot => ({
  id: "gid://shopify/Cart/savings-test", checkoutUrl: "https://checkout.example.test/savings-test",
  totalQuantity: discounted ? 2 : 1,
  discountCodes: [],
  lines: { pageInfo: { hasNextPage: false }, edges: [{ node: {
    id: "line-1", quantity: discounted ? 2 : 1,
    cost: { subtotalAmount: money(discounted ? "48.85" : "43.90"), totalAmount: money(discounted ? "39.08" : "43.90") },
    discountAllocations: discounted ? [{ title: "KidsPack20", targetType: "LINE_ITEM", discountedAmount: money("9.77") }] : [],
    merchandise: { id: "gid://shopify/ProductVariant/101", title: "Default Title", price: money("43.90"),
      product: { id: "gid://shopify/Product/1", title: "Kids Gift Selection", handle: "kids-gift-selection", tags: [] } },
  } }] },
  cost: { subtotalAmount: money(discounted ? "39.08" : "43.90"), totalAmount: money(discounted ? "49.03" : "53.85") },
});

async function openBag(page: Page, initial: CartSnapshot) {
  await page.addInitScript(id => localStorage.setItem("hp_cart_id", id), initial.id);
  await page.route(/googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/, route => route.fulfill({ contentType: "application/javascript", body: "" }));
  await page.route("**/graphql.json", route => route.fulfill({ json: { data: { products: { edges: [] }, collections: { edges: [] } } } }));
  let snapshot = initial;
  await page.route("**/api/checkout", async route => {
    const request = route.request().postDataJSON();
    if (request.action === "update") snapshot = fixture(request.lines[0].quantity > 1);
    if (request.action === "remove") snapshot = { ...initial, totalQuantity: 0, lines: { edges: [] }, cost: { subtotalAmount: money("0.00"), totalAmount: money("0.00") } };
    await route.fulfill({ json: { cart: snapshot } });
  });
  await page.goto("/services/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /View cart/ }).filter({ visible: true }).click();
  const bag = page.locator("[data-mini-cart]");
  await expect(bag.locator("[data-cart-lines]")).toBeVisible();
  return bag;
}

for (const width of [390, 1280]) {
  test(`confirmed savings remain clear at ${width}px and refresh after quantity changes`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const bag = await openBag(page, fixture());
    await expect(bag.locator("[data-cart-savings]")).toHaveText(/Subtotal before discounts\$48\.85KidsPack20−\$9\.77/);
    await expect(bag.locator("[data-cart-subtotal]")).toHaveText("$39.08");
    await expect(bag.locator("[data-cart-line-price] del")).toContainText("$48.85");
    await expect(bag.locator("[data-cart-line-price]")).toContainText("$39.08");
    await expect(bag.locator("[data-cart-checkout]")).not.toContainText("$49.03");
    await expect(bag).toContainText("Shipping and any taxes are confirmed in Shopify checkout.");
    await expect(bag.getByRole("button", { name: "Checkout", exact: true })).toBeVisible();
    expect(await bag.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);

    await bag.getByRole("button", { name: "Decrease Kids Gift Selection quantity" }).click();
    await expect(bag.locator("[data-cart-subtotal]")).toHaveText("$43.90");
    await expect(bag.locator("[data-cart-savings]")).toHaveCount(0);
    await expect(bag.locator("[data-cart-line-price] del")).toHaveCount(0);
    await bag.getByRole("button", { name: "Increase Kids Gift Selection quantity" }).click();
    await expect(bag.locator("[data-cart-savings]")).toContainText("KidsPack20");

    await bag.getByRole("button", { name: "Close cart", exact: true }).click();
    await expect(bag).not.toBeVisible();
    await page.getByRole("button", { name: /View cart/ }).filter({ visible: true }).click();
    await expect(bag.locator("[data-cart-subtotal]")).toHaveText("$39.08");
    await bag.getByRole("button", { name: "Remove Kids Gift Selection from bag" }).click();
    await expect(bag.locator("[data-cart-empty]")).toBeVisible();
    await expect(bag.locator("[data-cart-savings]")).toHaveCount(0);
    await expect(bag.getByRole("button", { name: "Checkout", exact: true })).toBeDisabled();
  });
}

test("legacy carts keep their authoritative subtotal without a savings claim", async ({ page }) => {
  const legacy = fixture();
  delete legacy.lines.edges[0].node.cost;
  delete legacy.lines.edges[0].node.discountAllocations;
  const bag = await openBag(page, legacy);
  await expect(bag.locator("[data-cart-subtotal]")).toHaveText("$39.08");
  await expect(bag.locator("[data-cart-savings]")).toHaveCount(0);
});
