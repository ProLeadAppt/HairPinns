import { expect, test } from "@playwright/test";

const ACTIVE_PROMOTION_TIME = new Date("2026-08-05T10:00:00+10:00");
const EXPIRED_PROMOTION_TIME = new Date("2026-08-12T09:00:00+10:00");

test.beforeEach(async ({ page }) => {
  await page.route(
    /googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/,
    route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );
});

test("active offer replaces QIQI in the header and adds a homepage promotion block", async ({ page }) => {
  await page.clock.setFixedTime(ACTIVE_PROMOTION_TIME);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const promo = page.getByRole("link", { name: /buy 2 full-size hair products/i });
  await expect(promo).toBeVisible();
  await expect(promo).toHaveAttribute("href", "/offers/free-extra");
  await expect(page.getByText(/20% off QIQI/i)).toHaveCount(0);

  const featureHeading = page.getByRole("heading", { name: /restock two favourites/i });
  await expect(featureHeading).toBeVisible();
  const feature = featureHeading.locator("xpath=ancestor::section[1]");
  await expect(feature.getByRole("link", { name: "Build my restock" })).toHaveAttribute("href", "/offers/free-extra");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("expired promotion falls back to evergreen shipping and hides temporary homepage copy", async ({ page }) => {
  await page.clock.setFixedTime(EXPIRED_PROMOTION_TIME);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("link", { name: /free shipping on orders over \$150/i })).toHaveAttribute("href", "/collections");
  await expect(page.getByRole("heading", { name: /restock two favourites/i })).toHaveCount(0);
  await expect(page.getByText(/20% off QIQI/i)).toHaveCount(0);
});

test("an open tab refreshes campaign UI when the expiry boundary passes", async ({ page }) => {
  await page.clock.setFixedTime(ACTIVE_PROMOTION_TIME);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /buy 2 full-size hair products/i })).toBeVisible();

  await page.clock.setFixedTime(EXPIRED_PROMOTION_TIME);
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));

  await expect(page.getByRole("link", { name: /free shipping on orders over \$150/i })).toHaveAttribute("href", "/collections");
  await expect(page.getByRole("heading", { name: /restock two favourites/i })).toHaveCount(0);
});

test("offer page states the exact mechanic, gift choices, exclusions and expiry", async ({ page }) => {
  await page.clock.setFixedTime(ACTIVE_PROMOTION_TIME);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/offers/free-extra", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: /Restock two favourites/i })).toBeVisible();
  const heroContrast = await page.locator("#free-extra-title").evaluate((heading) => ({
    foreground: getComputedStyle(heading).color,
    background: getComputedStyle(heading.closest("section")!).backgroundColor,
  }));
  expect(heroContrast.foreground).not.toBe(heroContrast.background);
  await expect(page.getByText(/Buy two eligible full-size hair products in one order/i)).toBeVisible();
  await expect(page.getByText("Add one free extra to your bag", { exact: true })).toBeVisible();
  await expect(page.getByText(/Shopify removes the gift price automatically at checkout/i)).toBeVisible();
  await expect(page.getByText(/Ends 9:00am AEST on 12 August 2026/i)).toBeVisible();
  await expect(page.getByText(/limited to 200 redemptions/i)).toBeVisible();

  await expect(page.getByRole("link", { name: /travel bottles/i })).toHaveAttribute("href", "/products/silicon-travel-bottle-duo");
  await expect(page.getByRole("link", { name: /head towel/i })).toHaveAttribute("href", "/products/soft-towel");
  await expect(page.getByRole("link", { name: /wide-tooth comb/i })).toHaveAttribute("href", "/products/purple-wide-tooth-combs");
  await expect(page.getByText(/Excludes QIQI products, sale items, bundles, gift cards, services and free-extra products/i)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
