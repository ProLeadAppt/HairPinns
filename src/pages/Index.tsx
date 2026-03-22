import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHome from "@/components/home/HeroHome";
import GoogleReviewBadge from "@/components/reviews/GoogleReviewBadge";
import UrgencyBar from "@/components/conversion/UrgencyBar";
import TrustStrip from "@/components/conversion/TrustStrip";
// RecentPurchases removed — was using simulated/fake purchase data
import ProductCountBadge from "@/components/conversion/ProductCountBadge";
import TrustBadges from "@/components/conversion/TrustBadges";

// ✅ SAFE: Lazy-load components (doesn't block initial render)
// Above-fold (loaded immediately for LCP)
const AboveFoldProducts = lazy(() => import("@/components/home/AboveFoldProducts"));

// Below-fold (lazy-loaded for better initial load performance)
const BestSellers = lazy(() => import("@/components/home/BestSellers"));
const WhyShopHairPinns = lazy(() => import("@/components/home/WhyShopHairPinns"));
const ReviewsShowcase = lazy(() => import("@/components/home/ReviewsShowcase"));
const ProductCategories = lazy(() => import("@/components/home/ProductCategories"));
const BlogTrio = lazy(() => import("@/components/home/BlogTrio"));
const FooterCTA = lazy(() => import("@/components/home/FooterCTA"));
const BookingBanner = lazy(() => import("@/components/home/BookingBanner"));
const StickyProductBar = lazy(() => import("@/components/conversion/StickyProductBar"));
import { MapPin } from "lucide-react";
import {
  generateOrganizationSchema,
  generateEnhancedLocalBusinessSchema,
  generateKnowledgeGraphSchema,
  generateFAQPageSchema,
  generateStoreSchema,
  generateWebPageSchema,
  generateHowToSchema
} from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { isStocktakeActive, PROMO_COLLECTIONS } from "@/config/promotions";
import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";

