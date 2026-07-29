import { describe, expect, it } from "vitest";
import { findForbiddenClaims } from "./content-trust-rules.mjs";

describe("content trust rules", () => {
  it("rejects unsourced 5.0/5 aggregate-rating copy", () => {
    expect(
      findForbiddenClaims(
        "src/pages/Home.tsx",
        "Customers rate Hair Pinns 5.0/5 across hundreds of reviews.",
      ),
    ).toContain("unsupported 5.0/5 aggregate review claim");
  });

  it("allows the canonical proof registry to hold the sourced claim", () => {
    expect(
      findForbiddenClaims(
        "src/config/proofRegistry.ts",
        "Hair Pinns has a sourced 5.0/5 Fresha venue rating.",
      ),
    ).not.toContain("unsupported 5.0/5 aggregate review claim");
  });
});
