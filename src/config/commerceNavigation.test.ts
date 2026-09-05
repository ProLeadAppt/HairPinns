import { describe, expect, it } from "vitest";
import {
  CHRISTMAS_PRODUCTS,
  HIDDEN_COLLECTION_HANDLES,
  PUBLIC_COLLECTION_HANDLES,
  SHOP_TAXONOMY,
} from "./commerceNavigation";

describe("commerce navigation taxonomy", () => {
  it("offers the three approved customer paths in order", () => {
    expect(SHOP_TAXONOMY.map((group) => group.id)).toEqual(["hair-need", "product", "brand"]);
    expect(SHOP_TAXONOMY[0].destinations.map((item) => item.name)).toEqual([
      "Frizz Control",
      "Heat Protection",
      "Blonde Care",
      "Fine & Flat Hair",
      "Curly Hair",
      "Scalp Care",
      "Colour-Treated Hair",
    ]);
  });

  it("never exposes internal promotion collections as public destinations", () => {
    expect(PUBLIC_COLLECTION_HANDLES.some((handle) => HIDDEN_COLLECTION_HANDLES.includes(handle))).toBe(false);
    expect(HIDDEN_COLLECTION_HANDLES).toContain("free-extra-eligible");
    expect(HIDDEN_COLLECTION_HANDLES).toContain("hair-care-must-haves-sale-items");
  });

  it("links the three seasonal products directly", () => {
    expect(CHRISTMAS_PRODUCTS.map((product) => product.href)).toEqual([
      "/products/christmas-packs",
      "/products/pure-christmas-packs-2025",
      "/products/festive-finish-gift-set-duo",
    ]);
  });
});
