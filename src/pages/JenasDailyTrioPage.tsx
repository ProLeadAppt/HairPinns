import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { JENAS_DAILY_TRIO } from "@/data/jenasDailyTrio";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";

const canonical = "https://hairpinns.com/collections/jenas-daily-trio";

const JenasDailyTrioPage = () => {
  const trio = JENAS_DAILY_TRIO;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "Collections", url: "https://hairpinns.com/collections" },
    { name: trio.name, url: canonical },
  ]);
  const webPage = generateWebPageSchema({
    name: `${trio.name} | Hair Pinns`,
    description: trio.subheadline,
    url: canonical,
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-paper))]">
      <SEOHead
        title={`${trio.name} | Hair Pinns`}
        description={trio.subheadline}
        canonical={canonical}
        ogImage={getOGImage("collection")}
        hrefLang="en-AU"
        noIndex
        schemaJson={[breadcrumb, webPage]}
      />
      <Header />

      <main id="main-content" tabIndex={-1} data-trio-page="" data-trio-status={trio.status}>
        <div className="border-b border-[hsl(var(--after-hours-cream)/0.16)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[78rem]">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections" },
                { label: trio.name },
              ]}
              variant="dark"
            />
          </div>
        </div>

        <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]" aria-labelledby="trio-title">
          <div className="mx-auto grid max-w-[78rem] lg:min-h-[38rem] lg:grid-cols-[0.64fr_0.36fr]">
            <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:pr-16">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">{trio.eyebrow}</p>
              <h1
                id="trio-title"
                className="mt-6 max-w-[10ch] font-heading text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[0.89] tracking-[-0.055em]"
              >
                {trio.headline}
              </h1>
              <p className="mt-8 max-w-[40rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.78)] sm:text-lg sm:leading-8">
                {trio.subheadline}
              </p>
            </div>

            <aside className="flex flex-col justify-between border-t border-[hsl(var(--after-hours-cream)/0.18)] bg-[hsl(var(--after-hours-cream))] p-6 text-[hsl(var(--after-hours-plum))] sm:p-10 lg:border-l lg:border-t-0 lg:p-12" aria-label="What to do next">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.62)]">While Jena updates the routine</p>
                <p className="mt-6 border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-6 text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.72)]">
                  {trio.supportingCopy}
                </p>
              </div>

              <div className="mt-12 space-y-3">
                <Link
                  to="/collections"
                  className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:bg-[hsl(var(--after-hours-copper))] hover:no-underline"
                >
                  Browse haircare
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("jenas_trio_paused", "/collections/jenas-daily-trio")}
                  className="flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-plum)/0.38)] px-5 py-3 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline"
                >
                  {BOOK_CTA_LABEL}
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-[hsl(var(--after-hours-plum)/0.18)] px-4 py-14 text-[hsl(var(--after-hours-plum))] sm:px-6 lg:px-8 lg:py-20" aria-labelledby="trio-accuracy-title">
          <div className="mx-auto grid max-w-[78rem] gap-8 border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-6 md:grid-cols-[0.7fr_1.3fr]">
            <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.62)]">Why it is paused</p>
            <div>
              <h2 id="trio-accuracy-title" className="max-w-[14ch] font-heading text-[clamp(2.4rem,6vw,5rem)] leading-[0.94] tracking-[-0.045em]">
                Product advice should be accurate.
              </h2>
              <p className="mt-6 max-w-[42rem] text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.7)] sm:text-base">
                The trio will return only after its three products, current stock and final bundle price are confirmed. That way, what you see here will match what appears in your bag and at checkout.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JenasDailyTrioPage;
