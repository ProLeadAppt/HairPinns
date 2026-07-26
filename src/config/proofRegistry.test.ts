import { describe, expect, it } from "vitest";
import { getPublishableProofById } from "./proofRegistry";

describe("publishable proof lookup", () => {
  it("returns the current published Fresha venue proof", () => {
    expect(
      getPublishableProofById("fresha-venue-rating", "2026-07-26")?.id,
    ).toBe("fresha-venue-rating");
  });

  it("does not return withheld or expired proof records", () => {
    expect(
      getPublishableProofById("google-rating-unresolved", "2026-07-26"),
    ).toBeUndefined();
    expect(
      getPublishableProofById("fresha-venue-rating", "2026-10-26"),
    ).toBeUndefined();
  });
});
