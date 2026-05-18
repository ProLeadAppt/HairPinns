import { useParams, Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Truck, Package, MapPin, Clock, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getShippingStateData, shippingStates } from "@/data/shippingStates";
import { getShippingCityData, shippingCities } from "@/data/shippingCities";
import {
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateWebPageSchema,
  generateOrganizationSchema,
  generateEnhancedLocalBusinessSchema,
} from "@/lib/schema";

/**
 * Shipping destination landing page. Handles both state-level slugs
 * (e.g. /shipping-to/victoria) and city-level slugs (e.g. /shipping-to/melbourne)
 * via a unified `normalise` step. Lookup order is cities first then states,
 * so capital-city slugs resolve to the city page rather than being shadowed
 * by their parent state.
 *
 * Data sources:
 *  - States: [src/data/shippingStates.ts](../data/shippingStates.ts)
 *  - Cities: [src/data/shippingCities.ts](../data/shippingCities.ts)
 *
 * Edit data in those files. The page just renders.
 */

type LocationKind = "state" | "city";

interface NormalisedLocation {
  kind: LocationKind;
  slug: string;
  name: string;
  /** State abbreviation for states, state code for cities. */
  shortCode: string;
  /** Postcode range (states only — cities show city + state name instead). */
  scopeLabel: string;
  standardDeliveryDays: string;
  expressDeliveryDays: string;
  /** Suburb tags for cities, major-city tags for states. */
  regionTags: string[];
  /** Heading text for the regions section. */
  regionsHeading: string;
  hook: string;
  intro: string;
  productPicks: Array<{ label: string; collectionPath: string; reason: string }>;
  faqs: Array<{ question: string; answer: string }>;
  /** Cross-link slugs (state nearbyStates or city nearbyCities). */
  crossLinks: Array<{ slug: string; name: string; shortCode: string; kind: LocationKind }>;
  /** Cities have a parent state for an "up" link. States don't. */
  parentState?: { slug: string; name: string };
  /** Title fragment used in <title>. */
  titleSuffix: string;
}

function normaliseLocation(slug: string): NormalisedLocation | undefined {
  // Cities first — capital-city slugs would otherwise shadow nothing, but if
  // a city slug ever clashes with a future state slug (unlikely) we want the
  // city to win because it's the higher-intent surface.
  const city = getShippingCityData(slug);
  if (city) {
    return {
      kind: "city",
      slug: city.slug,
      name: city.name,
      shortCode: city.stateCode,
      scopeLabel: `${city.stateName} (${city.stateCode})`,
      standardDeliveryDays: city.standardDeliveryDays,
      expressDeliveryDays: city.expressDeliveryDays,
      regionTags: city.popularSuburbs,
      regionsHeading: `Delivering across ${city.name}`,
      hook: city.cityHook,
      intro: city.localIntro,
      productPicks: city.productPicks,
      faqs: city.faqs,
      crossLinks: (city.nearbyCities ?? []).flatMap((s) => {
        const c = getShippingCityData(s);
        return c
          ? [{ slug: c.slug, name: c.name, shortCode: c.stateCode, kind: "city" as LocationKind }]
          : [];
      }),
      parentState: { slug: city.stateSlug, name: city.stateName },
      titleSuffix: `${city.name}, ${city.stateCode}`,
    };
  }

  const state = getShippingStateData(slug);
  if (state) {
    return {
      kind: "state",
      slug: state.slug,
      name: state.name,
      shortCode: state.abbreviation,
      scopeLabel: `Postcodes ${state.postcodeRange}`,
      standardDeliveryDays: state.standardDeliveryDays,
      expressDeliveryDays: state.expressDeliveryDays,
      regionTags: state.majorCities,
      regionsHeading: `Delivering across ${state.name}`,
      hook: state.climateHook,
      intro: state.localIntro,
      productPicks: state.productPicks,
      faqs: state.faqs,
      crossLinks: (state.nearbyStates ?? []).flatMap((s) => {
        const st = getShippingStateData(s);
        return st
          ? [{ slug: st.slug, name: st.name, shortCode: st.abbreviation, kind: "state" as LocationKind }]
          : [];
      }),
      titleSuffix: `${state.name} (${state.abbreviation})`,
    };
  }
  return undefined;
}

