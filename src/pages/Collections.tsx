import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAllCollections } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getOGImage } from "@/lib/sitemap";
import { generateStoreSchema, generateBreadcrumbSchema } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BOOK_URL } from "@/config/bookingConfig";
import SEOHead from "@/components/SEOHead";
import { BUSINESS_NAP } from "@/config/businessConfig";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";
// All local collection images removed — using Shopify's own collection images and first product images

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
    edges: Array<{ node: { id: string; images?: { edges: Array<{ node: { url: string; altText?: string } }> } } }>;
  };
}

const Collections = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");

  // Real Shopify product photos for each collection — no AI/stock/logo images
  const collectionImageOverrides: Record<string, string> = {
    "juuce-botanicals": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
    "pure-certified-organic-hair-care": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Pure-034.jpg?v=1744176510",
    "wet-brush-detanglers": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Accessories-016.jpg?v=1746738998",
    "hair-pinns-accessories": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/98599680-F876-44FB-8AF2-687C0FC9176F.jpg?v=1746739385",
    "aromaganic": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Aromaganics-14.jpg?v=1746832701",
    "island-vibes-tanning": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/IslandVibesTanningDeepBangingBronzeDIYFoam.webp?v=1742170894",
    "qiqi": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/DAA9BE23-75CA-4B08-8C44-F572D7EA7DB9.jpg?v=1747084029",
    "the-perfect-pony-hair": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/A96B9D56-5A54-458F-9D5C-DAF26AF03C8C.jpg?v=1753072697",
    "best-sellers-march": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-057.jpg?v=1744178135",
    "heat-protection": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-042.jpg?v=1744250283",
    "blonde-bombshells": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-057.jpg?v=1744178135",
    "curly-girlys": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-011.jpg?v=1744178942",
    "pump-up-the-volume": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-067.jpg?v=1744178179",
    "frizz-free-must-haves": "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/DAA9BE23-75CA-4B08-8C44-F572D7EA7DB9.jpg?v=1747084029",
  };

  const getCollectionImage = (collection: ShopifyCollection) => {
    // Always use real product photos — overrides bypass AI/logo collection images
    if (collectionImageOverrides[collection.handle]) return collectionImageOverrides[collection.handle];
    // Fall back to first product's image (always real)
    const firstProduct = collection.products?.edges?.[0]?.node;
    const firstProductImage = firstProduct?.images?.edges?.[0]?.node?.url;
    if (firstProductImage) return firstProductImage;
    // Final fallback
    return "/placeholder.svg";
  };

  const collectionImageSizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";
  const collectionImageWidths = [480, 640, 800, 960];

  const buildShopifySrcSet = (url: string, webp = false) =>
    collectionImageWidths
      .map((width) => `${webp ? shopifyImageWebp(url, width) : shopifyImage(url, width)} ${width}w`)
      .join(", ");

  // Define the exact order from the live site
  const collectionOrder = [
    'aromaganic',
    'gift',
    'clearance',
    'accessories',
    'hair-pinns-accessories',
    'island',
    'island-vibes',
    'juuce',
    'botanical',
    'poppet',
    'locks',
    'pure',
    'organic',
    'qiqi',
    'perfect',
    'pony',
    'wet-brush',
    'detangler'
  ];

  const sortCollections = (collections: ShopifyCollection[]) => {
    return [...collections].sort((a, b) => {
      const aHandle = a.handle.toLowerCase();
      const bHandle = b.handle.toLowerCase();
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Find position based on handle or title match
      const aPos = collectionOrder.findIndex(term => 
        aHandle.includes(term) || aTitle.includes(term)
      );
      const bPos = collectionOrder.findIndex(term => 
        bHandle.includes(term) || bTitle.includes(term)
      );
      
      // If neither found, maintain original order
      if (aPos === -1 && bPos === -1) return 0;
      // If only one found, prioritize it
      if (aPos === -1) return 1;
      if (bPos === -1) return -1;
      // Both found, sort by position
      return aPos - bPos;
    });
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCollections(20);
        const sortedData = sortCollections(data);
        setCollections(sortedData);
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

  // Filter and sort collections (exclude collections with invalid handles)
  const filteredAndSortedCollections = useMemo(() => {
    let filtered = collections.filter(
      (c) => c.handle && typeof c.handle === "string" && c.handle.length > 0
    );

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (collection) =>
          collection.title.toLowerCase().includes(query) ||
          collection.handle.toLowerCase().includes(query) ||
          (collection.description && collection.description.toLowerCase().includes(query))
      );
    }

    // Sort collections
    const sorted = [...filtered];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "product-count":
        sorted.sort((a, b) => {
          const aCount = a.products?.edges?.length || 0;
          const bCount = b.products?.edges?.length || 0;
          return bCount - aCount;
        });
        break;
      default:
        // Keep default order (already sorted by collectionOrder)
        break;
    }

    return sorted;
  }, [collections, searchQuery, sortBy]);

  const schemas = [
    generateStoreSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "Collections", url: "https://hairpinns.com/collections" },
    ])
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Hair Products Australia | Hair Pinns Collections | Free Shipping Over $150"
        description="Shop hair care from Jena's salon. Juuce, QIQI, Pure, Wet Brush and more. Shipped anywhere in Australia. Free shipping over $150."
        canonical="https://hairpinns.com/collections"
        ogImage={getOGImage('collection')}
        ogType="website"
        schemaJson={schemas}
      />

      <Header />

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Collections" }
          ]} />
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-accent/40 via-background to-accent/30 py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,74,139,0.15),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-heading font-heading tracking-tight leading-tight">
                Shop Collections
              </h1>
              <div className="inline-block bg-background/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-lg">
                <p className="text-xl md:text-2xl text-heading font-semibold max-w-2xl leading-relaxed mb-4">
                  I ship hair care anywhere in Australia. Free shipping over $150.
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  Browse by brand: Juuce, QIQI, Pure, Wet Brush and more. From daily essentials to treatments, everything your hair needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured bundle */}
        <section className="py-10 md:py-14 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-500/8 via-background to-accent/20 p-6 md:p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-3">
                    Jena's Daily Trio
                  </h2>
                  <p className="text-base text-foreground max-w-xl mb-5">
                    The shampoo, conditioner and leave-in Jena uses most —
                    bundled at 10% off.
                  </p>
                  <p className="text-sm font-semibold text-brand-500 mb-5">
                    Save 10% · Free shipping over $150
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-border">10% bundle saving</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-border">Free shipping over $150</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-border">Salon-picked routine</span>
                  </div>
                  {/* Single CTA — once a user is on /collections they
                      don't need a "browse all" button. One path, one
                      click. */}
                  <div>
                    <Button asChild variant="default" size="lg" className="gap-2">
                      <Link to="/collections/jenas-daily-trio">
                        View the trio
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Inside
                  </p>
                  <div className="space-y-2">
                    {[
                      "Juuce Bond Repair Shampoo",
                      "Aromaganic Smooth Hair Conditioner",
                      "QIQI Bare Repair Oil",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="border-b border-border bg-card sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  aria-label="Search collections"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]" aria-label="Sort collections">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Order</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z-A</SelectItem>
                  <SelectItem value="product-count">Most Products</SelectItem>
                </SelectContent>
              </Select>
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
                <p className="text-muted-foreground text-lg mb-6">{error}</p>
                <Button variant="default" asChild>
                  <a href="https://hairpinns.com/collections" target="_blank" rel="noopener noreferrer">
                    Visit Our Store
                  </a>
                </Button>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-16 max-w-2xl mx-auto">
                <p className="text-muted-foreground text-lg mb-6">No collections available at the moment.</p>
                <Button variant="default" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            ) : filteredAndSortedCollections.length === 0 ? (
              <div className="text-center py-16 max-w-2xl mx-auto">
                <p className="text-muted-foreground text-lg mb-6">
                  No collections found matching "{searchQuery}".
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredAndSortedCollections.map((collection, index) => (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.handle}`}
                    className="group relative bg-card rounded-card overflow-hidden border border-border hover:border-brand-500/30 hover:shadow-2xl transition-all duration-slow animate-fade-in hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet={buildShopifySrcSet(getCollectionImage(collection), true)}
                          sizes={collectionImageSizes}
                        />
                        <img
                          src={shopifyImage(getCollectionImage(collection), 800)}
                          srcSet={buildShopifySrcSet(getCollectionImage(collection))}
                          alt={collection.image?.altText || collection.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-slow"
                          loading="lazy"
                          decoding="async"
                          width="800"
                          height="600"
                          sizes={collectionImageSizes}
                        />
                      </picture>
                      <div className="absolute inset-0 bg-gradient-to-t from-heading/70 via-heading/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-slow" />
                      
                      {/* Product Count Badge removed due to inaccurate counts from GraphQL pagination */}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h2 className="text-3xl font-semibold text-heading font-heading group-hover:text-brand-500 transition-colors leading-tight">
                        {collection.title}
                      </h2>
                      
                      {collection.description && (
                        <p className="text-muted-foreground leading-relaxed line-clamp-2">
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
              <p className="text-lg md:text-xl text-heading font-semibold leading-relaxed inline-block bg-background/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md">
                Chat with Isabella for instant product recommendations or call Jena for personalized advice.
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
                  <a href={BUSINESS_NAP.phone.tel}>Call Jena Now</a>
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
