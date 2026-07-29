import { describe, expect, it } from "vitest";
import { resolveVenueReviewProof } from "./venueReviewProof";

describe("venue review proof", () => {
  it("resolves explicit venue-level Fresha proof for a service surface", () => {
    expect(
      resolveVenueReviewProof(
        { entityType: "service", entitySlug: "mid-length-straight-up-smoothing" },
        "2026-07-26",
      ),
    ).toMatchObject({
      source: "fresha",
      rating: 5,
      reviewCount: 936,
      label: "Hair Pinns venue on Fresha: 5.0 from 936 reviews",
    });
  });

  it("withholds venue proof from evidence-pending suburb pages", () => {
    expect(
      resolveVenueReviewProof(
        { entityType: "location", entitySlug: "como-2226" },
        "2026-07-26",
      ),
    ).toBeNull();
  });

  it("resolves venue proof for the canonical Bangor location", () => {
    expect(
      resolveVenueReviewProof(
        { entityType: "location", entitySlug: "bangor-2234" },
        "2026-07-26",
      )?.source,
    ).toBe("fresha");
  });

  it("withholds expired venue proof from every surface", () => {
    expect(
      resolveVenueReviewProof(
        { entityType: "service", entitySlug: "mid-length-straight-up-smoothing" },
        "2026-10-26",
      ),
    ).toBeNull();
  });
});
