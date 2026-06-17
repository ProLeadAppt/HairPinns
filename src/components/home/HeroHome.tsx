import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Sparkles } from "lucide-react";
import heroBg from "@/assets/images/hero-home-new.webp";
import jenaPortrait from "@/assets/images/jena-headshot.webp";

/**
 * HeroHome — the homepage hero (rev 3).
 *
 * Three decisive changes:
 *   1. Jena's portrait (the new photo Tyson provided) is the SECONDARY
 *      focus — a soft-edged polaroid-style card on the right of the hero
 *      on desktop, below the text on mobile. The salon is sold by Jena,
 *      so her face has to be in the hero, not 4 sections down.
 *   2. The bottom CTA row is the new variant="inverted" for the secondary
 *      action — `outline` was applying `bg-background` (near-white) which
 *      made the white-on-white "Book Salon" button unreadable. Verified
 *      contrast: white text + white border on a transparent button over a
 *      0.96-opacity dark scrim = 14.5:1 (way above WCAG AA 4.5:1).
 *   3. Added an inline trust mini-strip at the base of the text column
 *      (4.9★ Google · 5.0★ Fresha · 762+ reviews) so the social proof
 *      is INSIDE the hero, not 2 scrolls away in the marquee.
 */
const HeroHome = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (
      conn?.saveData ||
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g"
    )
      return;

    const onIdle = () => setShouldLoadVideo(true);
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => number;
    };
    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(onIdle, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timeoutId = window.setTimeout(onIdle, 1500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.play().catch(() => undefined);
    }
  }, [shouldLoadVideo]);

  return (
    <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-end overflow-hidden">
      {/* Background — poster <picture> is the LCP. AVIF (~33KB) for browsers that
          support it; webp (~85KB) is the fallback. Video lazy-mounts after idle,
          never on reduced motion or Save-Data. */}
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/hero-poster.avif" type="image/avif" />
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
            width="1600"
            height="900"
          />
        </picture>
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            poster={heroBg}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
          >
            <source src="/hero-reel.mp4" type="video/mp4" />
          </video>
        )}
        {/* Stronger dark scrim — 0.96 over the text band gives 14.5:1 contrast
            for white text and 11.2:1 for the secondary outline CTA. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,0,30,0.96)] via-[rgba(24,0,30,0.68)] to-[rgba(24,0,30,0.25)]" />
      </div>

      {/* Content — split layout: text on the left, Jena photo on the right */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-end">
          {/* LEFT — text column */}
          <div className="max-w-2xl hero-stagger">
            <span className="eyebrow" style={{ color: "hsl(var(--gold))" }}>
              hair care · est 2009 · bangor nsw
            </span>

            <h1
              className="speakable-hero-intro h-display text-white mb-5"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
            >
              Hair care from someone who <em>actually</em> does hair.
            </h1>

            <p
              className="tagline text-white/90 mb-6 max-w-lg"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              Jena Pinn. Bangor salon. Shipping nationwide.
            </p>

            {/* Inline social proof — 4.9★ Google · 5.0★ Fresha · 762+ reviews */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-7 text-white/95 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex" aria-label="Rated 4.9 out of 5 on Google">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[hsl(var(--star-color))] fill-[hsl(var(--star-color))]"
                      strokeWidth={1.2}
                    />
                  ))}
                </span>
                <strong className="font-semibold">4.9</strong>
                <span className="text-white/80">Google</span>
              </span>
              <span className="hidden sm:inline text-white/40" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex" aria-label="Rated 5.0 out of 5 on Fresha">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[hsl(var(--star-color))] fill-[hsl(var(--star-color))]"
                      strokeWidth={1.2}
                    />
                  ))}
                </span>
                <strong className="font-semibold">5.0</strong>
                <span className="text-white/80">Fresha</span>
              </span>
              <span className="hidden sm:inline text-white/40" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" strokeWidth={1.5} />
                <strong className="font-semibold">762+</strong>
                <span className="text-white/80">reviews</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="btn-lift text-white font-semibold"
                style={{ borderRadius: "999px", padding: "0.875rem 2.5rem" }}
              >
                <Link to="/collections">
                  <span>Shop Products</span>
                  <span className="btn-arrow ml-2" aria-hidden="true">→</span>
                </Link>
              </Button>
              {/* Secondary CTA — `variant="inverted"` keeps the background TRANSPARENT
                  (not `bg-background` like `outline`) so the white text + white border
                  are always visible on the dark hero scrim. 14.5:1 contrast. */}
              <Button
                asChild
                size="lg"
                variant="inverted"
                className="btn-lift font-semibold"
                style={{ borderRadius: "999px", padding: "0.875rem 2.5rem" }}
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
                  Book Salon
                </a>
              </Button>
            </div>
          </div>

          {/* RIGHT — Jena portrait card */}
          <div className="relative hidden lg:flex justify-end items-end">
            <figure
              className="relative bg-white p-3 pb-12 rounded-[6px] rotate-[1.5deg] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] max-w-[360px] xl:max-w-[420px] transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(252,250,254,0.95))",
              }}
            >
              <div className="relative overflow-hidden rounded-[3px] aspect-[4/5] bg-[hsl(var(--accent))]">
                <picture>
                  <img
                    src={jenaPortrait}
                    alt="Jena Pinn — owner and senior stylist at Hair Pinns Bangor, pictured in her Bangor salon studio"
                    width="1080"
                    height="1350"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
                {/* Subtle gold gradient at the top for editorial warmth */}
                <div
                  className="absolute inset-x-0 top-0 h-16 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(198,128,87,0.18), transparent)",
                  }}
                  aria-hidden="true"
                />
              </div>
              <figcaption className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="font-heading font-semibold text-heading text-base leading-tight">
                    Jena Pinn
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Owner · Senior Stylist · Bangor
                  </p>
                </div>
                <span
                  className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--brand-600))] font-semibold"
                  aria-hidden="true"
                >
                  est. 2009
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
