import { describe, expect, it } from "vitest";
import {
  publicExcerpt,
  sanitisePublicArticleHtml,
} from "./shopifyContent";

describe("Shopify public content", () => {
  it("removes executable markup and unsafe attributes", () => {
    const dirty = `
      <p onclick="steal()" style="color:red">Hello <strong>Hair Pinns</strong></p>
      <script>alert(1)</script>
      <iframe src="https://example.com"></iframe>
      <a href="javascript:alert(1)" target="_blank">unsafe</a>
    `;

    const clean = sanitisePublicArticleHtml(dirty);

    expect(clean).toContain("Hello <strong>Hair Pinns</strong>");
    expect(clean).not.toMatch(/script|iframe|onclick|style=|javascript:|target=/i);
  });

  it("removes recipient-specific link parameters but keeps storefront choices", () => {
    const clean = sanitisePublicArticleHtml(
      '<a href="https://hairpinns.com/products/example?variant=123&utm_source=email&email=jena%40example.com&preview_token=secret">Shop</a>',
    );

    expect(clean).toContain('href="https://hairpinns.com/products/example?variant=123&amp;utm_source=email"');
    expect(clean).not.toMatch(/jena|preview_token|email=/i);
    expect(clean).toContain('rel="nofollow noopener noreferrer"');
  });

  it("creates a plain, bounded excerpt when Shopify has no excerpt", () => {
    expect(publicExcerpt("", "<h2>A useful update</h2><p>From Jena &amp; the Hair Pinns team.</p>", 36))
      .toBe("A useful update From Jena & the…");
  });
});