const ShippingStatePage = () => {
  const { state: slug } = useParams<{ state: string }>();
  const data = slug ? normaliseLocation(slug) : undefined;

  if (!data) {
    const allDestinations = [
      ...Object.values(shippingCities).map((c) => ({ slug: c.slug, name: c.name })),
      ...Object.values(shippingStates).map((s) => ({ slug: s.slug, name: s.name })),
    ];
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title="Destination not found | Hair Pinns"
          description="Hair Pinns ships hair care products to every Australian state, territory, and major city."
          canonical={`https://hairpinns.com/shipping-to/${slug ?? ""}`}
          noIndex={true}
        />
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-xl">
            <h1 className="text-2xl font-bold text-heading mb-2">
              Destination not found
            </h1>
            <p className="text-muted-foreground mb-6">
              We ship to every Australian state and major city. Pick one:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {allDestinations.map((d) => (
                <Button key={d.slug} asChild variant="outline" size="sm">
                  <Link to={`/shipping-to/${d.slug}`}>{d.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://hairpinns.com/shipping-to/${data.slug}`;
  const pageTitle = `Hair Care Delivery to ${data.titleSuffix} | Hair Pinns`;
  const pageDescription = `Hair Pinns ships salon-quality hair care products to ${data.name}. Standard ${data.standardDeliveryDays} business days, express ${data.expressDeliveryDays}. Free shipping over $150 AUD. ${data.hook}`;

  const breadcrumbCrumbs: Array<{ name: string; url: string }> = [
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "Shipping", url: "https://hairpinns.com/policies/shipping" },
  ];
  if (data.kind === "city" && data.parentState) {
    breadcrumbCrumbs.push({
      name: data.parentState.name,
      url: `https://hairpinns.com/shipping-to/${data.parentState.slug}`,
    });
  }
  breadcrumbCrumbs.push({ name: data.name, url: canonicalUrl });

  const schemas = [
    generateBreadcrumbSchema(breadcrumbCrumbs),
    generateWebPageSchema({
      name: `Hair Care Delivery to ${data.name}`,
      description: pageDescription,
      url: canonicalUrl,
      speakable: { cssSelector: [".speakable-state-intro", ".speakable-delivery"] },
    }),
    generateFAQPageSchema(data.faqs),
    generateOrganizationSchema(),
    generateEnhancedLocalBusinessSchema(canonicalUrl),
  ];

  const breadcrumbItems: Array<{ name: string; url: string }> = [
    { name: "Home", url: "/" },
    { name: "Shipping", url: "/policies/shipping" },
  ];
  if (data.kind === "city" && data.parentState) {
    breadcrumbItems.push({
      name: data.parentState.name,
      url: `/shipping-to/${data.parentState.slug}`,
    });
  }
  breadcrumbItems.push({ name: data.name, url: `/shipping-to/${data.slug}` });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        ogImage="https://hairpinns.com/og-default.jpg"
        schemaJson={schemas}
      />
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-grow">
        <Section className="pt-xl">
          <Breadcrumbs items={breadcrumbItems} />

          <SectionHeader
            as="h1"
            title={`Hair Care Delivery to ${data.name}`}
            subtitle={`${data.shortCode} • ${data.scopeLabel} • Dispatched from Bangor, NSW`}
          />

          <div className="max-w-3xl mx-auto">
            <p className="speakable-state-intro text-lg text-foreground leading-relaxed mb-8">
              {data.intro}
            </p>

            {/* Delivery window cards */}
            <div className="speakable-delivery grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-accent/5 border border-accent/20 rounded-card p-6">
                <Truck className="w-8 h-8 text-brand-500 mb-3" />
                <h2 className="text-base font-heading font-semibold text-heading mb-1">
                  Standard delivery
                </h2>
                <p className="text-2xl font-bold text-heading">
                  {data.standardDeliveryDays}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    business days
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  AusPost standard, tracked.
                </p>
              </div>

              <div className="bg-brand-500/5 border border-brand-500/20 rounded-card p-6">
                <Package className="w-8 h-8 text-brand-500 mb-3" />
                <h2 className="text-base font-heading font-semibold text-heading mb-1">
                  Express delivery
                </h2>
                <p className="text-2xl font-bold text-heading">
                  {data.expressDeliveryDays}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    business days
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  AusPost express, priority tracked.
                </p>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-card p-6">
                <Clock className="w-8 h-8 text-brand-500 mb-3" />
                <h2 className="text-base font-heading font-semibold text-heading mb-1">
                  Free shipping
                </h2>
                <p className="text-2xl font-bold text-heading">
                  Over $150
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    AUD
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Standard, every {data.shortCode} postcode.
                </p>
              </div>
            </div>

            {/* Regions (cities for state pages, suburbs for city pages) */}
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-heading mb-4">
                {data.regionsHeading}
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                {data.hook}
              </p>
              <div className="flex flex-wrap gap-2">
                {data.regionTags.map((region) => (
                  <span
                    key={region}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-sm text-foreground"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {region}
                  </span>
                ))}
              </div>
            </div>

            {/* Product picks */}
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-heading mb-4">
                What Jena picks for {data.name} hair
              </h2>
              <p className="text-foreground leading-relaxed mb-6">
                Hand-selected ranges from the Hair Pinns catalogue that match{" "}
                {data.name}&apos;s climate and water profile.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.productPicks.map((pick) => (
                  <Link
                    key={pick.collectionPath}
                    to={pick.collectionPath}
                    className="group block bg-card border border-border rounded-card p-5 hover:border-brand-500 transition-colors"
                  >
                    <h3 className="text-lg font-heading font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                      {pick.label}
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed mb-3">
                      {pick.reason}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-500">
                      Shop the range
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-heading mb-4">
                Shipping to {data.name}, frequently asked
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {data.faqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="bg-card border border-border rounded-card px-5"
                  >
                    <AccordionTrigger className="text-left font-heading font-semibold text-heading hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* "Up" link to parent state for city pages */}
            {data.kind === "city" && data.parentState && (
              <div className="mb-12 pt-8 border-t border-border">
                <h2 className="text-xl font-heading font-bold text-heading mb-4">
                  Shipping across {data.parentState.name}
                </h2>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/shipping-to/${data.parentState.slug}`}>
                    All {data.parentState.name} delivery info
                  </Link>
                </Button>
              </div>
            )}

            {/* Cross-links to nearby destinations */}
            {data.crossLinks.length > 0 && (
              <div className="mb-12 pt-8 border-t border-border">
                <h2 className="text-xl font-heading font-bold text-heading mb-4">
                  {data.kind === "city" ? "Shipping to nearby cities" : "Shipping to other states"}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.crossLinks.map((link) => (
                    <Button
                      key={link.slug}
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link to={`/shipping-to/${link.slug}`}>
                        {link.name} ({link.shortCode})
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center bg-brand-500/5 border border-brand-500/20 rounded-card p-8">
              <h2 className="text-2xl font-heading font-bold text-heading mb-3">
                Ready to order?
              </h2>
              <p className="text-foreground mb-6">
                Free shipping to {data.name} on orders over $150 AUD.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="primary" size="lg">
                  <Link to="/collections">Browse all products</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/policies/shipping">Full shipping policy</Link>
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingStatePage;
