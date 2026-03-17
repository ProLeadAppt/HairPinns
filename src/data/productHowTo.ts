/**
 * Product-specific HowTo schema for AEO (Answer Engine Optimization)
 * Maps product handles to usage instructions for treatments, masks, and pre-wash products
 */

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface ProductHowToData {
  name: string;
  description: string;
  step: HowToStep[];
  supply?: string[];
}

/** Product handle to HowTo mapping — add more as needed */
export const PRODUCT_HOWTO: Record<string, ProductHowToData> = {
  "walnut-scrub-hair-scalp-pre-wash-treatment": {
    name: "How to Use Pure Walnut Scrub Hair & Scalp Pre-Wash Treatment",
    description: "A gentle scalp exfoliant that refreshes and clarifies. Use before shampooing for best results.",
    step: [
      { name: "Apply to damp hair", text: "Apply the Walnut Scrub to damp hair, focusing on the scalp area." },
      { name: "Massage gently", text: "Massage gently into the scalp using circular motions for 1-2 minutes." },
      { name: "Rinse", text: "Rinse thoroughly with water." },
      { name: "Follow with shampoo", text: "Follow with your usual Pure shampoo and conditioner. Use once a week for best results." },
    ],
    supply: ["Pure Walnut Scrub", "Shampoo", "Conditioner"],
  },
  "juuce-bond-repair-mask": {
    name: "How to Use Juuce Bond Repair Mask",
    description: "A bond-building hair mask that repairs damage from heat, colour, and chemical processing.",
    step: [
      { name: "Shampoo first", text: "Shampoo your hair as usual and gently squeeze out excess water." },
      { name: "Apply mask", text: "Apply the Bond Repair Mask from mid-lengths to ends. Avoid roots if hair is oily." },
      { name: "Leave in", text: "Leave on for 5-10 minutes. For deeper repair, leave up to 15 minutes." },
      { name: "Rinse", text: "Rinse thoroughly with lukewarm water. Follow with conditioner if desired." },
    ],
    supply: ["Juuce Bond Repair Mask", "Shampoo"],
  },
  "pure-precious-ends": {
    name: "How to Use Pure Precious Ends",
    description: "A leave-in treatment for dry, damaged ends. Adds moisture and shine without weighing hair down.",
    step: [
      { name: "Apply to damp or dry ends", text: "Apply a small amount to damp or dry hair, focusing on mid-lengths and ends." },
      { name: "Avoid roots", text: "Avoid applying to roots to prevent greasiness." },
      { name: "Style as usual", text: "Style your hair as usual. No need to rinse. Can be used daily." },
    ],
    supply: ["Pure Precious Ends"],
  },
  "solar-enz": {
    name: "How to Use Juuce Solar Enz",
    description: "A UV and environmental stress defense serum that protects hair from sun, saltwater, chlorine, and thermal heat.",
    step: [
      { name: "Apply to damp or towel-dried hair", text: "Apply Solar Enz to damp or towel-dried hair before styling or going outdoors." },
      { name: "Focus on mid-lengths and ends", text: "Concentrate on mid-lengths and ends. Avoid roots if hair is fine or oily." },
      { name: "Style as usual", text: "Blow-dry or style as usual. No need to rinse. Reapply before swimming or extended sun exposure." },
    ],
    supply: ["Juuce Solar Enz"],
  },
  "heat-shield": {
    name: "How to Use Juuce Heat Shield",
    description: "A weightless thermal shield that protects hair from heat styling up to 230°C.",
    step: [
      { name: "Apply to damp hair", text: "Apply Heat Shield to damp, towel-dried hair before blow-drying or heat styling." },
      { name: "Distribute evenly", text: "Spray or apply evenly through mid-lengths and ends. Comb through for even coverage." },
      { name: "Style with heat", text: "Proceed with blow-drying, straightening, or curling. The shield protects against heat damage." },
    ],
    supply: ["Juuce Heat Shield"],
  },
  "dry-heat-guard": {
    name: "How to Use Juuce Dry Heat Guard",
    description: "A thermal protector for dry styling. Use before straightening, curling, or re-styling between washes.",
    step: [
      { name: "Apply to dry hair", text: "Apply Dry Heat Guard to dry hair before using hot tools." },
      { name: "Spray or mist evenly", text: "Spray lightly through hair, focusing on areas you'll heat style." },
      { name: "Style with heat", text: "Use your straightener, curling iron, or hot brush. Protects against heat stress on dry hair." },
    ],
    supply: ["Juuce Dry Heat Guard"],
  },
};

/**
 * Get HowTo data for a product by handle
 */
export function getProductHowTo(productHandle: string | undefined, productTitle: string): ProductHowToData | null {
  if (!productHandle) return null;
  const normalized = productHandle.toLowerCase().trim();
  return PRODUCT_HOWTO[normalized] ?? null;
}
