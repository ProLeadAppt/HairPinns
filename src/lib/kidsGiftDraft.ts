import type { GiftChoice } from "./kidsGiftSelection";

export const GIFT_DRAFT_KEY = "hp_kids_gift_draft_v1";
const MAX_AGE = 24 * 60 * 60 * 1000;

// Store choices only, never prices, inventory, cart IDs or customer details.
// Fresh Shopify products still validate every line before it can be added.
export function readGiftDraft(storage: Pick<Storage, "getItem">, now = Date.now()): Record<string, GiftChoice> {
  try {
    const raw = storage.getItem(GIFT_DRAFT_KEY);
    if (!raw || raw.length > 20_000) return {};
    const draft = JSON.parse(raw);
    if (draft?.version !== 1 || !Number.isFinite(draft.savedAt) || draft.savedAt > now || now - draft.savedAt > MAX_AGE) return {};
    if (!draft.choices || typeof draft.choices !== "object" || Array.isArray(draft.choices)) return {};
    const entries = Object.entries(draft.choices);
    if (entries.length > 50) return {};
    const choices: Record<string, GiftChoice> = {};
    for (const [productId, value] of entries) {
      const choice = value as Partial<GiftChoice> | null;
      if (!productId || productId.length > 200 || ["__proto__", "constructor", "prototype"].includes(productId)
        || !choice || typeof choice.variantId !== "string" || !choice.variantId || choice.variantId.length > 200
        || !Number.isInteger(choice.quantity) || choice.quantity! < 1 || choice.quantity! > 5) return {};
      choices[productId] = { variantId: choice.variantId, quantity: choice.quantity! };
    }
    return choices;
  } catch {
    return {};
  }
}

export function saveGiftDraft(storage: Pick<Storage, "setItem" | "removeItem">, choices: Record<string, GiftChoice>, now = Date.now()): void {
  try {
    if (Object.keys(choices).length) storage.setItem(GIFT_DRAFT_KEY, JSON.stringify({ version: 1, savedAt: now, choices }));
    else storage.removeItem(GIFT_DRAFT_KEY);
  } catch {
    // Restricted storage must never prevent shoppers from choosing products.
  }
}
