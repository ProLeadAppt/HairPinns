import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MapPin, Phone, Quote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import RelatedContent from "@/components/RelatedContent";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import { Button } from "@/components/ui/button";
import { getLocationData } from "@/data/locationPages";
import { getOGImage } from "@/lib/sitemap";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";
import { ENTITY_REGISTRY } from "@/config/entityRegistry";
import { generateLocalBusinessSchema } from "@/lib/schema";

const LocationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const locationData = slug ? getLocationData(slug) : undefined;

  useEffect(() => {
    if (!slug || !locationData) return;
    const sessionKey = `location_view_${slug}`;
    if (sessionStorage.getItem(sessionKey)) return;

    const trackPageView = async () => {
      try {
        const hpCaptureModule = await import("@/lib/hpCapture");
        const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
        await hpCapture.trackEvent("location_page_view", {
          location: slug,
          location_name: locationData.name,
          source_page: window.location.href,
        });
        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        console.error("Error tracking location page view:", error);
      }
    };

    void trackPageView();
  }, [slug, locationData]);

  if (!locationData) return <Navigate to="/areas" replace />;

  const canonicalUrl = `https://hairpinns.com/areas/${locationData.slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hairpinns.com/" },
      { "@type": "ListItem", position: 2, name: "Areas We Serve", item: "https://hairpinns.com/areas" },
      { "@type": "ListItem", position: 3, name: locationData.name, item: canonicalUrl },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: locationData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <SEOHead
        title={`Hairdresser ${locationData.name} | Hair Salon near ${locationData.name} – Hair Pinns`}
        description={`Hair salon near ${locationData.name} for colour, blonding, smoothing and cuts. ${locationData.driveTime} from Bangor. Book online or call ${BUSINESS_NAP.phone.display}.`}
        canonical={canonicalUrl}
        ogImage={getOGImage("default")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={[breadcrumbSchema, generateLocalBusinessSchema(canonicalUrl), faqSchema]}
      />

      <div className="editorial-route min-h-screen bg-[hsl(var(--after-hours-paper))] text-[hsl(var(--after-hours-plum))]" data-location-page="">
        <Header />
        <main id="main-content" tabIndex={-1}>
          <div className="border-b border-[hsl(var(--after-hours-plum)/0.18)]">
            <div className="container-custom px-4 sm:px-6 py-4">
              <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Areas We Serve", href: "/areas" },
                { label: locationData.name },
              ]} />
            </div>
          </div>

          <section className="bg-[hsl(var(--after-hours-plum))] py-20 text-[hsl(var(--after-hours-cream))] md:py-28" data-location-hero="">
            <div className="container-custom px-4 sm:px-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div className="max-w-4xl">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--after-hours-copper))]">
                  {locationData.driveTime} from Bangor
                </p>
                <h1 className="max-w-3xl font-heading text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.98] text-[hsl(var(--after-hours-cream))]">
                  Hairdresser near {locationData.name}
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[hsl(var(--after-hours-cream)/0.82)]">
                  One-on-one salon care with Jena for colour, blonding, smoothing, cuts and styling from the Bangor salon.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="xl" className="rounded-none bg-[hsl(var(--after-hours-copper))] text-[hsl(var(--after-hours-near-black))] hover:bg-[hsl(var(--after-hours-cream))]">
                    <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("location_hero", `/areas/${slug}`)}>
                      {BOOK_CTA_LABEL}
                    </a>
                  </Button>
                  <Button asChild size="xl" variant="outline" className="rounded-none border-[hsl(var(--after-hours-cream)/0.45)] bg-transparent text-[hsl(var(--after-hours-cream))] hover:bg-[hsl(var(--after-hours-cream))] hover:text-[hsl(var(--after-hours-plum))]">
                    <a href={BUSINESS_NAP.phone.tel}><Phone className="mr-2 h-5 w-5" />Call {BUSINESS_NAP.phone.display}</a>
                  </Button>
                </div>
              </div>
              <dl className="border-l border-[hsl(var(--after-hours-cream)/0.28)] pl-6 text-sm">
                <dt className="uppercase tracking-[0.18em] text-[hsl(var(--after-hours-muted))]">Salon</dt>
                <dd className="mt-2 font-heading text-2xl">Hair Pinns, Bangor</dd>
                <dt className="mt-6 uppercase tracking-[0.18em] text-[hsl(var(--after-hours-muted))]">From {locationData.name}</dt>
                <dd className="mt-2 text-base">{locationData.driveTime}</dd>
              </dl>
            </div>
          </section>

          <section className="py-16 md:py-24" data-location-context="">
            <div className="container-custom px-4 sm:px-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--after-hours-copper))]">Local guide</p>
                <p className="mt-5 max-w-3xl text-xl leading-relaxed md:text-2xl">{locationData.localIntro}</p>
              </div>
              {locationData.jenaTip ? (
                <figure className="border-l-2 border-[hsl(var(--after-hours-copper))] pl-6">
                  <Quote className="h-7 w-7 text-[hsl(var(--after-hours-copper))]" aria-hidden="true" />
                  <blockquote className="mt-4 font-heading text-xl italic leading-relaxed">{locationData.jenaTip}</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold">Jena, Hair Pinns</figcaption>
                </figure>
              ) : null}
            </div>
          </section>

          <section className="border-y border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-cream))] py-16 md:py-24" data-location-services="">
            <div className="container-custom px-4 sm:px-6">
              <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--after-hours-copper))]">Salon menu</p>
                  <h2 className="mt-4 font-heading text-h2">Services chosen around {locationData.name}</h2>
                  <p className="mt-4 leading-relaxed text-[hsl(var(--after-hours-plum)/0.74)]">Explore the current Hair Pinns menu and book live availability through Fresha.</p>
                </div>
                <ol className="border-t border-[hsl(var(--after-hours-plum)/0.2)]">
                  {locationData.popularServices.map((service, index) => (
                    <li key={service} className="grid grid-cols-[2rem_1fr] items-center gap-x-4 border-b border-[hsl(var(--after-hours-plum)/0.2)] py-5 sm:grid-cols-[2.5rem_1fr_auto]">
                      <span className="text-xs text-[hsl(var(--after-hours-copper))]">0{index + 1}</span>
                      <span className="font-heading text-xl">{service}</span>
                      <Link to="/services" className="col-start-2 min-h-11 justify-self-start py-3 text-sm font-semibold text-[hsl(var(--after-hours-plum))] underline decoration-[hsl(var(--after-hours-copper))] underline-offset-4 hover:text-[hsl(var(--after-hours-copper))] sm:col-start-auto">View menu</Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24" data-location-faq="">
            <div className="container-custom px-4 sm:px-6 grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--after-hours-copper))]">Common questions</p>
                <h2 className="mt-4 font-heading text-h2">Before you visit</h2>
              </div>
              <div className="border-t border-[hsl(var(--after-hours-plum)/0.2)]">
                {locationData.faqs.map((faq) => (
                  <details key={faq.question} className="group border-b border-[hsl(var(--after-hours-plum)/0.2)] py-5">
                    <summary className="min-h-11 cursor-pointer list-none pr-8 font-heading text-lg font-semibold">{faq.question}</summary>
                    <div className="max-w-3xl pb-2 pt-3 leading-relaxed text-[hsl(var(--after-hours-plum)/0.78)]">
                      <p>{faq.answer}</p>
                      <FaqFeedbackWidget question={faq.question} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[hsl(var(--after-hours-near-black))] py-16 text-[hsl(var(--after-hours-cream))] md:py-24" data-location-visit="">
            <div className="container-custom px-4 sm:px-6 grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--after-hours-copper))]">Visit Hair Pinns</p>
                <h2 className="mt-4 font-heading text-h2 text-[hsl(var(--after-hours-cream))]">From {locationData.name} to Bangor</h2>
                <p className="mt-5 text-lg text-[hsl(var(--after-hours-cream)/0.78)]">Allow {locationData.driveTime}. The salon is at {BUSINESS_NAP.address.full}.</p>
              </div>
              <div className="flex flex-col justify-end gap-3 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="rounded-none bg-[hsl(var(--after-hours-copper))] text-[hsl(var(--after-hours-near-black))] hover:bg-[hsl(var(--after-hours-cream))]">
                  <a href={ENTITY_REGISTRY.profiles.google.directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin className="mr-2 h-5 w-5" />Get directions</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-[hsl(var(--after-hours-cream)/0.4)] bg-transparent text-[hsl(var(--after-hours-cream))] hover:bg-[hsl(var(--after-hours-cream))] hover:text-[hsl(var(--after-hours-plum))]">
                  <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("location_close", `/areas/${slug}`)}>{BOOK_CTA_LABEL}</a>
                </Button>
              </div>
            </div>
          </section>

          <nav aria-label="Nearby service areas" className="border-b border-[hsl(var(--after-hours-plum)/0.16)] py-12">
            <div className="container-custom px-4 sm:px-6">
              <h2 className="font-heading text-2xl">Nearby areas</h2>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {locationData.nearbyLocations.map((nearbySlug) => {
                  const nearby = getLocationData(nearbySlug);
                  return nearby ? <Link key={nearbySlug} to={`/areas/${nearbySlug}`} className="min-h-11 py-3 font-semibold text-[hsl(var(--after-hours-plum))] underline decoration-[hsl(var(--after-hours-copper))] underline-offset-4 hover:text-[hsl(var(--after-hours-copper))]">{nearby.name}</Link> : null;
                })}
                <Link to="/areas" className="min-h-11 py-3 font-semibold text-[hsl(var(--after-hours-plum))] underline decoration-[hsl(var(--after-hours-copper))] underline-offset-4 hover:text-[hsl(var(--after-hours-copper))]">All service areas</Link>
              </div>
            </div>
          </nav>

          <RelatedContent topics={["smoothing", "cuts", "colour", "frizz-control"]} heading="Popular with locals" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LocationPage;
