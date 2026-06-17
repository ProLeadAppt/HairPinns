/**
 * Single source of truth for business NAP (Name, Address, Phone) and contact details.
 * Keep in sync with Google My Business profile for local SEO.
 */

/** Canonical site URL — single source of truth for all SEO references */
export const SITE_URL = 'https://hairpinns.com';

export const BUSINESS_NAP = {
  name: "Hair Pinns",
  address: {
    street: "60 Goorgool Rd",
    locality: "Bangor",
    region: "NSW",
    postcode: "2234",
    country: "AU",
    full: "60 Goorgool Rd, Bangor NSW 2234",
    fullForMaps: "60 Goorgool Rd, Bangor NSW 2234",
  },
  phone: {
    // Canonical mobile for Hair Pinns. Verified against Google Business
    // Profile on 2026-06-17. Prior values were a literal string mask
    // ("+614****7663") that produced dead tel: links in Footer,
    // StickyBookBar, ContactForm and JSON-LD schema. Keep these three
    // fields in sync with the GBP. To rotate the number, update all three
    // below + GBP + Fresha + business profile listing.
    //   - `display`  human-readable (used in copy / fallback label)
    //   - `raw`      E.164 with no `tel:` prefix (for wa.me, sms:, schema)
    //   - `tel`      full `tel:` href
    display: "0416 037 663",
    raw: "+61416037663",
    tel: "tel:+61416037663",
  },
  email: "hairpinns1@gmail.com",
} as const;

/**
 * Single source of truth for opening hours.
 * Keep in sync with Google Business Profile and Fresha.
 * Closed: Sunday, Monday
 */
export const BUSINESS_HOURS = [
  { day: "Tuesday", opens: "10:00", closes: "17:00" },
  { day: "Wednesday", opens: "18:00", closes: "21:00" },
  { day: "Thursday", opens: "09:00", closes: "21:00" },
  { day: "Friday", opens: "09:00", closes: "17:30" },
  { day: "Saturday", opens: "08:00", closes: "14:00" },
] as const;

/** Short format for display: "Tue 10am-5pm" style */
export const BUSINESS_HOURS_DISPLAY = [
  "Tue: 10am - 5pm",
  "Wed: 6pm - 9pm",
  "Thu: 9am - 9pm",
  "Fri: 9am - 5:30pm",
  "Sat: 8am - 2pm",
  "Sun - Mon: Closed",
] as const;

/** Google Business Profile ID */
export const GBP_ID = "CX-F0vOcpJLhEBM";
export const GBP_REVIEW_URL = `https://g.page/r/${GBP_ID}/review`;
export const GBP_URL = `https://g.page/r/${GBP_ID}`;