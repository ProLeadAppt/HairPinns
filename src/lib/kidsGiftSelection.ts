export interface GiftVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText?: string | null } | null;
}

export interface GiftProduct {
  id: string;
  title: string;
  handle: string;
  images?: { edges: { node: { url: string; altText?: string | null } }[] };
  variants?: { edges: { node: GiftVariant }[] };
}

export interface GiftChoice { variantId: string; quantity: number }

export type GiftCategory = "brushes" | "ponytails" | "extras";

export const giftCategory = (product: GiftProduct): GiftCategory => {
  if (/brush|detangl|comb/i.test(product.title)) return "brushes";
  if (/ponytail|pony tail|piggy tail|hair extension/i.test(product.title)) return "ponytails";
  return "extras";
};

export const sellableGiftVariants = (product: GiftProduct): GiftVariant[] =>
  (product.variants?.edges || [])
    .map(({ node }) => node)
    .filter((variant) => variant.availableForSale && Number.isFinite(Number(variant.price?.amount)));

export const orderGiftProducts = (products: GiftProduct[]): GiftProduct[] => {
  const categoryOrder: Record<GiftCategory, number> = { brushes: 0, ponytails: 1, extras: 2 };
  return products
    .filter((product) => sellableGiftVariants(product).length > 0)
    .sort((a, b) => categoryOrder[giftCategory(a)] - categoryOrder[giftCategory(b)] || a.title.localeCompare(b.title, "en-AU"));
};

export function buildGiftSelection(products: GiftProduct[], choices: Record<string, GiftChoice>) {
  const lines: { merchandiseId: string; quantity: number; attributes: { key: string; value: string }[] }[] = [];
  let subtotal = 0;
  let currency = "AUD";

  for (const product of products) {
    const choice = choices[product.id];
    if (!choice || !Number.isInteger(choice.quantity) || choice.quantity < 1) continue;
    const variant = sellableGiftVariants(product).find(({ id }) => id === choice.variantId);
    if (!variant) continue;
    lines.push({ merchandiseId: variant.id, quantity: choice.quantity, attributes: [{ key: "Gift selection", value: "DIY kids gift" }] });
    subtotal += Number(variant.price.amount) * choice.quantity;
    currency = variant.price.currencyCode || currency;
  }

  return { lines, subtotal, currency };
}
