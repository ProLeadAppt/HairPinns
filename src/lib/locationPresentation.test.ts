import { describe, expect, it } from "vitest";
import {
  buildLocationFaqSchema,
  getLocationJourneyHeading,
  getLocationMetaDescription,
  getLocationTravelCopy,
} from "./locationPresentation";
import { locationPages } from "../data/locationPages";

describe("location page presentation policy", () => {
  it("omits FAQ schema when a location has no evidence-backed FAQs", () => {
    expect(buildLocationFaqSchema(locationPages["como-2226"].faqs)).toBeNull();
  });

  it("builds FAQ schema only for factual Bangor questions", () => {
    const schema = buildLocationFaqSchema(locationPages["bangor-2234"].faqs);

    expect(schema).toMatchObject({
      "@type": "FAQPage",
      mainEntity: expect.arrayContaining([
        expect.objectContaining({ "@type": "Question" }),
      ]),
    });
  });

  it("uses live-direction guidance instead of an unsupported duration", () => {
    expect(getLocationTravelCopy(locationPages["como-2226"])).toEqual({
      heroLabel: "Check live directions from Como",
      visitNote:
        "Check live directions from Como to 60 Goorgool Road before leaving.",
    });
  });

  it("does not describe the Bangor venue as a journey from Bangor to Bangor", () => {
    expect(getLocationJourneyHeading(locationPages["bangor-2234"])).toBe(
      "Visit Hair Pinns in Bangor",
    );
  });

  it("keeps every location meta description concise and evidence-safe", () => {
    for (const location of Object.values(locationPages)) {
      const description = getLocationMetaDescription(location);

      expect(description.length, location.slug).toBeLessThanOrEqual(160);
      expect(description).not.toMatch(/\d+\s*[–-]\s*\d+\s*min/i);
    }
  });
});
