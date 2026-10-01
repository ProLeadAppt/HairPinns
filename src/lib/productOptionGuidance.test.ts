import { describe, expect, it } from "vitest";
import { productOptionGuidance } from "./productOptionGuidance";

describe("product-specific option guidance", () => {
  it("does not show selection instructions for a single variant", () => {
    expect(productOptionGuidance(["Size"], 1, 5)).toBeNull();
  });
  it("uses size rather than brush or style for treatments", () => {
    expect(productOptionGuidance(["Size"], 2, 3)).toBe("Choose your size above. Gallery-only photographs do not change your selection.");
  });
  it("uses colour and style for brushes", () => {
    expect(productOptionGuidance(["Colour", "Style"], 4, 2)).toContain("colour / style");
  });
  it("supports generic variant labels and one image", () => {
    expect(productOptionGuidance(["Title"], 2, 1)).toBe("Choose your option above.");
  });
});
