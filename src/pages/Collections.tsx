import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Droplet, Sparkles, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOGImage } from "@/lib/sitemap";

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
      <Helmet>
        <title>Shop Hair Care Collections | Professional Products | Hair Pinns</title>
        <meta 
          name="description" 
          content="Shop professional hair care: Christmas Gift Packs, Daily Care, Treatments & Styling. Olaplex, Kevin Murphy & more. Curated by experts." 
        />
        <link rel="canonical" href="https://hairpinns.com/collections" />
        <meta property="og:title" content="Professional Hair Care Collections | Hair Pinns" />
        <meta property="og:description" content="Salon-quality products curated by Jena. Gift packs, daily care, treatments & styling essentials." />
        <meta property="og:url" content="https://hairpinns.com/collections" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('collection')} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/collections" />
      </Helmet>
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
              <a href="/contact" className="text-white font-semibold hover:text-white/90 underline">Message us on the contact page</a> for personalized product recommendations.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
