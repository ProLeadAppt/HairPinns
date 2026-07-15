import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import heroHomeAvif640 from "@/assets/images/hero-home-640w.avif";
import heroHomeAvif1280 from "@/assets/images/hero-home-1280w.avif";
import heroHomeAvif1920 from "@/assets/images/hero-home-1920w.avif";
import heroHomeWebp640 from "@/assets/images/hero-home-640w.webp";
import heroHomeWebp1280 from "@/assets/images/hero-home-1280w.webp";
import heroHomeWebp1920 from "@/assets/images/hero-home-1920w.webp";
import heroReelMp4 from "/hero-reel.mp4";
import heroPosterAvif from "/hero-poster.avif";

/**
 * HeroHome — premium editorial with optional cinematic video.
 *
 * Base layer is the responsive AVIF/WebP still (LCP). On desktop with no
 * reduced-motion and no save-data, an autoplaying muted-looped <video> is
 * layered on top, crossfading in once it's actually playing. The video
 * is decorative — the site works perfectly without it on:
 *
 *   - mobile / small tablets (intentionally no autoplay)
 *   - reduced-motion users (poster + still only)
 *   - save-data / slow connections (still wins)
 *   - prerender / headless (always still — keeps the static HTML clean
 *     and avoids a 2.7 MB video transfer for crawlers)
 *   - browsers without <video> support (still wins)
 *
 * The video has no <source> children besides the MP4 — we keep the
 * master file in one format (h.264 baseline, plays everywhere
 * desktop and modern Safari) rather than ship a 3-format set that
 * would triple the LCP-bandwidth cost. Mobile gets the still.
 */
const HeroHome = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoActive, setVideoActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't run in prerender / headless — keeps the static HTML clean
    // and avoids a 2.7 MB video transfer for crawlers.
    if (navigator.userAgent?.includes("HeadlessChrome")) return;

    // Mobile / small tablets — still only.
    if (window.innerWidth < 1024) return;

    // Respect user motion preferences + data-saver.
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (reducedMotion) return;

    // navigator.connection is not in the TS lib types; cast for the gate.
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return;

    // Slow connection (effectiveType 2g/3g) — don't autoplay video.
    if (conn && ["slow-2g", "2g", "3g"].includes((conn as any).effectiveType)) {
      return;
    }

    setVideoActive(true);
  }, []);

  const handleCanPlay = () => {
    // Fade video in only once it has a frame to show, so the user never
    // sees a flicker of black between still and video.
    setVideoReady(true);
  };

  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      {/* Background — still is always rendered (LCP, fallback, mobile). */}
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

        {/* Optional video overlay — desktop only, motion-ok, no save-data.
            Decodes "async" so the first paint is the still, not a video
            frame. Crossfades in only once canplay fires. */}
        {videoActive && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: videoReady ? 1 : 0 }}
            src={heroReelMp4}
            poster={heroPosterAvif}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden="true"
            onCanPlay={handleCanPlay}
          />
        )}

        {/* Editorial scrim — slightly stronger when video is on so the
            headline stays readable over a moving picture. */}
        <div
          className="absolute inset-0"
          style={{
            background: videoReady
              ? "linear-gradient(110deg, rgba(24,0,30,0.88) 0%, rgba(24,0,30,0.55) 45%, rgba(24,0,30,0.30) 100%)"
              : undefined,
          }}
        >
          {!videoReady && (
            <div className="absolute inset-0 bg-[rgba(24,0,30,0.82)] lg:bg-gradient-to-tr lg:from-[rgba(24,0,30,0.92)] lg:via-[rgba(24,0,30,0.55)] lg:to-[rgba(24,0,30,0.18)]" />
          )}
        </div>
      </div>

      {/* Content — single column, max-width, lots of air at the bottom */}
      <div className="relative z-10 w-full pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl hero-stagger">
            {/* Eyebrow — small, gold, single line */}
            <span
              className="eyebrow inline-block text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--gold))] mb-8"
            >
              Salon-picked hair care · Shipped Australia-wide
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

            {/* Commerce is the primary action. Salon booking stays available
                as a quieter secondary path. */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="btn-lift text-white font-semibold"
                style={{ borderRadius: "999px", padding: "1rem 2.75rem" }}
              >
                <Link
                  to="/collections"

                  onClick={() => {
                    if (typeof window !== "undefined" && (window as any).dataLayer) {
                      (window as any).dataLayer.push({
                        event: "shop_click",
                        location: "hero_home",
                        cta: "shop_jenas_shelf",
                      });
                    }
                  }}
                >
                  Shop Jena's shelf
                  <span className="btn-arrow ml-2" aria-hidden="true">→</span>
                </Link>
              </Button>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white text-sm underline-offset-4 hover:underline transition"
                onClick={() => trackBookingClick("hero_home_secondary", window.location.pathname)}
              >
                Book the Bangor salon →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
