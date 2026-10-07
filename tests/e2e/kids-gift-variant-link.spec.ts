import { expect, test, type Page } from "@playwright/test";

// Run with a placeholder Storefront token. All remote traffic is mocked; the
// test exercises navigation only and records any unexpected commerce request.
const handle = "wet-brush-kids-detangler";
const collectionPath = "/collections/diy-kids-gift-packs";
const snowWhite = "53203907805365";
const yellow = "101";
const gid = (id: string) => `gid://shopify/ProductVariant/${id}`;
const photo = (name: string) => ({ id: name, url: `https://cdn.shopify.com/test/${name}.png`, altText: name, width: 800, height: 800 });
const variants = [
  { id: snowWhite, title: "Snow White Mini", amount: "16.95" },
  { id: yellow, title: "Yellow", amount: "19.95" },
  ...Array.from({ length: 19 }, (_, index) => ({ id: String(200 + index), title: `Other style ${index}`, amount: "19.95" })),
].map(option => ({
  id: gid(option.id), title: option.title, availableForSale: true, quantityAvailable: 3, requiresShipping: true,
  price: { amount: option.amount, currencyCode: "AUD" }, compareAtPrice: null,
  selectedOptions: [{ name: "Style", value: option.title }], image: photo(option.id),
}));
const product = {
  id: "gid://shopify/Product/901", handle, title: "Wet Brush Kids Detangler", vendor: "Wet Brush", productType: "Brush", tags: [],
  description: "A detangling brush.", descriptionHtml: "<p>A detangling brush.</p>", availableForSale: true,
  priceRange: { minVariantPrice: { amount: "16.95", currencyCode: "AUD" }, maxVariantPrice: { amount: "19.95", currencyCode: "AUD" } },
  compareAtPriceRange: { minVariantPrice: { amount: "0.00", currencyCode: "AUD" } },
  images: { edges: variants.map(variant => ({ node: variant.image })) },
  variants: { edges: variants.map(node => ({ node })), pageInfo: { hasNextPage: false } }, collections: { edges: [] },
};
const collection = {
  id: "gid://shopify/Collection/901", handle: "diy-kids-gift-packs", title: "DIY Kids Gift Packs", description: "Choose their favourites.",
  products: { edges: [{ node: product }], pageInfo: { hasNextPage: false, endCursor: null } },
};

async function mockStore(page: Page) {
  const writes: string[] = [];
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.endsWith("/graphql.json")) {
      if (/\bmutation\b/.test(request.postDataJSON()?.query || "")) {
        writes.push("GraphQL mutation");
        return route.abort("blockedbyclient");
      }
      return route.fulfill({ json: { data: { product, collection, products: { edges: [] }, collections: { edges: [] }, productRecommendations: [], shop: { name: "Isolated test store" } } } });
    }
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/.netlify/functions/")) {
      if (/checkout|cart/.test(url.pathname)) writes.push(url.pathname);
      return route.fulfill({ json: {} });
    }
    if (["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return route.continue();
    if (request.resourceType() === "image") return route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="lavender"/></svg>' });
    if (request.resourceType() === "script") return route.fulfill({ contentType: "application/javascript", body: "" });
    return route.fulfill({ status: 204, body: "" });
  });
  return writes;
}

for (const width of [344, 390, 768, 1280]) {
  test(`gift image and all-styles links follow the chosen variant at ${width}px`, async ({ page }) => {
    test.setTimeout(150_000);
    await page.setViewportSize({ width, height: 844 });
    const writes = await mockStore(page);
    await page.goto(collectionPath);
    const card = page.locator('section[aria-labelledby="kids-gift-builder-heading"] article').first();
    const option = card.getByRole("combobox", { name: "Colour or style", exact: true });
    const imageLink = card.getByRole("link").first();
    const allStyles = card.getByRole("link", { name: "See all styles and photos before choosing" });
    await expect(option).toHaveValue("");
    await expect(imageLink).toHaveAttribute("href", `/products/${handle}`);

    await option.selectOption(gid(snowWhite));
    await expect(imageLink).toHaveAttribute("href", `/products/${handle}?variant=${snowWhite}`);
    await expect(allStyles).toHaveAttribute("href", `/products/${handle}?variant=${snowWhite}`);
    await expect(card.getByText("$16.95", { exact: true })).toBeVisible();
    await card.getByRole("combobox", { name: "Quantity", exact: true }).selectOption("2");
    await imageLink.click();
    await expect(page).toHaveURL(`/products/${handle}?variant=${snowWhite}`);
    await expect(page.getByRole("combobox", { name: "Style", exact: true })).toContainText("Snow White Mini");
    await expect(page.locator("main").getByText("$16.95", { exact: true }).first()).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(collectionPath);
    // Returning from the product preserves the draft, validated against fresh stock.
    await expect(option).toHaveValue(gid(snowWhite));
    await expect(card.getByRole("combobox", { name: "Quantity", exact: true })).toHaveValue("2");
    await page.goForward();
    await expect(page).toHaveURL(`/products/${handle}?variant=${snowWhite}`);
    await page.goBack();
    await expect(option).toHaveValue(gid(snowWhite));
    await page.reload();
    await expect(option).toHaveValue(gid(snowWhite));
    await expect(card.getByRole("combobox", { name: "Quantity", exact: true })).toHaveValue("2");
    await expect(imageLink).toHaveAttribute("href", `/products/${handle}?variant=${snowWhite}`);
    await option.selectOption(gid(snowWhite));
    await option.selectOption(gid(yellow));
    await expect(imageLink).toHaveAttribute("href", `/products/${handle}?variant=${yellow}`);
    await expect(allStyles).toHaveAttribute("href", `/products/${handle}?variant=${yellow}`);
    await expect(card.getByText("$19.95", { exact: true })).toBeVisible();
    await allStyles.click();
    await expect(page).toHaveURL(`/products/${handle}?variant=${yellow}`);
    await expect(page.getByRole("combobox", { name: "Style", exact: true })).toContainText("Yellow");
    await page.goBack();
    await expect(option).toHaveValue(gid(yellow));
    await option.selectOption(gid(snowWhite));
    await option.selectOption("");
    await expect(imageLink).toHaveAttribute("href", `/products/${handle}`);
    await expect(allStyles).toHaveAttribute("href", `/products/${handle}`);
    await option.selectOption(gid(yellow));
    const clear = page.getByRole("button", { name: "Clear my selection", exact: true });
    await clear.focus();
    await expect(clear).toBeFocused();
    expect((await clear.boundingBox())!.height).toBeGreaterThanOrEqual(44 - 0.001);
    await page.keyboard.press("Enter");
    await expect(clear).toBeFocused();
    await expect(option).toHaveValue("");
    await page.reload();
    await expect(option).toHaveValue("");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(writes).toEqual([]);
  });
}

