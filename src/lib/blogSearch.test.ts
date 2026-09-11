import { describe, expect, it } from "vitest";
import type { BlogSummary } from "@/data/blogSummaries";
import { filterBlogSummaries } from "./blogSearch";

const posts: BlogSummary[] = [
  {
    slug: "heat-damage",
    title: "How to prevent heat damage",
    excerpt: "Practical protection for styling at home.",
    category: "Hair Care",
    date: "1 September 2026",
    readTime: "4 min read",
    image: "/heat.webp",
    author: "Jena Pinn",
  },
  {
    slug: "bangor-colour",
    title: "Colour consultations explained",
    excerpt: "What to expect at the Bangor salon.",
    category: "Salon",
    date: "2 September 2026",
    readTime: "5 min read",
    image: "/colour.webp",
    author: "Jena Pinn",
  },
];

describe("journal search", () => {
  it("matches title, excerpt, category and author without case sensitivity", () => {
    expect(filterBlogSummaries(posts, "HEAT damage").map((post) => post.slug)).toEqual(["heat-damage"]);
    expect(filterBlogSummaries(posts, "bangor salon").map((post) => post.slug)).toEqual(["bangor-colour"]);
    expect(filterBlogSummaries(posts, "jena")).toHaveLength(2);
  });

  it("treats extra whitespace as separate required search terms", () => {
    expect(filterBlogSummaries(posts, "  colour   Bangor ").map((post) => post.slug)).toEqual(["bangor-colour"]);
  });

  it("returns all entries for an empty query", () => {
    expect(filterBlogSummaries(posts, "   ")).toEqual(posts);
  });
});
