import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ExternalLink, LockKeyhole } from "lucide-react";
import {
  GOOGLE_REVIEW_URL,
  REVIEW_CHOICES,
  type ReviewRating,
} from "@/lib/reviewPolicy";

type ReviewChoicesProps = {
  rating: ReviewRating | null;
  source: string;
};

const ReviewChoices = ({ rating, source }: ReviewChoicesProps) => {
  const privateFeedbackUrl = rating
    ? `/reviews/feedback?rating=${rating}`
    : "/reviews/feedback";

  return (
    <section
      aria-label="Choose how to share your feedback"
      className="border-t border-[hsl(var(--after-hours-cream)/0.28)] pt-7"
    >
      <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.72)]">
        Choose either option
      </p>
      <div className="mt-5 grid gap-px bg-[hsl(var(--after-hours-cream)/0.24)] md:grid-cols-2">
        <a
          data-review-choice={REVIEW_CHOICES[0].id}
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-track="review_public"
          data-track-source={source}
          className="group flex min-h-48 flex-col justify-between bg-[hsl(var(--after-hours-cream))] p-6"
          style={{ color: "hsl(var(--after-hours-plum))" }}
        >
          <div>
            <ExternalLink aria-hidden="true" className="h-5 w-5" />
            <h2 className="mt-8 font-heading text-2xl font-semibold leading-tight" style={{ color: "hsl(var(--after-hours-plum))" }}>
              {REVIEW_CHOICES[0].title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">
              {REVIEW_CHOICES[0].description}
            </p>
          </div>
          <span className="mt-6 flex items-center justify-between border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-4 text-sm font-semibold">
            Open Google
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </a>

        <Link
          data-review-choice={REVIEW_CHOICES[1].id}
          to={privateFeedbackUrl}
          state={rating ? { rating } : undefined}
          data-track="review_private"
          data-track-source={source}
          className="group flex min-h-48 flex-col justify-between bg-[hsl(var(--after-hours-cream))] p-6"
          style={{ color: "hsl(var(--after-hours-plum))" }}
        >
          <div>
            <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            <h2 className="mt-8 font-heading text-2xl font-semibold leading-tight" style={{ color: "hsl(var(--after-hours-plum))" }}>
              Private feedback
            </h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">
              {REVIEW_CHOICES[1].description}
            </p>
          </div>
          <span className="mt-6 flex items-center justify-between border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-4 text-sm font-semibold">
            Write privately
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
      <p className="mt-5 text-xs leading-5 text-[hsl(var(--after-hours-cream)/0.64)]">
        Both options are available for every experience and every rating. Private feedback is sent directly to Hair Pinns.
      </p>
    </section>
  );
};

export default ReviewChoices;
