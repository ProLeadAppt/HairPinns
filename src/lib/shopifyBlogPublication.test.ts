import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
vi.mock("@/lib/shopify", () => ({ fetchShopify: vi.fn() }));
import { fetchShopify } from "@/lib/shopify";
import { getPublicArticle } from "./shopifyContent";

describe("Shopify journal publication", () => {
  beforeEach(() => vi.mocked(fetchShopify).mockReset());
  it("reads the editorial blog using the exact published handle", async () => {
    const article = { handle: "how-to-apply-hair-finishing-products" };
    vi.mocked(fetchShopify).mockResolvedValue({ blog: { articleByHandle: article } });
    expect(await getPublicArticle("blogs", article.handle)).toEqual(article);
    expect(fetchShopify).toHaveBeenCalledWith(expect.any(String), {
      blogHandle: "blogs", articleHandle: article.handle,
    });
  });
  it("does not substitute a different article when Shopify returns no public article", async () => {
    vi.mocked(fetchShopify).mockResolvedValue({ blog: { articleByHandle: null } });
    expect(await getPublicArticle("blogs", "private-draft")).toBeNull();
  });
  it("discovers editorial handles for both prerendering and sitemap output", () => {
    const routes = readFileSync("scripts/collect-prerender-routes.js", "utf8");
    const sitemap = readFileSync("scripts/generate-sitemap.js", "utf8");
    expect(routes).toContain("fetchUpdateArticleHandles('blogs')");
    expect(sitemap).toContain("getShopifyUpdates('blogs')");
    expect(routes).toContain("new Set(routes)");
  });
});
