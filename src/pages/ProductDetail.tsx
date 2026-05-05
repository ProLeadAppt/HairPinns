import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ChevronLeft, ChevronRight, ShoppingBag, Zap } from "lucide-react";
import { getProductByHandle, getProductUrl } from "@/lib/shopify";
import RelatedContent from "@/components/RelatedContent";
import { topicsForCollection } from "@/data/topicMap";
import { getCartId } from "@/lib/cartManagement";
import { trackAddToCart, trackBeginCheckout, trackProductView, trackFunnelStep } from "@/lib/ecommerceTracking";
import { toast } from "sonner";
import TrustStrip from "@/components/conversion/TrustStrip";
import SocialShareBar from "@/components/blog/SocialShareBar";
import PaymentBadges from "@/components/product/PaymentBadges";
import ShippingCalculator from "@/components/product/ShippingCalculator";
import EstimatedDelivery from "@/components/product/EstimatedDelivery";
import UrgencyIndicator from "@/components/conversion/UrgencyIndicator";
import StickyAddToCart from "@/components/conversion/StickyAddToCart";
import FrequentlyBoughtTogether from "@/components/product/FrequentlyBoughtTogether";
import ProductRecommendations from "@/components/product/ProductRecommendations";
import { SilentErrorBoundary } from "@/components/ErrorBoundary";
import { trackCartCreated } from "@/lib/cartAbandonment";
import { formatPrice } from "@/lib/utils";
import { getOGImage } from "@/lib/sitemap";
import { generateEnhancedProductSchema, generateBreadcrumbSchema, generateFAQPageSchema, generateWebPageSchema, generateHowToSchema } from "@/lib/schema";
import { getProductHowTo } from "@/data/productHowTo";

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Fetch product from Shopify (with 8s timeout to avoid perpetual loading)
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchProduct = async () => {
      if (!handle) return;

      setLoading(true);
      try {
        const fetchPromise = getProductByHandle(handle);
        const timeoutPromise = new Promise<null>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Request timeout")), 8000);
        });

        const productData = await Promise.race([fetchPromise, timeoutPromise]);
        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (productData) {
          // Products must have at least one variant to be purchasable
          const hasVariants = productData.variants?.edges?.length > 0;
          if (!hasVariants) {
            console.warn("Product has no variants (not purchasable):", productData.handle);
            setProduct(null);
            setLoading(false);
            return;
          }

          setProduct(productData);

          // Track product view for conversion funnel
          trackProductView(productData.id, productData.title);
          trackFunnelStep("view", {
            product_id: productData.id,
            product_title: productData.title,
          });

          // Save to recently viewed (for collection pages)
          try {
            const firstImg = productData.images?.edges?.[0]?.node?.url || "";
            const recentItem = { slug: productData.handle, title: productData.title, image: firstImg, price: parseFloat(productData.priceRange?.minVariantPrice?.amount || "0") };
            const stored = JSON.parse(localStorage.getItem("hp_recent_products") || "[]");
            const filtered = stored.filter((p: any) => p.slug !== productData.handle);
            filtered.unshift(recentItem);
            localStorage.setItem("hp_recent_products", JSON.stringify(filtered.slice(0, 8)));
          } catch {}

          // Set first available variant as default
          const variants = productData.variants.edges;
          const firstAvailableVariant = variants.find((v: any) => v.node.availableForSale)?.node || variants[0]?.node;

          if (firstAvailableVariant) {
            setActiveVariantId(firstAvailableVariant.id);

            // Set default selected options
            const defaultOptions: Record<string, string> = {};
            (firstAvailableVariant.selectedOptions || []).forEach((opt: any) => {
              defaultOptions[opt.name] = opt.value;
            });
            setSelectedOptions(defaultOptions);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        setProduct(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [handle]);

  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    if (!product?.variants?.edges) return;
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const matchingVariant = product.variants.edges.find((edge: any) => {
      const variant = edge.node;
      return (variant.selectedOptions || []).every((opt: any) =>
        newOptions[opt.name] === opt.value
      );
    });

    if (matchingVariant) {
      setActiveVariantId(matchingVariant.node.id);

      // Update image to match variant if available
      const variantImage = matchingVariant.node.image;
      if (variantImage && product.images?.edges) {
        const imageIndex = product.images.edges.findIndex(
          (edge: any) => edge.node.id === variantImage.id || edge.node.url === variantImage.url
        );
        if (imageIndex !== -1) {
          setCurrentImage(imageIndex);
        }
      }
    }
  };

  // Handle add to bag - use server-side Edge Function
  const handleAddToBag = async () => {
    if (!activeVariantId || !product) return;
    
    setAddingToCart(true);
    
    try {
      const existingCartId = getCartId();

      // Call Edge Function to add to cart (retry once without cart ID if stale)
      let response: Response | null = null;
      let useCartId = existingCartId;
      for (let attempt = 0; attempt < 2; attempt++) {
        response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lines: [{ merchandiseId: activeVariantId, quantity: 1 }],
            ...(useCartId && { cartId: useCartId }),
          }),
        });
        if (response.ok) break;
        // If cart ID is stale, retry with a fresh cart
        if (attempt === 0 && existingCartId) {
          useCartId = null;
          localStorage.removeItem('hp_cart_id');
        }
      }

      if (!response || !response.ok) {
        throw new Error('Failed to add to cart');
      }

      const { checkoutUrl, cartId } = await response.json();
      
      // Store cart ID for future additions
      if (cartId) {
        localStorage.setItem('hp_cart_id', cartId);
      }
      
      // Track add_to_cart to GHL and cart abandonment
      const activeVariant = product.variants?.edges?.find((e: any) => e.node.id === activeVariantId)?.node;
      const price = activeVariant ? parseFloat(activeVariant.price?.amount || "0") : 0;

      // Track funnel step: intent
      trackFunnelStep("intent", {
        product_id: product.id,
        product_title: product.title,
        price,
      });
      
      // Track cart creation for abandonment recovery
      if (cartId && checkoutUrl) {
        await trackCartCreated(
          cartId,
          checkoutUrl,
          [{
            id: activeVariantId,
            title: product.title,
            price: price,
            quantity: 1,
          }],
          price,
          "AUD"
        );
      }
      
      trackAddToCart({
        product_id: product.id,
        title: product.title,
        variant_id: activeVariantId,
        price: price,
        currency: "AUD",
        quantity: 1,
      });
      
      toast.success("Added to bag!");
      window.dispatchEvent(new CustomEvent("hp:openMiniCart"));
    } catch (error: any) {
      console.error("Add to bag failed:", error);
      toast.error("We couldn't add this to your bag. Please try again or contact us.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle buy now - server-side checkout
  const handleBuyNow = async () => {
    if (!activeVariantId || !product) return;
    
    setBuyingNow(true);
    
    try {
      // Track add_to_cart
      const activeVariant = product.variants?.edges?.find((e: any) => e.node.id === activeVariantId)?.node;
      const price = activeVariant ? parseFloat(activeVariant.price?.amount || "0") : 0;

      trackAddToCart({
        product_id: product.id,
        title: product.title,
        variant_id: activeVariantId,
        price: price,
        currency: "AUD",
        quantity: 1,
      });
      
      // Track begin_checkout
      trackBeginCheckout({
        cart_total: price,
        item_count: 1,
        currency: "AUD",
      });
      
      // Call server-side checkout endpoint with redirect=true
      // The server will create/update cart and redirect to Shopify checkout
      const existingCartId = getCartId();
      let useCartId = existingCartId;

      // Retry once without cart ID if stale
      let response: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        response = await fetch('/api/checkout?redirect=true', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lines: [{ merchandiseId: activeVariantId, quantity: 1 }],
            ...(useCartId && { cartId: useCartId }),
          }),
        });
        if (response.ok || response.redirected || response.status === 303) break;
        if (attempt === 0 && existingCartId) {
          useCartId = null;
          localStorage.removeItem('hp_cart_id');
        }
      }

      if (!response) {
        throw new Error('Checkout failed');
      }

      // If redirect fails, follow the redirect manually
      if (response.redirected) {
        window.location.href = response.url;
      } else if (response.status === 303) {
        const location = response.headers.get('Location');
        if (location) {
          window.location.href = location;
        }
      } else if (!response.ok) {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      console.error("Buy now failed:", error);
      toast.error("Unable to proceed to checkout. Please try again.");
      setBuyingNow(false);
    }
    // Don't reset setBuyingNow(false) if redirect succeeds - page will navigate away
  };

  // Navigate images
  const nextImage = () => {
    const edges = product?.images?.edges;
    if (!edges?.length) return;
    setCurrentImage((prev) => (prev + 1) % edges.length);
  };

  const prevImage = () => {
    const edges = product?.images?.edges;
    if (!edges?.length) return;
    setCurrentImage((prev) => (prev - 1 + edges.length) % edges.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-heading mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-6">
              This product doesn&apos;t exist or may have been removed from our store.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="primary">
                <Link to="/collections">Browse Collections</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/search">Search Products</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get active variant details (null-safe) - fallback to first variant if activeVariantId doesn't match
  const variantEdges = product.variants?.edges ?? [];
  let activeVariant = variantEdges.find((e: any) => e.node.id === activeVariantId)?.node;
  if (!activeVariant && variantEdges.length > 0) {
    // Selected variant no longer exists - prefer first available variant
    const firstAvailable = variantEdges.find((e: any) => e.node.availableForSale)?.node || variantEdges[0]?.node;
    activeVariant = firstAvailable;
  }
  const price = activeVariant ? parseFloat(activeVariant.price?.amount || "0") : parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
  const compareAtPrice = activeVariant?.compareAtPrice?.amount
    ? parseFloat(activeVariant.compareAtPrice.amount)
    : null;
  const isAvailable = activeVariant?.availableForSale ?? false;

  const images = (product.images?.edges ?? []).map((e: any) => e?.node).filter(Boolean);
  const currentImg = images[currentImage];

  // Get unique option names
  const uniqueOptionNames = new Set<string>();
  variantEdges.forEach((edge: any) => {
    (edge.node.selectedOptions || []).forEach((opt: any) => {
      uniqueOptionNames.add(opt.name);
    });
  });

  // Get unique values for each option
  const getOptionValues = (optionName: string) => {
    const values = new Set<string>();
    variantEdges.forEach((edge: any) => {
      const option = (edge.node.selectedOptions || []).find((opt: any) => opt.name === optionName);
      if (option) values.add(option.value);
    });
    return Array.from(values);
  };

  // Build product schemas
  const productDescription = String(product.description ?? "").substring(0, 120);
  const imageUrls = images.map((img: any) => img?.url).filter(Boolean);

  const productSchemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "Collections", url: "https://hairpinns.com/collections" },
      { name: product.title, url: `https://hairpinns.com/products/${handle}` },
    ]),
    (() => {
      try {
        return generateEnhancedProductSchema({
          name: product.title,
          description: product.description || `${product.title} - Professional hair care product from Hair Pinns`,
          image: imageUrls.length > 0 ? imageUrls : [getOGImage('product')],
          price: (Number.isFinite(price) ? price : 0).toString(),
          currency: activeVariant?.price?.currencyCode || "AUD",
          brand: "Hair Pinns",
          sku: activeVariant?.sku || product.id?.split("/")?.pop() || product.handle || "",
          productID: product.id,
          availability: isAvailable ? "InStock" : "OutOfStock",
          category: product.productType || "Hair Care",
        });
      } catch (e) {
        console.warn("Product schema generation failed:", e);
        return {};
      }
    })(),
    generateFAQPageSchema([
      { question: `What is ${product.title}?`, answer: `${(product.description || `${product.title} - Professional hair care product from Hair Pinns`).substring(0, 250)} Hair Pinns ships ${product.title} Australia-wide. Free shipping over $150.` },
      { question: `Where can I buy ${product.title} in Australia?`, answer: `Hair Pinns ships ${product.title} Australia-wide with free shipping on orders over $150. Picked by Jena since 2009. Available now at hairpinns.com.` },
      { question: `Does ${product.title} ship to Melbourne, Brisbane, Perth or Sydney?`, answer: `Yes. Hair Pinns ships ${product.title} to Melbourne, Brisbane, Perth, Sydney, and all of Australia. Free shipping over $150. Every state and territory.` },
      { question: `Is ${product.title} available in Australia?`, answer: `Yes. ${product.title} is available in Australia from Hair Pinns. Shipped Australia-wide with free shipping on orders over $150.` },
    ]),
    generateWebPageSchema({
      name: product.title,
      description: product.description || `${product.title} - Professional hair care product from Hair Pinns`,
      url: `https://hairpinns.com/products/${handle}`,
      speakable: { cssSelector: [".speakable-product-intro"] },
    }),
    ...(() => {
      const howTo = getProductHowTo(handle, product.title);
      if (!howTo) return [];
      return [generateHowToSchema({
        name: howTo.name,
        description: howTo.description,
        step: howTo.step,
        supply: howTo.supply?.map((s) => ({ name: s })),
      })];
    })(),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.title} | Hair Care Australia | Hair Pinns`}
        description={`${productDescription} Shipped Australia-wide. Free shipping over $150.`}
        canonical={`https://hairpinns.com/products/${handle}`}
        ogImage={images[0]?.url || getOGImage('product')}
        ogType="product"
        hrefLang="en-AU"
        schemaJson={productSchemas}
      />
      
      <Header />
      
      {/* Trust Strip */}
      <TrustStrip />
      
      {/* Exit Intent Modal */}
      {/* ExitIntentModal removed */}
      
      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: product.title }
            ]}
          />
        </div>
        
        {/* Product Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Gallery */}
              <div className="space-y-4">
                {/* Main Image - Clickable */}
                <div
                  className="relative aspect-square bg-muted rounded-card overflow-hidden group cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={currentImg?.url || "/placeholder.svg"}
                    alt={currentImg?.altText || product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    width="800"
                    height="800"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    decoding="async"
                    fetchPriority="high"
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Dots Indicator */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImage ? "bg-white w-6" : "bg-white/50"
                          }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((image: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        aria-label={`View thumbnail ${index + 1}`}
                        className={`aspect-square rounded-card overflow-hidden border-2 transition-all ${
                          index === currentImage ? "border-brand-500" : "border-transparent hover:border-border"
                        }`}
                      >
                        <img
                          src={image?.url || "/placeholder.svg"}
                          alt={image?.altText || `${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          width="200"
                          height="200"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Info */}
              <div className="space-y-6">
                {/* Title */}
                <h1 className="text-h1-lg font-heading font-bold text-heading">
                  {product.title}
                </h1>

                {/* Availability & Urgency */}
                <SilentErrorBoundary>
                  <UrgencyIndicator
                    productId={product.id}
                    inStock={product.availableForSale}
                    showRecentPurchases={false}
                    className="mb-4"
                  />
                </SilentErrorBoundary>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-brand-500">
                      {formatPrice(Number.isFinite(price) ? price : 0, "AUD")}
                    </span>
                    {compareAtPrice && compareAtPrice > price && (
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(compareAtPrice, "AUD")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">All prices in Australian Dollars (AUD)</p>
                </div>

                {/* Variant Selector */}
                {Array.from(uniqueOptionNames).map((optionName) => (
                  <div key={optionName} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {optionName}
                    </label>
                    <Select 
                      value={selectedOptions[optionName] || ""}
                      onValueChange={(value) => handleOptionChange(optionName, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${optionName}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getOptionValues(optionName).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                {/* Add to Bag / Buy Now */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleAddToBag}
                    disabled={!isAvailable || addingToCart}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {addingToCart ? "Adding..." : "Add to Bag"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleBuyNow}
                    disabled={!isAvailable || buyingNow}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    {buyingNow ? "Processing..." : "Buy Now"}
                  </Button>

                  {/* Shipping Calculator */}
                  <div className="pt-2">
                    <SilentErrorBoundary fallback={<p className="text-sm text-muted-foreground">Free shipping on orders over $150 Australia-wide</p>}>
                      <ShippingCalculator cartTotal={price} />
                    </SilentErrorBoundary>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="pt-2">
                    <SilentErrorBoundary fallback={<p className="text-sm text-muted-foreground">Ships in 1-2 business days &middot; 3-7 day delivery</p>}>
                      <EstimatedDelivery cartTotal={price} />
                    </SilentErrorBoundary>
                  </div>

                  {/* Payment Options */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-3 text-foreground">Payment Options:</p>
                    <SilentErrorBoundary>
                      <PaymentBadges variant="stacked" />
                    </SilentErrorBoundary>
                  </div>

                </div>

                {/* Product Tabs */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-6">
                    <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent px-0 pb-2 text-sm font-medium">
                      Description
                    </TabsTrigger>
                    {(() => {
                      const howTo = getProductHowTo(handle, product.title);
                      return howTo ? (
                        <TabsTrigger value="how-to-use" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent px-0 pb-2 text-sm font-medium">
                          How to Use
                        </TabsTrigger>
                      ) : null;
                    })()}
                  </TabsList>

                  <TabsContent value="description" className="mt-4">
                    <div className="prose prose-sm max-w-none text-foreground">
                      {(() => {
                        try {
                          const rawDesc = product.description ?? product.descriptionHtml ?? "";
                          const description = typeof rawDesc === "string" ? rawDesc : String(rawDesc);
                          const sentences = description.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
                          const keyPoints = sentences.slice(0, 5).map((s: string) => s.trim()).filter(Boolean);

                          if (keyPoints.length === 0) {
                            return <p className="speakable-product-intro">Professional hair care product designed for great results at home.</p>;
                          }

                          return (
                            <div className="space-y-2">
                              {keyPoints.map((point, index) => (
                                <p key={index} className={index === 0 ? "speakable-product-intro text-sm leading-relaxed" : "text-sm leading-relaxed"}>{point}.</p>
                              ))}
                            </div>
                          );
                        } catch {
                          return <p>Professional hair care product designed for great results at home.</p>;
                        }
                      })()}
                    </div>
                  </TabsContent>

                  <TabsContent value="how-to-use" className="mt-4">
                    {(() => {
                      const howTo = getProductHowTo(handle, product.title);
                      if (!howTo) return null;
                      return (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{howTo.description}</p>
                          <ol className="space-y-3">
                            {howTo.step.map((step, i) => (
                              <li key={i} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                                <div>
                                  <p className="text-sm font-medium text-heading">{step.name}</p>
                                  <p className="text-sm text-muted-foreground">{step.text}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                          {howTo.supply && howTo.supply.length > 0 && (
                            <div className="pt-3 border-t border-border">
                              <p className="text-xs font-medium text-muted-foreground mb-1">You'll need:</p>
                              <p className="text-sm text-foreground">{howTo.supply.join(", ")}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Image Lightbox */}
        {lightboxOpen && currentImg?.url && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light z-10"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={currentImg.url}
              alt={currentImg.altText || product.title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
          </div>
        )}

        {/* Frequently Bought Together Section - wrapped so failures don't break product page */}
        {product && (
          <SilentErrorBoundary>
            <FrequentlyBoughtTogether
              currentProductId={product.id}
              currentProductHandle={product.handle}
            />
          </SilentErrorBoundary>
        )}

        {/* Product Recommendations - wrapped so failures don't break product page */}
        {product && (
          <SilentErrorBoundary>
            <ProductRecommendations
              currentProductId={product.id}
              currentCollectionHandle={product.collections?.edges?.[0]?.node?.handle}
            />
          </SilentErrorBoundary>
        )}
        {/* Share this product */}
        {product && (
          <section className="py-8 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-muted-foreground mb-3">Share this product</p>
              <SocialShareBar url={`https://hairpinns.com/products/${handle}`} title={product.title} />
            </div>
          </section>
        )}

        {/* Topic cluster: services and blog posts that use/apply this product */}
        {product?.collections?.edges?.[0]?.node?.handle && (
          <RelatedContent
            topics={topicsForCollection(
              product.collections.edges[0].node.handle
            ).map((t) => t.slug)}
            show={["service", "blog"]}
            heading="Services & reading that pair with this"
          />
        )}
      </main>

      <Footer />
      {product && (
        <SilentErrorBoundary>
          <StickyAddToCart
            productTitle={product.title}
            price={price}
            inStock={isAvailable}
            onAddToCart={handleAddToBag}
            threshold={500}
          />
        </SilentErrorBoundary>
      )}
    </div>
  );
};

export default ProductDetail;
