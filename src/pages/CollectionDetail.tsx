import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { getCollectionByHandle, getProductUrl, storeUrl } from "@/lib/shopify";
import { notify } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ExitIntentModal removed

import QuickViewModal from "@/components/product/QuickViewModal";
import { formatPrice } from "@/lib/utils";
import { getOGImage } from "@/lib/sitemap";
import { generateCollectionPageSchema, generateBreadcrumbSchema, generateFAQPageSchema, generateWebPageSchema } from "@/lib/schema";
import { getCollectionFAQs } from "@/data/collectionFAQs";
import SEOHead from "@/components/SEOHead";
import { useImagePreload } from "@/components/ImagePreloader";
import RelatedContent from "@/components/RelatedContent";
import { topicsForCollection } from "@/data/topicMap";

const CollectionDetail = () => {
  const { slug } = useParams(); // Route uses :slug, not :handle
  const handle = slug; // But we'll use "handle" internally for clarity

  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [quickViewHandle, setQuickViewHandle] = useState<string | null>(null);

  const collectionTitle = collection?.title || "Collection";
  const collectionDescription = collection?.description || "Browse this hair care collection";

  // Track GA4 view_item_list when collection loads
  useEffect(() => {
    if (collectionTitle && collectionTitle !== "Collection" && typeof window.gtag === 'function') {
      window.gtag('event', 'view_item_list', { item_list_name: collectionTitle });
    }
  }, [collectionTitle]);

  // Fetch collection from Shopify with timeout
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const fetchCollection = async () => {
      if (!handle) return;
      
      setLoading(true);
      
      try {
        console.log("🔍 Fetching", handle, "collection...");
        const cacheKey = `hp_col_${handle}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.collection && parsed.products) {
              setCollection(parsed.collection);
              setProducts(parsed.products);
              setLoading(false);
            }
          } catch (e) {
            console.error("Cache parsing error", e);
          }
        }
        
        // 8s timeout wrapper
        const fetchPromise = getCollectionByHandle(handle);
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Request timeout")), 8000);
        });
        
        const collectionData = await Promise.race([fetchPromise, timeoutPromise]) as any;
        clearTimeout(timeoutId);
        
        console.log("✅ Collection fetched:", collectionData);
        
        if (!isMounted) {
          console.log("⚠️ Component unmounted, skipping state update");
          return;
        }
        
        // Check if collection exists and has products
        const productEdges = collectionData?.products?.edges || [];
        if (!collectionData || productEdges.length === 0) {
          console.warn("Collection fallback", { handle });
          // If we have cached data, don't overwrite with null
          if (!cached) {
            setCollection(null);
            setProducts([]);
            setLoading(false);
          }
          return;
        }
        
        setCollection(collectionData);
        
        // Map Shopify products to our format
        const mappedProducts = productEdges.map((edge: any) => {
          const product = edge.node;
          const firstImage = product.images.edges[0]?.node;
          const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
          const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
            ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
            : undefined;
          
          // Get first available variant ID
          const variants = product.variants?.edges || [];
          const firstVariant = variants.find((v: any) => v.node.availableForSale)?.node || variants[0]?.node;
          const variantId = firstVariant?.id || null;
          
          return {
            id: product.id,
            handle: product.handle,
            title: product.title,
            price: minPrice,
            originalPrice: compareAtPrice,
            image: firstImage?.url || "/placeholder.svg",
            availableForSale: product.availableForSale,
            firstVariantId: variantId,
          };
        });
        
        console.log("✅ Mapped products:", mappedProducts.length);
        setProducts(mappedProducts);
        
        try {
          sessionStorage.setItem(`hp_col_${handle}`, JSON.stringify({
            collection: collectionData,
            products: mappedProducts
          }));
        } catch (e) {
          console.warn("Could not cache collection details", e);
        }
        
      } catch (error: any) {
        console.warn("Collection fallback", { handle });
        console.error("❌ Failed to fetch collection:", error);
        
        if (isMounted) {
          setCollection(null);
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          console.log("✅ Setting loading to false");
          setLoading(false);
        }
      }
    };

    fetchCollection();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      console.log("🧹 CollectionDetail cleanup");
    };
  }, [handle]);

  // Handle add to bag - use server-side Edge Function
  const handleAddToBag = async (productHandle: string, variantId: string) => {
    if (!variantId) {
      notify.error("Product variant unavailable. Please try again.");
      return;
    }

    setAddingToCart(productHandle);
    
    try {
      const existingCartId = localStorage.getItem('hp_cart_id');
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: [{ merchandiseId: variantId, quantity: 1 }],
          ...(existingCartId && { cartId: existingCartId }),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      const { cartId } = await response.json();
      if (cartId) {
        localStorage.setItem('hp_cart_id', cartId);
      }
      
      window.dispatchEvent(new CustomEvent("hp:openMiniCart"));
      notify.success("Added to bag!");
    } catch (error: any) {
      console.error("Add to bag failed:", error);
      notify.error("We couldn't add this to your bag. Please try again or contact us.");
      
      // Fallback: redirect to product page on hairpinns.com after 2s
      setTimeout(() => {
        window.location.href = getProductUrl(productHandle);
      }, 2000);
    } finally {
      setAddingToCart(null);
    }
  };

  // Filter and sort logic (exclude products with invalid handles to prevent broken links)
  const filteredProducts = products
    .filter((p) => p?.handle && typeof p.handle === "string" && p.handle.length > 0)
    .filter((p) => {
      if (priceRange === "all") return true;
      if (priceRange === "under-80") return p.price < 80;
      if (priceRange === "80-90") return p.price >= 80 && p.price <= 90;
      if (priceRange === "over-90") return p.price > 90;
      return true;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name-asc") return a.title.localeCompare(b.title);
    if (sortBy === "name-desc") return b.title.localeCompare(a.title);

    return 0;
  });

  useImagePreload(sortedProducts.slice(0, 2).map((p) => p.image).filter(Boolean));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Skeleton Loader */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-4 w-48 mb-8" />
          
          <div className="bg-accent py-12 rounded-card mb-8">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full max-w-3xl" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-card border border-border rounded-card overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Fallback if collection doesn't exist or has no products
  if (!collection || products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-lg">
            <h2 className="text-3xl font-bold text-heading mb-4">Collection Unavailable</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We couldn't load this collection right now. It may have been moved or temporarily unavailable.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="primary" size="lg">
                <Link to="/collections">Browse All Collections</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={`${storeUrl}/collections`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  View on Shopify
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "Collections", url: "https://hairpinns.com/collections" },
    { name: collectionTitle, url: `https://hairpinns.com/collections/${handle}` },
  ]);

  const collectionPageSchema = generateCollectionPageSchema({
    name: collectionTitle,
    description: collectionDescription,
    url: `https://hairpinns.com/collections/${handle}`,
    image: collection?.image?.url || getOGImage('collection'),
    numberOfItems: filteredProducts.length,
    items: filteredProducts.slice(0, 20).map((product) => ({
      name: product.title,
      description: product.description || `${product.title} - Salon-quality hair care product`,
      url: `https://hairpinns.com/products/${product.handle}`,
      image: product.image,
      price: product.price.toString(),
      currency: product.currency || "AUD",
    })),
  });

  const faqSchema = generateFAQPageSchema(getCollectionFAQs(handle));

  const webPageSchema = generateWebPageSchema({
    name: collectionTitle,
    description: collectionDescription,
    url: `https://hairpinns.com/collections/${handle}`,
    speakable: { cssSelector: [".speakable-collection-intro"] },
  });

  const schemas = [breadcrumbSchema, collectionPageSchema, faqSchema, webPageSchema];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${collectionTitle} | Hair Care Australia | Hair Pinns`}
        description={`${collectionDescription.substring(0, 130)} Shipped Australia-wide. Free shipping over $150.`}
        canonical={`https://hairpinns.com/collections/${handle}`}
        ogImage={collection?.image?.url || getOGImage('collection')}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />
      <Header />
      

      {/* Exit Intent Modal */}
      {/* ExitIntentModal removed */}
      
      <main id="main-content" tabIndex={-1}>
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: collectionTitle }
            ]}
          />
        </div>
        
        {/* Collection Header */}
        <section className="border-y border-[hsl(var(--after-hours-plum)/0.18)] bg-[hsl(var(--after-hours-cream))] py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_10rem] lg:items-end">
              <div className="flex-1">
                <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">Collection / Hair Pinns</p>
                <h1 className="font-heading text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.04em] text-[hsl(var(--after-hours-plum))] mb-4">
                  {collectionTitle}
                </h1>
                <p className="speakable-collection-intro max-w-3xl text-base leading-7 text-[hsl(var(--after-hours-plum)/0.72)] md:text-lg">
                  {collectionDescription}
                </p>
              </div>
              {sortedProducts.length > 0 && (
                <div className="border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-3 lg:text-right">
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[hsl(var(--after-hours-plum)/0.76)]">Products</p>
                  <p className="font-heading text-3xl text-[hsl(var(--after-hours-plum))]">{sortedProducts.length}</p>
                </div>
              )}
            </div>
            
          </div>
        </section>

        {/* Filters & Sort */}
        <section className="sticky top-16 z-30 border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-paper)/0.97)] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Price & Sort */}
              <div className="flex gap-3 flex-wrap">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger aria-label="Filter by price" className="h-11 w-[calc(50%-0.375rem)] min-w-0 rounded-none border-[hsl(var(--after-hours-plum)/0.25)] bg-transparent sm:w-[180px]">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-80">Under $80</SelectItem>
                    <SelectItem value="80-90">$80 - $90</SelectItem>
                    <SelectItem value="over-90">Over $90</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger aria-label="Sort products" className="h-11 w-[calc(50%-0.375rem)] min-w-0 rounded-none border-[hsl(var(--after-hours-plum)/0.25)] bg-transparent sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z-A</SelectItem>

                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="bg-[hsl(var(--after-hours-paper))] py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No products available in this collection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                  <article 
                    key={product.id} 
                    className="group flex min-w-0 flex-col border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-3"
                  >
                    {/* Image - clickable to product page */}
                    <Link
                      to={`/products/${product.handle}`}
                      className="relative block aspect-square overflow-hidden bg-[hsl(var(--after-hours-cream))] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain transition-opacity duration-slow group-hover:opacity-90"
                        loading="lazy"
                        width="600"
                        height="600"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {!product.availableForSale && (
                        <Badge
                          variant="destructive"
                          className="absolute top-3 left-3"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex flex-1 flex-col pt-4">
                      <h3 className="mb-2 line-clamp-3 font-heading text-base leading-tight text-[hsl(var(--after-hours-plum))] sm:text-lg">
                        <Link
                          to={`/products/${product.handle}`}
                          className="hover:text-brand-500 transition-colors"
                        >
                          {product.title}
                        </Link>
                      </h3>

                      <div className="flex items-baseline gap-2 mb-1">
                        {(() => {
                          const priceText = formatPrice(product.price, "AUD");
                          if (!priceText) return null;
                          const compareAt =
                            product.originalPrice && product.originalPrice > product.price
                              ? product.originalPrice
                              : undefined;
                          const compareText = compareAt
                            ? formatPrice(compareAt, "AUD")
                            : "";
                          return (
                            <>
                              <p className="text-lg font-semibold text-[hsl(var(--after-hours-plum))] sm:text-2xl">{priceText}</p>
                              {compareText && (
                                <p className="text-sm font-semibold text-muted-foreground line-through decoration-muted-foreground/30">
                                  {compareText}
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <p className="mb-3 text-[0.66rem] leading-4 text-[hsl(var(--after-hours-plum)/0.62)]">Afterpay &middot; Zip available</p>

                      {/* Actions */}
                      <div className="mt-auto flex flex-col gap-2 border-t border-[hsl(var(--after-hours-plum)/0.14)] pt-3 sm:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-11 flex-1 rounded-none border-[hsl(var(--after-hours-plum)/0.28)] px-2 text-xs sm:text-sm"
                          onClick={() => setQuickViewHandle(product.handle)}
                        >
                          Quick View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="min-h-11 flex-1 rounded-none bg-[hsl(var(--after-hours-plum))] px-2 text-xs text-[hsl(var(--after-hours-cream))] sm:text-sm"
                          onClick={() => handleAddToBag(product.handle, product.firstVariantId)}
                          disabled={!product.availableForSale || addingToCart === product.handle}
                        >
                          <ShoppingBag className="mr-1 hidden h-4 w-4 sm:block" />
                          {addingToCart === product.handle ? "Adding..." : "Add to Bag"}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>


        {/* Recently Viewed */}
        {(() => {
          try {
            const stored = JSON.parse(localStorage.getItem("hp_recent_products") || "[]");
            const recent = stored.filter((p: any) => p.slug && p.image).slice(0, 4);
            if (recent.length < 2) return null;
            return (
              <section className="py-12 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h3 className="text-lg font-heading font-semibold text-heading mb-6">Recently viewed</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {recent.map((p: any) => (
                      <Link key={p.slug} to={`/products/${p.slug}`} className="group">
                        <div className="aspect-square bg-muted rounded-card overflow-hidden mb-2">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
                        </div>
                        <p className="text-sm font-medium text-heading line-clamp-1 group-hover:text-brand-500 transition-colors">{p.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          } catch { return null; }
        })()}

        {handle && (
          <RelatedContent
            topics={topicsForCollection(handle).map((t) => t.slug)}
            show={["service", "blog"]}
            heading="Services & reading about this range"
          />
        )}
      </main>
      <Footer />

      {/* Quick View Modal */}
      {quickViewHandle && (
        <QuickViewModal
          productHandle={quickViewHandle}
          open={!!quickViewHandle}
          onClose={() => setQuickViewHandle(null)}
        />
      )}
    </div>
  );
};

export default CollectionDetail;