for (const issue of ["sold-out", "reduced-stock", "removed"] as const) {
  test(`restored ${issue} choice stays blocked until cleared`, async ({ page }) => {
    const writes = await mockStore(page);
    await page.addInitScript(({ key, variant }) => sessionStorage.setItem(key, JSON.stringify({ version: 1, savedAt: Date.now(), choices: { "gid://shopify/Product/901": { variantId: variant, quantity: 2 } } })), { key: "hp_kids_gift_draft_v1", variant: gid(snowWhite) });
    await page.route("**/graphql.json", route => {
      const updated = structuredClone(product);
      if (issue === "removed") updated.variants.edges = updated.variants.edges.filter(({ node }) => node.id !== gid(snowWhite));
      else if (issue === "sold-out") updated.variants.edges[0].node.availableForSale = false;
      else updated.variants.edges[0].node.quantityAvailable = 1;
      return route.fulfill({ json: { data: { collection: { ...collection, products: { edges: [{ node: updated }] } }, products: { edges: [] } } } });
    });
    await page.goto(collectionPath);
    await expect(page.getByText("One option or quantity has changed.", { exact: false })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add my selection to bag" })).toBeDisabled();
    await page.getByRole("button", { name: "Clear my selection" }).click();
    await expect(page.getByText("One option or quantity has changed.", { exact: false })).toHaveCount(0);
    const option = page.getByRole("combobox", { name: "Colour or style", exact: true });
    await option.selectOption(gid(yellow));
    await expect(page.getByRole("button", { name: "Add my selection to bag" })).toBeEnabled();
    expect(writes).toEqual([]);
  });
}

for (const width of [344, 390, 768]) {
  test(`mobile shopping menu keeps keyboard focus and touch targets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const writes = await mockStore(page);
    await page.goto(collectionPath);
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const menu = page.getByRole("dialog", { name: "Mobile menu" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Shop all products" })).toBeFocused();
    await expect(menu.locator("a button, button a")).toHaveCount(0);
    // Firefox DOMRects can report 44px as 43.999992px; allow subpixel precision.
    for (const target of await menu.locator("a, button, input").all()) {
      if (await target.isVisible()) expect((await target.boundingBox())!.height).toBeGreaterThanOrEqual(44 - 0.001);
    }
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press("Tab");
      expect(await menu.evaluate(element => element.contains(document.activeElement))).toBe(true);
    }
    const booking = menu.getByRole("link", { name: "Book now", exact: true });
    await expect(booking).toHaveAttribute("href", /fresha\.com/);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(writes).toEqual([]);
  });
}

test("blocked session storage still allows choosing and clearing a gift", async ({ page }) => {
  const writes = await mockStore(page);
  await page.addInitScript(() => Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Storage blocked"); } }));
  await page.goto(collectionPath);
  const option = page.getByRole("combobox", { name: "Colour or style", exact: true });
  await option.selectOption(gid(snowWhite));
  await expect(page.getByRole("button", { name: "Add my selection to bag" })).toBeEnabled();
  await page.getByRole("button", { name: "Clear my selection" }).click();
  await expect(option).toHaveValue("");
  expect(writes).toEqual([]);
});

test("a failed collection read does not erase the saved gift draft", async ({ page }) => {
  const writes = await mockStore(page);
  await page.goto(collectionPath);
  const option = page.getByRole("combobox", { name: "Colour or style", exact: true });
  await option.selectOption(gid(snowWhite));
  await page.route("**/graphql.json", route => route.fulfill({ json: { data: { collection: null } } }));
  await page.reload();
  await expect(page.getByRole("heading", { name: "Collection Unavailable" })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("hp_kids_gift_draft_v1")!).choices["gid://shopify/Product/901"].variantId)).toBe(gid(snowWhite));
  await page.unroute("**/graphql.json");
  await page.reload();
  await expect(option).toHaveValue(gid(snowWhite));
  await expect(page.getByRole("button", { name: "Add my selection to bag" })).toBeEnabled();
  expect(writes).toEqual([]);
});
