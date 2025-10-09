import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Card from "@/components/design-system/Card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  MapPin, 
  Clock, 
  Phone,
  CheckCircle2,
  Sparkles,
  Palette,
  Scissors,
  Zap,
  Heart,
  Shield
} from "lucide-react";
import { getLocationData, getAllLocationSlugs } from "@/data/locationPages";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import { serviceDetailData } from "@/data/serviceDetails";

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
          const { hpCapture } = await import("@/lib/hpCapture");
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
    "image": "https://hairpinns.com/hair-pinns-logo.png",
    "description": `Boutique hair salon serving ${locationData.name} ${locationData.postcode}. Expert colour, blonding, keratin smoothing, braids & cuts with Jena. Easy parking & quick callbacks.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "60 Goorgool Road",
      "addressLocality": "Bangor",
      "addressRegion": "NSW",
      "postalCode": "2234",
      "addressCountry": "AU"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": locationData.name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": locationData.name,
          "postalCode": locationData.postcode,
          "addressCountry": "AU"
        }
      }
    ],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-34.0186",
      "longitude": "151.0333"
    },
    "url": `https://hairpinns.com/areas/${locationData.slug}`,
    "telephone": "+61468020624",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "15:00"
      }
    ],
    "hasMap": "https://goo.gl/maps/example",
    "sameAs": [
      "https://www.facebook.com/hairpinns",
      "https://www.instagram.com/hairpinns"
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

  // Get top 6-8 services to display (find by category slug)
  const smoothingCategory = serviceDetailData.find(cat => cat.slug === "smoothing");
  const colourCategory = serviceDetailData.find(cat => cat.slug === "colour");
  const cutsCategory = serviceDetailData.find(cat => cat.slug === "cuts");
  const braidsCategory = serviceDetailData.find(cat => cat.slug === "braids");
  
  const topServices = [
    smoothingCategory?.services[0],
    smoothingCategory?.services[1],
    colourCategory?.services[0],
    colourCategory?.services[1],
    cutsCategory?.services[0],
    braidsCategory?.services[0],
  ].filter(Boolean); // Remove any undefined values

  return (
    <>
      <Helmet>
        <title>Hair Salon {locationData.name} – Colour, Smoothing, Braids | Hair Pinns</title>
        <meta 
          name="description" 
          content={`Boutique hair salon near ${locationData.name}. Colour, blonding, keratin smoothing, braids & cuts with Jena. Easy parking & quick callbacks. Book online.`}
        />
        <link rel="canonical" href={`https://hairpinns.com/areas/${locationData.slug}`} />
        <meta property="og:title" content={`Hair Salon ${locationData.name} | Hair Pinns`} />
        <meta property="og:description" content={locationData.heroSubtitle} />
        <meta property="og:url" content={`https://hairpinns.com/areas/${locationData.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hairpinns.com/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Hair Salon ${locationData.name} | Hair Pinns`} />
        <meta name="twitter:description" content={locationData.heroSubtitle} />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

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

          {/* Hero Section */}
          <Section 
            variant="default" 
            padding="xl"
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--brand-500) / 0.05) 0%, hsl(var(--accent) / 0.15) 100%)'
            }}
          >
            <div className="max-w-4xl">
              <h1 className="text-h1 font-heading text-heading mb-6">
                Hair Salon in {locationData.name}
              </h1>
              <p className="text-xl text-foreground leading-relaxed mb-8">
                {locationData.heroSubtitle}
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
                    onClick={() => trackBookingClick("location_hero", `/areas/${slug}`)}
                  >
                    {BOOK_CTA_LABEL}
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  asChild
                >
                  <Link to="/services">
                    See services
                  </Link>
                </Button>
              </div>
            </div>
          </Section>

          {/* Why Choose Hair Pinns */}
          <Section padding="lg">
            <SectionHeader 
              title="Why Choose Hair Pinns"
              align="center"
            />
            <div className="grid md:grid-cols-3 gap-8">
              {locationData.whyChoose.map((item, index) => {
                const icons = [Heart, Shield, CheckCircle2];
                const Icon = icons[index];
                return (
                  <Card key={index} variant="elevated" padding="lg" className="text-center">
                    <Icon className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                    <h3 className="text-h3 font-heading text-heading mb-3">
                      {item.title}
                    </h3>
                    <p className="text-foreground">
                      {item.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </Section>

          {/* Top Services */}
          <Section variant="muted" padding="lg">
            <SectionHeader 
              title={`Top Services near ${locationData.name}`}
              subtitle="Expert care with premium products and personalized attention"
              align="center"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {topServices.map((service, index) => {
                if (!service) return null;
                const icons = [Palette, Sparkles, Zap, Scissors, Palette, Heart];
                const Icon = icons[index % icons.length];
                return (
                  <Card key={index} variant="default" padding="md" className="hover:shadow-lg transition-shadow">
                    <Icon className="w-10 h-10 text-brand-500 mb-3" />
                    <h3 className="text-lg font-heading text-heading mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-500 font-semibold">
                        {service.price}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        asChild
                      >
                        <a 
                          href={BOOK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackBookingClick("location_service_card", `/areas/${slug}`)}
                        >
                          {BOOK_CTA_LABEL}
                        </a>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="text-center">
              <Button 
                variant="primary" 
                size="lg"
                asChild
              >
                <Link to="/services">
                  View all services
                </Link>
              </Button>
            </div>
          </Section>

          {/* Map & Travel Time */}
          <Section padding="lg">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-10 h-10 text-brand-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-h2 font-heading text-heading mb-4">
                    Easy to reach from {locationData.name}
                  </h2>
                  <p className="text-lg text-foreground mb-4">
                    Approximately <strong>{locationData.driveTime}</strong> from {locationData.name} to our salon in Bangor with easy parking.
                  </p>
                  <p className="text-foreground mb-4">
                    <strong>Route:</strong> {locationData.route}
                  </p>
                </div>
              </div>
              <Card variant="bordered" padding="md" className="bg-muted/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-500" />
                    <p className="text-sm text-foreground">
                      <strong>Address:</strong> 60 Goorgool Road, Bangor NSW 2234
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-500" />
                    <p className="text-sm text-foreground">
                      <strong>Hours:</strong> Tue–Fri 9am–5pm | Sat 8am–3pm | Sun–Mon Closed
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-500" />
                    <p className="text-sm text-foreground">
                      <strong>Phone:</strong> <a href="tel:+61468020624" className="text-brand-500 hover:underline">+61 468 020 624</a>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          {/* Local Tips */}
          <Section variant="accent" padding="lg">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-heading text-heading mb-6 text-center">
                Local Tips for {locationData.name}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {locationData.localTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <p className="text-foreground text-sm">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* FAQs */}
          <Section padding="lg">
            <div className="max-w-3xl mx-auto">
              <SectionHeader 
                title={`Frequently Asked Questions`}
                subtitle={`Common questions from ${locationData.name} clients`}
                align="center"
              />
              <Accordion type="single" collapsible className="space-y-4">
                {locationData.faqs.map((faq, index) => (
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
          </Section>

          {/* CTA Band */}
          <Section 
            padding="xl"
            className="text-center text-white"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-600)) 100%)'
            }}
          >
            <h2 className="text-h2-lg font-heading mb-6">
              Ready for great hair, {locationData.name}?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
              Book your appointment now or get in touch for a personalized quote
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
                  onClick={() => trackBookingClick("location_cta_band", `/areas/${slug}`)}
                >
                  {BOOK_CTA_LABEL}
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <a href="sms:+61468020624" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Message us
                </a>
              </Button>
            </div>
          </Section>

          {/* Nearby Suburbs */}
          <Section padding="lg">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-heading text-xl text-heading mb-6 text-center">
                We also serve nearby areas
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {locationData.nearbyLocations.map((nearbySlug) => {
                  const nearbyData = getLocationData(nearbySlug);
                  return nearbyData ? (
                    <Link
                      key={nearbySlug}
                      to={`/areas/${nearbySlug}`}
                      className="px-5 py-2.5 bg-card border border-border rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors text-foreground text-sm font-medium"
                    >
                      {nearbyData.name}
                    </Link>
                  ) : null;
                })}
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/areas"
                  className="text-brand-500 hover:text-brand-600 font-semibold inline-flex items-center gap-2"
                >
                  View all service areas →
                </Link>
              </div>
            </div>
          </Section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LocationPage;