import { describe, expect, it } from "vitest";
import {
  RETIRED_PRODUCT_HANDLES,
  excludeRetiredProductEdges,
  isRetiredProductHandle,
} from "./retiredProducts";

describe("retired products", () => {
  it("treats the live Pure Walnut Scrub product as active", () => {
    expect(isRetiredProductHandle("walnut-scrub-hair-scalp-pre-wash-treatment")).toBe(false);
    expect(RETIRED_PRODUCT_HANDLES.size).toBe(0);
  });

  it("keeps live Shopify edges when no handles are retired", () => {
    expect(
      excludeRetiredProductEdges([
        { node: { handle: "juuce-deep-cleanse-shampoo" } },
        { node: { handle: "walnut-scrub-hair-scalp-pre-wash-treatment" } },
      ]),
    ).toEqual([
      { node: { handle: "juuce-deep-cleanse-shampoo" } },
      { node: { handle: "walnut-scrub-hair-scalp-pre-wash-treatment" } },
    ]);
  });
});
