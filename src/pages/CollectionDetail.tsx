import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Check, ShoppingBag } from "lucide-react";
import { getCollectionByHandle, getProductUrl } from "@/lib/shopify";
import { addToBag, getCartId } from "@/lib/cartManagement";
import MiniCartDrawer from "@/components/MiniCartDrawer";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExitIntentModal from "@/components/conversion/ExitIntentModal";
import TrustStrip from "@/components/conversion/TrustStrip";
import ProductBadges from "@/components/conversion/ProductBadges";
import { getOGImage } from "@/lib/sitemap";

const CollectionDetail = () => {
  const { handle } = useParams();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("best-sellers");
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Fetch collection from Shopify
  useEffect(() => {
    let isMounted = true;
    
    const fetchCollection = async () => {
      if (!handle) return;
      
      setLoading(true);
      try {
        console.log("🔍 Fetching collection:", handle);
        const collectionData = await getCollectionByHandle(handle);
        console.log("✅ Collection data fetched:", collectionData);
        
        if (!isMounted) {
          console.log("⚠️ Component unmounted, skipping state update");
          return;
        }
        
        if (collectionData) {
          setCollection(collectionData);
          
          // Map Shopify products to our format
          if (collectionData.products?.edges && Array.isArray(collectionData.products.edges)) {
            const mappedProducts = collectionData.products.edges.map((edge: any) => {
              const product = edge.node;
              const firstImage = product.images.edges[0]?.node;
              const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
              
              // Get first available variant ID (Shopify uses base64 encoded IDs)
              const variants = product.variants?.edges || [];
              const firstVariant = variants.find((v: any) => v.node.availableForSale)?.node || variants[0]?.node;
              const variantId = firstVariant?.id || null;
              
              return {
                id: product.id,
                handle: product.handle,
                title: product.title,
                price: minPrice,
                image: firstImage?.url || "/placeholder.svg",
                availableForSale: product.availableForSale,
                firstVariantId: variantId,
              };
            });
            
            console.log("✅ Mapped products:", mappedProducts.length);
            setProducts(mappedProducts);
          } else {
            console.warn("⚠️ No products found in collection");
          }
        }
      } catch (error) {
        console.error("❌ Failed to fetch collection:", error);
        if (isMounted) {
          toast.error("Failed to load collection");
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
      console.log("🧹 CollectionDetail cleanup");
    };
  }, [handle]);

  // Handle add to bag
  const handleAddToBag = async (productHandle: string, variantId: string) => {
    setAddingToCart(productHandle);
    
    try {
      await addToBag(variantId, 1);
      setMiniCartOpen(true);
      toast.success("Added to bag!");
    } catch (error) {
      console.error("Add to bag failed:", error);
      toast.error("Failed to add to bag. Redirecting to product page...");
      
      // Fallback: redirect to product page on hairpinns.com
      setTimeout(() => {
        window.location.href = getProductUrl(productHandle);
      }, 1500);
    } finally {
      setAddingToCart(null);
    }
  };

  // Filter and sort logic
  const filteredProducts = products.filter((p) => {
    if (priceRange === "all") return true;
    if (priceRange === "under-80") return p.price < 80;
    if (priceRange === "80-90") return p.price >= 80 && p.price <= 90;
    if (priceRange === "over-90") return p.price > 90;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const collectionTitle = collection?.title || "Collection";
  const collectionDescription = collection?.description || "Shop our curated hair care collection";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading collection...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-heading mb-2">Collection not found</h2>
            <p className="text-muted-foreground mb-6">This collection doesn't exist or has been removed.</p>
            <Button asChild variant="primary">
              <Link to="/collections">Browse Collections</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{collectionTitle} | Hair Care Products | Hair Pinns</title>
        <meta 
          name="description" 
          content={collectionDescription.substring(0, 155)}
        />
        <link rel="canonical" href={`https://hairpinns.com/collections/${handle}`} />
        <meta property="og:title" content={`${collectionTitle} | Hair Pinns`} />
        <meta property="og:description" content={collectionDescription.substring(0, 155)} />
        <meta property="og:url" content={`https://hairpinns.com/collections/${handle}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('collection')} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="en-AU" href={`https://hairpinns.com/collections/${handle}`} />
      </Helmet>
      <Header />
      
      {/* Mini Cart Drawer */}
      <MiniCartDrawer
        open={miniCartOpen}
        onClose={() => setMiniCartOpen(false)}
        cartId={getCartId() || ""}
      />
      
      {/* Trust Strip */}
      <TrustStrip />
      
      {/* Exit Intent Modal */}
      <ExitIntentModal enabled={true} />
      
      <main>
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
        <section className="bg-accent py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
              {collectionTitle}
            </h1>
            <p className="text-lg text-foreground max-w-3xl leading-relaxed">
              {collectionDescription}
            </p>
          </div>
        </section>

        {/* Filters & Sort */}
        <section className="border-b border-border bg-card sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Price & Sort */}
              <div className="flex gap-3 flex-wrap">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[160px] h-9">
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
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best-sellers">Best Sellers</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No products available in this collection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <article 
                    key={product.id} 
                    className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-all duration-base group"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
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
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-heading font-semibold text-heading mb-2 line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-2xl font-bold text-brand-500 mb-4">
                        ${product.price.toFixed(2)}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/products/${product.handle}`}>
                            View Product
                          </Link>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToBag(product.handle, product.firstVariantId)}
                          disabled={!product.availableForSale || addingToCart === product.handle}
                        >
                          <ShoppingBag className="w-4 h-4 mr-1" />
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

        {/* How to Choose FAQ */}
        <section className="bg-muted py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              How to Choose
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card border border-border rounded-card px-6">
                <AccordionTrigger className="text-left font-semibold text-heading hover:text-brand-500">
                  Which pack is best for damaged or color-treated hair?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  The <strong>Hydrate & Restore Pack</strong> and <strong>Color Protect Bundle</strong> are specifically formulated for compromised hair. Both include bond-building treatments that repair damage from heat styling, chemical processing, and environmental stress. If you have blonde hair, choose the <strong>Blonde Brilliance Set</strong> for purple-toning benefits plus deep hydration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border border-border rounded-card px-6">
                <AccordionTrigger className="text-left font-semibold text-heading hover:text-brand-500">
                  How do I know if I need volume or smoothing products?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  If your hair is fine, flat, or lacks body, choose the <strong>Volume Boost Pack</strong> with lightweight formulas that lift at the roots. For thick, frizzy, or coarse hair that needs control, the <strong>Smooth & Sleek Set</strong> uses smoothing serums and anti-humidity technology. Need help choosing? <a href="/contact" className="text-brand-500 font-semibold hover:text-brand-600 underline">Message us on the contact page.</a>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card border border-border rounded-card px-6">
                <AccordionTrigger className="text-left font-semibold text-heading hover:text-brand-500">
                  Can I use these products if I don't have color-treated hair?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  Absolutely! All our packs work beautifully on natural, virgin hair. Color-safe formulas are sulfate-free and gentle, making them ideal for anyone seeking healthier hair. The <strong>Scalp Wellness Set</strong> is particularly great for all hair types as it focuses on scalp health, which is the foundation of strong, beautiful hair.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center mt-8">
              <p className="text-foreground mb-6">
                Need help choosing? <Link to="/contact" className="text-brand-500 font-semibold hover:text-brand-600 underline">Message us on the contact page.</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionDetail;
