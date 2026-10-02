import { describe, expect, it } from "vitest";
import { homeFeaturedGuides } from "./homeFeaturedGuides";

describe("advice-led homepage", () => {
  it("leads with the existing practical guide, not the dated ranking article", () => {
    expect(homeFeaturedGuides[0].slug).toBe("how-to-use-juuce-hair-products");
    expect(homeFeaturedGuides[0].title).not.toContain("2025");
    expect(homeFeaturedGuides[0].excerpt).not.toMatch(/[\u2014\u2013]/);
  });
});
