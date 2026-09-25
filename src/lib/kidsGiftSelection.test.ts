import { describe, expect, it } from "vitest";
import { buildGiftSelection, giftCategory, sellableGiftVariants, type GiftProduct } from "./kidsGiftSelection";

const products: GiftProduct[] = [
  { id: "p1", title: "Brush", handle: "brush", variants: { edges: [
    { node: { id: "v1", title: "Purple", availableForSale: true, price: { amount: "19.95", currencyCode: "AUD" } } },
    { node: { id: "v2", title: "Pink", availableForSale: false, price: { amount: "19.95", currencyCode: "AUD" } } },
  ] } },
  { id: "p2", title: "Ponytail", handle: "ponytail", variants: { edges: [
    { node: { id: "v3", title: "Blue", availableForSale: true, price: { amount: "12.00", currencyCode: "AUD" } } },
  ] } },
];

describe("kids gift selection", () => {
  it("offers only sellable Shopify variants", () => {
    expect(sellableGiftVariants(products[0]).map(({ id }) => id)).toEqual(["v1"]);
  });

  it("keeps the browsing groups predictable", () => {
    expect(products.map(giftCategory)).toEqual(["brushes", "ponytails"]);
  });

  it("adds exact selected variants and quantities without browser-calculated discounts", () => {
    expect(buildGiftSelection(products, {
      p1: { variantId: "v1", quantity: 2 },
      p2: { variantId: "v3", quantity: 1 },
    })).toEqual({
      lines: [
        { merchandiseId: "v1", quantity: 2, attributes: [{ key: "Gift selection", value: "DIY kids gift" }] },
        { merchandiseId: "v3", quantity: 1, attributes: [{ key: "Gift selection", value: "DIY kids gift" }] },
      ],
      subtotal: 51.9,
      currency: "AUD",
    });
  });

  it("does not send unavailable, stale or invalid selections to checkout", () => {
    expect(buildGiftSelection(products, {
      p1: { variantId: "v2", quantity: 1 },
      p2: { variantId: "v3", quantity: 0 },
    }).lines).toEqual([]);
  });
});
