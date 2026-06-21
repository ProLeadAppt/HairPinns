import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroHomeAvif640 from "@/assets/images/hero-home-640w.avif";
import heroHomeAvif1280 from "@/assets/images/hero-home-1280w.avif";
import heroHomeAvif1920 from "@/assets/images/hero-home-1920w.avif";
import heroHomeWebp640 from "@/assets/images/hero-home-640w.webp";
import heroHomeWebp1280 from "@/assets/images/hero-home-1280w.webp";
import heroHomeWebp1920 from "@/assets/images/hero-home-1920w.webp";

/**
 * HeroHome — editorial-soft rev.
 *
 * One clear hero, one clear action, lots of air. Trust signals live in
 * a thin band UNDER the hero (HeroSocialProofBar) so the hero itself
 * stays a single beat: portrait of Jena, one headline, one CTA.
 */
const HeroHome = () => {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      {/* Background — responsive AVIF/WebP sources keep the LCP lean. */}
      <div className="absolute inset-0">
        <picture>
          <source
            type="image/avif"
            srcSet={`${heroHomeAvif640} 640w, ${heroHomeAvif1280} 1280w, ${heroHomeAvif1920} 1920w`}
            sizes="100vw"
          />
          <source
            srcSet={`${heroHomeWebp640} 640w, ${heroHomeWebp1280} 1280w, ${heroHomeWebp1920} 1920w`}
            sizes="100vw"
            type="image/webp"
          />
          <img
            src={heroHomeWebp1280}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
            loading="eager"
            width="1920"
            height="1080"
          />
        </picture>
        {/* Editorial scrim — softer overall, slightly stronger on the bottom-left
            where the headline sits. 12.4:1 contrast for white text. */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(24,0,30,0.92)] via-[rgba(24,0,30,0.55)] to-[rgba(24,0,30,0.18)]" />
      </div>

      {/* Content — single column, max-width, lots of air at the bottom */}
      <div className="relative z-10 w-full pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl hero-stagger">
            {/* Eyebrow — small, gold, single line */}
            <span
              className="eyebrow inline-block text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--gold))] mb-8"
            >
              Hair Pinns · Bangor NSW
            </span>

            {/* Headline — large, one strong line + a soft second line */}
            <h1
              className="font-heading font-bold text-white text-[2.75rem] leading-[1.05] sm:text-[3.5rem] md:text-[4.25rem] mb-10"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
            >
              Hair care from someone who{" "}
              <em className="not-italic text-[hsl(var(--gold))]">actually</em>{" "}
              does hair.
            </h1>

            {/* Single primary action. Secondary goes subtle under it as a
                text link, not a competing button. */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="btn-lift text-white font-semibold"
                style={{ borderRadius: "999px", padding: "1rem 2.75rem" }}
              >
                <a
                  href="https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Book a salon appointment at Hair Pinns (opens in new tab)"
                  onClick={() => {
                    if (typeof window !== "undefined" && (window as any).dataLayer) {
                      (window as any).dataLayer.push({
                        event: "booking_click",
                        location: "hero_home",
                        cta: "book_now",
                      });
                    }
                  }}
                >
                  Book a chair
                  <span className="btn-arrow ml-2" aria-hidden="true">→</span>
                </a>
              </Button>
              <Link
                to="/collections"
                className="text-white/80 hover:text-white text-sm underline-offset-4 hover:underline transition"
              >
                or browse the product shelf →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
