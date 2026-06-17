import { Star, CalendarCheck, Shield, Truck } from "lucide-react";

/**
 * HeroSocialProofBar — the above-the-fold micro-row that sits directly
 * below the hero. Solves the audit gap "first-time visitors get no trust
 * signal before scrolling past the hero".
 *
 * Four compact chips, each is a single icon + 1 short line:
 *   - 762+ five-star reviews (the number is the strongest social proof in
 *     the entire site, so it has to live ABOVE the fold, not in the
 *     TrustStrip marquee that scrolls under the hero)
 *   - "X slots open this week" — Fresha availability pulse
 *   - Free shipping over $150
 *   - 14-day returns
 *
 * All four lines are <60 chars so the row never wraps on mobile.
 * White text on the brand-purple band keeps the editorial pattern of
 * gold-soft + white on a dark wash.
 */
const HeroSocialProofBar = () => {
  return (
    <div className="bg-gradient-to-r from-[hsl(var(--brand-500))] to-[hsl(var(--brand-600))] text-white border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 py-3.5 text-xs sm:text-sm">
          <li className="flex items-center gap-2 justify-center md:justify-start">
            <Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-[hsl(var(--star-color))]" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-medium whitespace-nowrap">
              <span className="font-bold">762+</span>&nbsp;five-star reviews
            </span>
          </li>
          <li className="flex items-center gap-2 justify-center md:justify-start">
            <CalendarCheck className="w-4 h-4 text-[hsl(var(--star-color))]" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-medium whitespace-nowrap">
              <span className="font-bold">Book online</span>&nbsp;24/7
            </span>
          </li>
          <li className="flex items-center gap-2 justify-center md:justify-start">
            <Truck className="w-4 h-4 text-[hsl(var(--star-color))]" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-medium whitespace-nowrap">
              <span className="font-bold">Free shipping</span>&nbsp;over&nbsp;$150
            </span>
          </li>
          <li className="flex items-center gap-2 justify-center md:justify-start">
            <Shield className="w-4 h-4 text-[hsl(var(--star-color))]" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-medium whitespace-nowrap">
              <span className="font-bold">14-day</span>&nbsp;returns, no&nbsp;drama
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeroSocialProofBar;
