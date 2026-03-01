import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHome from "@/components/home/HeroHome";
import GoogleReviewBadge from "@/components/reviews/GoogleReviewBadge";
import UrgencyBar from "@/components/conversion/UrgencyBar";
import TrustStrip from "@/components/conversion/TrustStrip";
import RecentPurchases from "@/components/conversion/RecentPurchases";
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
  generateFAQPageSchema
} from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";

const Index = () => {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateEnhancedLocalBusinessSchema('https://hairpinns.com');
  const knowledgeGraphSchema = generateKnowledgeGraphSchema();

  // FAQ schema for homepage
  const faqSchema = generateFAQPageSchema([
    {
      question: "Do you ship products Australia-wide?",
      answer: "Yes! We ship premium hair care products Australia-wide with free shipping on orders over $150. All products are salon-quality, curated by Jena with 15+ years of experience.",
    },
    {
      question: "What makes Hair Pinns products different?",
      answer: "Every product is handpicked by Jena, a salon owner with 15+ years of experience since 2009. We only stock salon-quality, professional-grade products that deliver real results - no supermarket quality items.",
    },
    {
      question: "Do you offer returns?",
      answer: "Yes, we offer hassle-free 14-day returns. Your satisfaction is our priority. If you're not happy with your purchase, we'll make it right.",
    },
    {
      question: "Where is Hair Pinns salon located?",
      answer: "Our boutique salon is located at 60 Goorgool Road, Bangor NSW 2234. We serve clients from across Sutherland Shire including Menai, Illawong, Sutherland, Kirrawee, and surrounding suburbs.",
    },
    {
      question: "Can I book an appointment online?",
      answer: "Yes! You can book your appointment 24/7 via Fresha. We offer expert colour, smoothing treatments, precision cuts, and styling services. With 762+ five-star reviews, we're trusted by thousands.",
    },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>Premium Hair Care Products | 762+ Five-Star Reviews | Hair Pinns | Australia-Wide Shipping</title>
        <meta 
          name="description" 
          content="Premium salon-quality hair care products shipped Australia-wide. 15+ years experience since 2009. 762+ Fresha reviews, 53+ Google reviews. Expert curation from Bangor, NSW. Free shipping over $150. Serving Sutherland Shire." 
        />
        <link rel="canonical" href="https://hairpinns.com" />
        <meta property="og:title" content="Premium Hair Care Products | Hair Pinns | Australia-Wide Shipping" />
        <meta property="og:description" content="Salon-quality products curated by Jena since 2009. 762+ five-star Fresha reviews. 53+ Google reviews. Free shipping over $150. Serving Sutherland Shire & Australia-wide." />
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
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <Header />
      <GoogleReviewBadge variant="micro" showCTA />
      <main>
        {/* 1. Hero Section (100% product-focused) */}
        <HeroHome />
        
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
        
        {/* 5.5 Recent Purchases (social proof) */}
        <section className="py-6 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecentPurchases />
          </div>
        </section>
        
        {/* 5.6 Trust Badges Section */}
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
                Starting at $24.99 — Discover our most popular product collections, handpicked for you
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
                Everything you need to know about shopping with Hair Pinns
              </p>
            </div>
            
            <div className="space-y-4">
              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  Do you ship products Australia-wide?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Yes! We ship premium hair care products Australia-wide with free shipping on orders over $150. All products are salon-quality, curated by Jena with 15+ years of experience.
                </p>
              </details>
              
              <details className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-heading cursor-pointer text-lg mb-2">
                  What makes Hair Pinns products different?
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Every product is handpicked by Jena, a salon owner with 15+ years of experience since 2009. We only stock salon-quality, professional-grade products that deliver real results - no supermarket quality items.
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
                  Absolutely! Every product in our collection is professional-grade, the same quality you'd find in top salons. Jena personally tests and approves every product before it's added to our store.
                </p>
              </details>
            </div>
          </div>
        </section>
        
        {/* 11. Local SEO Content Section (moved lower) */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
                Serving All Sutherland Shire Suburbs
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
                  'Bangor', 'Menai', 'Illawong', 'Alfords Point', 'Woronora', 
                  'Sutherland', 'Kirrawee', 'Kareela', 'Como', 'Gymea', 
                  'Miranda', 'Engadine', 'Heathcote'
                ].map((suburb) => (
                  <div key={suburb} className="text-muted-foreground hover:text-brand-500 transition-colors">
                    {suburb}
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
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
        
        {/* 11. Blog Highlights (reduced prominence) */}
        <div className="py-12 bg-muted/30">
          <Suspense fallback={null}>
            <BlogTrio />
          </Suspense>
        </div>
        
        {/* 12. Local Service CTA (moved to bottom) */}
        <Suspense fallback={null}>
          <BookingBanner />
        </Suspense>
        
        {/* 13. Footer CTA */}
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
