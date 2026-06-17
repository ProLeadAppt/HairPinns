import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { Award, Heart, Sparkles } from "lucide-react";
import jenaPromisePortraitWebp from "@/assets/images/jena-promise-portrait.webp";
import jenaPromisePortraitAvif from "@/assets/images/jena-promise-portrait.avif";

/**
 * The Jena Promise — the editorial "about the owner" section.
 *
 * This is the brand-truth beat: Jena's portrait + her promise. It lives
 * between the hero and the bestsellers to make the page feel like a
 * magazine spread, not a product catalog. Uses the editorial section
 * rhythm (96–128px vertical padding) and the gold-soft banded background
 * so it visually separates the hero's "video drama" from the product grid
 * below.
 *
 * NOTE: The section number ("01 — the jena promise") is rendered ONCE by
 * the `Section` component below. The `SectionHeader` does NOT also render
 * an eyebrow — that would double-up the number. (Fix 2026-06-17.)
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Portrait */}
        <div className="lg:col-span-5 reveal">
          <div className="img-hover-zoom rounded-sm overflow-hidden shadow-xl aspect-[4/5] bg-[hsl(var(--accent))]">
            <picture>
              <source
                srcSet={jenaPromisePortraitAvif}
                type="image/avif"
              />
              <img
                src={jenaPromisePortraitWebp}
                alt="Jena Pinn, owner and senior stylist at Hair Pinns Bangor"
                width="1600"
                height="1140"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-3 text-center">
            Jena · Hair Pinns Bangor
          </p>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
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
