import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./LocationPage.tsx", import.meta.url), "utf8");

describe("LocationPage review proof wiring", () => {
  it("resolves location-scoped proof and renders the shared attributed badge", () => {
    expect(source).toContain("resolveVenueReviewProof");
    expect(source).toContain('entityType: "location"');
    expect(source).toContain("entitySlug: locationData.slug");
    expect(source).toContain("<ReviewProofBadge");
  });
});
