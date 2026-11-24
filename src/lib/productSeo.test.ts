import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildMetaDescription, buildMetaTitle } from "./metadata";
import { getProductSeoOverride } from "./productSeo";

describe("product SEO overrides", () => {
  it("keeps the Island Vibes title and description exact and unclipped", () => {
    const seo = getProductSeoOverride("island-vibes-self-tanning-foam");

    expect(seo).toEqual({
      title: "Island Vibes Self-Tanning Foam | Shop AU | Hair Pinns",
      description:
        "Shop Island Vibes Self-Tanning Foam at Hair Pinns. Fast-drying, streak-free self-tanning foam shipped Australia-wide with free shipping over $150.",
    });
    expect(seo?.title).toHaveLength(53);
    expect(seo?.description).toHaveLength(146);
    expect(buildMetaTitle([seo?.title])).toBe(seo?.title);
    expect(buildMetaDescription(seo?.description ?? "")).toBe(seo?.description);
    expect(`${seo?.title}${seo?.description}`).not.toMatch(/[\u2013\u2014…]|color\b/);
  });

  it("leaves every other product on the default metadata path", () => {
    expect(getProductSeoOverride(undefined)).toBeUndefined();
    expect(getProductSeoOverride("juuce-radiant-colour-shampoo")).toBeUndefined();

    const source = readFileSync(new URL("../pages/ProductDetail.tsx", import.meta.url), "utf8");
    expect(source).toContain("productSeo?.title ?? `${product.title} | Hair Pinns`");
    expect(source).toContain("productSeo?.description ?? buildMetaDescription(");
  });
});
