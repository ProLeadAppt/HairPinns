import { ArrowRight, Check, Gift, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { trackPromoClick } from "@/config/bookingConfig";
import { FREE_EXTRA_PROMOTION, getActivePromotion } from "@/config/promotions";
import { usePromotionNow } from "@/hooks/use-promotion-now";

const steps = [
  {
    number: "01",
    title: "Choose two eligible full-size hair products",
    body: "Start with the full-size products you already use or build a new routine from Jena’s shelf.",
  },
  {
    number: "02",
    title: "Add one free extra to your bag",
    body: "Pick one travel bottle, soft head towel or wide-tooth comb and add it like any other product.",
  },
  {
    number: "03",
    title: "Check the saving before you pay",
    body: "Shopify removes the gift price automatically at checkout. If it does not, do not complete the order.",
  },
];

const giftNotes: Record<string, string> = {
  "silicon-travel-bottle-duo": "Two reusable 90mL bottles for decanting shampoo, conditioner or treatment.",
  "soft-towel": "A soft bamboo and charcoal towel made for gentler drying after wash day.",
  "purple-wide-tooth-combs": "A wide-tooth comb for working through wet hair with less pulling.",
};

export default function OfferFreeExtra() {
  const promotion = FREE_EXTRA_PROMOTION;
  const now = usePromotionNow();
  const startsAt = new Date(promotion.startsAt);
  const endsAt = new Date(promotion.endsAt);
  const isActive = Boolean(getActivePromotion(now));
  const isUpcoming = now < startsAt;
  const isExpired = now >= endsAt;
  const shopHref = isExpired ? "/collections" : "/collections/free-extra-eligible";

  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-paper))] text-[hsl(var(--after-hours-plum))]">
      <SEOHead
        title="Buy two full-size products and choose a free extra | Hair Pinns"
        description="Choose two eligible full-size hair products and one useful Hair Pinns extra. Add all three to your bag and Shopify removes the gift price at checkout."
        canonical="https://hairpinns.com/offers/free-extra"
        noIndex
      />
      <Header />

      <main id="main-content" tabIndex={-1} data-free-extra-offer="">
        <div className="border-b border-[hsl(var(--after-hours-cream)/0.16)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Free extra offer" }]} variant="dark" />
          </div>
        </div>

        <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]" aria-labelledby="free-extra-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-end lg:px-8 lg:py-24">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.88)]">
                {isActive ? "Now on / 05–12 August" : isUpcoming ? "Starts 9:00am AEST / 05 August" : "Offer ended / 12 August"}
              </p>
              <h1 id="free-extra-title" className="mt-6 max-w-[11ch] font-heading text-[clamp(3.4rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[hsl(var(--after-hours-cream))]">
                {promotion.headline}
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-[hsl(var(--after-hours-cream)/0.8)] sm:text-lg sm:leading-8">
                {promotion.body}
              </p>
            </div>

            <div className="border-t border-[hsl(var(--after-hours-cream)/0.25)] pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="font-heading text-2xl font-semibold">
                {isExpired ? "This offer has finished." : isUpcoming ? "Build your shortlist now." : "Three products in your bag. One is free."}
              </p>
              <p className="mt-4 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.72)]">
                {isExpired
                  ? "The free-extra discount is no longer available, but Jena’s full product shelf is still open."
                  : "No code. Add two qualifying products and one listed extra. Confirm the gift is free in Shopify checkout before paying."}
              </p>
              <Link
                to={shopHref}
                data-cta="offer-primary"
                data-cta-placement="offer_page_hero"
                data-cta-offer={promotion.id}
                onClick={() => trackPromoClick("offer_page_hero", window.location.pathname)}
                className="mt-7 flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold text-[hsl(var(--after-hours-plum))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))]"
              >
                {isExpired ? "Shop Jena’s shelf" : "Choose qualifying products"}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {!isExpired && (
          <section className="border-b border-[hsl(var(--after-hours-plum)/0.18)]" aria-labelledby="claim-heading">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum))]">How to claim it</p>
              <h2 id="claim-heading" className="mt-5 max-w-[13ch] font-heading text-4xl font-semibold leading-[0.96] sm:text-5xl">Three steps. Check the saving before you pay.</h2>
              <ol className="mt-12 grid border-t border-[hsl(var(--after-hours-plum)/0.22)] md:grid-cols-3">
                {steps.map((step) => (
                  <li key={step.number} className="border-b border-[hsl(var(--after-hours-plum)/0.22)] py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                    <p className="font-mono text-xs text-[hsl(var(--after-hours-plum))]">{step.number}</p>
                    <h3 className="mt-5 font-heading text-2xl font-semibold">{step.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.72)]">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {!isExpired && (
          <section className="bg-[hsl(var(--after-hours-cream))]" aria-labelledby="gift-heading">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
              <div className="flex flex-col gap-5 border-t border-[hsl(var(--after-hours-plum)/0.2)] pt-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="after-hours-kicker text-[hsl(var(--after-hours-plum))]">Choose one</p>
                  <h2 id="gift-heading" className="mt-5 font-heading text-4xl font-semibold sm:text-5xl">Pick the extra you’ll actually use.</h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.7)]">Gift colours and variants are subject to live stock. Add only one free extra per order.</p>
              </div>

              <div className="mt-10 grid gap-px border border-[hsl(var(--after-hours-plum)/0.18)] bg-[hsl(var(--after-hours-plum)/0.18)] md:grid-cols-3">
                {promotion.gifts.map((gift, index) => (
                  <Link
                    key={gift.handle}
                    to={`/products/${gift.handle}`}
                    data-cta="offer-gift"
                    data-cta-placement="offer_page_gifts"
                    data-cta-offer={promotion.id}
                    onClick={() => trackPromoClick(`offer_page_gift_${gift.handle}`, window.location.pathname)}
                    className="group flex min-h-[19rem] flex-col justify-between bg-[hsl(var(--after-hours-paper))] p-6 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--after-hours-copper))]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Gift className="h-7 w-7 text-[hsl(var(--after-hours-copper))]" aria-hidden="true" />
                        <span className="font-mono text-xs text-[hsl(var(--after-hours-plum)/0.56)]">0{index + 1}</span>
                      </div>
                      <h3 className="mt-10 max-w-[14ch] font-heading text-3xl font-semibold leading-none">{gift.title}</h3>
                      <p className="mt-5 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.7)]">{giftNotes[gift.handle]}</p>
                    </div>
                    <span className="mt-8 inline-flex min-h-11 items-center justify-between border-t border-[hsl(var(--after-hours-plum)/0.2)] pt-4 text-sm font-semibold">
                      Choose this extra <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-y border-[hsl(var(--after-hours-plum)/0.2)]" aria-labelledby="terms-heading">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-plum))]">Offer terms</p>
                <h2 id="terms-heading" className="mt-5 font-heading text-3xl font-semibold">The useful details.</h2>
              </div>
              <div className="space-y-4 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">
                <p><strong className="text-[hsl(var(--after-hours-plum))]">Timing:</strong> Starts 9:00am AEST on 5 August 2026. Ends 9:00am AEST on 12 August 2026, or earlier if promotional stock or the 200-redemption allocation runs out.</p>
                <p><strong className="text-[hsl(var(--after-hours-plum))]">Eligibility:</strong> Buy two eligible full-size hair products in one order. Excludes QIQI products, sale items, bundles, gift cards, services and free-extra products.</p>
                <p><strong className="text-[hsl(var(--after-hours-plum))]">Gift:</strong> Add one listed free extra to the same bag. Limited to one free extra per order and limited to 200 redemptions. Colours and variants depend on live stock.</p>
                <p><strong className="text-[hsl(var(--after-hours-plum))]">Checkout:</strong> The gift discount appears automatically in Shopify checkout. This offer cannot be combined with another discount. Free standard shipping applies when the post-discount subtotal is $150 or more.</p>
                <p><strong className="text-[hsl(var(--after-hours-plum))]">Returns:</strong> If a qualifying product is returned, the free extra must also be returned unopened. If it is not returned, its retail value may be deducted from the refund.</p>
                <p className="flex items-start gap-3 pt-2"><Check className="mt-0.5 h-5 w-5 flex-none text-[hsl(var(--after-hours-copper))]" aria-hidden="true" /> If the gift is not shown as free at checkout, stop and contact Hair Pinns before paying.</p>
              </div>
            </div>
          </div>
        </section>

        {!isExpired && (
          <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
            <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex items-start gap-4">
                <ShoppingBag className="mt-1 h-6 w-6 flex-none text-[hsl(var(--after-hours-copper))]" aria-hidden="true" />
                <div>
                  <p className="font-heading text-3xl font-semibold">Two full-size products. One useful extra.</p>
                  <p className="mt-2 text-sm text-[hsl(var(--after-hours-cream)/0.7)]">Add all three to your bag, then check the discount in Shopify checkout.</p>
                </div>
              </div>
              <Link to={shopHref} className="flex min-h-12 min-w-[15rem] items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-copper))]">
                Choose qualifying products <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
