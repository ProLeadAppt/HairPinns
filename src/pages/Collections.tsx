import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import CollectionGrid from "@/components/design-system/CollectionGrid";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const Collections = () => {
  const collections = [
    {
      title: "Christmas Gift Packs",
      description: "Curated gift sets perfect for the holiday season",
      image: "/placeholder.svg",
      href: "/collections/christmas-gift-packs",
      itemCount: 12
    },
    {
      title: "Hair Care Essentials",
      description: "Professional products for daily hair care",
      image: "/placeholder.svg",
      href: "/collections/hair-care",
      itemCount: 24
    },
    {
      title: "Styling Tools",
      description: "Professional tools for salon-quality results",
      image: "/placeholder.svg",
      href: "/collections/styling-tools",
      itemCount: 18
    },
    {
      title: "Treatment Products",
      description: "Intensive care for damaged or special hair needs",
      image: "/placeholder.svg",
      href: "/collections/treatments",
      itemCount: 15
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader 
            title="Shop Collections" 
            subtitle="Explore our curated product collections"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((collection) => (
              <Link 
                key={collection.href}
                to={collection.href}
                className="group block"
              >
                <div className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={collection.image} 
                      alt={collection.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-h2 font-heading text-heading mb-2 group-hover:text-brand-500 transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-foreground mb-3">{collection.description}</p>
                    <p className="text-sm text-muted-foreground">{collection.itemCount} products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Collections;
