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
import {
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateWebPageSchema,
  generateOrganizationSchema,
  generateEnhancedLocalBusinessSchema,
} from "@/lib/schema";

/**
 * One landing page per Australian state/territory, targeted at shoppers
 * searching for hair-product delivery to their state. Data lives in
 * [src/data/shippingStates.ts](../data/shippingStates.ts) — edit there
 * rather than here.
 */
const ShippingStatePage = () => {
  const { state } = useParams<{ state: string }>();
  const data = state ? getShippingStateData(state) : undefined;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title="State not found | Hair Pinns"
          description="Hair Pinns ships hair care products to every Australian state and territory."
          canonical={`https://hairpinns.com/shipping-to/${state ?? ""}`}
          noIndex={true}
        />
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-heading mb-2">
              State not found
            </h1>
            <p className="text-muted-foreground mb-6">
              We ship to every Australian state — try one of these:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.values(shippingStates).map((s) => (
                <Button key={s.slug} asChild variant="outline" size="sm">
                  <Link to={`/shipping-to/${s.slug}`}>{s.name}</Link>
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
  const pageTitle = `Hair Care Delivery to ${data.name} (${data.abbreviation}) | Hair Pinns`;
  const pageDescription = `Hair Pinns ships salon-quality hair care products to every ${data.name} postcode. Standard ${data.standardDeliveryDays} business days, express ${data.expressDeliveryDays}. Free shipping over $150 AUD. ${data.climateHook}`;

  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "Shipping", url: "https://hairpinns.com/policies/shipping" },
      { name: data.name, url: canonicalUrl },
    ]),
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
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Shipping", url: "/policies/shipping" },
              { name: data.name, url: `/shipping-to/${data.slug}` },
            ]}
          />

          <SectionHeader
            as="h1"
            title={`Hair Care Delivery to ${data.name}`}
            subtitle={`${data.abbreviation} • Postcodes ${data.postcodeRange} • Dispatched from Bangor, NSW`}
          />

          <div className="max-w-3xl mx-auto">
            <p className="speakable-state-intro text-lg text-foreground leading-relaxed mb-8">
              {data.localIntro}
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
                  Standard, all {data.abbreviation} postcodes.
                </p>
              </div>
            </div>

            {/* Major cities */}
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-heading mb-4">
                Delivering across {data.name}
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                {data.climateHook}
              </p>
              <div className="flex flex-wrap gap-2">
                {data.majorCities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-sm text-foreground"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {city}
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
                Shipping to {data.name} — frequently asked
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

            {/* Nearby states */}
            {data.nearbyStates && data.nearbyStates.length > 0 && (
              <div className="mb-12 pt-8 border-t border-border">
                <h2 className="text-xl font-heading font-bold text-heading mb-4">
                  Shipping to other states
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.nearbyStates.map((slug) => {
                    const nearby = getShippingStateData(slug);
                    if (!nearby) return null;
                    return (
                      <Button
                        key={slug}
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link to={`/shipping-to/${nearby.slug}`}>
                          {nearby.name} ({nearby.abbreviation})
                        </Link>
                      </Button>
                    );
                  })}
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
