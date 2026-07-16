import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import HeroHome from "@/components/home/HeroHome";
import HeroSocialProofBar from "@/components/home/HeroSocialProofBar";
import SectionNumber from "@/components/design-system/SectionNumber";
import useScrollReveal from "@/hooks/useScrollReveal";
import SEOHead from "@/components/SEOHead";

const Footer = lazy(() => import("@/components/Footer"));
const StickyBookBar = lazy(() => import("@/components/home/StickyBookBar"));

// Below-fold sections (lazy-loaded for performance)
const ShopByConcern = lazy(() => import("@/components/home/ShopByConcern"));
const BestSellers = lazy(() => import("@/components/home/BestSellers"));
const BlogTrio = lazy(() => import("@/components/home/BlogTrio"));
const BookingBanner = lazy(() => import("@/components/home/BookingBanner"));
const JenaPromise = lazy(() => import("@/components/home/JenaPromise"));

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
  return /HairPinnsPrerender/i.test(navigator.userAgent || "");
};

const DeferredSection = ({
  children,
  fallback = null,
  className = "",
  rootMargin = "250px 0px",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  rootMargin?: string;
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
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={ref}
      className={`${isVisible ? "" : "min-h-px"} ${className}`.trim()}
    >
      {isVisible ? children : fallback}
    </div>
  );
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

        {/* 3. Shop by concern — fast intent routing before the product grid */}
        <DeferredSection
          rootMargin="0px"
          fallback={<div className="h-24" aria-hidden="true" />}
        >
          <Suspense fallback={null}>
            <ShopByConcern />
          </Suspense>
        </DeferredSection>

        {/* 4. Best Sellers — live Shopify inventory and quick add */}
        <DeferredSection
          className="reveal"
          fallback={
            <section
              className="bg-[hsl(var(--after-hours-paper))] py-16 sm:py-20 lg:py-28"
              aria-label="Loading Jena’s product shelf"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-t border-[hsl(var(--after-hours-plum)/0.18)] pt-6">
                  <p className="mb-5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">
                    02 / Jena’s shelf
                  </p>
                  <div className="h-12 w-3/4 max-w-xl animate-pulse bg-[hsl(var(--after-hours-plum)/0.1)]" />
                </div>
              </div>
            </section>
          }
        >
          <Suspense fallback={null}>
            <BestSellers />
          </Suspense>
        </DeferredSection>

        {/* 5. Product selection credibility */}
        <DeferredSection fallback={null}>
          <Suspense fallback={null}>
            <JenaPromise />
          </Suspense>
        </DeferredSection>

        {/* 6. Product advice and education */}
        <SectionNumber index="04" label="read, learn, ask" />
        <DeferredSection className="reveal py-12 bg-muted/30" fallback={null}>
          <Suspense fallback={null}>
            <BlogTrio />
          </Suspense>
        </DeferredSection>

        {/* 7. Contained salon path — kept deliberately near the close */}
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
      <Suspense fallback={null}>
        <StickyBookBar />
      </Suspense>
    </div>
  );
};

export default Index;
