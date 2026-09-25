import { describe, expect, it } from "vitest";
import { buildGiftSelection, giftCategory, giftQuantitiesWereAdded, maxGiftQuantity, orderGiftProducts, sellableGiftVariants, type GiftCartLike, type GiftProduct } from "./kidsGiftSelection";

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

  it("never offers more than known positive stock, while permitting Shopify backorders", () => {
    const oneInStock = { ...products[0].variants!.edges[0].node, quantityAvailable: 1 };
    expect(maxGiftQuantity(oneInStock)).toBe(1);
    expect(buildGiftSelection([{ ...products[0], variants: { edges: [{ node: oneInStock }] } }], {
      p1: { variantId: "v1", quantity: 3 },
    }).lines).toEqual([]);
    expect(maxGiftQuantity({ ...oneInStock, quantityAvailable: 0 })).toBe(5);
  });

  it("keeps the browsing groups predictable", () => {
    expect(products.map(giftCategory)).toEqual(["brushes", "ponytails"]);
  });

  it("shows usable brushes and ponytails before other extras", () => {
    const extra: GiftProduct = { id: "p3", title: "Hair extra", handle: "extra", variants: { edges: [
      { node: { id: "v4", title: "Default Title", availableForSale: true, price: { amount: "8.00", currencyCode: "AUD" } } },
    ] } };
    const unavailable: GiftProduct = { id: "p4", title: "Other brush", handle: "other-brush", variants: { edges: [
      { node: { id: "v5", title: "Pink", availableForSale: false, price: { amount: "8.00", currencyCode: "AUD" } } },
    ] } };
    expect(orderGiftProducts([extra, products[1], unavailable, products[0]]).map(({ id }) => id)).toEqual(["p1", "p2", "p3"]);
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

  it("flags Shopify's silent stock adjustment instead of claiming all items were added", () => {
    const cart = (quantity: number): GiftCartLike => ({ lines: { edges: [{ node: { quantity, merchandise: { id: "v1" } } }] } });
    expect(giftQuantitiesWereAdded(null, cart(1), [{ merchandiseId: "v1", quantity: 3 }])).toBe(false);
    expect(giftQuantitiesWereAdded(cart(1), cart(2), [{ merchandiseId: "v1", quantity: 1 }])).toBe(true);
  });
});
