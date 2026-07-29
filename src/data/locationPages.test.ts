import { describe, expect, it } from "vitest";
import { locationPages } from "./locationPages";

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
    const evidencePending = Object.values(locationPages).filter(
      (location) => location.slug !== "bangor-2234",
    );

    for (const location of evidencePending) {
      expect(location).toMatchObject({
        driveTime: "Check live directions",
        evidenceStatus: "pending-local-evidence",
        faqs: [],
      });
      expect(location.localIntro).not.toMatch(
        /lasts? (?:months|\d)|safe for|seals? (?:colour|cuticles)|blocks? moisture|restore(?:s|d)?|speciali[sz](?:e|es|ed|ing)|tailored? to/i,
      );
    }
  });
});
