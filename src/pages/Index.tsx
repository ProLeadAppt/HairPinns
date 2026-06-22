import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import HeroHome from "@/components/home/HeroHome";
import HeroSocialProofBar from "@/components/home/HeroSocialProofBar";
import SectionNumber from "@/components/design-system/SectionNumber";
import useScrollReveal from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";

const Footer = lazy(() => import("@/components/Footer"));
const StickyBookBar = lazy(() => import("@/components/home/StickyBookBar"));
const ShampooConditionerPromo = lazy(() => import("@/components/home/ShampooConditionerPromo"));

// Below-fold sections (lazy-loaded for performance)
const BestSellers = lazy(() => import("@/components/home/BestSellers"));
const ReviewsShowcase = lazy(() => import("@/components/home/ReviewsShowcase"));
const BlogTrio = lazy(() => import("@/components/home/BlogTrio"));
const BookingBanner = lazy(() => import("@/components/home/BookingBanner"));
const JenaPromise = lazy(() => import("@/components/home/JenaPromise"));
const BeforeAfterShowcase = lazy(() => import("@/components/home/BeforeAfterShowcase"));

import {
  generateOrganizationSchema,
  generateEnhancedLocalBusinessSchema,
  generateKnowledgeGraphSchema,
  generateFAQPageSchema,
  generateStoreSchema,
  generateWebPageSchema,
  generateHowToSchema,
  generateAuthorSchema,
  generateWebSiteSchema,
  generateBlogItemListSchema,
} from "@/lib/schema";
import { homeFeaturedGuides } from "@/data/homeFeaturedGuides";
import { getOGImage } from "@/lib/sitemap";
import { googleReviews } from "@/data/reviews";

const isPrerenderOrHeadless = () => {
  if (typeof navigator === "undefined") return true;
  return /HeadlessChrome|HairPinnsPrerender/i.test(navigator.userAgent || "");
};

const DeferredSection = ({
  children,
  fallback = null,
  className = "",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isPrerenderOrHeadless());

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return <div ref={ref} className={className}>{isVisible ? children : fallback}</div>;
};

const Index = () => {
  const mainRef = useScrollReveal();
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateEnhancedLocalBusinessSchema('https://hairpinns.com', googleReviews);
  const knowledgeGraphSchema = generateKnowledgeGraphSchema();
  const storeSchema = generateStoreSchema();
  const authorSchema = generateAuthorSchema();
  const webSiteSchema = generateWebSiteSchema();

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

  const popularGuidesSchema = generateBlogItemListSchema(
    homeFeaturedGuides.map((post) => ({
      name: post.title,
      url: `/blog/${post.slug}`,
    }))
  );

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

  const schemas = useMemo(
    () => [
      webSiteSchema,
      organizationSchema,
      localBusinessSchema,
      knowledgeGraphSchema,
      storeSchema,
      faqSchema,
      webPageSchema,
      howToBookSchema,
      authorSchema,
      popularGuidesSchema,
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Hair Pinns — Hair Care from Someone Who Actually Does Hair",
        "description": "Jena Pinn, Bangor salon owner since 2009, shares the products she uses on clients. Shipped Australia-wide.",
        "thumbnailUrl": [
          "https://hairpinns.com/hero-poster.avif",
          "https://hairpinns.com/og-default.jpg"
        ],
        "uploadDate": "2026-06-22",
        "contentUrl": "https://hairpinns.com/hero-reel.mp4",
        "embedUrl": "https://hairpinns.com/",
        "duration": "PT10S",
        "width": 1920,
        "height": 1080,
        "isAccessibleForFree": true,
        "inLanguage": "en-AU",
        "publisher": {
          "@type": "Organization",
          "name": "Hair Pinns",
          "logo": {
            "@type": "ImageObject",
            "url": "https://hairpinns.com/logo.png"
          }
        }
      },
    ],
    [
      webSiteSchema,
      organizationSchema,
      localBusinessSchema,
      knowledgeGraphSchema,
      storeSchema,
      faqSchema,
      webPageSchema,
      howToBookSchema,
      authorSchema,
      popularGuidesSchema,
    ]
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead
        title="Hair Pinns | Hair Care by Jena | Free Shipping Over $150"
        description="Hair care picked by Jena. The same products I use on my clients, shipped anywhere in Australia. Free shipping over $150. Based in Bangor, Sutherland Shire."
        canonical="https://hairpinns.com"
        ogImage={getOGImage('default')}
        ogType="website"
        schemaJson={schemas}
      />
      <Header />
      <main id="main-content" tabIndex={-1} ref={mainRef as any}>

        {/* 1. Hero */}
        <HeroHome />

        {/* 2. Trust bar — 3 quiet signals, lots of air */}
        <HeroSocialProofBar />

        {/* 3. Active offer */}
        <DeferredSection fallback={null}>
          <Suspense fallback={null}>
            <ShampooConditionerPromo />
          </Suspense>
        </DeferredSection>

        {/* 4. The Jena Promise */}
        <Suspense fallback={null}>
          <JenaPromise />
        </Suspense>

        {/* 5. Best Sellers */}
        <DeferredSection
          className="reveal"
          fallback={
            <section className="py-12 bg-background">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">Best Sellers</h2>
                  <p className="text-lg text-muted-foreground">Loading...</p>
                </div>
              </div>
            </section>
          }
        >
          <Suspense fallback={null}>
            <BestSellers />
          </Suspense>
        </DeferredSection>

        {/* 6. In the chair — before/after styling showcase */}
        <DeferredSection fallback={null}>
          <Suspense fallback={null}>
            <BeforeAfterShowcase />
          </Suspense>
        </DeferredSection>

        {/* 7. Reviews */}
        <DeferredSection className="reveal" fallback={null}>
          <Suspense fallback={null}>
            <ReviewsShowcase />
          </Suspense>
        </DeferredSection>

        {/* 8. From the blog */}
        <SectionNumber index="04" label="read, learn, ask" />
        <DeferredSection className="reveal py-12 bg-muted/30" fallback={null}>
          <Suspense fallback={null}>
            <BlogTrio />
          </Suspense>
        </DeferredSection>

        {/* 9. Book with Jena */}
        <DeferredSection fallback={null}>
          <Suspense fallback={null}>
            <BookingBanner />
          </Suspense>
        </DeferredSection>

      </main>
      <DeferredSection fallback={null}>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={null}>
        <Suspense fallback={null}>
          <StickyBookBar />
        </Suspense>
      </DeferredSection>
    </div>
  );
};

export default Index;
