import { getPublishableProofById } from "../config/proofRegistry";

export interface ReviewProofSurface {
  entityType: "service" | "location";
  entitySlug: string;
}

export interface VenueReviewProof {
  source: "fresha";
  sourceUrl: string;
  rating: number;
  reviewCount: number;
  label: string;
}

export const resolveVenueReviewProof = (
  surface: ReviewProofSurface,
  asOfDate?: string,
): VenueReviewProof | null => {
  if (surface.entityType === "location" && surface.entitySlug !== "bangor-2234") {
    return null;
  }

  const record = getPublishableProofById("fresha-venue-rating", asOfDate);
  const rating = record?.value?.rating;
  const reviewCount = record?.value?.reviewCount;

  if (
    !record ||
    record.sourceType !== "fresha" ||
    typeof rating !== "number" ||
    typeof reviewCount !== "number"
  ) {
    return null;
  }

  return {
    source: "fresha",
    sourceUrl: record.sourceUrl,
    rating,
    reviewCount,
    label: `Hair Pinns venue on Fresha: ${rating.toFixed(1)} from ${reviewCount} reviews`,
  };
};
