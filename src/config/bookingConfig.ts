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
 * Track booking CTA click event
 * Sends analytics event to Zapier (no PII)
 */
export const trackBookingClick = async (placement: string, source_page: string) => {
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
