import { describe, expect, it } from "vitest";
import { generateCollectionPageSchema } from "./schema";

describe("collection product availability schema", () => {
  it("preserves backorder and sold-out states in collection offers", () => {
    const schema = generateCollectionPageSchema({
      name: "Bundles & Gifts",
      description: "Gift packs selected by Hair Pinns.",
      url: "https://hairpinns.com/collections/haircare-bundles-gift-sets/",
      items: [
        {
          name: "Christmas Pack",
          description: "Available to order.",
          url: "https://hairpinns.com/products/christmas-pack/",
          price: "89.90",
          availability: "BackOrder",
        },
        {
          name: "Unavailable Pack",
          description: "Currently unavailable.",
          url: "https://hairpinns.com/products/unavailable-pack/",
          price: "69.95",
          availability: "OutOfStock",
        },
      ],
    });

    expect(schema.mainEntity.itemListElement[0].item.offers.availability).toBe(
      "https://schema.org/BackOrder",
    );
    expect(schema.mainEntity.itemListElement[1].item.offers.availability).toBe(
      "https://schema.org/OutOfStock",
    );
  });
});
