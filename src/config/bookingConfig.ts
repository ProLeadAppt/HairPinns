/**
 * Single source of truth for booking CTA
 * Update these constants to change booking link and label across the entire app
 */

export const BOOK_CTA_LABEL = "Book now";
// Booking URL (no parameters) - should go directly to booking page
export const BOOK_URL = "https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb";
// Review URL (with ?reviews=true parameter) - should go to reviews page
export const FRESHA_REVIEWS_URL = "https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb?reviews=true";

/**
 * Track booking CTA click event.
 * Fires a GA4 "begin_booking" event for conversion tracking AND sends to
 * Zapier for CRM attribution (no PII in either).
 */
/**
 * Track promo banner / sitewide offer CTA click.
 * Fires a GA4 "promo_click" event with offer ID for attribution,
 * AND sends to Zapier for CRM/offers reporting (no PII).
 *
 * Use for any sitewide promo: shampoo+conditioner, stocktake, brand-specific.
 * placement examples: "shampoo_conditioner_promo", "header_promo_strip",
 * "homepage_promo_banner", "stocktake_banner"
 */
export const trackPromoClick = async (placement: string, source_page: string) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "promo_click", {
      placement,
      source_page,
      offer: "shampoo_conditioner_50_off",
    });
  }

  try {
    const hpCaptureModule = await import("@/lib/hpCapture");
    const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
    await hpCapture.trackEvent("promo_click", {
      placement,
      source_page,
      offer: "shampoo_conditioner_50_off",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Promo] Failed to track promo_click:", error);
  }
};

export const trackBookingClick = async (placement: string, source_page: string) => {
  // GA4 event — runs synchronously, used as a conversion in GA4 admin
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "begin_booking", {
      placement,
      source_page,
    });
  }

  // Zapier / CRM event
  try {
    const hpCaptureModule = await import("@/lib/hpCapture");
    const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
    await hpCapture.trackEvent("book_cta_click", {
      placement,
      source_page,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Booking] Failed to track book_cta_click:", error);
  }
};
