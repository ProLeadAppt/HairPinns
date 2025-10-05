import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Droplet, Sparkles, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

const Collections = () => {
  const collections = [
    {
      handle: "christmas-gift-packs",
      title: "Christmas Gift Packs",
      description: "Curated bundles perfect for gifting — salon-quality care sets at special prices",
      image: "/placeholder.svg",
      icon: Gift,
      productCount: 8
    },
    {
      handle: "hair-care",
      title: "Hair Care",
      description: "Daily shampoos, conditioners & treatments for every hair type and concern",
      image: "/placeholder.svg",
      icon: Droplet,
      productCount: 24
    },
    {
      handle: "treatments",
      title: "Treatments & Masks",
      description: "Deep conditioning, repair treatments & intensive care for damaged hair",
      image: "/placeholder.svg",
      icon: Sparkles,
      productCount: 12
    },
    {
      handle: "styling",
      title: "Styling Products",
      description: "Heat protectants, sprays, creams & finishing products for salon results at home",
      image: "/placeholder.svg",
      icon: Wind,
      productCount: 16
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-accent py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
              Shop Collections
            </h1>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Professional hair care products hand-picked by Jena. 
              From gift-ready bundles to daily essentials — find what your hair needs.
            </p>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => {
                const Icon = collection.icon;
                return (
                  <Link
                    key={collection.handle}
                    to={`/collections/${collection.handle}`}
                    className="group"
                  >
                    <article className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-all duration-base h-full">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <img
                          src={collection.image}
                          alt={collection.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                          loading="lazy"
                          width="800"
                          height="450"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-4 left-4 w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-baseline justify-between mb-2">
                          <h2 className="text-2xl font-heading font-semibold text-heading group-hover:text-brand-500 transition-colors">
                            {collection.title}
                          </h2>
                          <span className="text-sm text-muted-foreground">
                            {collection.productCount} products
                          </span>
                        </div>
                        
                        <p className="text-foreground mb-4 leading-relaxed">
                          {collection.description}
                        </p>
                        
                        <div className="flex items-center text-brand-500 font-semibold group-hover:gap-2 transition-all">
                          <span>Shop Collection</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-brand-500 text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h2-lg font-heading font-bold mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Book a free consultation with Jena to get personalized product recommendations.
            </p>
            <a 
              href="https://www.fresha.com/book-now/hair-pinns-example"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg" className="bg-white text-brand-500 hover:bg-white/90">
                Book Free Consult
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