const Index = () => {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateEnhancedLocalBusinessSchema('https://hairpinns.com');
  const knowledgeGraphSchema = generateKnowledgeGraphSchema();
  const storeSchema = generateStoreSchema();

  // WebPage schema with speakable for AEO/voice search
  const webPageSchema = generateWebPageSchema({
    name: "Hair Pinns - Salon Hair Care Australia",
    description: "Hair care handpicked by Jena. Salon-quality products shipped to every state and territory. Free shipping over $150. Also visit our Bangor salon in Sutherland Shire.",
    url: "https://hairpinns.com",
    speakable: { cssSelector: [".speakable-hero-intro"] },
  });

  // HowTo schema for booking - AEO optimization
  const howToBookSchema = generateHowToSchema({
    name: "How to Book an Appointment at Hair Pinns",
    description: "Book your hair appointment at Hair Pinns Bangor salon in 4 simple steps. Available 24/7 via Fresha.",
    step: [
      { name: "Visit booking page", text: "Go to hairpinns.com/booking or our Fresha page to start your booking" },
      { name: "Select service", text: "Choose your preferred service: Colour & Blonding, Smoothing Treatment, or Cuts & Styling" },
      { name: "Choose date and time", text: "Pick an available date and time that suits you" },
      { name: "Confirm booking", text: "Enter your details and confirm your appointment. You'll receive a confirmation" },
    ],
    totalTime: "PT2M",
  });

  // FAQ schema for homepage
  const faqSchema = generateFAQPageSchema([
    {
      question: "Do you ship products Australia-wide?",
      answer: "Yes! We ship hair care products Australia-wide with free shipping on orders over $150. Everything is handpicked by Jena from her 15+ years in the salon.",
    },
    {
      question: "Where can I buy salon hair products in Australia?",
      answer: "Hair Pinns ships salon hair care Australia-wide. Free shipping over $150. Handpicked by Jena since 2009. Shop Juuce, QIQI, Pure, Wet Brush and more.",
    },
    {
      question: "Do you ship internationally?",
      answer: "No, we ship to Australia only. Every state and territory — from Darwin to Hobart. We deliver to NSW, VIC, QLD, WA, SA, TAS, NT, and ACT.",
    },
    {
      question: "What makes Hair Pinns products different?",
      answer: "Every product is handpicked by Jena, who's been running her salon since 2009. She only stocks products that actually work — nothing from the supermarket aisle.",
    },
    {
      question: "Do you offer returns?",
      answer: "Yes, we offer hassle-free 14-day returns. Your satisfaction is our priority. If you're not happy with your purchase, we'll make it right.",
    },
    {
      question: "Where is Hair Pinns salon located?",
      answer: "We're at 60 Goorgool Road, Bangor NSW 2234. We see clients from across the Shire — Menai, Illawong, Sutherland, Kirrawee, and surrounding suburbs.",
    },
    {
      question: "Can I book an appointment online?",
      answer: "Yes! Book any time via Fresha. We do colour, smoothing treatments, cuts, and styling. With 762+ five-star reviews, people keep coming back.",
    },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>Hair Pinns | Salon Hair Care | Free Shipping Over $150</title>
        <meta 
          name="description" 
          content="Hair care handpicked by Jena. Salon-quality products shipped to every state and territory. Free shipping over $150. 15+ years experience. Also visit our Bangor salon in Sutherland Shire."
        />
        <link rel="canonical" href="https://hairpinns.com" />
        <meta property="og:title" content="Hair Pinns | Salon Hair Care | Australia-Wide Shipping" />
        <meta property="og:description" content="Hair care handpicked by Jena. Salon-quality products shipped to every state and territory. Free shipping over $150. 15+ years experience. Also visit our Bangor salon in Sutherland Shire." />
        <meta property="og:url" content="https://hairpinns.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('default')} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(knowledgeGraphSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(storeSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(howToBookSchema)}
        </script>
      </Helmet>
      <Header />
      <GoogleReviewBadge variant="micro" showCTA />
      <main id="main-content">
        {/* 1. Hero Section (100% product-focused) */}
        <HeroHome />

        {/* Stocktake Promo Banner */}
        {isStocktakeActive() && (
          <section className="bg-brand-500 text-primary-foreground py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm font-medium">
                Stocktake Sale:{" "}
                <Link to={`/collections/${PROMO_COLLECTIONS.pureLamellar}`} className="underline hover:no-underline font-semibold">
                  20% off Pure Lamellar
                </Link>
                {" • "}
                <Link to={`/collections/${PROMO_COLLECTIONS.wetBrush}`} className="underline hover:no-underline font-semibold">
                  15% off Wet Brush
                </Link>
                {" • Mystery gift with every order • Ends 31 March"}
              </p>
            </div>
          </section>
        )}
        
        {/* 2. Product Count Badge */}
        <section className="py-4 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <ProductCountBadge />
            </div>
          </div>
        </section>
        
        {/* 3. Above Fold Products (6 products visible without scrolling) */}
        {/* ✅ SAFE: Lazy-loaded with Suspense boundary and error handling */}
        <Suspense fallback={
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
                  Shop Our Best Sellers
                </h2>
                <p className="text-lg text-muted-foreground">
                  Loading products...
                </p>
              </div>
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
            </div>
          </section>
        }>
          <AboveFoldProducts />
        </Suspense>
        
        {/* 3. Urgency Bar (sticky top bar) */}
        <UrgencyBar />
        
        {/* 4. Best Sellers (move up - first products visitors see) */}
        <Suspense fallback={
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
                  Our Most Loved Products
                </h2>
                <p className="text-lg text-muted-foreground">
                  Loading...
                </p>
              </div>
            </div>
          </section>
        }>
          <BestSellers />
        </Suspense>
        
        {/* 5. Trust Strip (conversion-focused) */}
        <TrustStrip />
        
        {/* Trust Badges Section */}
        <section className="py-8 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrustBadges />
          </div>
        </section>
        
        {/* 6. Featured Collections (with product count) */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Starting at $24.99 — Browse the brands we love
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link 
                to="/collections/juuce" 
                className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all text-center"
              >
                <h3 className="text-lg font-heading font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Juuce
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Premium hair care essentials
                </p>
                <p className="text-xs text-brand-500 font-semibold">
                  Shop Now →
                </p>
              </Link>
              
              <Link 
                to="/collections/qiqi" 
                className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all text-center"
              >
                <h3 className="text-lg font-heading font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  QIQI
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Smoothing & treatment specialists
                </p>
                <p className="text-xs text-brand-500 font-semibold">
                  Shop Now →
                </p>
              </Link>
              
              <Link 
                to="/collections/pure" 
                className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all text-center"
              >
                <h3 className="text-lg font-heading font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Pure Organic
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Natural, organic hair care
                </p>
                <p className="text-xs text-brand-500 font-semibold">
                  Shop Now →
                </p>
              </Link>
              
              <Link 
                to="/collections/wet-brush" 
                className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all text-center"
              >
                <h3 className="text-lg font-heading font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Wet Brush
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Detangling brushes & tools
                </p>
                <p className="text-xs text-brand-500 font-semibold">
                  Shop Now →
                </p>
              </Link>
            </div>
          </div>
        </section>
        
        {/* 6. Why Shop Hair Pinns (benefits with icons) */}
        <Suspense fallback={null}>
          <WhyShopHairPinns />
        </Suspense>
        
        {/* 7. Social Proof Showcase (reviews + testimonials) */}
        <Suspense fallback={null}>
          <ReviewsShowcase />
        </Suspense>
        
        {/* 9. Product Categories (visual grid with hover effects) */}
        <Suspense fallback={null}>
          <ProductCategories />
        </Suspense>
        
        {/* 10. FAQ Section (reduce purchase anxiety) */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Common questions we get asked
              </p>
            </div>
            
            <div className="space-y-4">
              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  Do you ship products Australia-wide?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Yes! We ship hair care products Australia-wide with free shipping on orders over $150. Everything is handpicked by Jena from her 15+ years in the salon.
                </p>
              </details>
              
              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  Where can I buy salon hair products in Australia?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Hair Pinns ships salon hair care Australia-wide. Free shipping over $150. Handpicked by Jena since 2009. Shop Juuce, QIQI, Pure, Wet Brush and more.
                </p>
              </details>

              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  Do you ship internationally?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  No, we ship to Australia only. Every state and territory — from Darwin to Hobart. We deliver to NSW, VIC, QLD, WA, SA, TAS, NT, and ACT.
                </p>
              </details>

              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  What makes Hair Pinns products different?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Every product is handpicked by Jena, who's been running her salon since 2009. She only stocks products that actually work — nothing from the supermarket aisle.
                </p>
              </details>
              
              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  Do you offer returns?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Yes, we offer hassle-free 14-day returns. Your satisfaction is our priority. If you're not happy with your purchase, we'll make it right.
                </p>
              </details>
              
              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  How quickly will my order ship?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Orders are typically processed within 1-2 business days. We offer free shipping on orders over $150 Australia-wide. Express shipping options are available at checkout.
                </p>
              </details>
              
              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  Are your products salon-quality?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Yep! Everything we stock is salon-quality — the same stuff Jena uses on her clients. She tests every product herself before adding it to the store.
                </p>
              </details>
            </div>
          </div>
        </section>
        
        {/* 11. Shop Australia-Wide (retail-first) */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h2 font-heading font-bold text-heading mb-2">
              We Ship to Every Australian State and Territory
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              From Darwin to Hobart, Melbourne to Perth — salon-quality hair care delivered Australia-wide. Free shipping over {FREE_SHIPPING_THRESHOLD_DISPLAY}.
            </p>
            <Link to="/collections" className="inline-block text-brand-500 font-semibold hover:text-brand-600 transition-colors">
              Shop Hair Products Australia-Wide →
            </Link>
          </div>
        </section>

        {/* 12. Visit Our Salon (local / in-person) */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
                Visit Our Salon in Sutherland Shire
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                Hair Pinns serves clients from across Sutherland Shire with expert hair services and premium products. 
                Whether you're visiting our salon in Bangor or shopping online, we're here to help you achieve your best hair.
              </p>
              <div className="flex items-center justify-center gap-2 text-brand-500 mb-8">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Located in Bangor, NSW | 15+ Years Serving Sutherland Shire Since 2009</span>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-card p-8 md:p-12">
              <h3 className="text-xl font-heading font-semibold text-heading mb-6 text-center">
                Areas We Serve
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                {[
                  { name: 'Bangor', slug: 'bangor' },
                  { name: 'Menai', slug: 'menai' },
                  { name: 'Illawong', slug: 'illawong' },
                  { name: 'Alfords Point', slug: 'alfords-point' },
                  { name: 'Woronora', slug: 'woronora' },
                  { name: 'Sutherland', slug: 'sutherland' },
                  { name: 'Kirrawee', slug: 'kirrawee' },
                  { name: 'Kareela', slug: 'kareela' },
                  { name: 'Como', slug: 'como' },
                  { name: 'Gymea', slug: 'gymea' },
                  { name: 'Miranda', slug: 'miranda' },
                  { name: 'Engadine', slug: 'engadine' },
                  { name: 'Heathcote', slug: 'heathcote' }
                ].map(({ name, slug }) => (
                  <Link
                    key={slug}
                    to={`/near/${slug}`}
                    className="text-muted-foreground hover:text-brand-500 transition-colors"
                  >
                    {name}
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Salon services:{" "}
                  <Link to="/services#smoothing" className="text-brand-500 hover:text-brand-600 font-medium">Smoothing</Link>
                  {" · "}
                  <Link to="/services#foil-packages" className="text-brand-500 hover:text-brand-600 font-medium">Colour</Link>
                  {" · "}
                  <Link to="/services#cut-packages" className="text-brand-500 hover:text-brand-600 font-medium">Cuts</Link>
                </p>
                <p className="text-muted-foreground mb-4">
                  Visit our salon at <strong className="text-heading">60 Goorgool Road, Bangor NSW 2234</strong>
                </p>
                <a
                  href="https://www.google.com/maps/dir//Hair+Pinns,+60+Goorgool+Road,+Bangor+NSW+2234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-brand-500 font-semibold hover:text-brand-600 transition-colors"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* 13. Blog Highlights (reduced prominence) */}
        <div className="py-12 bg-muted/30">
          <Suspense fallback={null}>
            <BlogTrio />
          </Suspense>
        </div>
        
        {/* 14. Local Service CTA (moved to bottom) */}
        <Suspense fallback={null}>
          <BookingBanner />
        </Suspense>
        
        {/* 15. Footer CTA */}
        <Suspense fallback={null}>
          <FooterCTA />
        </Suspense>
      </main>
      <Footer />
      
      {/* Sticky Product Bar (Desktop Only) - Lazy-loaded for performance */}
      <Suspense fallback={null}>
        <StickyProductBar threshold={300} />
      </Suspense>
    </div>
  );
};

export default Index;
