import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { Award, Heart, Sparkles } from "lucide-react";

// ── Canonical Jena portrait ──────────────────────────────────────────────────
// ALWAYS use jena-headshot.avif / jena-headshot.webp from src/assets/images.
// Do NOT swap this for any other portrait asset without Tyson's explicit sign-off.
import jenaHeadshotAvif from "@/assets/images/jena-headshot.avif";
import jenaHeadshotWebp from "@/assets/images/jena-headshot.webp";

/**
 * The Jena Promise — editorial "about the owner" section.
 *
 * Layout: 2-column on md+, stacked on mobile.
 *   Left  → Jena's headshot (jena-headshot.avif / .webp — canonical, never swap)
 *   Right → headline, tagline, 3 promises, CTAs
 *
 * Round-7 fix: portrait restored using the correct canonical jena-headshot
 * (the previous jena-promise-portrait files were the wrong image and have
 * been deleted from the repo).
 */
const promises = [
  {
    icon: Award,
    title: "In the chair since 2009",
    body: "Over fifteen years of cutting, colouring and treating real hair in a real Bangor salon. Not a dropshipper, not a brand rep.",
  },
  {
    icon: Sparkles,
    title: "I only stock what I use",
    body: "Every product on this site is something I have personally used on a client and would use on you. If it doesn't perform, it doesn't make the shelf.",
  },
  {
    icon: Heart,
    title: "Packed at the salon",
    body: "Your order is picked, packed and posted by me. Same-day dispatch on weekdays. Free shipping over $150 anywhere in Australia.",
  },
];

const JenaPromise = () => {
  return (
    <Section
      variant="gold"
      padding="editorial"
      number={{ index: "01", label: "the jena promise" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ── Left: Jena portrait ── */}
        <div className="relative w-full max-w-sm mx-auto md:mx-0">
          {/* Offset shadow card for visual weight */}
          <div
            className="absolute inset-0 rounded-2xl bg-gold/30 translate-x-3 translate-y-3"
            aria-hidden="true"
          />
          <picture className="relative block rounded-2xl overflow-hidden shadow-lg">
            <source srcSet={jenaHeadshotAvif} type="image/avif" />
            <img
              src={jenaHeadshotWebp}
              alt="Jena, owner and hairdresser at Hair Pinns Bangor"
              width={1080}
              height={1350}
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </picture>
          {/* Name badge */}
          <div className="absolute bottom-4 left-4 right-4 bg-heading/90 text-white text-center py-2 px-4 rounded-xl text-sm font-heading tracking-widest uppercase">
            Jena · Hair Pinns Bangor
          </div>
        </div>

        {/* ── Right: copy + promises + CTAs ── */}
        <div>
          <SectionHeader
            align="left"
            tagline="Hair care from someone who actually does hair."
            title="I started Hair Pinns in 2009, and I still do the colour."
            subtitle="Three things haven't changed since the first cut. The products I trust, the way I treat a client, and the salon I work from. The site is just a way to ship those products to you."
            display
          />

          <div className="space-y-6 mt-8 reveal-stagger-slow">
            {promises.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="reveal flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/70 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-heading mb-1">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="btn-lift font-semibold"
              style={{ borderRadius: "999px", padding: "0.875rem 2.5rem" }}
            >
              <Link to="/about">
                <span>Read my story</span>
                <span className="btn-arrow ml-2" aria-hidden="true">→</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="btn-lift font-semibold border-heading/20"
              style={{ borderRadius: "999px", padding: "0.875rem 2.5rem" }}
            >
              <Link to="/booking">Book a chair</Link>
            </Button>
          </div>
        </div>

      </div>
    </Section>
  );
};

export default JenaPromise;
