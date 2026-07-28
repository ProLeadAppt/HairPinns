import { describe, expect, it } from "vitest";
import {
  excludeRetiredProductEdges,
  isRetiredProductHandle,
} from "./retiredProducts";

describe("retired products", () => {
  it("recognises the discontinued walnut scrub", () => {
    expect(isRetiredProductHandle("walnut-scrub-hair-scalp-pre-wash-treatment")).toBe(true);
  });

  it("removes retired products from Shopify edges", () => {
    expect(
      excludeRetiredProductEdges([
        { node: { handle: "juuce-deep-cleanse-shampoo" } },
        { node: { handle: "walnut-scrub-hair-scalp-pre-wash-treatment" } },
      ]),
    ).toEqual([{ node: { handle: "juuce-deep-cleanse-shampoo" } }]);
  });
});
