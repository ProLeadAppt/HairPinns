import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, MoveHorizontal } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionNumber from "@/components/design-system/SectionNumber";
import { Link } from "react-router-dom";

// Real salon editorial photos already in the bundle. We use these as a
// "styling reference" demo (not a fake before/after claim) — the slider
// reveals a basin wash vs an in-chair finish, both shot at the Bangor salon.
// Honest framing: "styling reference", not "transformation proof".

import brunetteAtBasin from "@/assets/images/brunette-woman-getting-her-hair-washed.webp";
import hairdresserWithClient from "@/assets/images/hairdresser-taking-care-her-client.webp";

interface ComparisonPair {
  id: string;
  label: string;
  caption: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}

const PAIRS: ComparisonPair[] = [
  {
    id: "bouncy-blow-dry",
    label: "Bouncy blow-dry",
    caption: "Same chair. Different moment.",
    before: brunetteAtBasin,
    after: hairdresserWithClient,
    beforeAlt: "Brunette client at the basin, post-shampoo, ready to style",
    afterAlt: "Hairdresser styling a client in the chair, mid-finish",
  },
];

const BeforeAfterShowcase = () => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const clientX =
        "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      updatePosition(clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePosition]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    const clientX =
      "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as React.MouseEvent).clientX;
    updatePosition(clientX);
  };

  return (
    <Section padding="editorial" maxWidth="xl">
      <SectionNumber index="04" label="in the chair" />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-3">Styling reference</p>
          <h2 className="font-heading text-h2-lg font-bold text-heading mb-5">
            What a fresh finish looks like in the chair.
          </h2>
          <p className="text-body text-muted-foreground mb-4">
            Drag the slider to see natural hair on the left, finished
            styling on the right. Real photos from the Bangor salon — not
            stock, not filtered. Just the kind of result you can book in
            for.
          </p>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>Every finish is built with the products on the shelf — nothing locked away in a back room.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>If you can&rsquo;t recreate it at home, I&rsquo;ll show you how in the chair. No gatekeeping.</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-full bg-heading px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-heading/90"
            >
              Book a blow-dry
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-full border border-heading/20 px-5 py-2.5 text-sm font-semibold text-heading transition hover:border-gold hover:text-gold"
            >
              See services
            </Link>
          </div>
        </div>

        <div>
          {PAIRS.map((pair) => (
            <div key={pair.id} className="space-y-3">
              <div
                ref={containerRef}
                className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-2xl border border-gold/20 bg-muted shadow-card"
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                role="img"
                aria-label={`${pair.label} — drag to compare`}
              >
                {/* "After" — full bleed */}
                <img
                  src={pair.after}
                  alt={pair.afterAlt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />

                {/* "Before" — clipped from the left */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                  <img
                    src={pair.before}
                    alt={pair.beforeAlt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Labels */}
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-heading backdrop-blur">
                  Natural
                </span>
                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-heading/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background backdrop-blur">
                  Styled
                </span>

                {/* Slider handle */}
                <div
                  className="pointer-events-none absolute inset-y-0"
                  style={{ left: `${position}%` }}
                  aria-hidden="true"
                >
                  <div className="h-full w-px bg-background/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background text-heading shadow-lg ring-2 ring-gold">
                    <MoveHorizontal className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {pair.label}
                </p>
                <p className="text-xs text-muted-foreground">{pair.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default BeforeAfterShowcase;
