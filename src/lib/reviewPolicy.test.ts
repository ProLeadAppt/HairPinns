import { describe, expect, it } from "vitest";
import {
  getReviewChoices,
  normaliseReviewRating,
  REVIEW_CHOICES,
} from "./reviewPolicy";

describe("rating-neutral review policy", () => {
  it.each([1, 2, 3, 4, 5] as const)(
    "offers the same public and private choices after a %i-star rating",
    (rating) => {
      expect(getReviewChoices(rating)).toEqual(REVIEW_CHOICES);
      expect(getReviewChoices(rating).map((choice) => choice.id)).toEqual([
        "public",
        "private",
      ]);
    },
  );

  it("does not assume a positive or negative rating when route state is absent", () => {
    expect(normaliseReviewRating(undefined)).toBeNull();
    expect(normaliseReviewRating(null)).toBeNull();
  });

  it("accepts only whole ratings from one to five", () => {
    expect(normaliseReviewRating(1)).toBe(1);
    expect(normaliseReviewRating(5)).toBe(5);
    expect(normaliseReviewRating(0)).toBeNull();
    expect(normaliseReviewRating(6)).toBeNull();
    expect(normaliseReviewRating(4.5)).toBeNull();
    expect(normaliseReviewRating("5")).toBeNull();
  });
});
