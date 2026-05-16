import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero-home-new.webp";

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
      cancelIdleCallback?: (id: number) => void;
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
      {/* Background — poster image is LCP; video is lazy-mounted after idle, never on reduced motion or Save-Data. */}
      <div className="absolute inset-0">
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
          <h1
            className="speakable-hero-intro font-heading font-bold text-white leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            Hair care from someone who actually does hair.
          </h1>

          <p className="text-white mb-8 max-w-lg" style={{ fontSize: 'clamp(16px, 2vw, 20px)', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            Jena Pinn. Bangor salon. Shipping nationwide.
          </p>

          <div>
            <Button
              asChild
              size="lg"
              variant="primary"
              className="text-white font-semibold"
              style={{ borderRadius: '999px', padding: '0.875rem 2.5rem' }}
            >
              <Link to="/collections">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
