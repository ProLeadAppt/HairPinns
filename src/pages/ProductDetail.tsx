import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
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
import { addToBag, getCheckoutUrl, getCartId } from "@/lib/cartManagement";
import { trackAddToCart, trackBeginCheckout } from "@/lib/ecommerceTracking";
import { gotoCheckout } from "@/lib/checkout";
import { toast } from "sonner";
import MiniCartDrawer from "@/components/MiniCartDrawer";
import TrustStrip from "@/components/conversion/TrustStrip";
import ExitIntentModal from "@/components/conversion/ExitIntentModal";
import { getOGImage } from "@/lib/sitemap";

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Fetch product from Shopify
  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      
      setLoading(true);
      try {
        const productData = await getProductByHandle(handle);
        
        if (productData) {
          setProduct(productData);
          
          // Set first available variant as default
          const variants = productData.variants.edges;
          const firstAvailableVariant = variants.find((v: any) => v.node.availableForSale)?.node || variants[0]?.node;
          
          if (firstAvailableVariant) {
            setActiveVariantId(firstAvailableVariant.id);
            
            // Set default selected options
            const defaultOptions: Record<string, string> = {};
            firstAvailableVariant.selectedOptions.forEach((opt: any) => {
              defaultOptions[opt.name] = opt.value;
            });
            setSelectedOptions(defaultOptions);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    // Find matching variant
    const matchingVariant = product.variants.edges.find((edge: any) => {
      const variant = edge.node;
      return variant.selectedOptions.every((opt: any) => 
        newOptions[opt.name] === opt.value
      );
    });
    
    if (matchingVariant) {
      setActiveVariantId(matchingVariant.node.id);
    }
  };

  // Handle add to bag
  const handleAddToBag = async () => {
    if (!activeVariantId || !product) return;
    
    setAddingToCart(true);
    
    try {
      const updatedCart = await addToBag(activeVariantId, 1);
      
      // Track add_to_cart to Zapier
      const activeVariant = product.variants.edges.find((e: any) => e.node.id === activeVariantId)?.node;
      const price = activeVariant ? parseFloat(activeVariant.priceV2.amount) : 0;
      
      trackAddToCart({
        product_id: product.id,
        title: product.title,
        variant_id: activeVariantId,
        price: price,
        currency: "AUD",
        quantity: 1,
      });
      
      toast.success("Added to bag!");
      setMiniCartOpen(true);
    } catch (error) {
      console.error("Add to bag failed:", error);
      toast.error("Failed to add to bag. Redirecting...");
      
      // Fallback to product page
      setTimeout(() => {
        window.location.href = getProductUrl(handle || "");
      }, 1500);
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!activeVariantId || !product) return;
    
    setBuyingNow(true);
    
    try {
      const updatedCart = await addToBag(activeVariantId, 1);
      
      // Track add_to_cart
      const activeVariant = product.variants.edges.find((e: any) => e.node.id === activeVariantId)?.node;
      const price = activeVariant ? parseFloat(activeVariant.priceV2.amount) : 0;
      
      trackAddToCart({
        product_id: product.id,
        title: product.title,
        variant_id: activeVariantId,
        price: price,
        currency: "AUD",
        quantity: 1,
      });
      
      // Track begin_checkout
      const cartTotal = parseFloat(updatedCart.cost.totalAmount.amount);
      const itemCount = updatedCart.lines.length;
      
      trackBeginCheckout({
        cart_total: cartTotal,
        item_count: itemCount,
        currency: "AUD",
      });
      
      // Get stored checkout URL (set during Add to Bag)
      const url = getCheckoutUrl();
      if (url) {
        console.log("🛒 Redirecting to checkout:", url);
        gotoCheckout(url);
      } else {
        // Fallback to native cart
        const cleanVariantId = activeVariantId.split('/').pop();
        const fallbackUrl = `https://hairpinns.com/cart/${cleanVariantId}:1`;
        console.warn("⚠️ Using native cart fallback:", fallbackUrl);
        gotoCheckout(fallbackUrl);
      }
    } catch (error) {
      console.error("Buy now failed:", error);
      toast.error("Unable to proceed to checkout. Please try again.");
      toast.error("Failed to process. Redirecting...");
      
      // Fallback to product page
      setTimeout(() => {
        window.location.href = getProductUrl(handle || "");
      }, 1500);
    }
  };

  // Navigate images
  const nextImage = () => {
    if (!product) return;
    setCurrentImage((prev) => (prev + 1) % product.images.edges.length);
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImage((prev) => (prev - 1 + product.images.edges.length) % product.images.edges.length);
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-heading mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-6">This product doesn't exist or has been removed.</p>
            <Button asChild variant="primary">
              <Link to="/collections">Browse Collections</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get active variant details
  const activeVariant = product.variants.edges.find((e: any) => e.node.id === activeVariantId)?.node;
  const price = activeVariant ? parseFloat(activeVariant.priceV2.amount) : 0;
  const compareAtPrice = activeVariant?.compareAtPriceV2 ? parseFloat(activeVariant.compareAtPriceV2.amount) : null;
  const isAvailable = activeVariant?.availableForSale ?? false;

  const images = product.images.edges.map((edge: any) => edge.node);
  const currentImg = images[currentImage];

  // Get unique option names
  const uniqueOptionNames = new Set<string>();
  product.variants.edges.forEach((edge: any) => {
    edge.node.selectedOptions.forEach((opt: any) => {
      uniqueOptionNames.add(opt.name);
    });
  });

  // Get unique values for each option
  const getOptionValues = (optionName: string) => {
    const values = new Set<string>();
    product.variants.edges.forEach((edge: any) => {
      const option = edge.node.selectedOptions.find((opt: any) => opt.name === optionName);
      if (option) values.add(option.value);
    });
    return Array.from(values);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.title} | ${price.toFixed(2)} | Hair Pinns</title>
        <meta 
          name="description" 
          content={product.description.substring(0, 155)}
        />
        <link rel="canonical" href={`https://hairpinns.com/products/${handle}`} />
        <meta property="og:title" content={`${product.title} - $${price.toFixed(2)}`} />
        <meta property="og:description" content={product.description.substring(0, 155)} />
        <meta property="og:url" content={`https://hairpinns.com/products/${handle}`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={images[0]?.url || getOGImage('product')} />
        <meta property="product:price:amount" content={price.toString()} />
        <meta property="product:price:currency" content="AUD" />
        <meta name="twitter:card" content="summary_large_image" />
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
                {/* Main Image */}
                <div className="relative aspect-square bg-muted rounded-card overflow-hidden group">
                  <img
                    src={currentImg?.url || "/placeholder.svg"}
                    alt={currentImg?.altText || product.title}
                    className="w-full h-full object-cover"
                    width="800"
                    height="800"
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
                        className={`aspect-square rounded-card overflow-hidden border-2 transition-all ${
                          index === currentImage ? "border-brand-500" : "border-transparent hover:border-border"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.altText || `${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          width="200"
                          height="200"
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

                {/* Availability */}
                {!product.availableForSale && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-brand-500">
                    ${price.toFixed(2)}
                  </span>
                  {compareAtPrice && compareAtPrice > price && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                  )}
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
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={handleBuyNow}
                    disabled={!isAvailable || buyingNow}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    {buyingNow ? "Processing..." : "Buy Now"}
                  </Button>
                </div>

                {/* Description */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="space-y-4">
                    <div 
                      className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Product ID:</strong> {product.id}</p>
                      <p><strong>Availability:</strong> {product.availableForSale ? "In Stock" : "Out of Stock"}</p>
                      <p><strong>Price Range:</strong> ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)} - ${parseFloat(product.priceRange.maxVariantPrice.amount).toFixed(2)}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
