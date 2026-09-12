import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import heroJournalMobileAvif640 from "@/assets/images/hero-journal-mobile-640w.avif";
import heroJournalAvif640 from "@/assets/images/hero-journal-640w.avif";
import heroJournalAvif1280 from "@/assets/images/hero-journal-1280w.avif";
import heroJournalAvif1440 from "@/assets/images/hero-journal-1440w.avif";
import heroJournalMobileWebp640 from "@/assets/images/hero-journal-mobile-640w.webp";
import heroJournalWebp640 from "@/assets/images/hero-journal-640w.webp";
import heroJournalWebp1280 from "@/assets/images/hero-journal-1280w.webp";
import heroJournalWebp1440 from "@/assets/images/hero-journal-1440w.webp";
import jenaSignatureAvif160 from "@/assets/images/jena-signature-160w.avif";
import jenaSignatureAvif320 from "@/assets/images/jena-signature-320w.avif";
import jenaSignatureWebp160 from "@/assets/images/jena-signature-160w.webp";
import jenaSignatureWebp320 from "@/assets/images/jena-signature-320w.webp";

/**
 * Product-first editorial hero.
 *
 * The finished salon work is the visual protagonist, while Jena remains the
 * human trust signature. The static responsive image is deliberately the only
 * hero media so the approved art direction and LCP remain stable everywhere.
 */
const HeroHome = () => (
  <section
    className="relative overflow-hidden"
    style={{ background: "hsl(var(--hp-lavender))" }}
  >
    <div className="grid min-h-[calc(100svh-4rem)] lg:min-h-[calc(100svh-5.25rem)] lg:grid-cols-[minmax(0,47%)_minmax(0,53%)]">
      <div className="order-2 relative flex items-center px-4 pb-24 pt-8 sm:px-6 sm:py-14 lg:order-1 lg:px-[clamp(3rem,6vw,6.5rem)] lg:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 max-w-[44rem]">
          <div className="mb-5 flex items-center gap-3 sm:mb-7">
            <span
              aria-hidden="true"
              className="h-px w-6 sm:w-9"
              style={{ background: "hsl(var(--after-hours-copper))" }}
            />
            <p
              className="m-0 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.13em] sm:text-[10px] sm:tracking-[0.2em]"
              style={{ color: "hsl(var(--after-hours-copper))" }}
            >
              Salon-picked hair care · Shipped Australia-wide
            </p>
          </div>

          <h1
            className="m-0 text-[clamp(2rem,9vw,2.625rem)] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[clamp(2.8rem,5vw,4.25rem)]"
            style={{
              color: "hsl(var(--hp-ink))",
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Hair care from someone who{" "}
            <em
              className="font-normal"
              style={{ color: "hsl(var(--after-hours-copper))" }}
            >
              actually
            </em>{" "}
            does hair.
          </h1>

          <p
            className="mt-6 max-w-[36rem] text-[0.94rem] leading-7 sm:mt-8 sm:text-[1.05rem]"
            style={{ color: "hsl(var(--hp-ink))" }}
          >
            A short shelf of salon-tested hair care, chosen to make your next
            routine easier to understand.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-9 sm:gap-x-7">
            <Button
              asChild
              size="lg"
              className="min-h-12 rounded-[2px] border-0 !bg-[hsl(var(--hp-purple))] px-5 text-[0.82rem] font-semibold !text-white shadow-none transition-colors hover:!bg-[hsl(var(--brand-600))] sm:min-h-[3.25rem] sm:px-7"
            >
              <Link
                to="/collections"
                onClick={() => {
                  if (typeof window !== "undefined" && (window as any).dataLayer) {
                    (window as any).dataLayer.push({
                      event: "shop_click",
                      location: "hero_home",
                      cta: "shop_jenas_shelf",
                    });
                  }
                }}
              >
                Shop Jena's shelf
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </Button>
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-[hsl(var(--hp-purple)/0.5)] py-2 text-[0.82rem] text-[hsl(var(--hp-ink))] transition-colors hover:text-[hsl(var(--hp-purple))]"
              onClick={() => trackBookingClick("hero_home_secondary", window.location.pathname)}
            >
              Book the Bangor salon
            </a>
          </div>

          <div className="mt-8 flex max-w-md items-center gap-3 border-t border-[hsl(var(--hp-lilac))] pt-5 sm:mt-11 sm:gap-4 sm:pt-6">
            <picture className="shrink-0">
              <source
                type="image/avif"
                srcSet={`${jenaSignatureAvif160} 160w, ${jenaSignatureAvif320} 320w`}
                sizes="56px"
              />
              <source
                type="image/webp"
                srcSet={`${jenaSignatureWebp160} 160w, ${jenaSignatureWebp320} 320w`}
                sizes="56px"
              />
              <img
                src={jenaSignatureWebp160}
                alt="Jena, owner and hairdresser at Hair Pinns"
                className="h-12 w-12 rounded-full object-cover object-top sm:h-14 sm:w-14"
                width="160"
                height="160"
                loading="eager"
                decoding="async"
              />
            </picture>
            <div>
              <p
                className="m-0 text-[1rem] font-semibold leading-tight sm:text-[1.08rem]"
                style={{
                  color: "hsl(var(--hp-ink))",
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Selected by Jena
              </p>
              <p
                className="m-0 mt-1 text-[0.56rem] uppercase tracking-[0.14em] sm:text-[0.62rem]"
                style={{ color: "hsl(var(--hp-ink))" }}
              >
                Owner · Hairdresser · Bangor
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 relative min-h-[38svh] overflow-hidden rounded-bl-[3rem] lg:order-2 lg:min-h-full lg:rounded-bl-[7rem]">
        <picture>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet={heroJournalMobileAvif640}
          />
          <source
            type="image/avif"
            srcSet={`${heroJournalAvif640} 640w, ${heroJournalAvif1280} 1280w, ${heroJournalAvif1440} 1440w`}
            sizes="53vw"
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet={heroJournalMobileWebp640}
          />
          <source
            type="image/webp"
            srcSet={`${heroJournalWebp640} 640w, ${heroJournalWebp1280} 1280w, ${heroJournalWebp1440} 1440w`}
            sizes="53vw"
          />
          <img
            src={heroJournalWebp1280}
            alt="Smooth copper hair finished at Hair Pinns"
            className="absolute inset-0 h-full w-full object-cover object-[center_48%]"
            fetchpriority="high"
            decoding="async"
            loading="eager"
            width="1440"
            height="1755"
          />
        </picture>

        <div
          aria-hidden="true"
          className="absolute inset-x-3 inset-y-3 border sm:inset-5 lg:inset-7"
          style={{ borderColor: "hsl(var(--after-hours-cream) / 0.68)" }}
        />
        <div
          className="absolute left-3 top-3 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] sm:left-5 sm:top-5 lg:left-7 lg:top-7"
          style={{
            background: "hsl(var(--after-hours-cream))",
            color: "hsl(var(--after-hours-plum))",
          }}
        >
          01 / Finished at Hair Pinns
        </div>
        <div
          className="absolute bottom-3 left-3 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] sm:bottom-5 sm:left-5 lg:bottom-7 lg:left-7"
          style={{
            background: "hsl(var(--after-hours-cream))",
            color: "hsl(var(--after-hours-plum))",
          }}
        >
          Jena's chair · Bangor
        </div>
      </div>
    </div>
  </section>
);

export default HeroHome;
