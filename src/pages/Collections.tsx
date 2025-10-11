import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAllCollections } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getOGImage } from "@/lib/sitemap";
import { BOOK_URL } from "@/config/bookingConfig";

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    altText?: string;
  };
  products: {
    edges: Array<{ node: { id: string } }>;
  };
}

const Collections = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collection image mapping for beautiful, representative images
  const collectionImageMap: Record<string, string> = {
    'christmas-gift-packs': '/placeholder.svg', // Will be replaced with actual gift pack image
    'daily-care': '/placeholder.svg',
    'treatments': '/placeholder.svg',
    'styling': '/placeholder.svg',
    'color-care': '/placeholder.svg',
    'volumizing': '/placeholder.svg',
    'smoothing': '/placeholder.svg',
  };

  const getCollectionImage = (handle: string, shopifyImage?: string) => {
    // Prefer Shopify image if available, otherwise use our curated map
    if (shopifyImage) return shopifyImage;
    return collectionImageMap[handle] || '/placeholder.svg';
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCollections(20);
        setCollections(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Unable to load collections. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-accent/30 via-background to-accent/20 py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,74,139,0.1),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-heading font-heading tracking-tight leading-tight">
                Shop Collections
              </h1>
              <p className="text-xl md:text-2xl text-heading font-medium max-w-2xl mx-auto leading-relaxed">
                Explore our curated collections of premium hair care products.
                From daily essentials to special treatments, find everything you
                need for healthy, beautiful hair.
              </p>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <Skeleton className="aspect-[4/3] w-full rounded-card" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 max-w-2xl mx-auto">
                <p className="text-muted text-lg mb-6">{error}</p>
                <Button variant="default" asChild>
                  <a href="https://hairpinns.com/collections" target="_blank" rel="noopener noreferrer">
                    Visit Our Store
                  </a>
                </Button>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-16 max-w-2xl mx-auto">
                <p className="text-muted text-lg mb-6">No collections available at the moment.</p>
                <Button variant="default" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {collections.map((collection, index) => (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.handle}`}
                    className="group relative bg-card rounded-card overflow-hidden border border-border hover:border-brand-500/30 hover:shadow-2xl transition-all duration-slow animate-fade-in hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                      {collection.image?.url ? (
                        <img
                          src={getCollectionImage(collection.handle, collection.image.url)}
                          alt={collection.image.altText || collection.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-slow"
                          loading="lazy"
                          width="800"
                          height="600"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/40 to-accent/20">
                          <span className="text-4xl font-heading text-brand-500">
                            {collection.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-heading/70 via-heading/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-slow" />
                      
                      {/* Product Count Badge */}
                      {collection.products?.edges && collection.products.edges.length > 0 && (
                        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-heading shadow-md">
                          {collection.products.edges.length} {collection.products.edges.length === 1 ? 'item' : 'items'}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h2 className="text-3xl font-semibold text-heading font-heading group-hover:text-brand-500 transition-colors leading-tight">
                        {collection.title}
                      </h2>
                      
                      {collection.description && (
                        <p className="text-muted leading-relaxed line-clamp-2">
                          {collection.description}
                        </p>
                      )}

                      {/* CTA */}
                      <div className="pt-2 flex items-center gap-2 text-brand-500 font-medium group-hover:gap-3 transition-all">
                        <span>Shop Collection</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* AI Agents CTA Banner */}
        <section className="relative bg-gradient-to-br from-brand-500/5 via-accent/30 to-brand-500/5 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,74,139,0.15),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-heading font-heading leading-tight">
                Not Sure What's Right for Your Hair?
              </h2>
              <p className="text-xl text-muted leading-relaxed">
                Chat with Isabella for instant product recommendations or call Sam for personalized advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => {
                    const bubble = document.querySelector('[data-chat-bubble]') as HTMLElement;
                    if (bubble) {
                      bubble.style.animation = 'pulse 0.5s ease-in-out 3';
                      bubble.click();
                    }
                    if (typeof window.hpCapture === 'function') {
                      window.hpCapture('chat_clicked', { source: 'collections_cta' });
                    }
                  }}
                  className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg hover:shadow-xl"
                >
                  Chat with Isabella
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  className="w-full sm:w-auto text-lg px-8 py-6"
                >
                  <a href="tel:+61468020624">Call Sam Now</a>
                </Button>
                <a 
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-500 hover:text-brand-600 font-medium underline"
                >
                  Or Book Direct
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
