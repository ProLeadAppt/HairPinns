export type VerificationStatus = "verified" | "provisional" | "unresolved";

export interface WeeklyHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  opens: string;
  closes: string;
}

export interface SpecialHours {
  date: string;
  opens?: string;
  closes?: string;
  closed: boolean;
  note?: string;
}

export interface EntityRegistry {
  site: {
    url: string;
    locale: "en-AU";
    country: "AU";
  };
  ids: {
    organization: string;
    hairSalon: string;
    store: string;
    webSite: string;
    jena: string;
    place: string;
  };
  business: {
    name: string;
    legalName: string;
    approvedAliases: readonly string[];
    publicPositioning: string;
  };
  person: {
    name: string;
    safeExperienceWording: string;
  };
  contact: {
    address: {
      street: string;
      locality: string;
      region: string;
      postcode: string;
      country: "AU";
      full: string;
      fullForMaps: string;
    };
    phone: {
      display: string;
      raw: string;
      tel: string;
      sms: string;
      whatsapp: string;
    };
    email: string;
  };
  place: {
    geo: {
      latitude: number;
      longitude: number;
      verificationStatus: VerificationStatus;
      sourceUrl: string;
      checkedDate: string;
      verificationNote: string;
    };
  };
  hours: {
    timezone: "Australia/Sydney";
    sourceUrl: string;
    checkedDate: string;
    weekly: readonly WeeklyHours[];
    special: readonly SpecialHours[];
  };
  profiles: {
    google: {
      placeId: string;
      profileUrl: string;
      reviewUrl: string;
      directionsUrl: string;
      verificationStatus: VerificationStatus;
    };
    fresha: {
      venueUrl: string;
      reviewsUrl: string;
      professionalUrl: string;
    };
    instagram: string;
    facebook: string;
    sustainableSalons: string;
  };
  serviceAreas: readonly string[];
}

const SITE_URL = "https://hairpinns.com";
const GOOGLE_PLACE_ID = "ChIJs9xoWku_EmsRo264WfJGtg4";
const FRESHA_VENUE_URL =
  "https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb";

