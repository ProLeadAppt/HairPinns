import { describe, expect, it } from "vitest";
import {
  normaliseLastmod,
  parseBlogFreshness,
  parseLocationSlugs,
  renderSitemapUrl,
} from "./sitemap-utils.js";

describe("truthful sitemap freshness", () => {
  it("normalises trustworthy dates and rejects unavailable or invalid dates", () => {
    expect(normaliseLastmod("2025-04-11T10:20:30Z")).toBe("2025-04-11");
    expect(normaliseLastmod("April 11, 2025")).toBe("2025-04-11");
    expect(normaliseLastmod("")).toBeUndefined();
    expect(normaliseLastmod("not-a-date")).toBeUndefined();
  });

  it("pairs each blog slug with its own publication date", () => {
    const source = `
      { slug: 'first-post', title: 'First', date: 'February 25, 2025' },
      { slug: "second-post", title: "Second", date: "April 11, 2025" },
    `;

    expect(parseBlogFreshness(source)).toEqual([
      { slug: "first-post", lastmod: "2025-02-25" },
      { slug: "second-post", lastmod: "2025-04-11" },
    ]);
  });

  it("omits lastmod instead of publishing a fabricated current date", () => {
    const xml = renderSitemapUrl({
      loc: "https://hairpinns.com/privacy/",
      changefreq: "yearly",
      priority: 0.3,
      images: [],
    });

    expect(xml).not.toContain("<lastmod>");
    expect(xml).toContain("<loc>https://hairpinns.com/privacy/</loc>");
  });

  it("discovers area slugs from canonical slug fields and legacy object keys", () => {
    const source = `
      const definitions = [
        { slug: "como-2226", name: "Como" },
        { slug: "bangor-2234", name: "Bangor" },
      ];
      const legacy = { "como-2226": { slug: "como-2226" } };
      const noise = { slug: "not-an-area" };
    `;

    expect(parseLocationSlugs(source)).toEqual([
      "como-2226",
      "bangor-2234",
    ]);
  });
});
