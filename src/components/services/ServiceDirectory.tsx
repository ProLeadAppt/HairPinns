import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import { comprehensiveFAQs } from "@/data/faqs";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";

interface DirectoryService {
  title: string;
  subtitle?: string;
  duration?: string;
  serviceCount?: string;
  price: string;
  description?: string;
}

interface DirectoryCategory {
  id: string;
  title: string;
  services: DirectoryService[];
}

interface ServiceDirectoryProps {
  categories: DirectoryCategory[];
  activeSection: string;
  totalServices: number;
  serviceSlugMap: Record<string, string>;
}

const serviceLabel = (count: number) => `${count} ${count === 1 ? "service" : "services"}`;

const ServiceDirectory = ({ categories, activeSection, totalServices, serviceSlugMap }: ServiceDirectoryProps) => (
  <main id="main-content" tabIndex={-1} data-services-page="">
    <div className="bg-[hsl(var(--after-hours-cream))] px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[78rem]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      </div>
    </div>

    <section data-services-hero="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
      <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:px-8 lg:py-24">
        <div>
          <p className="after-hours-kicker text-[hsl(var(--after-hours-bronze))]">01 / Service menu</p>
          <h1 className="mt-6 max-w-[12ch] font-heading text-[clamp(3.15rem,7vw,6.9rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[hsl(var(--after-hours-cream))]">
            Find the right time in Jena’s chair.
          </h1>
        </div>
        <div className="max-w-[32rem] border-t border-[hsl(var(--after-hours-cream)/0.22)] pt-6 lg:justify-self-end">
          <p className="text-base leading-7 text-[hsl(var(--after-hours-cream)/0.78)] sm:text-lg">
            Browse the complete Hair Pinns booking menu by service. Prices and appointment times are shown as listed in the booking system.
          </p>
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("services_hero", "/services")}
            className="mt-8 inline-flex min-h-12 items-center justify-between gap-8 bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold text-[hsl(var(--after-hours-plum))]"
            style={{ color: "hsl(var(--after-hours-plum))" }}
          >
            {BOOK_CTA_LABEL}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--after-hours-cream)/0.18)]">
        <dl className="mx-auto grid max-w-[78rem] grid-cols-3 px-4 sm:px-6 lg:px-8">
          <div className="py-5 pr-3">
            <dt className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.52)]">Menu</dt>
            <dd className="mt-2 font-heading text-2xl text-[hsl(var(--after-hours-cream))]">{totalServices}</dd>
          </div>
          <div className="border-x border-[hsl(var(--after-hours-cream)/0.18)] px-3 py-5 sm:px-6">
            <dt className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.52)]">Categories</dt>
            <dd className="mt-2 font-heading text-2xl text-[hsl(var(--after-hours-cream))]">{categories.length}</dd>
          </div>
          <div className="py-5 pl-3 sm:pl-6">
            <dt className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.52)]">Studio</dt>
            <dd className="mt-2 font-heading text-2xl text-[hsl(var(--after-hours-cream))]">Bangor</dd>
          </div>
        </dl>
      </div>
    </section>

    <nav aria-label="Service categories" data-services-nav="" className="sticky top-0 z-30 border-b border-[hsl(var(--after-hours-plum)/0.18)] bg-[hsl(var(--after-hours-cream)/0.96)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[78rem] gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {categories.map((category, index) => {
          const active = activeSection === category.id;
          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              aria-current={active ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                const element = document.getElementById(category.id);
                if (!element) return;
                const top = element.offsetTop - 84;
                window.scrollTo({ top, behavior: "smooth" });
              }}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 border px-4 py-2 text-xs font-semibold tracking-[0.04em] transition-colors"
              style={active
                ? { color: "hsl(var(--after-hours-cream))", backgroundColor: "hsl(var(--after-hours-plum))", borderColor: "hsl(var(--after-hours-plum))" }
                : { color: "hsl(var(--after-hours-plum))", borderColor: "hsl(var(--after-hours-plum) / 0.2)" }}
            >
              <span className="font-mono text-[0.65rem] opacity-80">{String(index + 1).padStart(2, "0")}</span>
              {category.title}
            </a>
          );
        })}
      </div>
    </nav>

    <div data-services-directory="" className="bg-[hsl(var(--after-hours-cream))]">
      {categories.map((category, categoryIndex) => (
        <section
          key={category.id}
          id={category.id}
          aria-labelledby={`${category.id}-heading`}
          className="scroll-mt-24 border-b border-[hsl(var(--after-hours-plum)/0.18)]"
        >
          <div className="mx-auto grid max-w-[78rem] gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[0.35fr_0.65fr] lg:gap-14 lg:px-8 lg:py-20">
            <header className="lg:sticky lg:top-28 lg:self-start">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">{String(categoryIndex + 1).padStart(2, "0")} / Category</p>
              <h2 id={`${category.id}-heading`} className="mt-4 max-w-[13ch] font-heading text-[clamp(2.25rem,4vw,4.25rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]">
                {category.title}
              </h2>
              <p className="mt-5 text-sm text-[hsl(var(--after-hours-plum)/0.74)]">{serviceLabel(category.services.length)}</p>
            </header>

            <div className="grid border-t border-[hsl(var(--after-hours-plum)/0.32)] lg:grid-cols-2 lg:gap-x-8">
              {category.services.map((service, serviceIndex) => {
                const serviceSlug = serviceSlugMap[service.title];
                return (
                  <article key={service.title} className="border-b border-[hsl(var(--after-hours-plum)/0.18)] py-5 sm:py-6">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 sm:gap-6">
                      <div className="min-w-0">
                        <p className="font-mono text-[0.66rem] tracking-[0.12em] text-[hsl(var(--after-hours-plum)/0.74)]">{String(serviceIndex + 1).padStart(2, "0")}</p>
                        <h3 className="mt-3 max-w-[28ch] font-heading text-[1.55rem] font-semibold leading-[1.08] tracking-[-0.025em] text-[hsl(var(--after-hours-plum))] sm:text-[1.8rem]">
                          {service.title}
                        </h3>
                        {(service.duration || service.serviceCount) && (
                          <p className="mt-3 text-sm text-[hsl(var(--after-hours-plum)/0.62)]">
                            {[service.duration, service.serviceCount].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                      <p className="whitespace-nowrap font-heading text-xl font-semibold tabular-nums text-[hsl(var(--after-hours-plum))] sm:text-right sm:text-2xl">{service.price}</p>
                    </div>
                    {(service.subtitle || service.description) && (
                      <details className="mt-3 border-t border-[hsl(var(--after-hours-plum)/0.14)] text-[hsl(var(--after-hours-plum))]">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-2 text-xs font-semibold uppercase tracking-[0.08em]">
                          Service details
                          <span aria-hidden="true">+</span>
                        </summary>
                        <div className="pb-4">
                          {service.subtitle && <p className="max-w-[62ch] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">{service.subtitle}</p>}
                          {service.description && <p className="max-w-[62ch] whitespace-pre-line text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">{service.description}</p>}
                        </div>
                      </details>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={BOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackBookingClick(`services_${category.id}_card`, "/services")}
                        aria-label={`Book now, ${service.title} on Fresha`}
                        className="inline-flex min-h-11 items-center justify-between gap-4 bg-[hsl(var(--after-hours-plum))] px-3 py-2 text-sm font-semibold"
                        style={{ color: "hsl(var(--after-hours-cream))" }}
                      >
                        Book now
                        <span aria-hidden="true">↗</span>
                      </a>
                      {serviceSlug && (
                        <Link
                          to={`/services/${category.id}/${serviceSlug}`}
                          className="inline-flex min-h-11 items-center gap-2 border border-[hsl(var(--after-hours-plum)/0.28)] px-3 py-2 text-sm font-semibold"
                          style={{ color: "hsl(var(--after-hours-plum))" }}
                        >
                          Service guide
                          <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>

    <section data-services-faq="" className="bg-[hsl(var(--after-hours-cream))]">
      <FAQSection
        faqs={comprehensiveFAQs}
        title="Before you book"
        subtitle="Answers to common Hair Pinns service and hair-care questions."
        showFeedback={true}
      />
    </section>

    <section data-services-close="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
      <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:px-8">
        <div>
          <p className="after-hours-kicker text-[hsl(var(--after-hours-bronze))]">15 / Visit or ask</p>
          <h2 className="mt-5 max-w-[11ch] font-heading text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))]">
            Not sure what to book?
          </h2>
          <p className="mt-6 max-w-[38rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.74)]">
            Book through Fresha or call the salon before choosing. Hair Pinns is based in Bangor and welcomes clients from across the Sutherland Shire.
          </p>
        </div>
        <div className="border-t border-[hsl(var(--after-hours-cream)/0.22)] pt-7">
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("services_close", "/services")}
            className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold"
            style={{ color: "hsl(var(--after-hours-plum))" }}
          >
            {BOOK_CTA_LABEL}
            <span aria-hidden="true">↗</span>
          </a>
          <a href={BUSINESS_NAP.phone.tel} className="mt-3 flex min-h-11 items-center border-b border-[hsl(var(--after-hours-cream)/0.28)] py-2 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
            {BUSINESS_NAP.phone.display}
          </a>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[hsl(var(--after-hours-cream)/0.62)]">
            <address className="not-italic">{BUSINESS_NAP.address.full}</address>
            <Link to="/areas" style={{ color: "hsl(var(--after-hours-cream))" }}>See service areas →</Link>
          </div>
          <p className="mt-6 text-xs leading-5 text-[hsl(var(--after-hours-cream)/0.5)]">Service durations and prices are shown as listed in the Hair Pinns booking menu.</p>
        </div>
      </div>
    </section>
  </main>
);

export default ServiceDirectory;
