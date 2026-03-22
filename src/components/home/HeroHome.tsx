import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Award, Truck, Shield, TrendingUp, Users, MapPin, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-home-new.webp";
import { FRESHA_REVIEWS_URL } from "@/config/bookingConfig";
import { searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import AnimatedCounter from "@/components/conversion/AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { quickAddToCart, QuickAddProduct } from "@/lib/quickAdd";
import { getCartId } from "@/lib/cartManagement";
import { getUserLocation, getShippingMessage, isInSutherlandShire } from "@/lib/locationDetection";
import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";
import { hpCapture } from "@/lib/hpCapture";

const HeroHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [currentValueProp, setCurrentValueProp] = useState(0);
  const [shippingMessage, setShippingMessage] = useState("Fast shipping Australia-wide");
  const [isLocal, setIsLocal] = useState(false);
  const valuePropsRef = useRef<NodeJS.Timeout | null>(null);

  const valueProps = [
    { icon: Award, text: "15+ Years of Knowing What Works", color: "text-brand-300" },
    { icon: Star, text: "762+ Five-Star Reviews", color: "text-[hsl(var(--star-color))]" },
    { icon: Truck, text: `Free Shipping Over ${FREE_SHIPPING_THRESHOLD_DISPLAY}`, color: "text-brand-300" },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        const { getProductByHandle, getCollectionByHandle } = await import("@/lib/shopify");
        const { ABOVE_FOLD_HERO_PRODUCT_HANDLES, FRIZZ_FREE_COLLECTION_HANDLE } = await import("@/config/featuredProducts");

        let frizzFreeProducts: any[] = [];
        let handleProducts: any[] = [];

        // 1. Fetch 1–2 products from Frizz-Free Must-Haves collection
        if (FRIZZ_FREE_COLLECTION_HANDLE) {
          try {
            const collection = await getCollectionByHandle(FRIZZ_FREE_COLLECTION_HANDLE);
            const edges = collection?.products?.edges || [];
            frizzFreeProducts = edges
              .slice(0, 2)
              .map((e: any) => e.node)
              .filter((p: any) => p?.handle && p?.availableForSale);
          } catch {
            // Collection may not exist, fall through
          }
        }

        // 2. Fetch products from ABOVE_FOLD_HERO_PRODUCT_HANDLES (best seller = first)
        if (ABOVE_FOLD_HERO_PRODUCT_HANDLES?.length > 0) {
          const results = await Promise.all(
            ABOVE_FOLD_HERO_PRODUCT_HANDLES.map((handle) => getProductByHandle(handle))
          );
          handleProducts = results.filter((p) => p?.handle && p?.availableForSale);
        }

        // 3. Merge: best seller first, then Frizz-Free (1–2), then rest from handles
        const seen = new Set<string>();
        let products: any[] = [];
        const bestSeller = handleProducts[0];
        if (bestSeller) {
          seen.add(bestSeller.handle);
          products.push(bestSeller);
        }
        for (const p of frizzFreeProducts) {
          if (products.length >= 4) break;
          if (!seen.has(p.handle)) {
            seen.add(p.handle);
            products.push(p);
          }
        }
        for (const p of handleProducts.slice(1)) {
          if (products.length >= 4) break;
          if (!seen.has(p.handle)) {
            seen.add(p.handle);
            products.push(p);
          }
        }

        // 4. Fill to 4 with search results (deduped)
        if (products.length < 4) {
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

        if (products.length > 0) {
          const mappedProducts = products.map((product: any) => {
            const firstImage = product.images?.edges?.[0]?.node;
            const firstVariant = product.variants?.edges?.[0]?.node;
            const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
            return {
              id: product.id,
              slug: product.handle,
              title: product.title,
              price: price,
              currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
              image: firstImage?.url || "/placeholder.svg",
              variantId: firstVariant?.id || "",
              availableForSale: product.availableForSale,
            };
          });

          if (isMounted) {
            setFeaturedProducts(mappedProducts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedProducts();

    // Detect location for personalized messaging
    const detectLocation = async () => {
      try {
        const location = await getUserLocation();
        if (location) {
          await hpCapture.trackLocationDetected(location.city, location.region, location.country).catch(() => {});
          
          const message = await getShippingMessage();
          setShippingMessage(message);
          
          const local = await isInSutherlandShire();
          setIsLocal(local);
        }
      } catch (error) {
        console.warn('Location detection failed:', error);
      }
    };

    detectLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Cycle through value props
  useEffect(() => {
    valuePropsRef.current = setInterval(() => {
      setCurrentValueProp((prev) => (prev + 1) % valueProps.length);
    }, 4000); // Change every 4 seconds

    return () => {
      if (valuePropsRef.current) {
        clearInterval(valuePropsRef.current);
      }
    };
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

  const currentProp = valueProps[currentValueProp];
  const IconComponent = currentProp.icon;

  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hair Pinns - Premium hair care products from Jena's boutique salon in Bangor, shipped Australia-wide"
          className="w-full h-full object-cover object-[65%_center] brightness-[0.92]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
          sizes="100vw"
          style={{ filter: 'brightness(0.92)' }}
        />
        {/* Desktop/Tablet: Left to Right Gradient */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[rgba(24,0,30,0.85)] via-[rgba(24,0,30,0.4)] to-transparent"></div>
        {/* Mobile: Top to Bottom Gradient */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[rgba(24,0,30,0.88)] via-[rgba(24,0,30,0.3)] to-transparent"></div>
      </div>

      {/* Content - Split Screen Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
        {/* Mobile: Stacked Layout - Products First */}
        <div className="md:hidden space-y-6">
          {/* Product Showcase First (Above Fold) */}
          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="group relative bg-card/90 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Link to={`/products/${product.slug}`} className="block">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading={index < 2 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : undefined}
                        width="300"
                        height="300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      {index === 0 && (
                        <Badge variant="secondary" className="absolute top-2 left-2 gap-1 text-xs">
                          <Sparkles className="w-3 h-3" />
                          Best Seller
                        </Badge>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                        <h3 className="font-semibold text-xs mb-0.5 line-clamp-1">{product.title}</h3>
                        <p className="text-base font-bold text-brand-300">
                          {formatPrice(product.price, product.currency)}
                        </p>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Quick Add Button on Hover */}
                  {hoveredProduct === product.id && product.availableForSale && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in duration-200">
                      <Button
                        size="sm"
                        variant="primary"
                        className="gap-2 shadow-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuickAdd(product);
                        }}
                        disabled={addingToCart === product.id}
                      >
                        {addingToCart === product.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Quick Add
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Text Content Below */}
          <div className="rounded-[14px] p-5" style={{
            background: 'rgba(24, 0, 30, 0.5)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4)'
          }}>
            <Badge variant="secondary" className="mb-3 gap-2 text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              Popular This Week
            </Badge>

            <h1 className="speakable-hero-intro font-heading font-bold text-white mb-3 leading-[1.05]" style={{
              fontSize: 'clamp(28px, 6vw, 36px)',
              textShadow: '0 2px 24px rgba(0, 0, 0, 0.6)'
            }}>
              Salon Hair Care. Delivered to Your Door.
            </h1>

            {/* Animated Value Prop */}
            <div className="mb-4 flex items-center gap-2 text-white" style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
              <IconComponent className={`w-4 h-4 ${currentProp.color} transition-all duration-500`} />
              <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{currentProp.text}</span>
            </div>

            <p className="mb-4 max-w-lg leading-relaxed" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 'clamp(15px, 3.5vw, 18px)',
            }}>
              Picked by Jena. 15 years behind the chair.
            </p>

            {/* Trust Metrics - Compact */}
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Star className="w-3 h-3 text-[hsl(var(--star-color))] fill-current" />
                <span>762+ Reviews</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Truck className="w-3 h-3 text-brand-300" />
                <span>Free Ship $100+</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Shield className="w-3 h-3 text-brand-300" />
                <span>14-Day Returns</span>
              </div>
            </div>

            {/* Local SEO Badge - Dynamic based on location */}
            <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              <MapPin className="w-3 h-3 text-brand-300" />
              <span>
                {isLocal 
                  ? "Trusted by Bangor Locals | Same-Day Pickup Available" 
                  : "Based in Bangor, NSW | Serving All Sutherland Shire"}
              </span>
            </div>
            {/* Dynamic Shipping Message */}
            <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              <Truck className="w-3 h-3 text-brand-300" />
              <span>{shippingMessage}</span>
            </div>

            {/* Price Anchor */}
            {featuredProducts.length > 0 && (
              <p className="mb-4 text-sm font-semibold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                Starting at {formatPrice(featuredProducts[0]?.price || 0, "AUD")}
              </p>
            )}

            {/* CTA */}
            <Button
              asChild
              size="lg"
              variant="primary"
              className="w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
              style={{
                borderRadius: '999px',
                padding: '0.875rem 2rem',
              }}
            >
              <Link
                to="/collections"
                className="flex items-center justify-center gap-2"
                onClick={async () => {
                  if (typeof window !== 'undefined') {
                    const hpCaptureModule = await import("@/lib/hpCapture");
                    const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
                    await hpCapture.trackHeroCTA("shop_best_sellers", "hero_home").catch(() => {});
                  }
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Best Sellers Now
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop: Split Screen (40% Left, 60% Right) */}
        <div className="hidden md:grid md:grid-cols-[40%_60%] gap-8 lg:gap-12 items-center">
          {/* Left Panel (40%) - Text Content */}
          <div className="max-w-[32rem]">
            <div className="rounded-[14px] p-6 lg:p-8" style={{
              background: 'rgba(24, 0, 30, 0.5)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}>
              {/* Urgency Badge */}
              <Badge variant="secondary" className="mb-4 gap-2 text-sm font-semibold animate-fade-in">
                <TrendingUp className="w-4 h-4" />
                Popular This Week
              </Badge>

              {/* Ultra-Bold Headline with Gradient Text */}
              <h1
                className="speakable-hero-intro font-heading font-bold text-white mb-5 leading-[1.05]"
                style={{
                  fontSize: 'clamp(40px, 4.5vw, 64px)',
                  textShadow: '0 2px 32px rgba(0, 0, 0, 0.6)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 50%, rgba(220,180,255,0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Salon Hair Care. Delivered to Your Door.
              </h1>

              {/* Animated Value Props */}
              <div className="mb-6 h-8 flex items-center">
                <div className="flex items-center gap-2 text-white transition-all duration-500" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
                  <IconComponent className={`w-5 h-5 ${currentProp.color} transition-all duration-500`} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{currentProp.text}</span>
                </div>
              </div>

              <p className="mb-6 max-w-lg leading-relaxed" style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: 'clamp(18px, 2vw, 22px)',
                fontWeight: 500
              }}>
                Picked by Jena. 15 years behind the chair.
              </p>

              {/* Animated Customer Count */}
              <div className="mb-6 flex items-center gap-2 text-white" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
                <Users className="w-5 h-5 text-brand-300" />
                <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  Join <AnimatedCounter end={2500} prefix="" suffix="+" className="font-bold text-brand-300" /> customers who trust Hair Pinns
                </span>
              </div>

              {/* Trust Metrics - Compact */}
              <div className="mb-6 flex flex-wrap gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-1.5" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
                  <Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
                  <span className="font-semibold">762+ Five-Star Reviews</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
                  <Truck className="w-4 h-4 text-brand-300" />
                  <span>Free Shipping Over $100</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
                  <Shield className="w-4 h-4 text-brand-300" />
                  <span>14-Day Returns</span>
                </div>
              </div>

              {/* Local SEO Badge - Dynamic based on location */}
              <div className="mb-6 flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <MapPin className="w-4 h-4 text-brand-300" />
                <span>
                  {isLocal 
                    ? "Trusted by Bangor Locals | Same-Day Pickup Available" 
                    : "Based in Bangor, NSW | Serving All Sutherland Shire Suburbs"}
                </span>
              </div>
              {/* Dynamic Shipping Message */}
              <div className="mb-6 flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Truck className="w-4 h-4 text-brand-300" />
                <span>{shippingMessage}</span>
              </div>

              {/* Price Anchor */}
              {featuredProducts.length > 0 && (
                <p className="mb-6 text-base font-semibold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  Starting at {formatPrice(featuredProducts[0]?.price || 0, "AUD")}
                </p>
              )}

              {/* Single Dominant CTA with Glow Effect */}
              <div className="mb-4">
                <Button
                  asChild
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative group"
                  style={{
                    borderRadius: '999px',
                    padding: '1rem 2.5rem',
                    fontSize: 'clamp(16px, 1.8vw, 18px)',
                  }}
                >
                  <Link
                    to="/collections"
                    className="flex items-center gap-3 relative z-10"
                    onClick={async () => {
                      if (typeof window !== 'undefined') {
                        const hpCaptureModule = await import("@/lib/hpCapture");
                        const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
                        await hpCapture.trackHeroCTA("shop_best_sellers", "hero_home").catch(() => {});
                      }
                    }}
                  >
                    <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    Shop Best Sellers Now
                    <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </Button>
                {/* Glow effect on hover */}
                <div className="absolute blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 bg-brand-500 w-full h-full -z-10 rounded-full"></div>
              </div>

              {/* Value Props */}
              <p className="text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                <Award className="w-3 h-3 inline mr-1.5 text-brand-300" />
                <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>15+ Years of Knowing What Works Since 2009</strong> • Trusted by thousands Australia-wide
              </p>
            </div>
          </div>

          {/* Right Panel (60%) - Interactive Product Showcase */}
          {!loading && featuredProducts.length > 0 && (
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-card/90 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-105 hover:-translate-y-1"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      animationDelay: `${index * 0.1}s`
                    }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading={index < 2 ? "eager" : "lazy"}
                          width="400"
                          height="400"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Product Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                          {index === 0 && (
                            <Badge variant="secondary" className="gap-1.5 text-xs font-semibold">
                              <Sparkles className="w-3 h-3" />
                              Best Seller
                            </Badge>
                          )}
                          {index === 1 && (
                            <Badge variant="accent" className="gap-1.5 text-xs font-semibold">
                              New Arrival
                            </Badge>
                          )}
                          {index === 2 && (
                            <Badge variant="warning" className="gap-1.5 text-xs font-semibold">
                              Limited Stock
                            </Badge>
                          )}
                        </div>

                        {/* Customer Testimonial Overlay (on hover) */}
                        {hoveredProduct === product.id && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs font-medium text-heading animate-in fade-in slide-in-from-top duration-300 z-10">
                            "Just bought this - amazing!"
                          </div>
                        )}

                        {/* Product Info at Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-brand-300 transition-colors duration-300">
                            {product.title}
                          </h3>
                          <p className="text-xl font-bold text-brand-300">
                            {formatPrice(product.price, product.currency)}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Quick Add Button on Hover */}
                    {hoveredProduct === product.id && product.availableForSale && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 animate-in fade-in duration-300">
                        <Button
                          size="lg"
                          variant="primary"
                          className="gap-2 shadow-xl transform hover:scale-110 transition-transform duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuickAdd(product);
                          }}
                          disabled={addingToCart === product.id}
                        >
                          {addingToCart === product.id ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5" />
                              Quick Add
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bottom Label */}
              <p className="text-center mt-6 text-sm text-white/90 font-medium">
                Best Sellers • Starting at {formatPrice(featuredProducts[0]?.price || 0, "AUD")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroHome;