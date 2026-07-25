import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import ReviewChoices from "@/components/reviews/ReviewChoices";
import { cn } from "@/lib/utils";
import { normaliseReviewRating, type ReviewRating } from "@/lib/reviewPolicy";

const sentimentLabels = ["Poor", "Fair", "Good", "Great", "Excellent"] as const;

const Reviews = () => {
  const [selectedRating, setSelectedRating] = useState<ReviewRating | null>(null);

  const chooseRating = (value: number) => {
    setSelectedRating(normaliseReviewRating(value));
  };

  return (
    <div className="editorial-route editorial-route--dark min-h-screen bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
      <SEOHead
        title="Share Your Experience | Hair Pinns"
        description="Share public or private feedback about your Hair Pinns experience. Both options are available for every rating."
        canonical="https://hairpinns.com/reviews"
        noIndex={true}
      />

      <header className="border-b border-[hsl(var(--after-hours-cream)/0.18)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[78rem] items-center justify-between">
          <Link to="/" className="font-heading text-xl font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
            Hair Pinns
          </Link>
          <Link to="/" className="min-h-11 border-b border-[hsl(var(--after-hours-cream)/0.44)] py-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "hsl(var(--after-hours-cream))" }}>
            Return home
          </Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.56fr_0.44fr] lg:gap-20 lg:px-8 lg:py-28">
          <section>
            <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.72)]">Hair Pinns / Feedback</p>
            <h1 className="mt-5 max-w-[10ch] font-heading text-[clamp(3.6rem,7vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.06em]" style={{ color: "hsl(var(--after-hours-cream))" }}>
              Share your experience.
            </h1>
            <p className="mt-8 max-w-[40rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.78)] sm:text-lg sm:leading-8">
              Choose a rating if you would like, then decide whether to post publicly on Google or send feedback privately to Jena. The same choices are available for every rating.
            </p>
          </section>

          <div className="self-start border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-7">
            <fieldset>
              <legend className="font-heading text-2xl font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
                How would you rate your visit?
              </legend>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.68)]">Rating is optional and never changes the choices below.</p>
              <div className="mt-6 grid grid-cols-5 gap-2" aria-label="Rate your visit">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = selectedRating !== null && star <= selectedRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => chooseRating(star)}
                      className={cn(
                        "flex min-h-14 items-center justify-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        active
                          ? "border-[hsl(var(--after-hours-copper))] bg-[hsl(var(--after-hours-copper))] text-[hsl(var(--after-hours-near-black))]"
                          : "border-[hsl(var(--after-hours-cream)/0.34)] text-[hsl(var(--after-hours-cream)/0.72)] hover:border-[hsl(var(--after-hours-cream))]",
                      )}
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      aria-pressed={selectedRating === star}
                    >
                      <Star aria-hidden="true" className={cn("h-6 w-6", active && "fill-current")} />
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 min-h-6 text-sm font-semibold text-[hsl(var(--after-hours-cream)/0.82)]" aria-live="polite">
                {selectedRating ? `${selectedRating} out of 5 · ${sentimentLabels[selectedRating - 1]}` : "No rating selected"}
              </p>
            </fieldset>

            {selectedRating ? (
              <div className="mt-8">
                <ReviewChoices rating={selectedRating} source="reviews_rating" />
              </div>
            ) : (
              <div className="mt-8">
                <ReviewChoices rating={null} source="reviews_no_rating" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reviews;
