import { Helmet } from "react-helmet";
import Header from "@/components/design-system/Header";
import Footer from "@/components/design-system/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import servicesCatalog from "@/data/services.catalog.json";

interface Service {
  category: string;
  name: string;
  description?: string;
  duration: string;
  services_count?: string;
  price_aud: string;
  notes?: string;
}

const Services = () => {
  const categoryOrder = [
    "Straight Up Smoothing Treatments",
    "Foil Packages",
    "Colouring Packages",
    "Cut & Blow-dry Packages",
    "Pretty Princess Braids",
    "Time-Out",
    "Hair",
    "Styling",
    "Kids Formal Hairstyle",
    "Treatments",
    "Straight Up Treatment",
    "Rinse-out Colour",
    "OSTEO",
    "Tints",
    "Foils",
    "Blow Dry"
  ];

  // Group services by category
  const groupedServices = servicesCatalog.reduce((acc, service: Service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Sort categories by the specified order
  const sortedCategories = categoryOrder.filter(cat => groupedServices[cat]);

  return (
    <>
      <Helmet>
        <title>Services & Pricing | Hair Pinns – Boutique Hair Salon, Bangor NSW</title>
        <meta 
          name="description" 
          content="Browse our complete menu: cuts, colour, keratin smoothing, braids and event hair. All services, durations and prices shown exactly as listed in our booking system." 
        />
        <link rel="canonical" href="https://hairpinns.com/services" />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-accent/20 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-h1 font-heading text-heading mb-4">
                Services & Pricing
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse our complete service menu with exact durations and pricing. 
                Book directly on Fresha for instant confirmation.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sortedCategories.map((category) => (
              <div key={category} className="mb-16">
                <h2 className="text-h2 font-heading text-heading mb-8">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedServices[category].map((service: Service, index: number) => (
                    <Card key={`${category}-${index}`} className="shadow-soft hover:shadow-medium transition-smooth">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-heading mb-3">
                          {service.name}
                        </h3>
                        
                        {service.description && (
                          <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                            {service.description}
                          </p>
                        )}

                        {(service.duration || service.services_count) && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Clock className="w-4 h-4" />
                            <span>
                              {[service.duration, service.services_count]
                                .filter(Boolean)
                                .join(" • ")}
                            </span>
                          </div>
                        )}

                        {service.price_aud && (
                          <p className="text-xl font-semibold text-brand-500 mb-4">
                            {service.price_aud}
                          </p>
                        )}

                        <Button 
                          asChild
                          variant="primary" 
                          className="w-full"
                        >
                          <a
                            href={`${BOOK_URL}?utm_source=site&utm_medium=cta&utm_campaign=services`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackBookingClick("service_card", `/services#${category}`)}
                          >
                            Book on Fresha
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* Disclaimer */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                All services, durations and prices shown exactly as listed in our booking system.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Services;