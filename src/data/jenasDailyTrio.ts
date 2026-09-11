/**
 * Jena's Daily Trio is intentionally paused until the replacement Shopify
 * bundle exists. No product, price, saving or availability may be inferred
 * by the website while this status is "awaiting-update".
 */
export const JENAS_DAILY_TRIO = {
  id: "jenas-daily-trio",
  status: "awaiting-update" as const,
  name: "Jena's Daily Trio",
  eyebrow: "Jena's shelf / Routine update",
  headline: "A better daily trio is coming.",
  subheadline:
    "Jena is refreshing her three-step routine. We’ll reopen the trio when the exact products, bundle price and availability have been verified.",
  supportingCopy:
    "In the meantime, browse the full haircare shelf or book with Jena for advice tailored to your hair.",
};

export const JENAS_DAILY_TRIO_REQUEST_FOR_JENA =
  "Hi Jena, I’ve temporarily paused the Daily Trio so the website doesn’t show an unverified saving. Please send me the exact Shopify links for the shampoo, conditioner and leave-in you want in the updated trio. Once I have those, I’ll verify the individual prices and stock, create the fixed bundle with the agreed saving, and send you the final page and checkout for approval.";
