import { describe, expect, it } from "vitest";
import { productBrand, recommendationCollection } from "./productBrand";
describe("catalogue brand attribution", () => {
  it("uses explicit title attribution instead of the retailer", () => {
    expect(productBrand({ title: "Juuce Heat Shield", vendor: "Hair Pinns Home Hair Care" })).toBe("Juuce");
    expect(productBrand({ title: "Wet Brush Kids", vendor: "Hair Pinns" })).toBe("Wet Brush");
  });
  it("preserves a manufacturer vendor and never guesses unknown brands", () => {
    expect(productBrand({ title: "Mask", vendor: "Vitality's" })).toBe("Vitality's");
    expect(productBrand({ title: "Mini Pamper Pack", vendor: "Hair Pinns Home Hair Care" })).toBeUndefined();
    expect(productBrand({ title: "Purely special", vendor: "" })).toBeUndefined();
  });
  it("prefers the declared brand range over mixed gift/promotional collections", () => {
    expect(recommendationCollection({ title: "Juuce Heat Shield", vendor: "Hair Pinns", collections: { edges: [
      { node: { handle: "diy-kids-gift-packs", title: "DIY Kids Gifts" } },
      { node: { handle: "juuce", title: "Juuce Botanical Hair Care" } },
    ] } })).toBe("juuce");
    expect(recommendationCollection({ collections: { edges: [{ node: { handle: "sale" } }] } })).toBeUndefined();
  });
});
