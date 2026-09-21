import { describe, expect, it } from "vitest";
import { generateCollectionPageSchema } from "./schema";

describe("collection listing schema", () => {
  it("lists backorder and sold-out products without creating merchant offers", () => {
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

    expect(schema.mainEntity.itemListElement.map((item: { url: string }) => item.url)).toEqual([
      "https://hairpinns.com/products/christmas-pack/",
      "https://hairpinns.com/products/unavailable-pack/",
    ]);
    expect(JSON.stringify(schema)).not.toContain('"offers"');
  });
});
