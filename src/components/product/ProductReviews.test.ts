import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProductReviews from "./ProductReviews";

describe("product review destination", () => {
  it("provides a product-specific, accessible destination without blocking initial rendering", () => {
    const html = renderToStaticMarkup(createElement(ProductReviews, { productId: "gid://shopify/Product/8180068516021", title: "Wet Brush Original Detangler" }));
    expect(html).toContain('id="product-reviews"');
    expect(html).toContain("Read or write a product review");
    // Judge.me support requires the preloader to run before widget markup is mounted.
    expect(html).not.toContain('class="jdgm-widget');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("aggregateRating");
  });

  it("does not associate reviews with an invalid product identifier", () => {
    expect(renderToStaticMarkup(createElement(ProductReviews, { productId: "invalid", title: "Product" }))).toBe("");
  });

  it("escapes product titles instead of interpreting them as markup", () => {
    const html = renderToStaticMarkup(createElement(ProductReviews, { productId: "123", title: '<img src=x onerror="alert(1)">' }));
    expect(html).not.toContain("<img");
    expect(html).not.toContain("onerror");
  });
});
