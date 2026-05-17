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

  // === Pure Lamellar Vitality range — Jena's #1 recommendation ===
  "lamellar-vitality-glass-hair-treatment": {
    name: "How to Use Pure Lamellar Vitality Glass Hair Treatment",
    description: "A 30-second in-shower lamellar treatment that coats every strand for instant glass-like shine. Use weekly or after every chemical service.",
    step: [
      { name: "Shampoo first", text: "Wash with Lamellar Vitality Shampoo (or another sulphate-free shampoo) and rinse." },
      { name: "Squeeze out excess water", text: "Gently squeeze water from hair — the treatment binds better to damp, not soaking-wet, hair." },
      { name: "Apply through lengths", text: "Distribute evenly through mid-lengths and ends. Comb through with fingers or a wide-tooth comb." },
      { name: "Rinse after 30 seconds", text: "Leave for 30 seconds, then rinse with lukewarm water. Style as usual." },
    ],
    supply: ["Pure Lamellar Vitality Glass Hair Treatment"],
  },
  "lamellar-vitality-shampoo": {
    name: "How to Use Pure Lamellar Vitality Shampoo",
    description: "A sulphate-free shampoo formulated to layer with the Lamellar Vitality range. Gentle enough for daily use on chemically-treated hair.",
    step: [
      { name: "Wet hair thoroughly", text: "Saturate hair with lukewarm water — hot water strips natural oils and colour." },
      { name: "Apply and lather", text: "Apply a small amount to the scalp and massage gently for 30 seconds. A little goes a long way." },
      { name: "Rinse fully", text: "Rinse for at least 30 seconds — sulphate-free formulas leave more residue if under-rinsed." },
      { name: "Follow with treatment", text: "Follow with Lamellar Vitality Conditioner or Glass Hair Treatment for best results." },
    ],
    supply: ["Pure Lamellar Vitality Shampoo"],
  },
  "lamellar-vitality-conditioner": {
    name: "How to Use Pure Lamellar Vitality Conditioner",
    description: "A daily conditioner from the Lamellar Vitality range. Restores softness and slip without weighing hair down.",
    step: [
      { name: "Shampoo and squeeze out water", text: "After shampooing, squeeze out excess water so the conditioner can absorb." },
      { name: "Apply mid-length to ends", text: "Apply a small amount through mid-lengths and ends. Avoid roots if hair is fine." },
      { name: "Leave 2-3 minutes", text: "Leave on for 2-3 minutes while you finish your shower." },
      { name: "Rinse with cool water", text: "Rinse with cool water to seal the cuticle and add shine." },
    ],
    supply: ["Pure Lamellar Vitality Conditioner"],
  },
  "lamellar-vitality-luminous-leave-in-silky-foam": {
    name: "How to Use Pure Lamellar Vitality Luminous Leave-In Silky Foam",
    description: "A leave-in foam that adds smoothness, heat protection, and shine in one step. Apply to damp hair before styling.",
    step: [
      { name: "Shake well", text: "Shake the can well before each use." },
      { name: "Dispense a small amount", text: "Dispense a golf-ball-sized amount of foam into your palm." },
      { name: "Apply through damp hair", text: "Work evenly through damp, towel-dried hair from mid-lengths to ends. Do not rinse." },
      { name: "Style as usual", text: "Blow-dry, air-dry, or heat style as normal. The foam protects against heat up to 230°C." },
    ],
    supply: ["Pure Lamellar Vitality Luminous Leave-In Silky Foam"],
  },
  "lamellar-vitality-butter-mask-treatment": {
    name: "How to Use Pure Lamellar Vitality Butter Mask Treatment",
    description: "A rich weekly butter mask for very dry, damaged or chemically-treated hair. Restores deep moisture in one application.",
    step: [
      { name: "Shampoo first", text: "Wash with a sulphate-free shampoo and squeeze out excess water." },
      { name: "Apply generously to lengths", text: "Apply a generous amount through mid-lengths and ends, focusing on the most damaged sections." },
      { name: "Comb through", text: "Comb with a wide-tooth comb to distribute evenly and detangle." },
      { name: "Leave 5-10 minutes", text: "Leave for 5-10 minutes (up to 20 for very damaged hair). Add heat with a steamer or warm towel for a deeper treatment." },
      { name: "Rinse thoroughly", text: "Rinse with lukewarm water. Style as usual. Use once a week." },
    ],
    supply: ["Pure Lamellar Vitality Butter Mask Treatment"],
  },

  // === Juuce picks — Jena's top sellers ===
  "juuce-botanic-oil-serum": {
    name: "How to Use Juuce Botanic Oil Serum",
    description: "A lightweight finishing oil that adds shine and seals frizz without weighing fine hair down. Jena's go-to for daily styling.",
    step: [
      { name: "Dispense a small amount", text: "Place 1-2 drops in your palm and rub hands together. Less is more — too much weighs hair down." },
      { name: "Apply to damp or dry ends", text: "Smooth through mid-lengths and ends. Avoid the roots." },
      { name: "Style as usual", text: "Blow-dry, air-dry or style as normal. No need to rinse. Reapply a single drop on dry hair to refresh shine." },
    ],
    supply: ["Juuce Botanic Oil Serum"],
  },
  "juuce-miracle-smooth-shampoo": {
    name: "How to Use Juuce Miracle Smooth Shampoo",
    description: "A smoothing shampoo for frizz-prone, coloured, or chemically-treated hair. Sulphate-free and safe with smoothing treatments.",
    step: [
      { name: "Wet hair with lukewarm water", text: "Wet hair fully — never use hot water, especially after a smoothing treatment." },
      { name: "Lather at the scalp", text: "Apply a small amount to the scalp and massage gently. The lather will carry through the lengths as you rinse." },
      { name: "Rinse fully", text: "Rinse for at least 30 seconds. Repeat if hair is heavily product-laden." },
      { name: "Follow with conditioner", text: "Follow with Juuce Miracle Smooth Conditioner for the full smoothing system." },
    ],
    supply: ["Juuce Miracle Smooth Shampoo"],
  },
  "juuce-miracle-smooth-conditioner": {
    name: "How to Use Juuce Miracle Smooth Conditioner",
    description: "A smoothing, frizz-control conditioner that pairs with the Miracle Smooth Shampoo. Safe for smoothed and coloured hair.",
    step: [
      { name: "Squeeze out excess water", text: "After shampooing, squeeze out water so conditioner can absorb properly." },
      { name: "Apply through mid-lengths and ends", text: "Distribute through mid-lengths and ends. Comb through with fingers for even coverage." },
      { name: "Leave 2-5 minutes", text: "Leave for 2-5 minutes — longer for drier or more processed hair." },
      { name: "Rinse with cool water", text: "Rinse with cool water to seal the cuticle and lock in smoothness." },
    ],
    supply: ["Juuce Miracle Smooth Conditioner"],
  },
  "juuce-super-soft-hydration-moisture-mask": {
    name: "How to Use Juuce Super Soft Hydration Moisture Mask",
    description: "A best-selling deep-hydration mask for dry, thirsty, or chemically-treated hair. Restores softness and bounce in one application.",
    step: [
      { name: "Shampoo first", text: "Wash hair with a sulphate-free shampoo and squeeze out excess water." },
      { name: "Apply mask generously", text: "Apply a generous amount from mid-lengths to ends. Avoid roots if your scalp is oily." },
      { name: "Comb through", text: "Comb through with a wide-tooth comb to distribute evenly." },
      { name: "Leave 5-10 minutes", text: "Leave for 5-10 minutes — apply a warm towel for a deeper, salon-style treatment." },
      { name: "Rinse and style", text: "Rinse thoroughly. Use once a week — twice for very dry hair." },
    ],
    supply: ["Juuce Super Soft Hydration Moisture Mask"],
  },

  // === Pure Forever Blonde — toning duo ===
  "pure-forever-blonde-shampoo": {
    name: "How to Use Pure Forever Blonde Shampoo",
    description: "A sulphate-free, violet-toning shampoo that neutralises brassiness and yellow tones in blonde, silver, or grey hair.",
    step: [
      { name: "Wet hair with lukewarm water", text: "Saturate hair completely before applying — concentrated toning shampoos work best on wet hair." },
      { name: "Apply and leave for 3-5 minutes", text: "Lather through hair and leave for 3-5 minutes. Longer dwell time deposits more violet pigment." },
      { name: "Rinse and check", text: "Rinse thoroughly. If hair still looks warm, repeat with a 2-minute dwell. Use once or twice a week." },
      { name: "Follow with conditioner", text: "Always follow with Pure Forever Blonde Conditioner — violet shampoos can be slightly drying without it." },
    ],
    supply: ["Pure Forever Blonde Shampoo"],
  },
  "pure-forever-blonde-conditioner": {
    name: "How to Use Pure Forever Blonde Conditioner",
    description: "A toning conditioner that pairs with Forever Blonde Shampoo to neutralise warmth and add moisture to blonde hair.",
    step: [
      { name: "Squeeze out excess water", text: "After shampooing, squeeze out water so the conditioner absorbs properly." },
      { name: "Apply mid-length to ends", text: "Apply through mid-lengths and ends. Avoid roots if blonde is freshly applied at the root." },
      { name: "Leave 2-3 minutes", text: "Leave on for 2-3 minutes for moisture, up to 5 minutes for stronger toning." },
      { name: "Rinse with cool water", text: "Rinse with cool water for maximum shine and to seal the cuticle." },
    ],
    supply: ["Pure Forever Blonde Conditioner"],
  },

  // === Wet Brush detanglers ===
  "wet-brush-original-detangler": {
    name: "How to Use the Wet Brush Original Detangler",
    description: "The original Wet Brush — gentle, flexible IntelliFlex bristles glide through tangles in wet or dry hair without breakage.",
    step: [
      { name: "Apply leave-in or conditioner", text: "Spray a leave-in conditioner or detangling spray through wet hair for extra slip." },
      { name: "Start at the ends", text: "Brush from the ends first, working up in small sections. Never start at the roots — you'll force tangles down." },
      { name: "Move up to the roots", text: "Once the ends are smooth, brush from the scalp through to the ends in long strokes." },
      { name: "Use daily", text: "Safe on wet or dry hair. Suitable for adults, kids, extensions, and chemically-treated hair." },
    ],
    supply: ["Wet Brush Original Detangler"],
  },
  "wet-brush-kids-detangler": {
    name: "How to Use the Wet Brush Kids Detangler",
    description: "A gentle detangling brush designed for children's softer, finer hair. Removes tangles without pulling, pain, or tears.",
    step: [
      { name: "Spray with detangler", text: "Spray a kids' detangling mist or light leave-in through damp hair to add slip." },
      { name: "Start at the ends", text: "Hold a small section near the ends and brush gently. Work up in small sections." },
      { name: "Move up to the roots", text: "Once ends are smooth, brush from the scalp down in long, gentle strokes." },
      { name: "Daily use", text: "Use morning and night for tangle-free hair. The flexible bristles are gentle enough for daily use on fine kid hair." },
    ],
    supply: ["Wet Brush Kids Detangler"],
  },
  "wet-brush-pro-flex-dry": {
    name: "How to Use the Wet Brush Pro Flex Dry",
    description: "A vented Wet Brush designed for blow-drying — flexible bristles glide through wet hair while the vents let heat circulate for faster drying.",
    step: [
      { name: "Towel-dry and apply heat protectant", text: "Squeeze excess water from hair and apply a heat protectant like Juuce Heat Shield." },
      { name: "Section your hair", text: "Section hair into 2-4 sections for even drying — clip back what you're not working on." },
      { name: "Brush and dry section by section", text: "Hold the dryer nozzle pointing down the hair shaft. Brush through each section as you dry, working from roots to ends." },
      { name: "Finish with cool air", text: "Once dry, switch to the cool setting to seal the cuticle and lock in shine." },
    ],
    supply: ["Wet Brush Pro Flex Dry", "Heat protectant", "Blow-dryer"],
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
