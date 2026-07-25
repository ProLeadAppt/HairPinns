export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export const GOOGLE_REVIEW_URL = "https://g.page/r/CX-F0vOcpJLhEBM/review";

export const REVIEW_CHOICES = [
  {
    id: "public",
    title: "Leave a Google review",
    description: "Share your experience publicly to help other clients make an informed choice.",
  },
  {
    id: "private",
    title: "Send private feedback",
    description: "Send your comments directly to Jena so Hair Pinns can listen and improve.",
  },
] as const;

export const normaliseReviewRating = (value: unknown): ReviewRating | null => {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) {
    return null;
  }

  return value as ReviewRating;
};

export const getReviewChoices = (_rating: ReviewRating) => REVIEW_CHOICES;
