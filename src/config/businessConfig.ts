/**
 * Single source of truth for business NAP (Name, Address, Phone) and contact details.
 * Keep in sync with Google My Business profile for local SEO.
 */

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
    display: "0468 093 991",
    raw: "+61468093991",
    tel: "tel:+61468093991",
  },
  email: "hairpinns1@gmail.com",
} as const;
