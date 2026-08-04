import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { trackPromoClick } from "@/config/bookingConfig";
import { getActivePromotion } from "@/config/promotions";
import { usePromotionNow } from "@/hooks/use-promotion-now";

export default function PromotionFeature() {
  const now = usePromotionNow();
  const promotion = getActivePromotion(now);
  if (!promotion) return null;

  return (
    <section
      data-home-promotion=""
      aria-labelledby="free-extra-home-heading"
      className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-end lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.88)]">Limited offer / 05–12 August</p>
          <h2 id="free-extra-home-heading" className="mt-5 max-w-[14ch] font-heading text-4xl font-semibold leading-[0.96] sm:text-5xl lg:text-6xl">
            {promotion.headline}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[hsl(var(--after-hours-cream)/0.82)] sm:text-lg">
            {promotion.body}
          </p>
        </div>

        <div className="border-t border-[hsl(var(--after-hours-cream)/0.25)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="flex items-start gap-4">
            <Gift className="mt-1 h-6 w-6 flex-none text-[hsl(var(--after-hours-copper))]" aria-hidden="true" />
            <p className="text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.78)]">
              Pick a travel bottle, soft head towel or wide-tooth comb. One free extra per order, while promotional stock lasts.
            </p>
          </div>
          <Link
            to={promotion.landingPath}
            data-cta="home-free-extra"
            data-cta-placement="home_promotion_feature"
            data-cta-offer={promotion.id}
            onClick={() => trackPromoClick("home_promotion_feature", window.location.pathname)}
            className="mt-7 flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-copper))] px-5 py-3 text-sm font-semibold text-[hsl(var(--after-hours-cream))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] hover:text-[hsl(var(--after-hours-near-black))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--after-hours-plum))]"
          >
            {promotion.ctaLabel}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
