import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHome from "@/components/home/HeroHome";
import GoogleReviewBadge from "@/components/reviews/GoogleReviewBadge";
import useScrollReveal from "@/hooks/useScrollReveal";

// Below-fold sections (lazy-loaded for performance)
const BestSellers = lazy(() => import("@/components/home/BestSellers"));
const WhyShopHairPinns = lazy(() => import("@/components/home/WhyShopHairPinns"));
const ReviewsShowcase = lazy(() => import("@/components/home/ReviewsShowcase"));
const ProductCategories = lazy(() => import("@/components/home/ProductCategories"));
const BlogTrio = lazy(() => import("@/components/home/BlogTrio"));
const BookingBanner = lazy(() => import("@/components/home/BookingBanner"));

import {
  generateOrganizationSchema,
  generateEnhancedLocalBusinessSchema,
  generateKnowledgeGraphSchema,
  generateFAQPageSchema,
  generateStoreSchema,
  generateWebPageSchema,
  generateHowToSchema,
  generateAuthorSchema
} from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";

const Index = () => {
  const mainRef = useScrollReveal();
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateEnhancedLocalBusinessSchema('https://hairpinns.com');
  const knowledgeGraphSchema = generateKnowledgeGraphSchema();
  const storeSchema = generateStoreSchema();
  const authorSchema = generateAuthorSchema();

  const webPageSchema = generateWebPageSchema({
    name: "Hair Pinns - Hair Care by Jena",
    description: "Hair care picked by Jena. The same products I use on my clients, shipped anywhere in Australia. Free shipping over $150.",
    url: "https://hairpinns.com",
    speakable: { cssSelector: [".speakable-hero-intro"] },
  });

  const howToBookSchema = generateHowToSchema({
    name: "How to Book an Appointment at Hair Pinns",
    description: "Book your hair appointment at Hair Pinns Bangor salon in a few steps. Available 24/7 via Fresha.",
    step: [
      { name: "Visit booking page", text: "Go to hairpinns.com/booking or our Fresha page to start your booking" },
      { name: "Select service", text: "Choose your preferred service: Colour, Smoothing Treatment, or Cuts and Styling" },
      { name: "Choose date and time", text: "Pick an available date and time that suits you" },
      { name: "Confirm booking", text: "Enter your details and confirm your appointment. You'll receive a confirmation" },
    ],
    totalTime: "PT2M",
  });

  const faqSchema = generateFAQPageSchema([
    {
      question: "Do you ship products Australia-wide?",
      answer: "Yep, I ship to every state and territory. Free shipping on orders over $150. I pack everything from the salon myself.",
    },
    {
      question: "Where can I buy salon hair products in Australia?",
      answer: "Right here. Hair Pinns ships anywhere in Australia with free shipping over $150. I stock Juuce, QIQI, Pure, Wet Brush, Aromaganic and more.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Not at the moment, just Australia. Every state and territory though, from Darwin to Hobart.",
    },
    {
      question: "What makes Hair Pinns products different?",
      answer: "I only stock products I actually use on my clients. I've been doing hair since 2009, so if something doesn't work, it doesn't make the shelf.",
    },
    {
      question: "Do you offer returns?",
      answer: "Yep. 14-day returns, no drama. If it's not right for your hair, send it back and we'll sort it out.",
    },
    {
      question: "Where is Hair Pinns salon located?",
      answer: "We're at 60 Goorgool Road, Bangor NSW 2234. I see clients from all over the Shire, including Menai, Illawong, Sutherland, Kirrawee and surrounding suburbs.",
    },
    {
      question: "Can I book an appointment online?",
      answer: "Yep, you can book any time through Fresha. I do colour, smoothing treatments, cuts and styling. Over 762 five-star reviews and counting.",
    },
  ]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>Hair Pinns | Hair Care by Jena | Free Shipping Over $150</title>
        <meta
          name="description"
          content="Hair care picked by Jena. The same products I use on my clients, shipped anywhere in Australia. Free shipping over $150. Based in Bangor, Sutherland Shire."
        />
        <link rel="canonical" href="https://hairpinns.com" />
        <meta property="og:title" content="Hair Pinns | Hair Care by Jena | Free Shipping Over $150" />
        <meta property="og:description" content="Hair care picked by Jena. The same products I use on my clients, shipped anywhere in Australia. Free shipping over $150." />
        <meta property="og:url" content="https://hairpinns.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('default')} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com" />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(knowledgeGraphSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(storeSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToBookSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(authorSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": "Hair Pinns — Hair Care by Jena",
          "description": "Hair care from someone who actually does hair. Jena Pinn, Bangor salon, shipping nationwide.",
          "thumbnailUrl": "https://hairpinns.com/hero-poster.avif",
          "uploadDate": "2026-01-01",
          "contentUrl": "https://hairpinns.com/hero-reel.mp4"
        })}</script>
      </Helmet>
      <Header />
      <GoogleReviewBadge variant="micro" showCTA />
      <main id="main-content" ref={mainRef as any}>
        {/* 1. Hero */}
        <HeroHome />

        {/* 2. Best Sellers */}
        <div className="reveal">
          <Suspense fallback={
            <section className="py-12 bg-background">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">Best Sellers</h2>
                  <p className="text-lg text-muted-foreground">Loading the good stuff...</p>
                </div>
              </div>
            </section>
          }>
            <BestSellers />
          </Suspense>
        </div>

        {/* 3. Shop by Brand */}
        <div className="reveal">
          <Suspense fallback={null}>
            <ProductCategories />
          </Suspense>
        </div>

        {/* 4. Why Shop with Me */}
        <div className="reveal">
          <Suspense fallback={null}>
            <WhyShopHairPinns />
          </Suspense>
        </div>

        {/* 5. Reviews */}
        <div className="reveal">
          <Suspense fallback={null}>
            <ReviewsShowcase />
          </Suspense>
        </div>

        {/* 6. From the Blog */}
        <div className="reveal py-12 bg-muted/30">
          <Suspense fallback={null}>
            <BlogTrio />
          </Suspense>
        </div>

        {/* 7. Book with Jena */}
        <Suspense fallback={null}>
          <BookingBanner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
