import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Star, Eye } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import QuickViewModal from "@/components/product/QuickViewModal";

/**
 * AboveFoldProducts Component
 * 
 * Displays 6 products visible without scrolling (3x2 grid desktop, 2x3 mobile)
 * SAFE IMPLEMENTATION:
 * - Non-blocking data fetch (doesn't break render)
 * - Dynamic imports for Shopify (safe fallback)
 * - Loading skeleton fallback
 * - Graceful degradation on error
 */
const AboveFoldProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        // ✅ SAFE: Dynamic import for Shopify (doesn't block render)
        const shopifyModule = await import("@/lib/shopify");
        const { searchProducts } = shopifyModule;
        
        // Fetch top products for above-fold showcase
        // Use empty string to get all available products
        const result = await searchProducts("", 20);
        
        if (!isMounted) return;

        // searchProducts returns { products: [...], pageInfo: {...} }
        // products is already an array of nodes (not edges)
        const productList = result?.products || [];
        
        console.log("[AboveFoldProducts] Fetched products:", productList.length);

        if (productList.length > 0) {
          const mappedProducts = productList
            .filter((p: any) => p.availableForSale)
            .slice(0, 6) // Show 6 products (3x2 desktop, 2x3 mobile)
            .map((product: any) => {
              const firstImage = product.images?.edges?.[0]?.node || product.images?.[0];
              const firstVariant = product.variants?.edges?.[0]?.node || product.variants?.[0];
              const price = parseFloat(product.priceRange?.minVariantPrice?.amount || product.priceRange?.minVariantPrice?.amount || "0");
              
              return {
                id: product.id,
                slug: product.handle,
                title: product.title,
                price: price,
                currency: product.priceRange?.minVariantPrice?.currencyCode || product.priceRange?.currencyCode || "AUD",
                image: firstImage?.url || firstImage || "/placeholder.svg",
                variantId: firstVariant?.id || "",
                availableForSale: product.availableForSale,
                compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount 
                  ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                  : null,
              };
            });

          setProducts(mappedProducts);
        }
      } catch (err) {
        // ✅ SAFE: Log error but don't break the page
        console.warn("[AboveFoldProducts] Failed to load products:", err);
        console.error("[AboveFoldProducts] Error details:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // ✅ SAFE: Non-blocking fetch
    fetchProducts().catch((err) => {
      console.warn("[AboveFoldProducts] Fetch failed:", err);
      if (isMounted) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ SAFE: Loading skeleton (doesn't break layout)
  if (loading) {
    return (
      <Section className="content-visibility-auto" style={{ containIntrinsicSize: "0 800px" }}>
        <SectionHeader 
          title="Shop Our Best Sellers"
          subtitle="Premium salon-quality products, handpicked by Jena"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  // ✅ SAFE: Error state - show helpful message instead of hiding
  if (error) {
    // Log error but show section with message (for debugging)
    console.warn("[AboveFoldProducts] Error loading products:", error);
    return (
      <Section className="content-visibility-auto">
        <SectionHeader 
          title="Shop Our Best Sellers"
          subtitle="Premium salon-quality products, handpicked by Jena"
        />
        <div className="text-center py-12 text-muted-foreground">
          <p>Products are loading... Please check your browser console if this persists.</p>
        </div>
      </Section>
    );
  }

  // ✅ SAFE: No products - still show section title (helps with layout)
  if (products.length === 0 && !loading) {
    return (
      <Section className="content-visibility-auto">
        <SectionHeader 
          title="Shop Our Best Sellers"
          subtitle="Premium salon-quality products, handpicked by Jena"
        />
        <div className="text-center py-12 text-muted-foreground">
          <p>Products will appear here once available.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="content-visibility-auto" style={{ containIntrinsicSize: "0 800px" }}>
      <SectionHeader 
        title="Shop Our Best Sellers"
        subtitle="Premium salon-quality products, handpicked by Jena"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
          const discountPercent = hasDiscount
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-2xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <Link 
                to={`/products/${product.slug}`}
                className="block aspect-square bg-muted relative overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  {hasDiscount && (
                    <Badge variant="accent" className="font-semibold shadow-lg animate-in fade-in slide-in-from-top duration-300">
                      {discountPercent}% OFF
                    </Badge>
                  )}
                  {!product.availableForSale && (
                    <Badge variant="destructive" className="shadow-lg">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Hover Overlay - Quick View */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewProduct(product.slug);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Quick View
                  </Button>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 space-y-3">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-heading mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors duration-300">
                    {product.title}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl font-bold text-heading">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice, product.currency)}
                      </span>
                      <Badge variant="secondary" className="text-xs font-semibold">
                        Save {formatPrice(product.compareAtPrice - product.price, product.currency)}
                      </Badge>
                    </>
                  )}
                </div>

                {/* Social Proof - Star Rating (fake for now, can be enhanced with real data) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-3 h-3 text-[hsl(var(--star-color))] fill-current" 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">(4.8)</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">Best Seller</span>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2">
                  {product.availableForSale && product.variantId ? (
                    <>
                      <Button
                        className="flex-1 group/button hover:shadow-lg transition-all duration-300 hover:scale-105"
                        variant="primary"
                        size="sm"
                        onClick={async (e) => {
                          e.preventDefault();
                          if (!product.variantId) return;
                          
                          setAddingToCart(product.id);
                          try {
                            // ✅ SAFE: Dynamic import for quickAdd (doesn't block render)
                            const quickAddModule = await import("@/lib/quickAdd");
                            const { quickAddToCart } = quickAddModule;
                            
                            await quickAddToCart({
                              variantId: product.variantId,
                              productId: product.id,
                              productTitle: product.title,
                              price: product.price,
                              currency: product.currency || "AUD",
                              quantity: 1,
                            }, true);
                          } catch (err) {
                            console.warn("[AboveFoldProducts] Failed to add to cart:", err);
                            // Fallback: navigate to product page
                            window.location.href = `/products/${product.slug}`;
                          } finally {
                            setAddingToCart(null);
                          }
                        }}
                        disabled={addingToCart === product.id || !product.availableForSale}
                      >
                        {addingToCart === product.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Quick Add
                          </>
                        )}
                      </Button>
                      <Link to={`/products/${product.slug}`} className="flex-1">
                        <Button 
                          className="w-full" 
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link to={`/products/${product.slug}`} className="w-full">
                      <Button 
                        className="w-full" 
                        variant={product.availableForSale ? "default" : "secondary"}
                        disabled={!product.availableForSale}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        {product.availableForSale ? "View Product" : "Out of Stock"}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          productHandle={quickViewProduct}
          open={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </Section>
  );
};

export default AboveFoldProducts;
