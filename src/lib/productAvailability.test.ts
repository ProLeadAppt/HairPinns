import { describe, expect, it } from "vitest";
import { getProductAvailability } from "./productAvailability";

describe("getProductAvailability", () => {
  it("marks positive sellable inventory as in stock", () => {
    expect(getProductAvailability({ availableForSale: true, quantityAvailable: 2 })).toEqual({
      canPurchase: true,
      label: "Available online",
      schema: "InStock",
    });
  });

  it("keeps zero-inventory continue-selling variants purchasable as backorders", () => {
    expect(getProductAvailability({ availableForSale: true, quantityAvailable: 0 })).toEqual({
      canPurchase: true,
      label: "Available to order",
      schema: "BackOrder",
    });
  });

  it("blocks variants Shopify reports as unavailable", () => {
    expect(getProductAvailability({ availableForSale: false, quantityAvailable: 0 })).toEqual({
      canPurchase: false,
      label: "Sold out",
      schema: "OutOfStock",
    });
  });
});
