import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Truck, Shield, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-home-new.webp";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { quickAddToCart, QuickAddProduct } from "@/lib/quickAdd";

const HeroHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        const { getProductByHandle, getCollectionByHandle } = await import("@/lib/shopify");
        const { ABOVE_FOLD_HERO_PRODUCT_HANDLES, FRIZZ_FREE_COLLECTION_HANDLE } = await import("@/config/featuredProducts");

        let frizzFreeProducts: any[] = [];
        let handleProducts: any[] = [];

        if (FRIZZ_FREE_COLLECTION_HANDLE) {
          try {
            const collection = await getCollectionByHandle(FRIZZ_FREE_COLLECTION_HANDLE);
            const edges = collection?.products?.edges || [];
            frizzFreeProducts = edges
              .slice(0, 2)
              .map((e: any) => e.node)
              .filter((p: any) => p?.handle && p?.availableForSale);
          } catch {
            // Collection may not exist
          }
        }

        if (ABOVE_FOLD_HERO_PRODUCT_HANDLES?.length > 0) {
          const results = await Promise.all(
            ABOVE_FOLD_HERO_PRODUCT_HANDLES.map((handle) => getProductByHandle(handle))
          );
          handleProducts = results.filter((p) => p?.handle && p?.availableForSale);
        }

        // Merge: best seller first, then frizz-free, then rest
        const seen = new Set<string>();
        const products: any[] = [];
        const bestSeller = handleProducts[0];
        if (bestSeller) {
          seen.add(bestSeller.handle);
          products.push(bestSeller);
        }
        for (const p of frizzFreeProducts) {
          if (products.length >= 4) break;
          if (!seen.has(p.handle)) { seen.add(p.handle); products.push(p); }
        }
        for (const p of handleProducts.slice(1)) {
          if (products.length >= 4) break;
          if (!seen.has(p.handle)) { seen.add(p.handle); products.push(p); }
        }

        // Fill to 4 with search results if needed
        if (products.length < 4) {
          const { searchProducts } = await import("@/lib/shopify");
          const result = await searchProducts("", 25);
          if (result?.products) {
            for (const p of result.products) {
              if (products.length >= 4) break;
              if (!p?.availableForSale || !p?.handle || seen.has(p.handle)) continue;
              seen.add(p.handle);
              products.push(p);
            }
          }
        }

        if (products.length > 0 && isMounted) {
          setFeaturedProducts(products.map((product: any) => {
            const firstImage = product.images?.edges?.[0]?.node;
            const firstVariant = product.variants?.edges?.[0]?.node;
            return {
              id: product.id,
              slug: product.handle,
              title: product.title,
              price: parseFloat(product.priceRange?.minVariantPrice?.amount || "0"),
              currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
              image: firstImage?.url || "/placeholder.svg",
              variantId: firstVariant?.id || "",
              availableForSale: product.availableForSale,
            };
          }));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedProducts();
    return () => { isMounted = false; };
  }, []);

  const handleQuickAdd = async (product: any) => {
    if (!product.variantId || !product.availableForSale) return;
    setAddingToCart(product.id);
    const quickAddProduct: QuickAddProduct = {
      variantId: product.variantId,
      productId: product.id,
      productTitle: product.title,
      price: product.price,
      currency: product.currency,
      quantity: 1,
    };
    await quickAddToCart(quickAddProduct, true);
    setAddingToCart(null);
  };

  const ProductCard = ({ product, index }: { product: any; index: number }) => (
    <div
      className="group relative bg-card/90 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading={index < 2 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            width="400"
            height="400"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {index === 0 && (
            <Badge variant="secondary" className="absolute top-2 left-2 text-xs">Best Seller</Badge>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{product.title}</h3>
            <p className="text-lg font-bold text-brand-300">{formatPrice(product.price, product.currency)}</p>
          </div>
        </div>
      </Link>
      {hoveredProduct === product.id && product.availableForSale && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in duration-200">
          <Button
            size="sm"
            variant="primary"
            className="gap-2 shadow-lg"
            onClick={(e) => { e.preventDefault(); handleQuickAdd(product); }}
            disabled={addingToCart === product.id}
          >
            {addingToCart === product.id ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</>
            ) : (
              <><Plus className="w-4 h-4" /> Quick Add</>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hair Pinns salon products"
          className="w-full h-full object-cover object-[65%_center]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
          sizes="100vw"
          style={{ filter: 'brightness(0.9)' }}
        />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[rgba(24,0,30,0.85)] via-[rgba(24,0,30,0.4)] to-transparent" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[rgba(24,0,30,0.88)] via-[rgba(24,0,30,0.3)] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
        {/* Mobile: Products first, then text */}
        <div className="md:hidden space-y-6">
          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="hero-stagger rounded-xl p-5" style={{ background: 'rgba(24, 0, 30, 0.5)', backdropFilter: 'blur(8px)' }}>
            <h1 className="speakable-hero-intro font-heading font-bold text-white mb-3 leading-tight" style={{ fontSize: 'clamp(26px, 6vw, 34px)' }}>
              Hey, I'm Jena. These are the products I use on my clients.
            </h1>
            <p className="mb-4 text-white/90" style={{ fontSize: 'clamp(14px, 3.5vw, 17px)' }}>
              15 years behind the chair. If it doesn't work, I don't stock it.
            </p>

            <div className="mb-4 flex flex-wrap gap-3 text-xs text-white/90">
              <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-brand-300" /> Free shipping $150+</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-brand-300" /> 14-day returns</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[hsl(var(--star-color))] fill-current" /> 762+ reviews</span>
            </div>

            <Button asChild size="lg" variant="primary" className="w-full text-white font-semibold" style={{ borderRadius: '999px' }}>
              <Link to="/collections" className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Shop Now
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop: Split layout */}
        <div className="hidden md:grid md:grid-cols-[40%_60%] gap-8 lg:gap-12 items-center">
          <div className="max-w-[32rem]">
            <div className="hero-stagger rounded-xl p-6 lg:p-8" style={{ background: 'rgba(24, 0, 30, 0.5)', backdropFilter: 'blur(10px)' }}>
              <h1 className="speakable-hero-intro font-heading font-bold text-white mb-5 leading-tight" style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>
                Hey, I'm Jena. These are the products I use on my clients.
              </h1>

              <p className="mb-6 text-white/95 leading-relaxed" style={{ fontSize: 'clamp(17px, 1.8vw, 20px)' }}>
                15 years behind the chair. If it doesn't work, I don't stock it.
              </p>

              <div className="mb-6 flex flex-wrap gap-4 text-sm text-white/90">
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" /> 762+ reviews</span>
                <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-brand-300" /> Free shipping $150+</span>
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand-300" /> 14-day returns</span>
              </div>

              <Button asChild size="lg" variant="primary" className="text-white font-semibold" style={{ borderRadius: '999px', padding: '1rem 2.5rem' }}>
                <Link to="/collections" className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Shop Now
                </Link>
              </Button>
            </div>
          </div>

          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-white/60 scroll-indicator">
        <span className="text-xs">Scroll to shop</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  );
};

export default HeroHome;
