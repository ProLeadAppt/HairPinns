import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle2, ExternalLink, Send } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { getHpCapture } from "@/lib/loadHpCapture";
import {
  GOOGLE_REVIEW_URL,
  normaliseReviewRating,
} from "@/lib/reviewPolicy";

const SESSION_DRAFT_KEY = "hair-pinns-feedback-draft";

const ReviewFeedback = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryRating = searchParams.get("rating");
  const rating = normaliseReviewRating(
    location.state?.rating ?? (queryRating ? Number(queryRating) : null),
  );
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_DRAFT_KEY);
    if (!saved) return;
    setFormData((current) => ({ ...current, feedback: saved }));
  }, []);

  useEffect(() => {
    if (!isSubmitted) {
      sessionStorage.setItem(SESSION_DRAFT_KEY, formData.feedback);
    }
  }, [formData, isSubmitted]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const hpCapture = await getHpCapture();
      await hpCapture.postToGHL(
        {
          form_name: "review_feedback",
          name: formData.name,
          email: formData.email,
          message: formData.feedback,
          rating,
        },
        { event: "review_feedback" },
      );
      sessionStorage.removeItem(SESSION_DRAFT_KEY);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Your feedback could not be sent. Please try again, or contact Hair Pinns directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="editorial-route min-h-screen bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
      <SEOHead
        title="Private Feedback | Hair Pinns"
        description="Send private feedback directly to Hair Pinns."
        canonical="https://hairpinns.com/reviews/feedback"
        noIndex={true}
      />

      <header className="border-b border-[hsl(var(--after-hours-plum)/0.18)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[78rem] items-center justify-between">
          <Link to="/" className="font-heading text-xl font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>Hair Pinns</Link>
          <Link to="/reviews" className="min-h-11 border-b border-[hsl(var(--after-hours-plum)/0.44)] py-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "hsl(var(--after-hours-plum))" }}>Review options</Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20 lg:px-8 lg:py-24">
          <aside>
            <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.68)]">Direct to Hair Pinns</p>
            <h1 className="mt-5 max-w-[8ch] font-heading text-[clamp(3.4rem,6vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
              Private feedback.
            </h1>
            <p className="mt-7 max-w-[30rem] text-base leading-7 text-[hsl(var(--after-hours-plum)/0.76)]">
              Your comments go directly to Hair Pinns. A rating is optional, and choosing private feedback does not prevent you from reviewing publicly.
            </p>
            {rating && (
              <p className="mt-5 border-l-2 border-[hsl(var(--after-hours-copper))] pl-4 text-sm font-semibold">
                Rating supplied: {rating} out of 5
              </p>
            )}
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex min-h-12 max-w-sm items-center justify-between border border-[hsl(var(--after-hours-plum)/0.34)] px-5 py-3 text-sm font-semibold"
              style={{ color: "hsl(var(--after-hours-plum))" }}
            >
              Leave a Google review
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </aside>

          <section className="border-t border-[hsl(var(--after-hours-plum)/0.3)] pt-7" aria-label="Private feedback form">
            {isSubmitted ? (
              <div aria-live="polite">
                <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-[hsl(var(--after-hours-copper))]" />
                <h2 className="mt-8 max-w-[12ch] font-heading text-4xl font-semibold leading-tight">Thank you for sharing it privately.</h2>
                <p className="mt-5 max-w-[38rem] text-base leading-7 text-[hsl(var(--after-hours-plum)/0.76)]">
                  Your message has been sent to Hair Pinns. If you also want to share your experience publicly, the Google option remains available.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
                    Leave a Google review <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                  <Link to="/" className="flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-plum)/0.34)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>
                    Return home <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold">Your name</label>
                  <input id="name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" className="mt-2 min-h-12 w-full border border-[hsl(var(--after-hours-plum)/0.34)] bg-transparent px-4 py-3 text-base outline-none focus:border-[hsl(var(--after-hours-plum))]" />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-semibold">Email address</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" className="mt-2 min-h-12 w-full border border-[hsl(var(--after-hours-plum)/0.34)] bg-transparent px-4 py-3 text-base outline-none focus:border-[hsl(var(--after-hours-plum))]" />
                </div>
                <div>
                  <label htmlFor="feedback" className="text-sm font-semibold">Your feedback</label>
                  <textarea id="feedback" name="feedback" value={formData.feedback} onChange={handleChange} required rows={7} className="mt-2 w-full resize-y border border-[hsl(var(--after-hours-plum)/0.34)] bg-transparent px-4 py-3 text-base outline-none focus:border-[hsl(var(--after-hours-plum))]" />
                </div>
                {errorMessage && <p role="alert" className="border-l-2 border-destructive pl-4 text-sm leading-6 text-destructive">{errorMessage}</p>}
                <button type="submit" disabled={isSubmitting} className="flex min-h-12 w-full items-center justify-between bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold disabled:opacity-60" style={{ color: "hsl(var(--after-hours-cream))" }}>
                  {isSubmitting ? "Sending…" : "Send private feedback"}
                  <Send aria-hidden="true" className="h-4 w-4" />
                </button>
                <p className="text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.62)]">Only your feedback message is saved in this tab. It is cleared after submission or when the tab closes.</p>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ReviewFeedback;
