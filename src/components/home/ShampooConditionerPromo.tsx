import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { trackPromoClick } from "@/config/bookingConfig";
import {
  SHAMPOO_CONDITIONER_OFFER_ACTIVE,
  SHAMPOO_CONDITIONER_HEADLINE,
  SHAMPOO_COLLECTION_HANDLE,
} from "@/config/promotions";

/**
 * Site-wide headline promo: Buy any Shampoo — get 50% off Conditioner.
 * Sits on the homepage just below the hero.
 * Flip SHAMPOO_CONDITIONER_OFFER_ACTIVE off in src/config/promotions.ts to hide.
 */
const ShampooConditionerPromo = () => {
  if (!SHAMPOO_CONDITIONER_OFFER_ACTIVE) return null;

  return (
    <section
      aria-labelledby="shampoo-conditioner-promo-heading"
      className="bg-gradient-to-r from-brand-50 via-white to-brand-50 border-y border-brand-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center text-center md:text-left">
          {/* Left: badge */}
          <div className="flex justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4" />
              Limited offer
            </span>
          </div>

          {/* Middle: copy */}
          <div>
            <h2
              id="shampoo-conditioner-promo-heading"
              className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-heading leading-snug"
            >
              {SHAMPOO_CONDITIONER_HEADLINE}
            </h2>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
              Add any shampoo and a conditioner to your cart — the conditioner
              rings up at half price. Auto-applied at checkout.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex justify-center md:justify-end">
            <Button
              asChild
              size="lg"
              className="font-semibold shadow-md hover:shadow-lg transition-all"
              style={{ borderRadius: "999px" }}
              data-cta="shampoo-promo"
              data-cta-placement="homepage_promo_banner"
              data-cta-offer="shampoo_conditioner_50_off"
              onClick={() =>
                trackPromoClick("homepage_promo_banner", "/")
              }
            >
              <Link
                to={`/collections/${SHAMPOO_COLLECTION_HANDLE}`}
                aria-label="Shop the shampoo and conditioner offer"
              >
                Shop the offer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShampooConditionerPromo;
