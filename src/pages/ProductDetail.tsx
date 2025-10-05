import { useState, FormEvent, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, Check, ChevronLeft, ChevronRight, Truck, Package, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import StickyAddToCart from "@/components/conversion/StickyAddToCart";
import TrustStrip from "@/components/conversion/TrustStrip";
import ExitIntentModal from "@/components/conversion/ExitIntentModal";
import ProductBadges from "@/components/conversion/ProductBadges";
import ProductReviews from "@/components/reviews/ProductReviews";
import GoogleReviewBadge from "@/components/reviews/GoogleReviewBadge";
import { pixelTracking } from "@/lib/pixelTracking";
import { getOGImage } from "@/lib/sitemap";
import { productReviews } from "@/data/reviews";

const ProductDetail = () => {
  const { handle } = useParams();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Dummy product data (replace with Shopify API)
  const product = {
    title: "Hydrate & Restore Pack",
    price: 89.00,
    compareAtPrice: 114.00,
    bundleValue: "$25 savings",
    rating: 5,
    reviewCount: 47,
    inStock: true,
    stock: 7, // Low stock example
    soldLast24h: 12, // Fast moving example
    images: [
      { src: "/placeholder.svg", alt: "Hydrate & Restore Pack - Full Set" },
      { src: "/placeholder.svg", alt: "Product bottles close-up" },
      { src: "/placeholder.svg", alt: "Texture and consistency" },
      { src: "/placeholder.svg", alt: "Product in use" },
    ],
    bullets: [
      "Transform dry, damaged hair in 7 days",
      "Shampoo, conditioner & deep treatment included",
      "Save $25 vs buying separately"
    ],
    hairGoals: ["Repair", "Hydration", "Color-safe"],
    whatsInside: [
      "Hydrating Shampoo 300ml - Gentle sulfate-free cleanse",
      "Restorative Conditioner 300ml - Deep moisture & slip",
      "Bond Repair Treatment 150ml - Weekly intensive repair"
    ],
    whoItsFor: [
      "Dry, damaged, or over-processed hair",
      "Color-treated hair needing gentle care",
      "Anyone seeking salon-quality hydration at home"
    ],
    howToUse: [
      "Shampoo: Apply to wet hair, massage scalp, rinse thoroughly",
      "Conditioner: Apply mid-length to ends, leave 2-3 minutes, rinse",
      "Treatment: Use weekly after shampooing, leave 10 minutes, rinse well"
    ],
    ingredients: "Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Hydrolyzed Keratin, Argan Oil, Panthenol, Glycerin, Parfum",
    faqs: [
      {
        question: "How long will this pack last?",
        answer: "With typical use (washing 2-3 times per week), this pack lasts approximately 6-8 weeks."
      },
      {
        question: "Is this safe for color-treated hair?",
        answer: "Yes! All products in this pack are sulfate-free and specifically formulated to be gentle on color-treated hair."
      },
      {
        question: "Can I use the treatment more than once a week?",
        answer: "For severely damaged hair, you can use the bond repair treatment 2x per week. For maintenance, once weekly is perfect."
      }
    ],
    pairsWith: [
      { title: "Heat Defense Spray", price: 28.00, image: "/placeholder.svg", handle: "heat-defense" },
      { title: "Nourishing Hair Oil", price: 35.00, image: "/placeholder.svg", handle: "hair-oil" },
      { title: "Silk Pillowcase", price: 42.00, image: "/placeholder.svg", handle: "silk-pillowcase" }
    ],
    shippingNote: "In stock • Ships within 1-2 business days",
  };

  // Track view_item on page load
  useEffect(() => {
    // Track view_item pixel event (NO PII)
    pixelTracking.trackProductView({
      id: handle || 'unknown',
      title: product.title,
      price: product.price,
      currency: 'AUD',
    });

    // Track to Zapier for analytics (NO PII)
    const trackView = async () => {
      try {
        const { hpCapture } = await import("@/lib/hpCapture");
        await hpCapture.trackEvent("view_item", {
          product_id: handle,
          product_title: product.title,
          price: product.price,
          currency: "AUD",
        });
      } catch (error) {
        console.error("Failed to track view_item:", error);
      }
    };
    trackView();
  }, [handle, product.title, product.price]);

  const handleAddToCart = async () => {
    // Fire pixel tracking (NO PII)
    pixelTracking.trackAddToCart({
      id: handle || 'unknown',
      title: product.title,
      price: product.price,
      quantity: quantity,
      currency: 'AUD',
    });

    // Fire Zapier tracking (NO PII)
    const trackAddToCart = async () => {
      try {
        const { hpCapture } = await import("@/lib/hpCapture");
        
        await hpCapture.trackEvent("add_to_cart", {
          product_id: handle,
          product_title: product.title,
          price: product.price,
          variant: "default",
          quantity: quantity,
          currency: "AUD",
        });
      } catch (error) {
        console.error("Failed to track add_to_cart:", error);
      }
    };
    
    // Fire tracking in background (non-blocking)
    trackAddToCart();
    
    // Show immediate user feedback
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.title} added to your cart.`,
    });
    
    console.log("Add to cart:", { product: handle, quantity });
  };

  const handleLeadCapture = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingLead(true);

    try {
      const { hpCapture } = await import("@/lib/hpCapture");
      
      const success = await hpCapture.postToZapier(
        {
          form_name: "product_lead_magnet",
          first_name: '',
          last_name: '',
          email: email,
          phone: '',
          product_handle: handle,
          product_title: product.title,
          product_id: '',
          price: product.price.toString(),
          currency: 'AUD',
          lead_magnet_title: "7-Day Frizz-Free Plan",
          lead_magnet_slug: "frizz7_pdp",
          consent_marketing: true,
        },
        { event: "leadmagnet_frizz7_pdp" }
      );

      if (success) {
        // Track lead generation in pixels
        await pixelTracking.trackFormSubmission({
          email: email,
          leadValue: 25, // Estimated lead value
        });

        toast({
          title: "Success! Check your inbox",
          description: "We've sent you Jena's 7-Day Frizz-Free Plan.",
        });
        setEmail("");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Lead capture error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Get product reviews for schema
  const reviews = productReviews[handle || "hydrate-restore-pack"] || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : product.rating;
  const reviewCount = reviews.length || product.reviewCount;

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": product.title,
        "image": product.images.map(img => `https://hairpinns.com${img.src}`),
        "description": product.bullets.join(". "),
        "brand": {
          "@type": "Brand",
          "name": "Hair Pinns"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://hairpinns.com/products/${handle}`,
          "priceCurrency": "AUD",
          "price": product.price,
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "Hair Pinns"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": averageRating,
          "reviewCount": reviewCount,
          "bestRating": 5,
          "worstRating": 1
        },
        ...(reviews.length > 0 && {
          "review": reviews.map(review => ({
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": review.author
            },
            "datePublished": review.date,
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": review.rating,
              "bestRating": 5,
              "worstRating": 1
            },
            "reviewBody": review.text
          }))
        })
      },
      {
        "@type": "FAQPage",
        "mainEntity": product.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.title} | ${product.price} | Hair Pinns</title>
        <meta 
          name="description" 
          content={`${product.bullets.join(". ")}. Save $${(product.compareAtPrice - product.price).toFixed(0)}. In stock, ships fast.`}
        />
        <link rel="canonical" href={`https://hairpinns.com/products/${handle}`} />
        <meta property="og:title" content={`${product.title} - $${product.price}`} />
        <meta property="og:description" content={product.bullets.join(". ")} />
        <meta property="og:url" content={`https://hairpinns.com/products/${handle}`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={`https://hairpinns.com${product.images[0].src}`} />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="AUD" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="en-AU" href={`https://hairpinns.com/products/${handle}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Header />
      
      <GoogleReviewBadge variant="micro" showCTA />
      
      {/* Trust Strip */}
      <TrustStrip />
      
      {/* Exit Intent Modal */}
      <ExitIntentModal enabled={true} />
      
      {/* Sticky Add to Cart (mobile only) */}
      <StickyAddToCart
        productTitle={product.title}
        price={product.price}
        inStock={product.inStock}
        onAddToCart={handleAddToCart}
      />
      
      <main>
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: 'Hair Care', href: '/collections/hair-care' },
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
                    src={product.images[currentImage].src}
                    alt={product.images[currentImage].alt}
                    className="w-full h-full object-cover"
                    width="800"
                    height="800"
                  />
                  
                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
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
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
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
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`aspect-square rounded-card overflow-hidden border-2 transition-all ${
                        index === currentImage ? "border-brand-500" : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        width="200"
                        height="200"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="space-y-6">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[hsl(var(--star-color))] fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-foreground">
                    {product.rating}.0 ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-h1-lg font-heading font-bold text-heading">
                  {product.title}
                </h1>

                {/* Product Badges */}
                <ProductBadges
                  stock={product.stock}
                  soldLast24h={product.soldLast24h}
                />

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-brand-500">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                  {product.bundleValue && (
                    <Badge variant="default" className="ml-2">
                      {product.bundleValue}
                    </Badge>
                  )}
                </div>

                {/* Value Props */}
                <ul className="space-y-3">
                  {product.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Quantity & Add to Cart */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex gap-3">
                    <div className="flex items-center border border-border rounded-btn overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 border-x border-border min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>

                  {/* Stock & Shipping */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2 text-[hsl(var(--success-fg))]">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{product.shippingNote}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="w-4 h-4" />
                      <span>Free shipping over $99</span>
                    </div>
                  </div>
                  
                  {/* Returns Policy */}
                  <div className="text-sm text-muted-foreground">
                    Changed your mind? 14-day easy returns on unopened products.{" "}
                    <Link to="/policies/returns" className="text-brand-500 hover:text-brand-600 underline">
                      Learn more
                    </Link>
                  </div>

                  {/* Payment Options */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">
                      Or pay in 4 interest-free installments with
                    </p>
                    <div className="flex gap-4">
                      <span className="text-sm font-semibold">Klarna</span>
                      <span className="text-sm font-semibold">Afterpay</span>
                    </div>
                  </div>
                </div>

                {/* Lead Magnet */}
                <div className="bg-accent border border-border rounded-card p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Mail className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-heading mb-1">
                        Not ready to buy?
                      </h3>
                      <p className="text-sm text-foreground">
                        Get Jena's 7-Day Frizz-Free Plan — free guide via email
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleLeadCapture} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmittingLead}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isSubmittingLead}
                    >
                      {isSubmittingLead ? "Sending..." : "Send"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12 bg-muted">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="whats-inside" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="whats-inside">What's Inside</TabsTrigger>
                <TabsTrigger value="who-for">Who It's For</TabsTrigger>
                <TabsTrigger value="how-to">How To Use</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="whats-inside" className="bg-card rounded-card p-6">
                <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                  What's Inside
                </h3>
                <ul className="space-y-3">
                  {product.whatsInside.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="who-for" className="bg-card rounded-card p-6">
                <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                  Who It's For
                </h3>
                <ul className="space-y-3">
                  {product.whoItsFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-heading mb-2">Hair Goals:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.hairGoals.map((goal, index) => (
                      <Badge key={index} variant="outline">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="how-to" className="bg-card rounded-card p-6">
                <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                  How To Use
                </h3>
                <ol className="space-y-4">
                  {product.howToUse.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-foreground pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
                
                {/* Blog Tutorial Link */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-heading mb-3">
                    Want a detailed guide?
                  </p>
                  <Link 
                    to="/blog/frizz-free-in-7-days" 
                    className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors font-medium"
                  >
                    Read Jena's 7-Day Frizz-Free Plan
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="results" className="bg-card rounded-card p-6">
                <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                  Expected Results
                </h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    <strong>Week 1:</strong> Immediate improvement in manageability and shine. Hair feels softer and more hydrated.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    <strong>Week 2-3:</strong> Visible reduction in breakage and split ends. Color appears more vibrant and lasts longer.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    <strong>Week 4+:</strong> Transformed hair with restored strength, elasticity, and healthy shine. Long-term protection from future damage.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="bg-card rounded-card p-6">
                <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                  Full Ingredients List (INCI)
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {product.ingredients}
                </p>
                <div className="mt-6 p-4 bg-accent rounded-card">
                  <p className="text-sm text-foreground">
                    <strong>Clean Formula:</strong> Sulfate-free, paraben-free, cruelty-free. Safe for color-treated hair.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="faqs" className="bg-card rounded-card p-6">
                <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-3">
                  {product.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-card px-4">
                      <AccordionTrigger className="text-left font-medium text-heading hover:text-brand-500">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground">
                        <div>{faq.answer}</div>
                        <FaqFeedbackWidget question={faq.question} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Product Reviews */}
        <section className="py-16 bg-muted">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8">
              Customer Reviews
            </h2>
            <div className="bg-card rounded-card p-8">
              <ProductReviews productHandle={handle || "hydrate-restore-pack"} />
            </div>
          </div>
        </section>

        {/* Cross-sell: Pairs Well With */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              Pairs Well With
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.pairsWith.map((item, index) => (
                <Link
                  key={index}
                  to={`/products/${item.handle}`}
                  className="group bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-all duration-base"
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                      loading="lazy"
                      width="400"
                      height="400"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-lg font-bold text-brand-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
