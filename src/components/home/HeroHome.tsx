import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Sparkles } from "lucide-react";
import heroBg from "@/assets/images/hero-home-new.webp";
import jenaPortrait from "@/assets/images/jena-headshot.webp";

/**
 * HeroHome — editorial-soft rev.
 *
 * One clear hero, one clear action, lots of air. Trust signals live in
 * a thin band UNDER the hero (HeroSocialProofBar) so the hero itself
 * stays a single beat: portrait of Jena, one headline, one CTA.
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
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      {/* Background — poster is the LCP. AVIF for browsers that support it. */}
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
