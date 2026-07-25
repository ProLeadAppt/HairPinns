import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import ReviewChoices from "@/components/reviews/ReviewChoices";

const ReviewGoogle = () => (
  <div className="editorial-route editorial-route--dark min-h-screen bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
    <SEOHead
      title="Share Your Experience | Hair Pinns"
      description="Choose whether to share your Hair Pinns experience publicly on Google or privately with Jena."
      canonical="https://hairpinns.com/reviews/google"
      noIndex={true}
    />

    <header className="border-b border-[hsl(var(--after-hours-cream)/0.18)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[78rem] items-center justify-between">
        <Link to="/" className="font-heading text-xl font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>Hair Pinns</Link>
        <Link to="/reviews" className="min-h-11 border-b border-[hsl(var(--after-hours-cream)/0.44)] py-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "hsl(var(--after-hours-cream))" }}>Change rating</Link>
      </div>
    </header>

    <main id="main-content" tabIndex={-1}>
      <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.5fr_0.5fr] lg:gap-20 lg:px-8 lg:py-28">
        <section>
          <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.72)]">Public or private</p>
          <h1 className="mt-5 max-w-[10ch] font-heading text-[clamp(3.6rem,7vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.06em]" style={{ color: "hsl(var(--after-hours-cream))" }}>
            Share your experience.
          </h1>
          <p className="mt-8 max-w-[38rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.78)] sm:text-lg sm:leading-8">
            Choose the option that suits you. Hair Pinns makes both paths available equally, whatever your experience was.
          </p>
        </section>
        <ReviewChoices rating={null} source="reviews_legacy_google" />
      </div>
    </main>
  </div>
);

export default ReviewGoogle;
