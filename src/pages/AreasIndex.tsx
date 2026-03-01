import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Card from "@/components/design-system/Card";
import { MapPin, Clock } from "lucide-react";
import { getAllLocationSlugs, getLocationData } from "@/data/locationPages";

const AreasIndex = () => {
  const allSlugs = getAllLocationSlugs();
  const locations = allSlugs.map(slug => getLocationData(slug)).filter(Boolean);

  // Sort locations by name
  locations.sort((a, b) => a!.name.localeCompare(b!.name));

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
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Areas We Serve – Hair Salon in Sutherland Shire | Hair Pinns</title>
        <meta 
          name="description" 
          content="Hair Pinns serves the Sutherland Shire with expert colour, blonding, keratin smoothing, braids & cuts. Find your local area and book online today."
        />
        <link rel="canonical" href="https://hairpinns.com/areas" />
        <meta property="og:title" content="Areas We Serve | Hair Pinns" />
        <meta property="og:description" content="Boutique hair salon serving Sutherland Shire and surrounding areas with expert care." />
        <meta property="og:url" content="https://hairpinns.com/areas" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <Section 
            variant="default" 
            padding="xl"
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--brand-500) / 0.05) 0%, hsl(var(--accent) / 0.15) 100%)'
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-h1 font-heading text-heading mb-6">
                Areas We Serve
              </h1>
              <p className="text-xl text-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
                Hair Pinns proudly serves the Sutherland Shire and surrounding areas with boutique hair care. From Bangor to Cronulla, Menai to Miranda—we're your local hair experts.
              </p>
              <div className="flex items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-500" />
                  <span className="text-sm">60 Goorgool Road, Bangor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-500" />
                  <span className="text-sm">Tue–Sat appointments</span>
                </div>
              </div>
            </div>
          </Section>

          {/* Locations Grid */}
          <Section padding="xl">
            <SectionHeader 
              title="Find Your Area"
              subtitle="Select your suburb to see how close we are and what makes Hair Pinns perfect for your local hair care needs"
              align="center"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {locations.map((location) => {
                if (!location) return null;
                return (
                  <Link
                    key={location.slug}
                    to={`/areas/${location.slug}`}
                    className="group"
                  >
                    <Card 
                      variant="elevated" 
                      padding="md"
                      className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-heading text-heading group-hover:text-brand-500 transition-colors mb-1">
                            {location.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {location.postcode}
                          </p>
                        </div>
                        <MapPin className="w-5 h-5 text-brand-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {location.driveTime}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {location.localIntro.substring(0, 120)}...
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <span className="text-brand-500 text-sm font-semibold group-hover:underline">
                          View details →
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Section>

          {/* CTA Section */}
          <Section 
            variant="accent" 
            padding="lg"
            className="text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-heading text-heading mb-4">
                Don't see your suburb?
              </h2>
              <p className="text-lg text-foreground mb-6">
                We welcome clients from across Sydney. Get in touch to see how far we are from you and whether we can help with your hair goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+61468093991"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                  Call +61 468 093 991
                </a>
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors font-semibold"
                >
                  Contact Us
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

export default AreasIndex;