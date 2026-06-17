import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero-home-new.webp";

/**
 * HeroHome — the homepage hero.
 *
 * Changes in this revision:
 *  - h1 uses the new fluid `h-display` Fraunces class so it scales from
 *    48px (mobile) → 88px (desktop) without a breakpoint swap.
 *  - The brand tagline ("Jena Pinn. Bangor salon. Shipping nationwide.")
 *    uses the new italic Fraunces `.tagline` class for a warmer, more
 *    editorial voice.
 *  - Buttons get the `.btn-lift` micro-interaction (lift + arrow slide).
 *  - Eyebrow above the h1 ("hair care · est 2009 · bangor nsw") — small caps
 *    gold, the new pattern across the redesign.
 */
const HeroHome = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") return;

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
            src={heroImage}
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
            poster={heroImage}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
          >
            <source src="/hero-reel.mp4" type="video/mp4" />
          </video>
        )}
        {/* Stronger dark gradient — bumps overlay opacity in the headline band to keep WCAG AA contrast for the subtitle. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,0,30,0.92)] via-[rgba(24,0,30,0.55)] to-[rgba(24,0,30,0.15)]" />
      </div>

      {/* Content — left-aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-24">
        <div className="max-w-2xl hero-stagger">
          {/* Eyebrow — small caps gold, the editorial redesign's new pattern. */}
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
            className="tagline text-white/90 mb-8 max-w-lg"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
          >
            Jena Pinn. Bangor salon. Shipping nationwide.
          </p>

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
            <Button
              asChild
              size="lg"
              variant="outline"
              className="btn-lift text-white border-white hover:bg-white hover:text-heading font-semibold"
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
      </div>
    </section>
  );
};

export default HeroHome;
