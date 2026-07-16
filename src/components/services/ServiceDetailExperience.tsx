import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedContent from "@/components/RelatedContent";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";
import { serviceDetailData, type ServiceCategoryData, type ServiceDetailData } from "@/data/serviceDetails";

interface ServiceDetailExperienceProps {
  categoryData: ServiceCategoryData;
  serviceData: ServiceDetailData;
  categorySlug: string;
  serviceSlug: string;
  topics: string[];
}

const number = (index: number) => String(index + 1).padStart(2, "0");

const ServiceDetailExperience = ({
  categoryData,
  serviceData,
  categorySlug,
  serviceSlug,
  topics,
}: ServiceDetailExperienceProps) => {
  const route = `/services/${categorySlug}/${serviceSlug}`;
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: categoryData.title, href: `/services#${categorySlug}` },
    { label: serviceData.title },
  ];

  const relatedServices = (serviceData.relatedServices || []).flatMap((relatedSlug) => {
    for (const category of serviceDetailData) {
      const service = category.services.find((candidate) => candidate.slug === relatedSlug);
      if (service) return [{ category, service }];
    }
    return [];
  });

  return (
    <main id="main-content" tabIndex={-1} data-service-detail="">
      <div className="border-b border-[hsl(var(--after-hours-cream)/0.14)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[78rem]">
          <Breadcrumbs items={breadcrumbItems} variant="dark" />
        </div>
      </div>

      <section data-service-detail-hero="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
        <div className="mx-auto grid max-w-[78rem] gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[minmax(0,0.68fr)_minmax(19rem,0.32fr)] lg:gap-20 lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.76)]">{categoryData.title}</p>
            <h1 className="mt-5 max-w-[16ch] font-heading text-[clamp(3rem,7vw,6.9rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[hsl(var(--after-hours-cream))]">
              {serviceData.title}
            </h1>
            {serviceData.tagline && (
              <p className="mt-7 max-w-[46rem] font-heading text-[1.35rem] italic leading-[1.35] text-[hsl(var(--after-hours-copper))] sm:text-[1.65rem]">
                {serviceData.tagline}
              </p>
            )}
            {serviceData.quickAnswer && (
              <p className="speakable-quick-answer mt-7 max-w-[45rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.82)] sm:text-lg sm:leading-8">
                {serviceData.quickAnswer}
              </p>
            )}
          </div>

          <aside className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" aria-label="Booking details">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7">
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[hsl(var(--after-hours-cream)/0.7)]">Price</dt>
                <dd className="mt-2 font-heading text-3xl font-semibold text-[hsl(var(--after-hours-cream))]">{serviceData.price}</dd>
              </div>
              {serviceData.duration && (
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[hsl(var(--after-hours-cream)/0.7)]">Time</dt>
                  <dd className="mt-2 text-base font-semibold text-[hsl(var(--after-hours-cream))]">{serviceData.duration}</dd>
                </div>
              )}
            </dl>
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick(`service_detail_hero_${serviceSlug}`, route)}
              className="mt-8 flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold"
              style={{ color: "hsl(var(--after-hours-plum))" }}
            >
              {BOOK_CTA_LABEL}
              <span aria-hidden="true">↗</span>
            </a>
            <p className="mt-4 text-xs leading-5 text-[hsl(var(--after-hours-cream)/0.64)]">Booking opens in Fresha. Choose the available time that suits you.</p>
          </aside>
        </div>
      </section>

      <section data-service-detail-overview="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
        <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20 lg:px-8 lg:py-24">
          <header>
            <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">01 / The appointment</p>
            <h2 className="mt-4 max-w-[10ch] font-heading text-[clamp(2.5rem,4vw,4.7rem)] font-semibold leading-[0.95] tracking-[-0.045em]">What you’re booking.</h2>
          </header>
          <div>
            <p className="max-w-[44rem] font-heading text-[clamp(1.55rem,2.8vw,2.55rem)] leading-[1.2] tracking-[-0.025em]">{serviceData.description}</p>
            <div className="mt-12 grid gap-10 border-t border-[hsl(var(--after-hours-plum)/0.3)] pt-10 md:grid-cols-2 md:gap-12">
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">Included</h3>
                <ol className="mt-6 space-y-4">
                  {serviceData.whatsIncluded.map((item, index) => (
                    <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[hsl(var(--after-hours-plum)/0.16)] pt-4 text-sm leading-6">
                      <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{number(index)}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">A good fit for</h3>
                <ol className="mt-6 space-y-4">
                  {serviceData.whoItsFor.map((item, index) => (
                    <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[hsl(var(--after-hours-plum)/0.16)] pt-4 text-sm leading-6">
                      <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{number(index)}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {serviceData.process.length > 0 && (
        <section data-service-detail-process="" className="bg-[hsl(var(--after-hours-near-black))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto max-w-[78rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="grid gap-8 border-b border-[hsl(var(--after-hours-cream)/0.24)] pb-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.74)]">02 / In the chair</p>
              <h2 className="max-w-[13ch] font-heading text-[clamp(2.7rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.05em]" style={{ color: "hsl(var(--after-hours-cream))" }}>What to expect.</h2>
            </div>
            <ol className="grid md:grid-cols-3">
              {serviceData.process.map((step, index) => (
                <li key={step.step} className="border-b border-[hsl(var(--after-hours-cream)/0.2)] py-9 md:border-b-0 md:border-r md:px-8 md:py-12 first:md:pl-0 last:md:border-r-0 last:md:pr-0">
                  <p className="font-mono text-xs text-[hsl(var(--after-hours-copper))]">{number(index)}</p>
                  <h3 className="mt-7 max-w-[14ch] font-heading text-3xl font-semibold leading-[1.05]" style={{ color: "hsl(var(--after-hours-cream))" }}>{step.step}</h3>
                  <p className="mt-5 max-w-[30rem] text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.76)]">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {serviceData.benefits.length > 0 && (
        <section data-service-detail-benefits="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20 lg:px-8 lg:py-24">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">03 / The result</p>
              <h2 className="mt-4 max-w-[10ch] font-heading text-[clamp(2.5rem,4vw,4.7rem)] font-semibold leading-[0.95] tracking-[-0.045em]">Why clients choose it.</h2>
            </header>
            <ol className="grid border-t border-[hsl(var(--after-hours-plum)/0.3)] sm:grid-cols-2">
              {serviceData.benefits.map((benefit, index) => (
                <li key={benefit} className="grid min-h-28 grid-cols-[2.2rem_1fr] gap-3 border-b border-[hsl(var(--after-hours-plum)/0.2)] py-6 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
                  <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{number(index)}</span>
                  <span className="font-heading text-xl font-semibold leading-[1.25]">{benefit}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {serviceData.homeCareBundles && (
        <section data-service-detail-homecare="" className="border-y border-[hsl(var(--after-hours-plum)/0.22)] bg-[#efe5df] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20 lg:px-8 lg:py-24">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">04 / Home care</p>
              <h2 className="mt-4 max-w-[12ch] font-heading text-[clamp(2.4rem,4vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.045em]">{serviceData.homeCareBundles.title}</h2>
              {serviceData.homeCareBundles.intro && <p className="mt-6 max-w-sm text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">{serviceData.homeCareBundles.intro}</p>}
            </header>
            <div className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
              {serviceData.homeCareBundles.products.map((product, index) => (
                <a key={product.link} href={product.link} className="group grid min-h-28 grid-cols-[2rem_1fr_auto] gap-3 border-b border-[hsl(var(--after-hours-plum)/0.22)] py-6" style={{ color: "hsl(var(--after-hours-plum))" }}>
                  <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{number(index)}</span>
                  <span>
                    <span className="block font-heading text-xl font-semibold leading-tight sm:text-2xl">{product.name}</span>
                    <span className="mt-2 block max-w-[42rem] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">{product.reason}</span>
                  </span>
                  <span aria-hidden="true" className="self-start text-lg transition-transform group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {serviceData.faqs.length > 0 && (
        <section data-service-detail-faq="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20 lg:px-8 lg:py-24">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">05 / Before booking</p>
              <h2 className="mt-4 max-w-[10ch] font-heading text-[clamp(2.5rem,4vw,4.7rem)] font-semibold leading-[0.95] tracking-[-0.045em]">Questions, answered.</h2>
            </header>
            <div className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
              {serviceData.faqs.map((faq, index) => (
                <details key={faq.question} className="group border-b border-[hsl(var(--after-hours-plum)/0.22)]">
                  <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{number(index)}</span>
                    <span>{faq.question}</span>
                    <span aria-hidden="true" className="text-lg">+</span>
                  </summary>
                  <p className="max-w-[44rem] pb-7 pl-11 text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.78)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section data-service-detail-related="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto max-w-[78rem] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
            <div className="flex items-end justify-between gap-6 border-b border-[hsl(var(--after-hours-plum)/0.3)] pb-7">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">More appointments</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Related services.</h2>
              </div>
              <Link to="/services" className="hidden text-sm font-semibold sm:inline" style={{ color: "hsl(var(--after-hours-plum))" }}>Full menu →</Link>
            </div>
            <div className="grid md:grid-cols-3">
              {relatedServices.map(({ category, service }, index) => (
                <Link key={`${category.slug}/${service.slug}`} to={`/services/${category.slug}/${service.slug}`} className="group border-b border-[hsl(var(--after-hours-plum)/0.2)] py-7 md:border-b-0 md:border-r md:px-7 first:md:pl-0 last:md:border-r-0 last:md:pr-0" style={{ color: "hsl(var(--after-hours-plum))" }}>
                  <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{number(index)}</span>
                  <h3 className="mt-5 max-w-[18ch] font-heading text-2xl font-semibold leading-[1.08]">{service.title}</h3>
                  <div className="mt-6 flex items-end justify-between gap-4 text-sm">
                    <span>{service.price}{service.duration ? ` · ${service.duration}` : ""}</span>
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedContent topics={topics} excludeSlug={`${categorySlug}/${serviceSlug}`} heading="Learn more about this treatment" />

      <section data-service-detail-close="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
        <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.64fr_0.36fr] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.74)]">Ready when you are</p>
            <h2 className="mt-5 max-w-[12ch] font-heading text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em]">Choose your time with Fresha.</h2>
          </div>
          <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-6">
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick(`service_detail_close_${serviceSlug}`, route)} className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>
              {BOOK_CTA_LABEL}
              <span aria-hidden="true">↗</span>
            </a>
            <a href={BUSINESS_NAP.phone.tel} className="mt-3 flex min-h-11 items-center border-b border-[hsl(var(--after-hours-cream)/0.26)] py-2 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>{BUSINESS_NAP.phone.display}</a>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[hsl(var(--after-hours-cream)/0.7)]">
              <address className="not-italic">{BUSINESS_NAP.address.full}</address>
              <Link to="/services" style={{ color: "hsl(var(--after-hours-cream))" }}>Back to the service menu →</Link>
            </div>
            <p className="mt-6 text-xs leading-5 text-[hsl(var(--after-hours-cream)/0.64)]">Price and duration are shown as listed in the Hair Pinns booking menu.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetailExperience;
