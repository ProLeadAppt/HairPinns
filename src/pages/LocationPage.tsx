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
  Phone,
  Palette,
  Sparkles,
  Scissors
} from "lucide-react";
import { getLocationData } from "@/data/locationPages";
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
    "hasMap": `https://www.google.com/maps/dir/${encodeURIComponent(locationData.fullName)}/Hair+Pinns,+60+Goorgool+Road,+Bangor+NSW+2234`,
    "sameAs": [
      "https://www.facebook.com/hairpinns",
      "https://www.instagram.com/hairpinns",
      "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID"
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

  return (
    <>
      <Helmet>
        <title>Hairdresser {locationData.name} | Hair Salon near {locationData.name} – Hair Pinns</title>
        <meta 
          name="description" 
          content={`Boutique hair salon near ${locationData.name} for colour, blonding, smoothing and cuts. ${locationData.driveTime} from Bangor with easy parking. Book online or call +61 468 020 624.`}
        />
        <link rel="canonical" href={`https://hairpinns.com/areas/${locationData.slug}`} />
        <meta property="og:title" content={`Hairdresser ${locationData.name} | Hair Pinns`} />
        <meta property="og:description" content={`${locationData.driveTime} from Bangor salon • easy parking • one-on-one care with Jena`} />
        <meta property="og:url" content={`https://hairpinns.com/areas/${locationData.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hairpinns.com/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Hairdresser ${locationData.name} | Hair Pinns`} />
        <meta name="twitter:description" content={`${locationData.driveTime} from Bangor • easy parking • expert colour, smoothing & cuts`} />
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

          {/* Hero Section with Gradient Overlay */}
          <Section 
            variant="default" 
            padding="xl"
            className="relative overflow-hidden bg-gradient-to-br from-brand-500/10 via-accent/20 to-brand-500/5"
          >
            <div className="max-w-4xl">
              <h1 className="text-h1 font-heading text-heading mb-4">
                Hairdresser near {locationData.name} – Hair Pinns
              </h1>
              <p className="text-xl text-foreground mb-8">
                {locationData.driveTime} from Bangor salon • easy parking • one-on-one care with Jena
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
                  <a href="tel:+61468020624" className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call +61 468 020 624
                  </a>
                </Button>
              </div>
            </div>
          </Section>

          {/* Local Intro */}
          <Section padding="lg">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-foreground leading-relaxed">
                {locationData.localIntro}
              </p>
            </div>
          </Section>

          {/* Popular in {Suburb} */}
          <Section variant="muted" padding="lg">
            <SectionHeader 
              title={`Popular in ${locationData.name}`}
              align="center"
            />
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                    <Card variant="elevated" padding="md" className="text-center hover:shadow-xl transition-all">
                      <Icon className="w-12 h-12 text-brand-500 mx-auto mb-3" />
                      <h3 className="text-lg font-heading text-heading group-hover:text-brand-500 transition-colors">
                        {service}
                      </h3>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Section>

          {/* Services Mini-Grid */}
          <Section padding="lg">
            <SectionHeader 
              title="Our Services"
              subtitle="Book online or text for a personalized quote"
              align="center"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {topServices.map((service, index) => (
                <Card key={index} variant="default" padding="md" className="hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-heading text-heading mb-2">
                    {'name' in service ? service.name : service.title}
                  </h3>
                  <p className="text-brand-500 font-semibold mb-4">
                    {service.price}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="primary"
                      className="w-full"
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
                      size="sm" 
                      variant="outline"
                      className="w-full"
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
              <Button variant="primary" size="lg" asChild>
                <Link to="/services">View all services</Link>
              </Button>
            </div>
          </Section>

          {/* Micro-FAQs (AEO) */}
          <Section variant="muted" padding="lg">
            <div className="max-w-3xl mx-auto">
              <SectionHeader 
                title="Common Questions"
                align="center"
              />
              <Accordion type="single" collapsible className="space-y-4">
                {locationData.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-heading text-heading hover:text-brand-500 py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground pb-6">
                      {faq.answer}
                      <FaqFeedbackWidget question={faq.question} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Section>

          {/* Map & Directions */}
          <Section padding="lg">
            <div className="max-w-3xl mx-auto">
              <SectionHeader 
                title="Directions"
                align="center"
              />
              <Card variant="bordered" padding="lg" className="text-center">
                <MapPin className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                <p className="text-lg text-foreground mb-4">
                  Approximately <strong>{locationData.driveTime}</strong> from {locationData.name} to our salon in Bangor
                </p>
                <p className="text-foreground mb-6">
                  <strong>Hair Pinns</strong><br />
                  60 Goorgool Road, Bangor NSW 2234
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  asChild
                >
                  <a 
                    href={`https://www.google.com/maps/dir/${encodeURIComponent(locationData.fullName)}/Hair+Pinns,+60+Goorgool+Road,+Bangor+NSW+2234`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Get directions
                  </a>
                </Button>
              </Card>
            </div>
          </Section>

          {/* Footer CTA */}
          <Section 
            padding="xl"
            className="text-center text-white"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-600)) 100%)'
            }}
          >
            <h2 className="text-h2-lg font-heading mb-6">
              Ready for salon-quality hair near {locationData.name}?
            </h2>
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
                  onClick={() => trackBookingClick("location_footer_cta", `/areas/${slug}`)}
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
                <a href="tel:+61468020624" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call +61 468 020 624
                </a>
              </Button>
            </div>
          </Section>

          {/* Cross-link to Other Areas */}
          <Section padding="lg">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-heading text-xl text-heading mb-6 text-center">
                Serving the Sutherland Shire
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