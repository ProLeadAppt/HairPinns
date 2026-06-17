import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Sparkles, Truck, MapPin } from "lucide-react";

/**
 * TrustStrip — the marquee of brand-trust signals under the hero.
 * Subtle, infinite-scrolls, pauses on hover. The text uses the new small-caps
 * gold eyebrow style so it reads as a quiet confidence signal, not a SaaS row
 * of logos.
 *
 * Items are intentionally text-only — Hair Pinns sells hair products, not
 * enterprise SaaS, so a logo row would feel borrowed. Real brand words carry
 * more weight here.
 */
const items = [
  { icon: Award, label: "762+ five-star Google reviews" },
  { icon: Sparkles, label: "Stocked by a stylist, not an algorithm" },
  { icon: Truck, label: "Free shipping over $150, Australia-wide" },
  { icon: MapPin, label: "Packed at 60 Goorgool Rd, Bangor NSW" },
  { icon: Award, label: "In the chair since 2009" },
  { icon: Sparkles, label: "If I don't use it, I don't stock it" },
];

const TrustStrip = () => {
  return (
    <div className="bg-muted/30 border-y border-border/50 py-6">
      <div className="marquee">
        <div className="marquee-track">
          {[...items, ...items].map((item, i) => {
            const Icon = item.icon;
            return (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                <span className="tracking-wide">{item.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
