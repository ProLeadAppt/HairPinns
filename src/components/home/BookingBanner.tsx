import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import jenaWorkingAvif480 from "@/assets/images/jena-working-480w.avif";
import jenaWorkingAvif800 from "@/assets/images/jena-working-800w.avif";
import jenaWorkingAvif1170 from "@/assets/images/jena-working-1170w.avif";
import jenaWorkingWebp480 from "@/assets/images/jena-working-480w.webp";
import jenaWorkingWebp800 from "@/assets/images/jena-working-800w.webp";
import jenaWorkingWebp1170 from "@/assets/images/jena-working-1170w.webp";

const BookingBanner = () => {
  return (
    <section
      className="overflow-hidden bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]"
      aria-labelledby="salon-close-title"
      data-home-booking-close=""
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-10 md:landscape:grid-cols-12 md:landscape:items-stretch md:landscape:gap-0 lg:grid-cols-12 lg:items-stretch lg:gap-0">
          <figure className="min-w-0 md:landscape:col-span-7 lg:col-span-7">
            <div className="h-full border border-[hsl(var(--after-hours-cream)/0.25)] p-2 sm:p-3">
              <picture className="block aspect-[4/3] min-h-0 overflow-hidden bg-[hsl(var(--after-hours-cream)/0.08)] md:landscape:h-full md:landscape:aspect-auto lg:h-full lg:aspect-auto">
                <source
                  type="image/avif"
                  srcSet={`${jenaWorkingAvif480} 480w, ${jenaWorkingAvif800} 800w, ${jenaWorkingAvif1170} 1170w`}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 56vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${jenaWorkingWebp480} 480w, ${jenaWorkingWebp800} 800w, ${jenaWorkingWebp1170} 1170w`}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 56vw"
                />
                <img
                  src={jenaWorkingWebp800}
                  alt="Jena styling a client’s hair inside Hair Pinns Bangor"
                  width="1170"
                  height="1181"
                  className="h-full w-full object-cover object-[center_45%]"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <figcaption className="flex items-center justify-between gap-4 border-b border-[hsl(var(--after-hours-cream)/0.22)] py-4">
              <span className="font-heading text-lg text-[hsl(var(--after-hours-cream))]">Jena at work</span>
              <span className="text-right text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-copper))]">
                Hair Pinns / Bangor
              </span>
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-col md:landscape:col-span-5 md:landscape:border-b md:landscape:border-r md:landscape:border-t md:landscape:border-[hsl(var(--after-hours-cream)/0.25)] md:landscape:p-8 lg:col-span-5 lg:border-b lg:border-r lg:border-t lg:border-[hsl(var(--after-hours-cream)/0.25)] lg:p-10 xl:p-12">
            <p className="mb-6 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">
              05 / Visit the salon
            </p>
            <h2
              id="salon-close-title"
              className="max-w-[9ch] font-heading text-[clamp(3rem,10vw,5.6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))] md:landscape:text-5xl"
            >
              Come in and see me.
            </h2>
            <p className="mt-7 max-w-md text-base leading-7 text-[hsl(var(--after-hours-cream)/0.74)] sm:text-lg sm:leading-8">
              Book online any time through Fresha. Colour, cuts, and smoothing treatments in Jena’s Bangor salon.
            </p>

            <dl className="mt-10 divide-y divide-[hsl(var(--after-hours-cream)/0.2)] border-t border-[hsl(var(--after-hours-cream)/0.2)] text-sm">
              <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4">
                <dt className="text-[0.61rem] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--after-hours-copper))]">Visit</dt>
                <dd className="text-[hsl(var(--after-hours-cream)/0.86)]">60 Goorgool Rd, Bangor NSW</dd>
              </div>
              <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4">
                <dt className="text-[0.61rem] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--after-hours-copper))]">Call</dt>
                <dd>
                  <a
                    href="tel:+61416037663"
                    className="inline-flex min-h-11 items-center border-b border-[hsl(var(--after-hours-cream)/0.45)] !text-[hsl(var(--after-hours-cream))] transition-colors hover:border-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-copper))] sm:min-h-0"
                  >
                    0416 037 663
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4">
                <dt className="text-[0.61rem] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--after-hours-copper))]">Booking</dt>
                <dd className="text-[hsl(var(--after-hours-cream)/0.86)]">Managed securely through Fresha</dd>
              </div>
            </dl>

            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("booking_banner", window.location.pathname)}
              className="mt-9 inline-flex min-h-12 w-full items-center justify-between gap-6 bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] sm:w-auto lg:mt-auto"
            >
              <span>{BOOK_CTA_LABEL}</span>
              <span aria-hidden="true">↗</span>
            </a>
            <p className="mt-4 text-xs leading-5 text-[hsl(var(--after-hours-cream)/0.62)]">
              Opens Hair Pinns on Fresha in a new tab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingBanner;
