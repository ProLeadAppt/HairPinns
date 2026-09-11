import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("crawler discovery surfaces", () => {
  it("renders an anchor archive for every active blog summary", () => {
    const source = read("src/pages/Blog.tsx");
    expect(source).toContain("Browse all journal guides");
    expect(source).toContain("visiblePosts.map((post)");
    expect(source).toContain('to={`/blog/${post.slug}`}');
  });

  it("renders the curated catalogue taxonomy and seasonal links for crawlers", () => {
    const source = read("src/pages/Collections.tsx");
    expect(source).toContain("SHOP_TAXONOMY.map((group)");
    expect(source).toContain("group.destinations.map((destination");
    expect(source).toContain("CHRISTMAS_PRODUCTS.map((product");
    expect(source).toContain("prerenderReady");
  });

  it("links the HTML sitemap from global footer navigation", () => {
    expect(read("src/components/Footer.tsx")).toContain('["Sitemap", "/sitemap"]');
  });
});
