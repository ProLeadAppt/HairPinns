import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { resolveVenueReviewProof } from "../../lib/venueReviewProof";
import ReviewProofBadge from "./ReviewProofBadge";

describe("ReviewProofBadge", () => {
  it("renders explicit Fresha venue attribution and source link", () => {
    const proof = resolveVenueReviewProof(
      { entityType: "service", entitySlug: "mid-length-straight-up-smoothing" },
      "2026-07-26",
    );
    expect(proof).not.toBeNull();

    const html = renderToStaticMarkup(
      createElement(ReviewProofBadge, { proof: proof! }),
    );

    expect(html).toContain('data-review-proof-source="fresha"');
    expect(html).toContain("Hair Pinns venue on Fresha: 5.0 from 936 reviews");
    expect(html).toContain(`href="${proof!.sourceUrl}"`);
    expect(html).not.toContain("AggregateRating");
  });
});
