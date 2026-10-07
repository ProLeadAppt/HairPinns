import { describe, expect, it } from "vitest";
import { GIFT_DRAFT_KEY, readGiftDraft, saveGiftDraft } from "./kidsGiftDraft";
import { buildGiftSelection } from "./kidsGiftSelection";
const now = 100_000_000;
const choices = { brush: { variantId: "variant-1", quantity: 2 } };
const load = (value: unknown) => readGiftDraft({ getItem: () => JSON.stringify(value) }, now);
const draft = { version: 1, savedAt: now, choices };

describe("tab-local gift draft", () => {
  it("round-trips only choices and removes an empty draft", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
    saveGiftDraft(storage, choices, now);
    expect(readGiftDraft(storage, now)).toEqual(choices);
    expect(JSON.parse(values.get(GIFT_DRAFT_KEY)!)).toEqual(draft);
    saveGiftDraft(storage, {}, now);
    expect(values.size).toBe(0);
  });
  it("ignores expired, future and unrecognised drafts", () => {
    for (const invalid of [{ ...draft, savedAt: now - 86_400_001 }, { ...draft, savedAt: now + 1 }, { ...draft, savedAt: "today" }, { ...draft, version: 2 }, { ...draft, choices: [] }]) expect(load(invalid)).toEqual({});
  });
  it("rejects malformed or excessive quantities and payloads", () => {
    for (const quantity of [0, -1, 6, 1.5, "2", null]) expect(load({ ...draft, choices: { brush: { variantId: "v", quantity } } })).toEqual({});
    expect(load({ ...draft, choices: Object.fromEntries(Array.from({ length: 51 }, (_, i) => [String(i), choices.brush])) })).toEqual({});
    expect(readGiftDraft({ getItem: () => "not JSON" }, now)).toEqual({});
    expect(readGiftDraft({ getItem: () => "x".repeat(20_001) }, now)).toEqual({});
    expect(load({ ...draft, choices: JSON.parse('{"__proto__":{"variantId":"v","quantity":1}}') })).toEqual({});
  });
  it("fails safely when browser storage is unavailable", () => {
    const fail = () => { throw new Error("Storage blocked"); };
    expect(readGiftDraft({ getItem: fail })).toEqual({});
    expect(() => saveGiftDraft({ setItem: fail, removeItem: fail }, choices)).not.toThrow();
    expect(() => saveGiftDraft({ setItem: fail, removeItem: fail }, {})).not.toThrow();
  });
  it("does not trust saved inventory or prices when building lines", () => {
    const restored = load(draft);
    const product = { id: "brush", title: "Brush", handle: "brush", variants: { edges: [{ node: { id: "variant-1", title: "Blue", availableForSale: true, quantityAvailable: 2, price: { amount: "19.95", currencyCode: "AUD" } } }] } };
    expect(buildGiftSelection([product], restored).subtotal).toBe(39.9);
    product.variants.edges[0].node.quantityAvailable = 1;
    expect(buildGiftSelection([product], restored).lines).toEqual([]);
    product.variants.edges[0].node.availableForSale = false;
    expect(buildGiftSelection([product], restored).lines).toEqual([]);
    expect(buildGiftSelection([], restored).lines).toEqual([]);
  });
});
