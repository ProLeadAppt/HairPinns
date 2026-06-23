/**
 * Jena's Daily Trio — curated 3-product bundle
 *
 * 1 shampoo + 1 conditioner + 1 leave-in treatment that covers 90% of
 * hair types Jena works with in the chair. Used by the dedicated
 * /collections/jenas-daily-trio page.
 *
 * Pricing/discount is calculated at render time using live Shopify data.
 * Hard-coded 10% bundle saving here is the marketing promise — the
 * cart line-item total will still be the sum of the 3 products until
 * Shopify-side discount codes are added.
 */

export interface TrioProduct {
  /** Shopify product handle, used to fetch live data via getProductByHandle */
  handle: string;
  /** Slot in the trio — drives badge label + ordering */
  slot: "shampoo" | "conditioner" | "treatment";
  /** Short badge label, 2-3 words */
  badge: string;
  /** One-line Jena pitch for this product in the bundle */
  pitch: string;
  /** Icon to render next to the product name */
  icon: "🧴" | "💧" | "✨";
  /**
   * Curated fallback image (path under /public). Used only if Shopify
   * returns no image for this handle — which Jena flagged was happening
   * for the trio in mid-2026. The branded slot-coloured SVGs under
   * /assets/images/trio/ are the final fallback if this is empty.
   */
  fallbackImage?: string;
}

export interface JenasDailyTrio {
  /** URL-safe id used in routes/anchors */
  id: "jenas-daily-trio";
  name: "Jena's Daily Trio";
  /** Pre-headline eyebrow text */
  eyebrow: string;
  /** Hero headline */
  headline: string;
  /** Sub-headline below hero */
  subheadline: string;
  /** Jena's story for the page */
  jenaStory: string;
  /** Bundle promise, shown in the savings badge */
  bundlePromise: string;
  /** 3 products in order */
  products: TrioProduct[];
  /** FAQ items rendered on the page + FAQPage schema */
  faqItems: { question: string; answer: string }[];
}

export const JENAS_DAILY_TRIO: JenasDailyTrio = {
  id: "jenas-daily-trio",
  name: "Jena's Daily Trio",
  eyebrow: "Curated by Jena",
  headline: "Three products. One routine.",
  subheadline:
    "The shampoo, conditioner and leave-in Jena uses on most Bangor clients — bundled at 10% off.",
  jenaStory:
    "If you've sat in my chair, you've probably left with at least one of these. The questions are always the same: what should I actually use at home, and what do you use on me. One wash, one condition, one leave-in — the routine for most of the heads in my chair.",
  bundlePromise: "Bundle saves you 10% — applied at checkout",
  products: [
    {
      handle: "juuce-bond-repair-shampoo",
      slot: "shampoo",
      badge: "The Wash",
      icon: "🧴",
      pitch:
        "Bond repair from the first wash. Safe on colour, gentle on the scalp, strong on the kind of damage the Aussie sun leaves behind.",
      // Curated fallback for when Shopify returns no image for this handle.
      fallbackImage: "/assets/images/trio/wash.svg",
    },
    {
      handle: "aromaganic-smooth-hair-super-silky-conditioner",
      slot: "conditioner",
      badge: "The Condition",
      icon: "💧",
      pitch:
        "Detangles in one pass and leaves a finish you can actually run your fingers through. No silicones that weigh fine hair down.",
      fallbackImage: "/assets/images/trio/condition.svg",
    },
    {
      handle: "qiqi-bare-repair-oil",
      slot: "treatment",
      badge: "The Leave-In",
      icon: "✨",
      pitch:
        "The one I'd never skip. Heat protection, frizz control, and a soft hold — three jobs in one bottle, zero crunch.",
      fallbackImage: "/assets/images/trio/treatment.svg",
    },
  ],
  faqItems: [
    {
      question: "Will the trio work for my hair type?",
      answer: "Yes — the trio is built around colour-treated, sun-exposed, and heat-styled hair, which covers most of what sits in the Bangor chair. If your hair is very fine and oil-prone, swap the conditioner for the Aromaganic Pumpd. If it's very curly, swap to the Aromaganic Curly Curl conditioner.",
    },
    {
      question: "How do I use the trio?",
      answer: "Wash twice with the shampoo (first wash lifts build-up, second wash actually cleans). Condition mid-lengths to ends, leave for 60 seconds, rinse. On towel-dried hair, work a small amount of the leave-in through the ends and style as usual.",
    },
    {
      question: "Is the 10% saving applied automatically?",
      answer: "Yes. The trio price you see on this page already includes the 10% bundle saving. Add all three to your bag and checkout — the saving is calculated against the sum of the three individual prices.",
    },
    {
      question: "What if one product doesn't work for me?",
      answer: "Hair Pinns has a 14-day return window on all unopened products. If you've tried a product and it genuinely doesn't suit your hair, contact us and we'll swap it for a closer match from the shelf — no charge for the swap.",
    },
    {
      question: "Can I book a colour or cut with Jena too?",
      answer: "Yes — use the Book Now button. Online booking runs through Fresha. Most clients book a blow-dry six weeks after starting the trio so I can see how the routine is landing on their hair.",
    },
  ],
};
