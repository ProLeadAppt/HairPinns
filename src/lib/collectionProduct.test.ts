import { describe, expect, it } from "vitest";
import { mapCollectionProduct } from "./collectionProduct";

const baseProduct = {
  id: "product-1",
  handle: "test-product",
  title: "Test Product",
  availableForSale: true,
  priceRange: {
    minVariantPrice: { amount: "45.00", currencyCode: "AUD" },
    maxVariantPrice: { amount: "75.00", currencyCode: "AUD" },
  },
  compareAtPriceRange: { minVariantPrice: { amount: "50.00", currencyCode: "AUD" } },
  images: { edges: [] },
};

describe("collection product card mapping", () => {
  it("quick-adds a genuine single variant at that exact variant price", () => {
    const card = mapCollectionProduct({
      ...baseProduct,
      variants: {
        edges: [{ node: {
          id: "variant-only",
          title: "Default Title",
          availableForSale: true,
          quantityAvailable: 4,
          price: { amount: "49.50", currencyCode: "AUD" },
          compareAtPrice: { amount: "55.00", currencyCode: "AUD" },
        } }],
        pageInfo: { hasNextPage: false },
      },
    });

    expect(card.hasMultipleVariants).toBe(false);
    expect(card.quickAddVariantId).toBe("variant-only");
    expect(card.price).toBe(49.5);
    expect(card.originalPrice).toBe(55);
    expect(card.pricePrefix).toBe("");
  });

  it("never chooses an arbitrary variant for a Christmas pack", () => {
    const card = mapCollectionProduct({
      ...baseProduct,
      handle: "christmas-packs",
      variants: {
        edges: [
          { node: { id: "hydrate", title: "Hydrate", availableForSale: true, quantityAvailable: 0, price: { amount: "45.00", currencyCode: "AUD" } } },
          { node: { id: "repair", title: "Repair", availableForSale: true, quantityAvailable: 2, price: { amount: "75.00", currencyCode: "AUD" } } },
        ],
        pageInfo: { hasNextPage: false },
      },
    });

    expect(card.hasMultipleVariants).toBe(true);
    expect(card.quickAddVariantId).toBeNull();
    expect(card.price).toBe(45);
    expect(card.pricePrefix).toBe("From ");
  });

  it("treats a truncated variant connection as multi-variant", () => {
    const card = mapCollectionProduct({
      ...baseProduct,
      variants: {
        edges: [{ node: { id: "first", title: "First", availableForSale: true, quantityAvailable: 1, price: { amount: "45.00", currencyCode: "AUD" } } }],
        pageInfo: { hasNextPage: true },
      },
    });

    expect(card.hasMultipleVariants).toBe(true);
    expect(card.quickAddVariantId).toBeNull();
  });
});
