import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateBlogItemListSchema, generateFAQPageSchema } from "./schema";
import { getCollectionFAQs } from "@/data/collectionFAQs";

const root = resolve(process.cwd());
const read = (relativePath: string) => readFileSync(join(root, relativePath), "utf8");

describe("schema eligibility", () => {
  it("does not publish unsupported QAPage or Speakable schema", () => {
    const schemaSource = read("src/lib/schema.ts");
    const pageSource = readdirSync(join(root, "src/pages"))
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => read(`src/pages/${file}`))
      .join("\n");

    expect(schemaSource).not.toContain("generateQAPageSchema");
    expect(schemaSource).not.toContain("SpeakableSpecification");
    expect(pageSource).not.toContain("generateQAPageSchema");
    expect(pageSource).not.toMatch(/\bspeakable\s*:/);
  });

  it("uses BlogPosting as the only article node on blog detail pages", () => {
    const blogPostSource = read("src/pages/BlogPost.tsx");

    expect(blogPostSource).toContain("generateBlogPostSchema");
    expect(blogPostSource).not.toContain("generateArticleSchema");
    expect(blogPostSource).not.toContain("articleSchema");
    expect(blogPostSource).not.toContain("defaultBlogFaqs");
    expect(blogPostSource).toContain("post.content.faqSection ?? []");
  });

  it("keeps blog index entries as URL references rather than duplicate Article nodes", () => {
    const schema = generateBlogItemListSchema([
      { name: "Guide", url: "/blog/guide", datePublished: "2026-07-25" },
    ]);
    expect(JSON.stringify(schema)).not.toContain('"@type":"Article"');
    expect(schema.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      name: "Guide",
      item: "https://hairpinns.com/blog/guide",
    });
  });

  it("does not invent FAQ content for unmapped collections", () => {
    expect(getCollectionFAQs("unmapped-live-collection")).toEqual([]);
    expect(getCollectionFAQs("qiqi").length).toBeGreaterThan(0);
    expect(() => generateFAQPageSchema([])).toThrow(/at least one/i);
  });
});
