import { expect, test } from "@playwright/test";

const shopifyResponse = (data: unknown) => ({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify({ data }),
});

test("public updates archive has a useful empty state", async ({ page }) => {
  await page.route(/myshopify\.com\/api\/.+\/graphql\.json/, async (route) => {
    await route.fulfill(shopifyResponse({
      blog: {
        id: "gid://shopify/Blog/updates",
        title: "Updates",
        handle: "updates",
        articles: { nodes: [] },
      },
    }));
  });

  await page.goto("/updates");

  await expect(page.getByRole("heading", { level: 1, name: "Notes from Jena, ready to share." })).toBeVisible();
  await expect(page.getByText("First edition coming soon")).toBeVisible();
  await expect(page.getByRole("link", { name: /Read the hair guides/ })).toHaveAttribute("href", "/blog");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://hairpinns.com/updates/");
});

test("public update strips executable markup and recipient tokens", async ({ page }) => {
  await page.route(/myshopify\.com\/api\/.+\/graphql\.json/, async (route) => {
    await route.fulfill(shopifyResponse({
      blog: {
        articleByHandle: {
          id: "gid://shopify/OnlineStoreArticle/test",
          title: "A note from Jena",
          handle: "a-note-from-jena",
          excerpt: "A useful salon update from Jena.",
          excerptHtml: "<p>A useful salon update from Jena.</p>",
          contentHtml: '<p onclick="bad()">Hello from Hair Pinns.</p><script>bad()</script><a href="https://hairpinns.com/products/example?variant=123&email=private%40example.com">Shop now</a>',
          publishedAt: "2026-09-12T00:00:00Z",
          image: null,
          author: { name: "Jenna Pinn" },
          seo: { title: null, description: null },
          tags: [],
        },
      },
    }));
  });

  await page.goto("/updates/a-note-from-jena");

  await expect(page.getByRole("heading", { level: 1, name: "A note from Jena" })).toBeVisible();
  await expect(page.getByText("Hello from Hair Pinns.")).toBeVisible();
  await expect(page.locator("[data-public-update] script")).toHaveCount(0);
  const shopLink = page.getByRole("link", { name: "Shop now" });
  await expect(shopLink).toHaveAttribute("href", "https://hairpinns.com/products/example?variant=123");
  await expect(shopLink).toHaveAttribute("rel", "nofollow noopener noreferrer");
  await expect(page.locator("[onclick]")).toHaveCount(0);
});
