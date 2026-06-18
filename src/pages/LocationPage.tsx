import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Card from "@/components/design-system/Card";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Phone,
  Palette,
  Sparkles,
  Scissors,
  Quote
} from "lucide-react";
import { getLocationData } from "@/data/locationPages";
import { getOGImage } from "@/lib/sitemap";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import RelatedContent from "@/components/RelatedContent";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import { serviceDetailData } from "@/data/serviceDetails";
import { BUSINESS_HOURS } from "@/config/businessConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";

const LocationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const locationData = slug ? getLocationData(slug) : undefined;

  useEffect(() => {
    // Track location page view (once per session)
    const trackPageView = async () => {
      const sessionKey = `location_view_${slug}`;
      const hasViewed = sessionStorage.getItem(sessionKey);
      
      if (!hasViewed && slug && locationData) {
        try {
          const hpCaptureModule = await import("@/lib/hpCapture");
          const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
          await hpCapture.trackEvent("location_page_view", {
            location: slug,
            location_name: locationData.name,
            source_page: typeof window !== 'undefined' ? window.location.href : '',
          });
          sessionStorage.setItem(sessionKey, 'true');
        } catch (error) {
          console.error('Error tracking location page view:', error);
        }
      }
    };

    trackPageView();
  }, [slug, locationData]);

  // Redirect to areas index if location not found
  if (!locationData) {
    window.location.href = '/areas';
    return null;
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
        "name": "Areas We Serve",
        "item": "https://hairpinns.com/areas"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": locationData.name,
        "item": `https://hairpinns.com/areas/${locationData.slug}`
      }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": "Hair Pinns",
    "image": "https://hairpinns.com/logo.png",
    "description": `Boutique hair salon near ${locationData.name}. Colour, blonding, keratin smoothing, braids & cuts with Jena. Easy parking & quick callbacks.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "60 Goorgool Road",
      "addressLocality": "Bangor",
      "addressRegion": "NSW",
      "postalCode": "2234",
      "addressCountry": "AU"
    },
    "areaServed": `${locationData.name} NSW`,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-34.0186",
      "longitude": "151.0333"
    },
    "url": `https://hairpinns.com/areas/${locationData.slug}`,
    "telephone": "+61416037663",
    "priceRange": "$$",
    "openingHoursSpecification": BUSINESS_HOURS.map(h => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": h.day,
      "opens": h.opens,
      "closes": h.closes,
    })),
    "hasMap": `https://www.google.com/maps/dir/${encodeURIComponent(locationData.fullName)}/Hair+Pinns,+60+Goorgool+Road,+Bangor+NSW+2234`,
    "sameAs": [
      "https://www.facebook.com/hairpinns",
      "https://www.instagram.com/hairpinns",
      "https://g.page/r/CX-F0vOcpJLhEBM"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locationData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Get 6 top services for mini-grid
  const smoothingCategory = serviceDetailData.find(cat => cat.slug === "smoothing");
  const colourCategory = serviceDetailData.find(cat => cat.slug === "colour");
  const cutsCategory = serviceDetailData.find(cat => cat.slug === "cuts");
  
  const topServices = [
    { name: "Foils & Highlights", price: "from A$ 180", slug: "colour#foils" },
    { name: "Regrowth Colour", price: "from A$ 130", slug: "colour#regrowth" },
    { name: "Toner & Gloss", price: "from A$ 95", slug: "colour#toner" },
    smoothingCategory?.services[0] || { title: "Keratin Smoothing", price: "A$ 324", slug: "smoothing" },
    cutsCategory?.services[0] || { title: "Women's Cut", price: "A$ 85", slug: "cuts" },
    { name: "Blow-Dry & Style", price: "from A$ 65", slug: "cuts#blowdry" },
  ];

  const schemas = [breadcrumbSchema, localBusinessSchema, faqSchema];

  return (
    <>
      <SEOHead
        title={`Hairdresser ${locationData.name} | Hair Salon near ${locationData.name} – Hair Pinns`}
        description={`Boutique hair salon near ${locationData.name} for colour, blonding, smoothing and cuts. ${locationData.driveTime} from Bangor with easy parking. Book online or call +61 468 093 991.`}
        canonical={`https://hairpinns.com/areas/${locationData.slug}`}
        ogImage={getOGImage('default')}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {/* Breadcrumbs */}
          <div className="bg-background border-b border-border">
            <div className="container-custom py-4">
              <Breadcrumbs 
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Areas We Serve', href: '/areas' },
                  { label: locationData.name }
                ]}
              />
            </div>
          </div>

          {/* Hero Section - Premium Design */}
          <Section 
            variant="default" 
            padding="xl"
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-600)) 60%, #5D2C5D 100%)',
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl"></div>
              <div className="absolute bottom-10 right-32 w-64 h-64 rounded-full bg-accent blur-2xl"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <span className="text-white text-sm font-medium">📍 {locationData.driveTime} from Bangor</span>
              </div>
              
              <h1 className="text-h1 font-heading text-white mb-6 leading-tight" style={{
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)'
              }}>
                Hairdresser near {locationData.name}
              </h1>
              
              <p className="text-xl text-white/95 mb-8 max-w-2xl leading-relaxed">
                One-on-one salon care with Jena • Expert colour & blonding • Easy parking • Premium products
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="xl" 
                  className="bg-white text-brand-600 hover:bg-white/95 shadow-2xl font-semibold"
                  asChild
                >
                  <a 
                    href={BOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick("location_hero", `/areas/${slug}`)}
                  >
                    {BOOK_CTA_LABEL}
                  </a>
                </Button>
                <Button 
                  size="xl" 
                  variant="inverted"
                  className="font-semibold"
                  asChild
                >
                  <a href={BUSINESS_NAP.phone.tel} className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call +61 468 093 991
                  </a>
                </Button>
              </div>
            </div>
          </Section>

          {/* Local Intro - Premium Style */}
          <Section padding="xl" className="bg-gradient-to-b from-white to-accent/10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl text-foreground leading-relaxed font-light">
                {locationData.localIntro}
              </p>
            </div>
          </Section>

          {/* Jena's Tip - Local SEO pull-quote, unique per suburb */}
          {locationData.jenaTip && (
            <Section padding="md" className="bg-gradient-to-b from-accent/10 to-white">
              <div className="max-w-2xl mx-auto">
                <figure className="relative bg-card border-l-4 border-brand-500 rounded-r-card shadow-sm p-6 md:p-8">
                  <Quote className="absolute -top-3 left-6 w-8 h-8 text-brand-500 bg-card p-1 rounded-full" aria-hidden="true" />
                  <blockquote className="text-lg md:text-xl text-heading font-light italic leading-relaxed mb-3">
                    {locationData.jenaTip}
                  </blockquote>
                  <figcaption className="text-sm font-semibold text-brand-500 not-italic">
                    — Jena, Hair Pinns
                  </figcaption>
                </figure>
              </div>
            </Section>
          )}

          {/* Popular in {Suburb} - Premium Cards */}
          <Section variant="muted" padding="xl">
            <SectionHeader 
              title={`Popular in ${locationData.name}`}
              subtitle="Our most requested services in your area"
              align="center"
            />
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {locationData.popularServices.map((service, index) => {
                const icons = [Palette, Sparkles, Scissors];
                const Icon = icons[index % icons.length];
                const slugs = ["colour", "smoothing", "cuts"];
                return (
                  <Link
                    key={index}
                    to={`/services#${slugs[index]}`}
                    className="group"
                  >
                    <Card 
                      variant="elevated" 
                      padding="lg" 
                      className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-brand-500/5 border-2 border-transparent hover:border-brand-500/30"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-8 h-8 text-brand-500 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-heading text-heading group-hover:text-brand-500 transition-colors font-semibold">
                        {service}
                      </h3>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Section>

          {/* Services Mini-Grid - Premium Design */}
          <Section padding="xl" className="bg-gradient-to-b from-white to-accent/5">
            <SectionHeader 
              title="Our Services"
              subtitle="Premium hair care with transparent pricing"
              align="center"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
              {topServices.map((service, index) => (
                <Card 
                  key={index} 
                  variant="default" 
                  padding="lg" 
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-border hover:border-brand-500/40 bg-white group"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-heading text-heading mb-2 font-semibold group-hover:text-brand-500 transition-colors">
                      {'name' in service ? service.name : service.title}
                    </h3>
                    <p className="text-brand-500 font-bold text-xl">
                      {service.price}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button 
                      size="lg" 
                      variant="primary"
                      className="w-full font-semibold shadow-lg"
                      asChild
                    >
                      <a 
                        href={BOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackBookingClick("location_service_grid", `/areas/${slug}`)}
                      >
                        {BOOK_CTA_LABEL}
                      </a>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="accent"
                      className="w-full font-semibold"
                      asChild
                    >
                      <Link to={`/services#${service.slug.split('#')[0]}`}>
                        Learn more
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="primary" size="xl" asChild className="shadow-xl font-semibold">
                <Link to="/services">View all services & pricing</Link>
              </Button>
            </div>
          </Section>

          {/* Micro-FAQs - Premium Accordion */}
          <Section variant="muted" padding="xl">
            <div className="max-w-3xl mx-auto">
              <SectionHeader 
                title="Common Questions"
                subtitle="Get quick answers about our services"
                align="center"
              />
              <Accordion type="single" collapsible className="space-y-4">
                {locationData.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-white border-2 border-border rounded-xl px-6 hover:border-brand-500/40 transition-all shadow-sm hover:shadow-md"
                  >
                    <AccordionTrigger className="text-left font-heading text-heading hover:text-brand-500 py-6 text-lg font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground pb-6 text-base leading-relaxed">
                      {faq.answer}
                      <FaqFeedbackWidget question={faq.question} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Section>

          {/* Map & Directions - Premium Card */}
          <Section padding="xl" className="bg-gradient-to-b from-white to-accent/10">
            <div className="max-w-3xl mx-auto">
              <SectionHeader 
                title="Easy to Find"
                subtitle="Just a short drive from your location"
                align="center"
              />
              <Card variant="elevated" padding="lg" className="text-center border-2 border-brand-500/20 shadow-xl bg-gradient-to-br from-white to-brand-500/5">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-brand-500" />
                </div>
                <p className="text-2xl text-heading mb-6 font-heading font-semibold">
                  <span className="text-brand-500">{locationData.driveTime}</span> from {locationData.name}
                </p>
                <div className="mb-8 text-foreground text-lg space-y-2">
                  <p className="font-bold text-heading">Hair Pinns</p>
                  <p>60 Goorgool Road</p>
                  <p>Bangor NSW 2234</p>
                  <p className="text-brand-500 font-semibold mt-4">✓ Easy parking available</p>
                </div>
                <Button 
                  variant="primary" 
                  size="xl"
                  className="shadow-xl font-semibold"
                  asChild
                >
                  <a 
                    href={`https://www.google.com/maps/dir/${encodeURIComponent(locationData.fullName)}/Hair+Pinns,+60+Goorgool+Road,+Bangor+NSW+2234`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Get directions on Google Maps
                  </a>
                </Button>
              </Card>
            </div>
          </Section>

          {/* Footer CTA - Premium Banner */}
          <Section 
            padding="xl"
            className="text-center text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-600)) 60%, #5D2C5D 100%)',
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-h1 font-heading mb-4" style={{
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)'
              }}>
                Ready for great hair?
              </h2>
              <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
                Book your appointment near {locationData.name} today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="xl" 
                  className="bg-white text-brand-600 hover:bg-white/95 shadow-2xl font-semibold"
                  asChild
                >
                  <a 
                    href={BOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick("location_footer_cta", `/areas/${slug}`)}
                  >
                    {BOOK_CTA_LABEL}
                  </a>
                </Button>
                <Button 
                  size="xl" 
                  variant="inverted"
                  className="font-semibold"
                  asChild
                >
                  <a href={BUSINESS_NAP.phone.tel} className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call +61 468 093 991
                  </a>
                </Button>
              </div>
            </div>
          </Section>

          {/* Cross-link to Other Areas - Premium Pills */}
          <Section padding="xl" className="bg-muted">
            <div className="max-w-5xl mx-auto">
              <h3 className="font-heading text-2xl text-heading mb-8 text-center font-semibold">
                Also serving nearby suburbs
              </h3>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {locationData.nearbyLocations.map((nearbySlug) => {
                  const nearbyData = getLocationData(nearbySlug);
                  return nearbyData ? (
                    <Link
                      key={nearbySlug}
                      to={`/areas/${nearbySlug}`}
                      className="px-6 py-3 bg-white border-2 border-border rounded-full hover:border-brand-500 hover:text-brand-500 hover:shadow-lg transition-all duration-300 text-foreground text-base font-semibold hover:-translate-y-0.5"
                    >
                      {nearbyData.name}
                    </Link>
                  ) : null;
                })}
              </div>
              <div className="text-center">
                <Link
                  to="/areas"
                  className="inline-flex items-center text-brand-500 hover:text-brand-600 font-semibold text-lg transition-colors"
                >
                  View all service areas →
                </Link>
              </div>
            </div>
          </Section>

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

export default LocationPage;
