import { describe, expect, it } from "vitest";
import { getPrimaryVariantPricing } from "./productPricing";

describe("getPrimaryVariantPricing", () => {
  it("shows the price of the variant that quick add will place in the cart", () => {
    const product = {
      priceRange: { minVariantPrice: { amount: "4.95", currencyCode: "AUD" } },
      compareAtPriceRange: { minVariantPrice: { amount: "7.95" } },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/250g",
              price: { amount: "41.95", currencyCode: "AUD" },
              compareAtPrice: null,
            },
          },
        ],
      },
    };

    expect(getPrimaryVariantPricing(product)).toEqual({
      price: 41.95,
      originalPrice: undefined,
      currency: "AUD",
      variantId: "gid://shopify/ProductVariant/250g",
    });
  });

  it("falls back to range pricing when variant pricing is unavailable", () => {
    const product = {
      priceRange: { minVariantPrice: { amount: "25.95", currencyCode: "AUD" } },
      compareAtPriceRange: { minVariantPrice: { amount: "33.95" } },
      variants: { edges: [{ node: { id: "variant-1" } }] },
    };

    expect(getPrimaryVariantPricing(product)).toEqual({
      price: 25.95,
      originalPrice: 33.95,
      currency: "AUD",
      variantId: "variant-1",
    });
  });
});
