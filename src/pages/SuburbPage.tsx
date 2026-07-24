import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import InvalidSuburb from "./InvalidSuburb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Clock,
  ExternalLink,
  ShoppingBag,
  Palette,
  Sparkles,
  Scissors
} from "lucide-react";
import { getSuburbData } from "@/data/suburbPages";
import { generateFAQPageSchema, generateWebPageSchema, generatePlaceSchema, generateQAPageSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { BUSINESS_NAP, BUSINESS_HOURS, BUSINESS_HOURS_DISPLAY } from "@/config/businessConfig";
import RelatedContent from "@/components/RelatedContent";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import LocationProducts from "@/components/local/LocationProducts";

const SuburbPage = () => {
  const { suburb } = useParams<{ suburb: string }>();
  const suburbData = suburb ? getSuburbData(suburb) : undefined;

  useEffect(() => {
    // Track suburb page view (once per session)
    const trackPageView = async () => {
      const sessionKey = `suburb_view_${suburb}`;
      const hasViewed = sessionStorage.getItem(sessionKey);
      
      if (!hasViewed && suburb) {
        try {
          const hpCaptureModule = await import("@/lib/hpCapture");
          const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
          await hpCapture.trackEvent("suburb_page_view", {
            suburb: suburb,
            suburb_name: suburbData?.name || suburb,
            source_page: typeof window !== 'undefined' ? window.location.href : '',
          });
          sessionStorage.setItem(sessionKey, 'true');
        } catch (error) {
          console.error('Error tracking suburb page view:', error);
        }
      }
    };

    trackPageView();
  }, [suburb, suburbData]);

  // Show friendly invalid suburb page for unknown slugs
  if (!suburbData) {
    return <InvalidSuburb />;
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hairpinns.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Service Areas",
        "item": "https://hairpinns.com/near"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": suburbData.name,
        "item": `https://hairpinns.com/near/${suburbData.slug}`
      }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": "https://hairpinns.com/#hairsalon",
    "name": "Hair Pinns",
    "image": "https://hairpinns.com/logo.png",
    "description": `Boutique hair salon serving ${suburbData.name} with Colour & Blonding, Smoothing Treatments, and Cuts & Styling.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_NAP.address.street,
      "addressLocality": BUSINESS_NAP.address.locality,
      "addressRegion": BUSINESS_NAP.address.region,
      "postalCode": BUSINESS_NAP.address.postcode,
      "addressCountry": BUSINESS_NAP.address.country
    },
    "areaServed": [
      {
        "@type": "City",
        "name": suburbData.name
      },
      {
        "@type": "City",
        "name": "Bangor"
      }
    ],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-34.0186",
      "longitude": "151.0333"
    },
    "url": `https://hairpinns.com/near/${suburbData.slug}`,
    "telephone": BUSINESS_NAP.phone.raw,
    "priceRange": "$$",
    "openingHoursSpecification": BUSINESS_HOURS.map(h => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": h.day,
      "opens": h.opens,
      "closes": h.closes,
    }))
  };

  const services = [
    {
      icon: Palette,
      title: "Colour & Blonding",
      description: "From full head foils to colour corrections, we create dimensional, natural-looking colour that suits Sydney's climate.",
      link: "/services#foil-packages",
      detailLink: "/services/foil-packages/full-head-foils-package"
    },
    {
      icon: Sparkles,
      title: "Smoothing & Treatments",
      description: "Keratin smoothing and deep conditioning to tackle frizz and restore shine in humid conditions.",
      link: "/services#smoothing",
      detailLink: "/services/smoothing/mid-length-straight-up-smoothing"
    },
    {
      icon: Scissors,
      title: "Cuts & Styling",
      description: "Cuts and styling tailored to your face shape, hair texture, and lifestyle for easy maintenance at home.",
      link: "/services#cut-packages",
      detailLink: "/services/cut-packages/mid-length-wash-cut-blowdry"
    }
  ];

  const schemas = [
    breadcrumbSchema,
    localBusinessSchema,
    ...(suburbData.faqs?.length ? [generateFAQPageSchema(suburbData.faqs)] : []),
    generateWebPageSchema({
      name: `Hair Salon Near ${suburbData.name}`,
      description: suburbData.intro,
      url: `https://hairpinns.com/near/${suburbData.slug}`,
      speakable: suburbData.quickAnswer ? { cssSelector: [".speakable-quick-answer"] } : undefined,
    }),
    generatePlaceSchema({
      name: `Hair Pinns - ${suburbData.name}`,
      description: suburbData.quickAnswer || suburbData.intro,
      url: `https://hairpinns.com/near/${suburbData.slug}`,
      addressLocality: suburbData.name,
      addressRegion: "NSW",
      postalCode: "2234",
    }),
    ...(suburbData.quickAnswer ? [generateQAPageSchema({
      question: `What is Hair Pinns near ${suburbData.name}?`,
      answer: suburbData.quickAnswer,
    })] : []),
  ];

  return (
    <>
      <SEOHead
        title={`Hair Salon ${suburbData.name} | Hair Pinns Bangor | Book Online`}
        description={`${suburbData.driveTime} from ${suburbData.name}. Colour, smoothing & cuts. Expert care since 2018. Book online 24/7.`}
        canonical={`https://hairpinns.com/near/${suburbData.slug}`}
        ogImage={getOGImage('suburb')}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />

      <div className="editorial-route min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" tabIndex={-1} className="flex-grow">
          {/* Breadcrumbs */}
          <div className="bg-background border-b border-border">
            <div className="container-custom py-4">
              <Breadcrumbs 
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Areas We Serve', href: '/services#areas' },
                  { label: `Near ${suburbData.name}` }
                ]}
              />
            </div>
          </div>

          {/* Hero Section */}
          <section className="bg-gradient-to-br from-brand-50 via-background to-accent/5 py-16 md:py-24">
            <div className="container-custom">
              <div className="max-w-3xl">
                <h1 className="text-h1 font-heading text-heading mb-6">
                  Hair Salon Near {suburbData.name} | Hair Pinns
                </h1>
                {suburbData.quickAnswer && (
                  <p className="speakable-quick-answer text-lg md:text-xl text-foreground font-medium leading-relaxed mb-6 max-w-3xl">
                    {suburbData.quickAnswer}
                  </p>
                )}
                <p className="text-xl text-foreground leading-relaxed mb-8">
                  {suburbData.intro}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    variant="primary"
                    asChild
                  >
                    <a 
                      href={BOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackBookingClick("suburb_hero", `/near/${suburb}`)}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      {BOOK_CTA_LABEL}
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    asChild
                  >
                    <Link to="/services">
                      View All Services
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Local Context Note */}
          <section className="bg-accent/10 border-y border-accent/20 py-8">
            <div className="container-custom">
              <div className="flex items-start gap-4 max-w-3xl">
                <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-heading text-lg text-heading mb-2">
                    Why {suburbData.name} clients choose us
                  </h2>
                  <p className="text-foreground">
                    {suburbData.localNote}
                  </p>
                  {suburbData.seasonalNote && (
                    <p className="text-foreground mt-3 text-sm italic">
                      {suburbData.seasonalNote}
                    </p>
                  )}
                  {suburbData.landmarks && suburbData.landmarks.length > 0 && (
                    <p className="text-muted-foreground mt-3 text-sm">
                      Serving clients near {suburbData.landmarks.join(", ")}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Customer Stories / Recent Work — Caleb Ulku authority marker (Jena adds with permission) */}
          {(suburbData.customerStory || suburbData.projectExample) && (
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-h2 font-heading text-heading mb-6 text-center">
                    What Clients Say About {suburbData.name}
                  </h2>
                  {suburbData.customerStory && (
                    <blockquote className="border-l-4 border-brand-500 pl-6 py-4 mb-6 text-foreground italic">
                      "{suburbData.customerStory}"
                    </blockquote>
                  )}
                  {suburbData.projectExample && (
                    <p className="text-foreground leading-relaxed">
                      {suburbData.projectExample}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Services Cards */}
          <section className="section-padding">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-h2 font-heading text-heading mb-4">
                  Our Services
                </h2>
                <p className="text-lg text-foreground max-w-2xl mx-auto">
                  Services designed for Sydney's unique climate and your lifestyle
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <service.icon className="w-12 h-12 text-brand-500 mb-4" />
                    <h3 className="text-h3 font-heading text-heading mb-3">
                      {service.title}
                    </h3>
                    <p className="text-foreground mb-6">
                      {service.description}
                    </p>
                    <Link 
                      to={service.detailLink || service.link}
                      className="text-brand-500 hover:text-brand-600 font-semibold inline-flex items-center gap-2"
                    >
                      Learn More →
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How to Visit */}
          <section className="bg-card border-y border-border py-16">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-start gap-4 mb-6">
                  <Clock className="w-8 h-8 text-brand-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-h2 font-heading text-heading mb-4">
                      How to visit from {suburbData.name}
                    </h2>
                    <p className="text-lg text-foreground mb-2">
                      About <strong>{suburbData.driveTime}</strong> from {suburbData.name} via <strong>{suburbData.route}</strong>.
                    </p>
                    <p className="text-foreground">
                      Parking available near the salon. We're located in Bangor, easy to reach from all Sutherland Shire suburbs.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Address:</strong> {BUSINESS_NAP.address.full}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Hours:</strong> {BUSINESS_HOURS_DISPLAY.join(" | ")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="section-padding">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-h2 font-heading text-heading mb-8 text-center">
                  Common Questions from {suburbData.name}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {suburbData.faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`faq-${index}`}
                      className="bg-card border border-border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left text-lg font-heading text-heading hover:text-brand-500 py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground pb-6 leading-relaxed">
                        {faq.answer}
                        <FaqFeedbackWidget 
                          question={faq.question}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Location-Specific Products */}
          <section className="section-padding">
            <div className="container-custom">
              <LocationProducts 
                suburb={suburbData.name}
                climate={suburbData.localNote.toLowerCase().includes('humidity') ? 'humidity' : 
                        suburbData.localNote.toLowerCase().includes('coastal') ? 'coastal' :
                        suburbData.localNote.toLowerCase().includes('water') ? 'hard-water' : undefined}
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-accent text-white py-16 md:py-20">
            <div className="container-custom text-center">
              <h2 className="text-h2-lg font-heading mb-6">
                Ready to book in?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Book your appointment now or explore our featured products for at-home care
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-brand-600 hover:bg-white/90"
                  asChild
                >
                  <a 
                    href={BOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick("suburb_footer_cta", `/near/${suburb}`)}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    {BOOK_CTA_LABEL}
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/collections">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Shop Hair Products Australia-Wide
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Internal Links - Nearby Suburbs */}
          <section className="bg-background py-12">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto">
                <h3 className="font-heading text-lg text-heading mb-6 text-center">
                  Also serving nearby areas
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {suburbData.nearbySuburbs.map((nearbySlug) => {
                    const nearbyData = getSuburbData(nearbySlug);
                    return nearbyData ? (
                      <Link
                        key={nearbySlug}
                        to={`/near/${nearbySlug}`}
                        className="px-6 py-3 bg-card border border-border rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors text-foreground"
                      >
                        {nearbyData.name}
                      </Link>
                    ) : null;
                  })}
                  <Link
                    to="/services"
                    className="px-6 py-3 bg-card border border-border rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors text-foreground"
                  >
                    View All Services
                  </Link>
                  <Link
                    to="/about"
                    className="px-6 py-3 bg-card border border-border rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors text-foreground"
                  >
                    About Jena & Hair Pinns
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Topic cluster links — every suburb page is a local SEO gateway
              into smoothing, cuts, colour, and frizz-control content. */}
          <RelatedContent
            topics={["smoothing", "cuts", "colour", "frizz-control"]}
            heading="Popular with locals"
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SuburbPage;
