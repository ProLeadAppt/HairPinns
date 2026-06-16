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
    // Updated 2026-06-16 to match the Google Business Profile mobile number.
    display: "0416 037 663",
    raw: "+614****7663",
    tel: "tel:+614****7663",
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
