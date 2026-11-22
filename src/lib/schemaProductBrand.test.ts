import { describe, expect, it } from "vitest";
import { generateEnhancedProductSchema } from "./schema";

describe("product brand schema", () => {
  const baseProduct = {
    name: "Repair Shampoo",
    description: "Professional repair shampoo.",
    image: "https://cdn.shopify.com/product.jpg",
    price: "34.95",
    currency: "AUD",
    sku: "repair-shampoo",
    url: "https://hairpinns.com/products/repair-shampoo",
  };

  it("keeps Hair Pinns as seller without claiming its URL belongs to another manufacturer", () => {
    const schema = generateEnhancedProductSchema({ ...baseProduct, brand: "Juuce" });

    expect(schema.brand).toEqual({ "@type": "Brand", name: "Juuce" });
    expect(schema.offers.seller).toMatchObject({ name: "Hair Pinns", url: "https://hairpinns.com" });
  });

  it("links the brand entity only for Hair Pinns own-brand products", () => {
    const schema = generateEnhancedProductSchema({ ...baseProduct, brand: "Hair Pinns" });

    expect(schema.brand).toEqual({
      "@type": "Brand",
      name: "Hair Pinns",
      url: "https://hairpinns.com",
    });
  });
  it("omits an unknown brand instead of treating the retailer as manufacturer", () => {
    expect(generateEnhancedProductSchema(baseProduct)).not.toHaveProperty("brand");
  });

  it("uses a real GTIN length and leaves missing identifiers out", () => {
    const withGtin = generateEnhancedProductSchema({ ...baseProduct, gtin: "9312345678901", mpn: "MPN-1" });
    expect(withGtin.gtin13).toBe("9312345678901");
    expect(withGtin.mpn).toBe("MPN-1");
    expect(withGtin).not.toHaveProperty("gtin");

    const withoutIds = generateEnhancedProductSchema({ ...baseProduct, sku: "", gtin: "12345" });
    expect(withoutIds).not.toHaveProperty("sku");
    expect(withoutIds).not.toHaveProperty("gtin13");
    expect(withoutIds.offers.url).toBe("https://hairpinns.com/products/repair-shampoo/");
  });

  it("does not attach physical shipping details to a digital product", () => {
    const schema = generateEnhancedProductSchema({
      ...baseProduct,
      brand: "Hair Pinns",
      requiresShipping: false,
    });

    expect(schema.offers.shippingDetails).toBeUndefined();
  });
});
