import { describe, expect, it } from "vitest";
import { PRIORITY_LOCATION_SLUGS } from "./locationPageCopy";
import { getAllLocationSlugs, locationPages } from "./locationPages";

const serialiseLocations = (): string => JSON.stringify(locationPages);

describe("local page claim policy", () => {
  it("does not invite walk-ins or promise unverified appointment availability", () => {
    expect(serialiseLocations()).not.toMatch(
      /drop by|same week|fit you in|outside regular hours/i,
    );
  });

  it("does not invent suburb-specific climate, water, or landscape effects", () => {
    expect(serialiseLocations()).not.toMatch(
      /riverside humidity|coastal (?:air|breeze|humidity)|river-valley humidity|unique microclimate|Georges River humidity|Sutherland Shire(?:'s)? climate|bushland (?:environment|make hair dry)|Sutherland(?:'s)? water/i,
    );
  });

  it("does not manufacture first-person tips to make suburb pages appear unique", () => {
    expect(Object.values(locationPages).every((location) => !location.jenaTip)).toBe(
      true,
    );
  });

  it("keeps evidence-pending suburb records factual and non-prescriptive", () => {
    const priority = new Set<string>(PRIORITY_LOCATION_SLUGS);
    const evidencePending = Object.values(locationPages).filter(
      (location) => location.slug !== "bangor-2234",
    );

    for (const location of evidencePending) {
      expect(location).toMatchObject({
        driveTime: "Check live directions",
        evidenceStatus: "pending-local-evidence",
      });
      expect(location.faqs).toHaveLength(priority.has(location.slug) ? 3 : 0);
      const copy = [
        location.localIntro,
        ...location.faqs.flatMap((faq) => [faq.question, faq.answer]),
      ].join(" ");
      expect(copy).not.toMatch(
        /lasts? (?:months|\d)|safe for|seals? (?:colour|cuticles)|blocks? moisture|restore(?:s|d)?|speciali[sz](?:e|es|ed|ing)|tailored? to|15 minutes from Bangor/i,
      );
    }
  });

  it("publishes 18 area routes, including Engadine, with exact priority metadata", () => {
    expect(getAllLocationSlugs()).toHaveLength(18);
    expect(locationPages["engadine-2233"]).toMatchObject({
      name: "Engadine",
      fullName: "Engadine NSW 2233, Australia",
      postcode: "2233",
      nearbyLocations: ["bangor-2234", "menai-2234", "sutherland-2232", "kirrawee-2232"],
    });
    expect(locationPages["padstow-2211"].nearbyLocations).toEqual([
      "alfords-point-2234",
      "illawong-2234",
      "menai-2234",
      "bangor-2234",
    ]);

    const questions = new Set<string>();
    for (const slug of PRIORITY_LOCATION_SLUGS) {
      const location = locationPages[slug];
      expect(location.seoTitle?.length, slug).toBeLessThanOrEqual(60);
      expect(location.metaDescription?.length, slug).toBeLessThanOrEqual(155);
      expect(location.faqs).toHaveLength(3);
      for (const faq of location.faqs) {
        expect(questions.has(faq.question), faq.question).toBe(false);
        questions.add(faq.question);
      }
    }

    expect(locationPages["bangor-2234"].seoTitle).toBe(
      "Hairdresser in Bangor NSW 2234 | Hair Pinns",
    );
    expect(locationPages["bangor-2234"].metaDescription).toBe(
      "Appointment-only hair salon in Bangor at 60 Goorgool Road. One-on-one colour, blonding, smoothing and cuts with Jena. Book online or call 0416 037 663.",
    );
    expect(locationPages["menai-2234"].metaDescription).toBe(
      "Looking for a hairdresser near Menai? Visit Hair Pinns in Bangor, 5 mins away with free parking, for colour, blonding, smoothing and cuts with Jena.",
    );
    expect(locationPages["engadine-2233"].seoTitle).toBe(
      "Hairdresser Near Engadine 2233 | Hair Pinns",
    );
  });
});
