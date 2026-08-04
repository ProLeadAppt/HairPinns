export type PromotionGift = {
  title: string;
  handle: string;
  verifiedUnits: number;
  retailPrice: number;
};

export type Promotion = {
  id: string;
  name: string;
  enabled: boolean;
  startsAt: string;
  endsAt: string;
  timeZone: "Australia/Sydney";
  landingPath: string;
  message: string;
  headline: string;
  body: string;
  ctaLabel: string;
  orderCap: number;
  maximumDiscountedGiftsPerOrder: number;
  orderCapEnforcedBy: "shopify-discount-usage-limit";
  giftCapEnforcedBy: "shopify-discount-uses-per-order-limit";
  qualifyingQuantity: number;
  customerMustAddGift: boolean;
  stackingAllowed: boolean;
  shippingThresholdAfterDiscounts: number;
  discountCode: string;
  eligibleProductTag: string;
  giftProductTag: string;
  gifts: PromotionGift[];
  exclusions: string[];
};

export type HeaderPromotion = {
  id: string;
  message: string;
  href: string;
};

export const DEFAULT_HEADER_PROMOTION: HeaderPromotion = {
  id: "free_shipping_150",
  message: "Free shipping on orders over $150",
  href: "/collections",
};

export const FREE_EXTRA_PROMOTION: Promotion = {
  id: "buy_two_free_extra_2026_08",
  name: "Buy two full-size products and choose a free extra",
  enabled: true,
  startsAt: "2026-08-05T09:00:00+10:00",
  endsAt: "2026-08-12T09:00:00+10:00",
  timeZone: "Australia/Sydney",
  landingPath: "/offers/free-extra",
  message: "Buy 2 full-size hair products. Pick a free Hair Pinns extra.",
  headline: "Restock two favourites. Your extra is on us.",
  body:
    "Choose any two eligible full-size hair products, then add one travel bottle, soft head towel or wide-tooth comb to your bag. Shopify takes the gift price off automatically at checkout.",
  ctaLabel: "Build my restock",
  orderCap: 200,
  maximumDiscountedGiftsPerOrder: 1,
  orderCapEnforcedBy: "shopify-discount-usage-limit",
  giftCapEnforcedBy: "shopify-discount-uses-per-order-limit",
  qualifyingQuantity: 2,
  customerMustAddGift: true,
  stackingAllowed: false,
  shippingThresholdAfterDiscounts: 150,
  discountCode: "HP-FREE-EXTRA-2026-08",
  eligibleProductTag: "promo-free-extra-eligible",
  giftProductTag: "promo-free-extra-gift",
  gifts: [
    {
      title: "Silicon travel bottles (90mL)",
      handle: "silicon-travel-bottle-duo",
      verifiedUnits: 392,
      retailPrice: 4.95,
    },
    {
      title: "Bamboo and charcoal head towel",
      handle: "soft-towel",
      verifiedUnits: 185,
      retailPrice: 9.95,
    },
    {
      title: "Purple wide-tooth comb",
      handle: "purple-wide-tooth-combs",
      verifiedUnits: 50,
      retailPrice: 4.95,
    },
  ],
  exclusions: [
    "QIQI products",
    "sale items",
    "bundles",
    "gift cards",
    "services",
    "free-extra products",
  ],
};

export function getActivePromotion(now = new Date()): Promotion | null {
  if (!FREE_EXTRA_PROMOTION.enabled) return null;
  const timestamp = now.getTime();
  const startsAt = new Date(FREE_EXTRA_PROMOTION.startsAt).getTime();
  const endsAt = new Date(FREE_EXTRA_PROMOTION.endsAt).getTime();
  return timestamp >= startsAt && timestamp < endsAt ? FREE_EXTRA_PROMOTION : null;
}

export function getHeaderPromotion(now = new Date()): HeaderPromotion {
  const activePromotion = getActivePromotion(now);
  if (!activePromotion) return DEFAULT_HEADER_PROMOTION;
  return {
    id: activePromotion.id,
    message: activePromotion.message,
    href: activePromotion.landingPath,
  };
}

export type PromotionCartLine = {
  quantity: number;
  productTags: string[];
  productHandle?: string;
};

export function getPromotionCartState(lines: PromotionCartLine[]) {
  const approvedGiftHandles = new Set(FREE_EXTRA_PROMOTION.gifts.map((gift) => gift.handle));
  const qualifyingUnits = lines.reduce(
    (sum, line) => {
      const isGift = line.productTags.includes(FREE_EXTRA_PROMOTION.giftProductTag) ||
        (Boolean(line.productHandle) && approvedGiftHandles.has(line.productHandle as string));
      return sum + (line.productTags.includes(FREE_EXTRA_PROMOTION.eligibleProductTag) && !isGift ? line.quantity : 0);
    },
    0,
  );
  const giftUnits = lines.reduce(
    (sum, line) => sum + (
      line.productTags.includes(FREE_EXTRA_PROMOTION.giftProductTag) &&
      Boolean(line.productHandle) &&
      approvedGiftHandles.has(line.productHandle as string)
        ? line.quantity
        : 0
    ),
    0,
  );
  const unapprovedGiftUnits = lines.reduce(
    (sum, line) => sum + (
      line.productTags.includes(FREE_EXTRA_PROMOTION.giftProductTag) &&
      (!line.productHandle || !approvedGiftHandles.has(line.productHandle))
        ? line.quantity
        : 0
    ),
    0,
  );
  const hasExactlyOneApprovedGift = giftUnits === FREE_EXTRA_PROMOTION.maximumDiscountedGiftsPerOrder && unapprovedGiftUnits === 0;
  const freeGiftUnits = hasExactlyOneApprovedGift ? giftUnits : 0;
  const fullPriceGiftUnits = giftUnits + unapprovedGiftUnits - freeGiftUnits;

  return {
    qualifyingUnits,
    giftUnits,
    unapprovedGiftUnits,
    freeGiftUnits,
    fullPriceGiftUnits,
    shouldApplyCode:
      qualifyingUnits >= FREE_EXTRA_PROMOTION.qualifyingQuantity &&
      hasExactlyOneApprovedGift,
  };
}

export function getCheckoutDiscountCodes({
  existingCodes,
  promotionEligible,
  now = new Date(),
}: {
  existingCodes: string[];
  promotionEligible: boolean;
  now?: Date;
}) {
  const promotionCode = FREE_EXTRA_PROMOTION.discountCode;
  const otherCodes = Array.from(
    new Set(existingCodes.filter(Boolean).filter((code) => code !== promotionCode)),
  );

  if (!getActivePromotion(now) || !promotionEligible || otherCodes.length > 0) {
    return otherCodes;
  }

  return [promotionCode];
}
