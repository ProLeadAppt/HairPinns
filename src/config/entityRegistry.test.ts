import { describe, expect, it } from "vitest";
import {
  ENTITY_REGISTRY,
  getCanonicalEntityIds,
  getOpeningHoursSpecification,
  validateEntityRegistry,
} from "./entityRegistry";
import {
  PROOF_REGISTRY,
  getPublishableProof,
  validateProofRegistry,
} from "./proofRegistry";
import {
  BUSINESS_HOURS,
  BUSINESS_HOURS_DISPLAY,
  BUSINESS_NAP,
  GBP_REVIEW_URL,
  GBP_URL,
  SITE_URL,
} from "./businessConfig";
import {
  BOOK_URL,
  FRESHA_REVIEWS_URL,
} from "./bookingConfig";

describe("canonical entity registry", () => {
  it("owns one stable ID for every canonical entity", () => {
    expect(getCanonicalEntityIds()).toEqual([
      "https://hairpinns.com/#organization",
      "https://hairpinns.com/#hairsalon",
      "https://hairpinns.com/#store",
      "https://hairpinns.com/#website",
      "https://hairpinns.com/#jena-pinn",
      "https://hairpinns.com/#bangor-studio",
    ]);
    expect(new Set(getCanonicalEntityIds()).size).toBe(6);
  });

  it("records the approved NAP and a provisional, attributed coordinate pair", () => {
    expect(ENTITY_REGISTRY.business.name).toBe("Hair Pinns");
    expect(ENTITY_REGISTRY.contact.address.full).toBe(
      "60 Goorgool Road, Bangor NSW 2234",
    );
    expect(ENTITY_REGISTRY.contact.phone.display).toBe("0416 037 663");
    expect(ENTITY_REGISTRY.place.geo).toMatchObject({
      latitude: -34.02116155,
      longitude: 151.0389639,
      verificationStatus: "provisional",
      sourceUrl:
        "https://sustainablesalons.org/salon-directory/hair-pinns-pty-ltd/",
    });
  });

  it("uses the checked booking-provider hours and supports special overrides", () => {
    expect(ENTITY_REGISTRY.hours.weekly).toEqual([
      { day: "Tuesday", opens: "09:00", closes: "17:00" },
      { day: "Wednesday", opens: "16:00", closes: "21:00" },
      { day: "Thursday", opens: "09:00", closes: "21:00" },
      { day: "Friday", opens: "09:00", closes: "17:00" },
      { day: "Saturday", opens: "08:00", closes: "14:00" },
    ]);
    expect(ENTITY_REGISTRY.hours.special).toEqual([]);
    expect(getOpeningHoursSpecification()).toHaveLength(5);
  });

  it("keeps canonical profiles separate from action URLs", () => {
    expect(ENTITY_REGISTRY.profiles.google.placeId).toBe(
      "ChIJs9xoWku_EmsRo264WfJGtg4",
    );
    expect(ENTITY_REGISTRY.profiles.google.profileUrl).toContain(
      "query_place_id=ChIJs9xoWku_EmsRo264WfJGtg4",
    );
    expect(ENTITY_REGISTRY.profiles.google.reviewUrl).toContain(
      "placeid=ChIJs9xoWku_EmsRo264WfJGtg4",
    );
    expect(ENTITY_REGISTRY.profiles.google.profileUrl).not.toContain("g.page/r/");
    expect(ENTITY_REGISTRY.profiles.fresha.venueUrl).toContain("eb7ff3lb");
    expect(ENTITY_REGISTRY.profiles.fresha.professionalUrl).toContain(
      "jena-pinn-2198350",
    );
  });

  it("passes the registry validator without duplicate IDs or conflicting facts", () => {
    expect(validateEntityRegistry()).toEqual([]);
  });
});

describe("compatibility projections", () => {
  it("derives legacy business config exports from the entity registry", () => {
    expect(SITE_URL).toBe(ENTITY_REGISTRY.site.url);
    expect(BUSINESS_NAP).toEqual({
      name: ENTITY_REGISTRY.business.name,
      ...ENTITY_REGISTRY.contact,
    });
    expect(BUSINESS_HOURS).toBe(ENTITY_REGISTRY.hours.weekly);
    expect(BUSINESS_HOURS_DISPLAY).toEqual([
      "Tue: 9am - 5pm",
      "Wed: 4pm - 9pm",
      "Thu: 9am - 9pm",
      "Fri: 9am - 5pm",
      "Sat: 8am - 2pm",
      "Sun - Mon: Closed",
    ]);
    expect(GBP_URL).toBe(ENTITY_REGISTRY.profiles.google.profileUrl);
    expect(GBP_REVIEW_URL).toBe(ENTITY_REGISTRY.profiles.google.reviewUrl);
  });

  it("derives booking URLs from the canonical Fresha profile", () => {
    expect(BOOK_URL).toBe(ENTITY_REGISTRY.profiles.fresha.venueUrl);
    expect(FRESHA_REVIEWS_URL).toBe(
      ENTITY_REGISTRY.profiles.fresha.reviewsUrl,
    );
  });
});

describe("proof registry", () => {
  it("publishes only sourced, current proof and excludes unverified Google claims", () => {
    const publishable = getPublishableProof("2026-07-25");

    expect(publishable.map((proof) => proof.id)).toContain(
      "fresha-venue-rating",
    );
    expect(publishable).toContainEqual(
      expect.objectContaining({
        id: "fresha-venue-rating",
        sourceType: "fresha",
        checkedDate: "2026-07-25",
        expiryDate: "2026-10-25",
        value: { rating: 5, reviewCount: 936 },
      }),
    );
    expect(
      PROOF_REGISTRY.some(
        (proof) =>
          proof.sourceType === "google" && proof.publicationStatus === "published",
      ),
    ).toBe(false);
  });

  it("fails closed after dynamic proof expires", () => {
    expect(
      getPublishableProof("2026-10-26").map((proof) => proof.id),
    ).not.toContain("fresha-venue-rating");
  });

  it("passes provenance, uniqueness, and expiry validation", () => {
    expect(validateProofRegistry("2026-07-25")).toEqual([]);
  });
});
