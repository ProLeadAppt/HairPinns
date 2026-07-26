import type { VenueReviewProof } from "../../lib/venueReviewProof";

interface ReviewProofBadgeProps {
  proof: VenueReviewProof;
  tone?: "dark" | "light";
  className?: string;
}

const ReviewProofBadge = ({
  proof,
  tone = "light",
  className = "",
}: ReviewProofBadgeProps) => {
  const toneClass = tone === "dark"
    ? "border-[hsl(var(--after-hours-cream)/0.28)] text-[hsl(var(--after-hours-cream))]"
    : "border-[hsl(var(--after-hours-plum)/0.24)] text-[hsl(var(--after-hours-plum))]";

  return (
    <a
      data-review-proof=""
      data-review-proof-source={proof.source}
      href={proof.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${proof.label}. Verify on Fresha`}
      className={`flex min-h-11 items-center gap-3 border-y py-3 text-xs font-semibold leading-5 ${toneClass} ${className}`.trim()}
    >
      <span aria-hidden="true">★</span>
      <span>{proof.label}</span>
      <span className="ml-auto" aria-hidden="true">↗</span>
    </a>
  );
};

export default ReviewProofBadge;
