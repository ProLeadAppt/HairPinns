import { describe, expect, it } from "vitest";
import {
  DEFAULT_HEADER_PROMOTION,
  FREE_EXTRA_PROMOTION,
  getActivePromotion,
  getCheckoutDiscountCodes,
  getHeaderPromotion,
  getPromotionCartState,
} from "./promotions";

describe("free-extra promotion configuration", () => {
  it("defines one auditable offer with the approved gift pool and safety limits", () => {
    expect(FREE_EXTRA_PROMOTION).toMatchObject({
      id: "buy_two_free_extra_2026_08",
      enabled: true,
      landingPath: "/offers/free-extra",
      orderCap: 200,
      maximumDiscountedGiftsPerOrder: 1,
      orderCapEnforcedBy: "shopify-discount-usage-limit",
      giftCapEnforcedBy: "shopify-discount-uses-per-order-limit",
      qualifyingQuantity: 2,
      customerMustAddGift: true,
      stackingAllowed: false,
      shippingThresholdAfterDiscounts: 150,
    });

    expect(FREE_EXTRA_PROMOTION.gifts).toEqual([
      expect.objectContaining({ handle: "silicon-travel-bottle-duo", verifiedUnits: 392 }),
      expect.objectContaining({ handle: "soft-towel", verifiedUnits: 185 }),
      expect.objectContaining({ handle: "purple-wide-tooth-combs", verifiedUnits: 50 }),
    ]);
    expect(FREE_EXTRA_PROMOTION.gifts.reduce((sum, gift) => sum + gift.verifiedUnits, 0)).toBe(627);
  });

  it("is active only inside the Sydney launch window", () => {
    expect(getActivePromotion(new Date("2026-08-05T08:59:59+10:00"))).toBeNull();
    expect(getActivePromotion(new Date("2026-08-05T09:00:00+10:00"))?.id).toBe(FREE_EXTRA_PROMOTION.id);
    expect(getActivePromotion(new Date("2026-08-12T08:59:59+10:00"))?.id).toBe(FREE_EXTRA_PROMOTION.id);
    expect(getActivePromotion(new Date("2026-08-12T09:00:00+10:00"))).toBeNull();
  });

  it("falls back to the evergreen shipping message outside the campaign window", () => {
    expect(getHeaderPromotion(new Date("2026-08-12T09:00:00+10:00"))).toEqual(DEFAULT_HEADER_PROMOTION);
    expect(DEFAULT_HEADER_PROMOTION).toMatchObject({
      id: "free_shipping_150",
      message: "Free shipping on orders over $150",
      href: "/collections",
    });
  });
});

describe("free-extra cart qualification", () => {
  it("applies only when two eligible units and one gift are present", () => {
    expect(
      getPromotionCartState([
        { quantity: 2, productTags: ["promo-free-extra-eligible"] },
        { quantity: 1, productTags: ["promo-free-extra-gift"], productHandle: "soft-towel" },
      ]),
    ).toEqual({
      qualifyingUnits: 2,
      giftUnits: 1,
      unapprovedGiftUnits: 0,
      freeGiftUnits: 1,
      fullPriceGiftUnits: 0,
      shouldApplyCode: true,
    });
  });

  it("does not apply the offer when more than one gift unit is present", () => {
    expect(
      getPromotionCartState([
        { quantity: 2, productTags: ["promo-free-extra-eligible"] },
        { quantity: 2, productTags: ["promo-free-extra-gift"], productHandle: "soft-towel" },
      ]),
    ).toEqual({
      qualifyingUnits: 2,
      giftUnits: 2,
      unapprovedGiftUnits: 0,
      freeGiftUnits: 0,
      fullPriceGiftUnits: 2,
      shouldApplyCode: false,
    });
  });

  it("restricts gifts to the three explicitly approved product handles", () => {
    expect(
      getPromotionCartState([
        { quantity: 2, productTags: ["promo-free-extra-eligible"] },
        { quantity: 1, productTags: ["promo-free-extra-gift"], productHandle: "not-an-approved-gift" },
      ]),
    ).toEqual({
      qualifyingUnits: 2,
      giftUnits: 0,
      unapprovedGiftUnits: 1,
      freeGiftUnits: 0,
      fullPriceGiftUnits: 1,
      shouldApplyCode: false,
    });
  });

  it("never counts an approved gift as a qualifying product, even with a stale eligible tag", () => {
    expect(
      getPromotionCartState([
        { quantity: 1, productTags: ["promo-free-extra-eligible"] },
        {
          quantity: 1,
          productTags: ["promo-free-extra-eligible", "promo-free-extra-gift"],
          productHandle: "soft-towel",
        },
      ]),
    ).toMatchObject({
      qualifyingUnits: 1,
      giftUnits: 1,
      shouldApplyCode: false,
    });
  });

  it("does not attach the code to an incomplete or ineligible cart", () => {
    expect(
      getPromotionCartState([
        { quantity: 2, productTags: ["sale"] },
        { quantity: 1, productTags: ["promo-free-extra-gift"], productHandle: "soft-towel" },
      ]).shouldApplyCode,
    ).toBe(false);
    expect(
      getPromotionCartState([{ quantity: 2, productTags: ["promo-free-extra-eligible"] }]).shouldApplyCode,
    ).toBe(false);
  });
});

describe("promotion checkout discount preservation", () => {
  const activeNow = new Date("2026-08-05T10:00:00+10:00");
  const expiredNow = new Date("2026-08-12T09:00:00+10:00");

  it("applies the promotion only to an eligible cart without a competing code", () => {
    expect(getCheckoutDiscountCodes({ existingCodes: [], promotionEligible: true, now: activeNow })).toEqual([
      FREE_EXTRA_PROMOTION.discountCode,
    ]);
  });

  it("preserves a customer's existing code instead of replacing it", () => {
    expect(
      getCheckoutDiscountCodes({
        existingCodes: [FREE_EXTRA_PROMOTION.discountCode, "CUSTOMER10"],
        promotionEligible: true,
        now: activeNow,
      }),
    ).toEqual(["CUSTOMER10"]);
  });

  it("removes the temporary code when the cart stops qualifying or the offer expires", () => {
    expect(
      getCheckoutDiscountCodes({
        existingCodes: [FREE_EXTRA_PROMOTION.discountCode],
        promotionEligible: false,
        now: activeNow,
      }),
    ).toEqual([]);
    expect(
      getCheckoutDiscountCodes({
        existingCodes: [FREE_EXTRA_PROMOTION.discountCode],
        promotionEligible: true,
        now: expiredNow,
      }),
    ).toEqual([]);
  });
});