export const ENTITY_REGISTRY: EntityRegistry = {
  site: {
    url: SITE_URL,
    locale: "en-AU",
    country: "AU",
  },
  ids: {
    organization: `${SITE_URL}/#organization`,
    hairSalon: `${SITE_URL}/#hairsalon`,
    store: `${SITE_URL}/#store`,
    webSite: `${SITE_URL}/#website`,
    jena: `${SITE_URL}/#jena-pinn`,
    place: `${SITE_URL}/#bangor-studio`,
  },
  business: {
    name: "Hair Pinns",
    legalName: "Hair Pinns Pty Ltd",
    approvedAliases: ["Hair Pinns- Bangor Studio", "Hair Pinn's Boutique Salon"],
    publicPositioning:
      "Appointment-only, one-on-one Bangor hair salon and Australia-wide professional haircare store",
  },
  commerce: {
    currency: "AUD",
    paymentAccepted: [
      "Credit Card",
      "Debit Card",
      "Afterpay",
      "Apple Pay",
      "Google Pay",
      "Shop Pay",
    ],
  },
  person: {
    name: "Jena Pinn",
    safeExperienceWording: "Behind the chair since 2009",
  },
  contact: {
    address: {
      street: "60 Goorgool Road",
      locality: "Bangor",
      region: "NSW",
      postcode: "2234",
      country: "AU",
      full: "60 Goorgool Road, Bangor NSW 2234",
      fullForMaps: "60 Goorgool Road, Bangor NSW 2234",
    },
    phone: {
      display: "0416 037 663",
      raw: "+61416037663",
      tel: "tel:+61416037663",
      sms: "sms:+61416037663",
      whatsapp: "https://wa.me/61416037663",
    },
    email: "hairpinns1@gmail.com",
  },
  place: {
    geo: {
      latitude: -34.02116155,
      longitude: 151.0389639,
      verificationStatus: "provisional",
      sourceUrl:
        "https://sustainablesalons.org/salon-directory/hair-pinns-pty-ltd/",
      checkedDate: "2026-07-25",
      verificationNote:
        "Provisional Sustainable Salons directory pin. Confirm against the Google Business Profile pin before marking verified.",
    },
  },
  hours: {
    timezone: "Australia/Sydney",
    sourceUrl: FRESHA_VENUE_URL,
    checkedDate: "2026-07-25",
    weekly: [
      { day: "Tuesday", opens: "09:00", closes: "17:00" },
      { day: "Wednesday", opens: "16:00", closes: "21:00" },
      { day: "Thursday", opens: "09:00", closes: "21:00" },
      { day: "Friday", opens: "09:00", closes: "17:00" },
      { day: "Saturday", opens: "08:00", closes: "14:00" },
    ],
    special: [],
  },
  profiles: {
    google: {
      placeId: GOOGLE_PLACE_ID,
      profileUrl: `https://www.google.com/maps/search/?api=1&query=Hair%20Pinns&query_place_id=${GOOGLE_PLACE_ID}`,
      reviewUrl: `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("60 Goorgool Road, Bangor NSW 2234")}&destination_place_id=${GOOGLE_PLACE_ID}`,
      verificationStatus: "provisional",
    },
    fresha: {
      venueUrl: FRESHA_VENUE_URL,
      reviewsUrl: `${FRESHA_VENUE_URL}?reviews=true`,
      professionalUrl: "https://www.fresha.com/p/jena-pinn-2198350",
    },
    instagram: "https://www.instagram.com/hair.pinns/",
    facebook: "https://www.facebook.com/Hair.Pinns/",
    sustainableSalons:
      "https://sustainablesalons.org/salon-directory/hair-pinns-pty-ltd/",
  },
  serviceAreas: [
    "Bangor",
    "Menai",
    "Illawong",
    "Alfords Point",
    "Woronora",
    "Sutherland",
    "Kirrawee",
    "Kareela",
    "Como",
    "Gymea",
    "Miranda",
    "Engadine",
    "Heathcote",
  ],
};

export const getCanonicalEntityIds = (
  registry: EntityRegistry = ENTITY_REGISTRY,
): string[] => Object.values(registry.ids);

export const getOpeningHoursSpecification = (
  registry: EntityRegistry = ENTITY_REGISTRY,
) =>
  registry.hours.weekly.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.day,
    opens: hours.opens,
    closes: hours.closes,
  }));

const compactPhone = (value: string) => value.replace(/[^+\d]/g, "");

export const validateEntityRegistry = (
  registry: EntityRegistry = ENTITY_REGISTRY,
): string[] => {
  const issues: string[] = [];
  const ids = getCanonicalEntityIds(registry);
  if (new Set(ids).size !== ids.length) issues.push("duplicate-entity-id");
  if (ids.some((id) => !id.startsWith(`${registry.site.url}/#`))) {
    issues.push("noncanonical-entity-id");
  }

  const { latitude, longitude } = registry.place.geo;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    issues.push("invalid-coordinate");
  }

  const displayDigits = registry.contact.phone.display.replace(/\D/g, "");
  const rawDigits = compactPhone(registry.contact.phone.raw).replace(/^\+61/, "0");
  if (displayDigits !== rawDigits) issues.push("conflicting-phone");
  if (registry.contact.phone.tel !== `tel:${registry.contact.phone.raw}`) {
    issues.push("conflicting-phone-link");
  }

  const hoursDays = registry.hours.weekly.map((hours) => hours.day);
  if (new Set(hoursDays).size !== hoursDays.length) issues.push("duplicate-hours-day");
  if (registry.profiles.instagram !== "https://www.instagram.com/hair.pinns/") {
    issues.push("noncanonical-instagram");
  }
  if (registry.profiles.facebook !== "https://www.facebook.com/Hair.Pinns/") {
    issues.push("noncanonical-facebook");
  }
  if (registry.profiles.google.profileUrl.includes("g.page/r/")) {
    issues.push("stale-google-profile-url");
  }

  return issues;
};
