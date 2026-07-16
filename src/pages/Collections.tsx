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

  const collectionImageSizes = "(max-width: 767px) 50vw, (max-width: 1023px) 50vw, 33vw";
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
        <section className="border-b border-[hsl(var(--after-hours-plum)/0.18)] bg-[hsl(var(--after-hours-cream))] py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">Shop / Hair Pinns</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-end lg:gap-16">
              <h1 className="max-w-[10ch] font-heading text-[clamp(3.4rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]">
                Shop collections.
              </h1>
              <div className="border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-5">
                <p className="text-lg font-semibold leading-7 text-[hsl(var(--after-hours-plum))]">Hair care selected behind the chair and shipped across Australia.</p>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.72)]">Browse Juuce, QIQI, Pure, Wet Brush and more. Free shipping over $150.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured bundle */}
        <section className="bg-[hsl(var(--after-hours-paper))] py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-y border-[hsl(var(--after-hours-plum)/0.2)] py-8 md:py-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 items-center">
                <div>
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">Jena’s routine / 10% saving</p>
                  <h2 className="mt-3 text-3xl md:text-4xl font-heading text-[hsl(var(--after-hours-plum))] mb-3">
                    Jena's Daily Trio
                  </h2>
                  <p className="text-base text-[hsl(var(--after-hours-plum)/0.76)] max-w-xl mb-5">
                    The shampoo, conditioner and leave-in Jena uses most —
                    bundled at 10% off.
                  </p>
                  {/* Single CTA — once a user is on /collections they
                      don't need a "browse all" button. One path, one
                      click. */}
                  <div>
                    <Button asChild variant="default" size="lg" className="min-h-11 rounded-none gap-2 bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
                      <Link to="/collections/jenas-daily-trio">
                        View the trio
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="border-t border-[hsl(var(--after-hours-plum)/0.2)] pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className="text-xs uppercase tracking-widest text-[hsl(var(--after-hours-plum)/0.76)] font-semibold mb-3">
                    Inside
                  </p>
                  <ol>
                    {[
                      "Juuce Bond Repair Shampoo",
                      "Aromaganic Smooth Hair Conditioner",
                      "QIQI Bare Repair Oil",
                    ].map((item, index) => (
                      <li
                        key={item}
                        className="flex min-h-11 items-center border-t border-[hsl(var(--after-hours-plum)/0.16)] text-sm text-[hsl(var(--after-hours-plum))]"
                      >
                        <span className="mr-3 text-[0.62rem] text-[hsl(var(--after-hours-plum)/0.76)]">0{index + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="sticky top-16 z-30 border-y border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-paper)/0.97)] backdrop-blur-sm">
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
                  className="h-11 rounded-none border-[hsl(var(--after-hours-plum)/0.25)] bg-transparent pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-full rounded-none border-[hsl(var(--after-hours-plum)/0.25)] bg-transparent md:w-[200px]" aria-label="Sort collections">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Order</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z-A</SelectItem>

                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="bg-[hsl(var(--after-hours-paper))] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
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
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
                {filteredAndSortedCollections.map((collection, index) => (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.handle}`}
                    className="group relative min-w-0 border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-3 text-[hsl(var(--after-hours-plum))] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-[hsl(var(--after-hours-cream))]">
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
                          className="w-full h-full object-cover transition-opacity duration-slow group-hover:opacity-90"
                          loading="lazy"
                          decoding="async"
                          width="800"
                          height="600"
                          sizes={collectionImageSizes}
                        />
                      </picture>
                      {/* Product Count Badge removed due to inaccurate counts from GraphQL pagination */}
                    </div>

                    {/* Content */}
                    <div className="pt-4">
                      <h2 className="font-heading text-xl leading-tight text-[hsl(var(--after-hours-plum))] transition-colors group-hover:text-brand-600 sm:text-2xl">
                        {collection.title}
                      </h2>
                      
                      {collection.description && (
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.66)] sm:text-sm">
                          {collection.description}
                        </p>
                      )}

                      {/* CTA */}
                      <div className="mt-3 flex min-h-11 items-center gap-2 border-t border-[hsl(var(--after-hours-plum)/0.16)] text-sm font-medium text-[hsl(var(--after-hours-plum))]">
                        <span>Shop collection</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-[hsl(var(--after-hours-plum)/0.2)] bg-[hsl(var(--after-hours-cream))] py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-end lg:gap-16">
              <div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">Need a second opinion?</p>
                <h2 className="mt-4 max-w-[12ch] font-heading text-4xl leading-[0.98] text-[hsl(var(--after-hours-plum))] md:text-5xl">Not Sure What's Right for Your Hair?</h2>
              </div>
              <div className="border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-5">
                <p className="text-base leading-7 text-[hsl(var(--after-hours-plum)/0.74)]">Chat with Isabella for product recommendations or call Jena for personalised advice.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
                    className="min-h-11 w-full rounded-none bg-[hsl(var(--after-hours-plum))] px-8 text-[hsl(var(--after-hours-cream))] sm:w-auto"
                  >
                    Chat with Isabella
                  </Button>
                  <Button variant="outline" size="lg" asChild className="min-h-11 w-full rounded-none border-[hsl(var(--after-hours-plum)/0.35)] px-8 sm:w-auto">
                    <a href={BUSINESS_NAP.phone.tel}>Call Jena now</a>
                  </Button>
                  <a
                    href={BOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-[hsl(var(--after-hours-plum))] underline underline-offset-4"
                  >
                    Or book direct
                  </a>
                </div>
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
