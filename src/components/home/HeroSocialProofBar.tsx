import { Star, Truck, Shield } from "lucide-react";

/**
 * HeroSocialProofBar — editorial-soft rev.
 *
 * The bar lives under the hero and carries the trust signals so the hero
 * itself can stay a single beat (one portrait, one headline, one CTA).
 *
 * Three quiet chips, plenty of air. No competing icon row.
 */
const HeroSocialProofBar = () => {
  return (
    <div className="border-y border-[hsl(var(--gold))]/15 bg-[hsl(var(--background))]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 py-5 text-sm text-foreground/80">
          <li className="flex items-center gap-3 justify-center sm:justify-start">
            <Star className="h-4 w-4 text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" strokeWidth={1.5} aria-hidden="true" />
            <span className="whitespace-nowrap">
              <span className="font-semibold text-foreground">4.9 / 5</span>{" "}
              <span className="text-foreground/60">from 762+ reviews</span>
            </span>
          </li>
          <li className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck className="h-4 w-4 text-[hsl(var(--gold))]" strokeWidth={1.5} aria-hidden="true" />
            <span className="whitespace-nowrap">
              <span className="font-semibold text-foreground">Free shipping</span>{" "}
              <span className="text-foreground/60">over $150</span>
            </span>
          </li>
          <li className="flex items-center gap-3 justify-center sm:justify-start">
            <Shield className="h-4 w-4 text-[hsl(var(--gold))]" strokeWidth={1.5} aria-hidden="true" />
            <span className="whitespace-nowrap">
              <span className="font-semibold text-foreground">14-day returns</span>{" "}
              <span className="text-foreground/60">no drama</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeroSocialProofBar;
