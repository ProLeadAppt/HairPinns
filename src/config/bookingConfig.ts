/**
 * Single source of truth for booking CTA
 * Update these constants to change booking link and label across the entire app
 */

export const BOOK_CTA_LABEL = "Book now";
export const BOOK_URL = "https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127";

/**
 * Track booking CTA click event
 * Sends analytics event to Zapier (no PII)
 */
export const trackBookingClick = async (placement: string, source_page: string) => {
  try {
    const { hpCapture } = await import("@/lib/hpCapture");
    await hpCapture.trackEvent("book_cta_click", {
      placement,
      source_page,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Booking] Failed to track book_cta_click:", error);
  }
};
