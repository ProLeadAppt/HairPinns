import { useState, useMemo, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/design-system/Header";
import Footer from "@/components/design-system/Footer";
import { ServiceCard } from "@/components/services/ServiceCard";
import { FilterToolbar } from "@/components/services/FilterToolbar";
import { CategoryNav } from "@/components/services/CategoryNav";
import { Button } from "@/components/ui/button";
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const categoryOrder = [
    "Straight Up Smoothing Treatments",
    "Foil Packages",
    "Colouring Packages",
    "Cut & Blow-dry Packages",
    "Pretty Princess Braids",
    "Time-Out",
    "Hair",
    "Kids Formal Hairstyle",
    "Treatments",
    "Straight Up Treatment",
    "Rinse-out Colour",
    "OSTEO",
    "Tints",
    "Foils",
    "Blow Dry"
  ];

  const quickFilterOptions = ["Packages", "Colour/Blonde", "Smoothing", "Braids", "Kids"];

  // Group services by category
  const groupedServices = useMemo(() => {
    return servicesCatalog.reduce((acc, service: Service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {} as Record<string, Service[]>);
  }, []);

  const sortedCategories = categoryOrder.filter(cat => groupedServices[cat]);

  // Filter services based on search, category, and quick filters
  const filteredCategories = useMemo(() => {
    let filtered = sortedCategories;

    // Apply category filter
    if (activeCategory) {
      filtered = [activeCategory];
    }

    // Apply quick filters
    if (activeQuickFilters.length > 0) {
      filtered = filtered.filter(category => {
        return activeQuickFilters.some(qf => {
          if (qf === "Packages") {
            return category.includes("Packages") || 
                   groupedServices[category].some(s => s.name.toLowerCase().includes("package"));
          }
          if (qf === "Colour/Blonde") {
            return ["Colouring Packages", "Tints", "Foils"].includes(category) ||
                   groupedServices[category].some(s => 
                     s.name.toLowerCase().includes("toner") || 
                     s.name.toLowerCase().includes("foils") || 
                     s.name.toLowerCase().includes("colour")
                   );
          }
          if (qf === "Smoothing") {
            return category.includes("Smoothing") || category.includes("Straight Up");
          }
          if (qf === "Braids") {
            return category.includes("Braids");
          }
          if (qf === "Kids") {
            return groupedServices[category].some(s => 
              s.name.toLowerCase().includes("kids") || 
              s.name.toLowerCase().includes("princess") ||
              s.name.toLowerCase().includes("boys") ||
              s.name.toLowerCase().includes("girls") ||
              s.name.toLowerCase().includes("primary") ||
              s.name.toLowerCase().includes("high school")
            );
          }
          return false;
        });
      });
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(category => {
        return category.toLowerCase().includes(term) ||
               groupedServices[category].some(s => 
                 s.name.toLowerCase().includes(term) || 
                 (s.description && s.description.toLowerCase().includes(term))
               );
      });
    }

    return filtered;
  }, [sortedCategories, activeCategory, activeQuickFilters, searchTerm, groupedServices]);

  const handleCategoryClick = (category: string) => {
    const element = sectionRefs.current[category];
    if (element) {
      const offset = 150; // Account for sticky toolbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleQuickFilterToggle = (filter: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

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
      
      <main className="min-h-screen" style={{ backgroundColor: 'hsl(var(--bg))' }}>
        {/* Hero Section */}
        <section className="py-12 md:py-16" style={{ background: 'linear-gradient(180deg, hsl(var(--accent)), hsl(var(--surface)))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-brand-500 font-medium text-sm uppercase tracking-wide mb-3">
                Our Services
              </p>
              <h1 className="font-heading text-h1 lg:text-h1-lg font-semibold text-heading mb-4">
                Services & Packages
              </h1>
              <p className="text-base text-muted-foreground">
                Exact pricing and timings as listed in our booking system.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Toolbar */}
        <FilterToolbar
          categories={sortedCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          quickFilters={quickFilterOptions}
          activeQuickFilters={activeQuickFilters}
          onQuickFilterToggle={handleQuickFilterToggle}
        />

        {/* Main Content: Two-column layout */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Left: Sticky Category Nav (desktop only) */}
              <CategoryNav
                categories={sortedCategories}
                activeCategory={activeCategory}
                onCategoryClick={handleCategoryClick}
              />

              {/* Right: Services Grid */}
              <div className="flex-1 space-y-12 md:space-y-16">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">
                      No services found matching your filters.
                    </p>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <section
                      key={category}
                      id={category.toLowerCase().replace(/\s+/g, '-')}
                      ref={(el) => (sectionRefs.current[category] = el)}
                      className="scroll-mt-32"
                    >
                      <h2 className="font-heading text-h2 lg:text-h2-lg font-semibold text-heading mb-6 md:mb-8">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {groupedServices[category]
                          .filter(service => {
                            if (!searchTerm) return true;
                            const term = searchTerm.toLowerCase();
                            return service.name.toLowerCase().includes(term) ||
                                   (service.description && service.description.toLowerCase().includes(term));
                          })
                          .map((service: Service, index: number) => (
                            <ServiceCard
                              key={`${category}-${index}`}
                              service={service}
                              category={category}
                            />
                          ))}
                      </div>
                    </section>
                  ))
                )}

                {/* Disclaimer */}
                <div className="text-center pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    All services, durations and prices shown exactly as listed in our booking system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Sticky Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border p-4" style={{ boxShadow: '0 -4px 12px rgba(36,19,39,0.08)' }}>
          <Button
            asChild
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-btn"
          >
            <a
              href={`${BOOK_URL}?utm_source=site&utm_medium=services&utm_campaign=mobile_sticky`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("mobile_sticky_bottom", "/services")}
            >
              Book now
            </a>
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Services;
