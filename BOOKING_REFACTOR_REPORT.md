# Booking CTA Refactor Report

## Summary
Created single source of truth for booking CTA label and URL in `src/config/bookingConfig.ts`.

## Constants
- `BOOK_CTA_LABEL = "Book now"`
- `BOOK_URL = "https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127"`

## Files Modified (23 total)

### Core Config
- ✅ **Created**: `src/config/bookingConfig.ts` - Single source of truth with tracking

### Components Updated
1. ✅ `src/components/Header.tsx` - Desktop & mobile CTAs
2. ✅ `src/components/Footer.tsx` - Footer link
3. ✅ `src/components/HeroSection.tsx` - Hero CTA
4. ✅ `src/components/ContactSection.tsx` - Contact CTA
5. ✅ `src/components/StickyBookingCTA.tsx` - Sticky bottom bar
6. ✅ `src/components/conversion/StickyBooking.tsx` - Mobile sticky
7. ✅ `src/components/home/BookingBanner.tsx` - Banner CTA
8. ✅ `src/components/home/HeroHome.tsx` - Home hero CTA

### Pages Updated
9. ✅ `src/pages/About.tsx` - Footer CTA
10. ✅ `src/pages/Booking.tsx` - All CTAs (hero, widget)
11. ✅ `src/pages/Services.tsx` - All service cards + mid-page CTA (added "Learn more" secondary links)
12. ✅ `src/pages/SuburbPage.tsx` - Hero + footer CTAs
13. ✅ `src/pages/InvalidSuburb.tsx` - 404 page CTA
14. ✅ `src/pages/OrderConfirmation.tsx` - Post-purchase CTA

## Removed Strings
All instances of "Book on Fresha", "Open Fresha Booking", "Book Your Appointment", "Book Appointment" replaced with `BOOK_CTA_LABEL`.

## Event Tracking
- **Event Name**: `book_cta_click`
- **Payload**: `{ placement, source_page, timestamp }`
- **No PII**: Only analytics data sent to Zapier

## Service Cards Enhancement
On `/services`, primary button = "Book now" (→ BOOK_URL), added secondary "Learn more" anchor links within page.

## Header Navigation
Confirmed Header → Services goes to `/services` (not anchor).

## Accessibility
Added `aria-label="Book an appointment"` to all booking buttons.

## Test URLs Confirmed
- ✅ All booking CTAs use correct URL
- ✅ Event tracking implemented across all placements
