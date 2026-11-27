import { describe, expect, it } from "vitest";
import { SHOP_TAXONOMY } from "@/config/commerceNavigation";
import { canonicalSiteUrl } from "@/config/businessConfig";
import { collectionIndexSchema } from "./collectionIndexSchema";

describe("collection index ItemList", () => {
  it("only describes the actual user-accessible collection cards, with no duplicates", () => {
    const expected = new Set(SHOP_TAXONOMY.flatMap(group => [...group.destinations, ...(group.secondaryDestinations || [])]).map(d => canonicalSiteUrl(d.href)));
    const schema = collectionIndexSchema();
    expect(schema["@type"]).toBe("ItemList");
    expect(schema.numberOfItems).toBe(expected.size);
    expect(schema.itemListElement.map(item => item.position)).toEqual(Array.from({length: expected.size}, (_, i) => i + 1));
    expect(new Set(schema.itemListElement.map(item => item.item))).toEqual(expected);
    expect(schema.itemListElement.every(item => item.item.startsWith("https://hairpinns.com/collections/") && item.item.endsWith("/"))).toBe(true);
  });
});
