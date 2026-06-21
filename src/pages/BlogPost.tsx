import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import useScrollReveal from "@/hooks/useScrollReveal";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProductModule from "@/components/blog/ProductModule";
import LeadMagnetBox from "@/components/blog/LeadMagnetBox";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import BlogCTA from "@/components/blog/BlogCTA";
import ProgressBar from "@/components/blog/ProgressBar";
import RelatedPosts from "@/components/blog/RelatedPosts";
import AuthorBio from "@/components/blog/AuthorBio";
import SocialShareBar from "@/components/blog/SocialShareBar";
import QuickAnswer from "@/components/blog/QuickAnswer";
import KeyTakeaways from "@/components/blog/KeyTakeaways";
import { getOGImage } from "@/lib/sitemap";
import RelatedContent from "@/components/RelatedContent";
import { topicsForBlogPost } from "@/data/topicMap";
import { renderInlineLinks } from "@/lib/renderInlineLinks";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";
import {
  generateOrganizationSchema,
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateArticleSchema,
  generateQAPageSchema,
  generateJenaPersonSchema,
} from "@/lib/schema";

export const BlogPostTemplate = ({ post }: { post: any }) => {
  // Wire the IntersectionObserver that flips `.reveal` → `.reveal.visible`.
  // Without this, every `<div className="reveal">` in this template renders
  // at opacity:0 and never appears — silently hiding every blog body section.
  const revealRef = useScrollReveal();

  // Archived posts are 301'd to the live destination (collections page or homepage).
  // Doing it client-side via <Navigate> keeps the URL change observable and avoids
  // letting search engines index dead/seasonal content like the Christmas gift pack post.
  if (post.archived && post.redirectTo) {
    return <Navigate to={post.redirectTo} replace />;
  }

  const wordCount = 
    post.content.introduction.split(/\s+/).filter((word) => word.length > 0).length +
    post.content.sections.reduce((total, section) => 
      total + section.content.split(/\s+/).filter((word) => word.length > 0).length, 0
    );

  const organizationSchema = generateOrganizationSchema();
  const blogPostSchema = generateBlogPostSchema({
    title: post.title,
    description: post.excerpt,
    author: post.author,
    datePublished: new Date(post.date).toISOString(),
    image: post.image,
    url: `https://hairpinns.com/blog/${post.slug}`,
    wordCount: wordCount,
  });

  // Enhanced Article schema with speakable for AI SEO
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    author: post.author,
    datePublished: new Date(post.date).toISOString(),
    image: post.image,
    url: `https://hairpinns.com/blog/${post.slug}`,
    wordCount: wordCount,
    speakable: {
      // `.post-intro` is the lede paragraph (always present); .quick-answer is
      // present on posts with a featured-snippet block. h2/h3 give voice
      // assistants a fallback when the body has structure but no intro paragraph.
      cssSelector: [".post-intro", ".quick-answer", "h2", "h3"],
    },
  });

  // QAPage schema if quickAnswer exists
  const qaSchema = post.content.quickAnswer
    ? generateQAPageSchema({
        question: post.content.quickAnswer.question,
        answer: post.content.quickAnswer.answer,
        author: post.author,
        datePublished: new Date(post.date).toISOString(),
      })
    : null;

  // Generic fallback FAQs shown visibly on posts that don't yet have their own
  // faqSection. NOT emitted as schema — duplicate FAQPage JSON-LD across 57
  // posts would trigger Google's spam heuristics. Backfill `faqSection` on
  // individual posts to get per-post FAQ rich results.
  const defaultBlogFaqs = [
    {
      question: "What's the best treatment for frizz in humid Sydney weather?",
      answer: "A keratin-free smoothing treatment paired with a humidity-resistant leave-in works best for Sydney's changeable climate. Start with a gentle, sulphate-free wash, add a protein-balanced mask weekly, then seal with a heat-activated protectant before blow-drying."
    },
    {
      question: "How often should I tone blonde hair at home?",
      answer: "Every 1–2 weeks for maintenance, using a pH-balanced violet or blue-violet treatment, depending on your undertone. Keep dwell time short (3–5 mins) to avoid over-ash. Follow with a hydrating mask because toners can be slightly drying."
    },
    {
      question: "Keratin vs. smoothing: which lasts longer?",
      answer: "Keratin treatments (formaldehyde-free) generally outlast quick smoothing services, giving 2–4 months of frizz reduction with proper care. Smoothing services are gentler and great for first-timers or colour-treated hair, lasting 4–8 weeks."
    },
  ];

  const visibleFaqs = post.content.faqSection ?? defaultBlogFaqs;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://hairpinns.com' },
    { name: 'Blog', url: 'https://hairpinns.com/blog' },
    { name: post.title, url: `https://hairpinns.com/blog/${post.slug}` },
  ]);

  // Only emit FAQPage schema when the post has its OWN per-post FAQs. Emitting
  // the same generic FAQPage on every post would be flagged as duplicate content.
  const faqSchema = post.content.faqSection
    ? generateFAQPageSchema(post.content.faqSection)
    : null;
  const currentUrl = `https://hairpinns.com/blog/${post.slug}`;

  const personSchema =
    post.author === "Jena Pinn" ? generateJenaPersonSchema() : null;

  const schemas = [
    organizationSchema,
    blogPostSchema,
    breadcrumbSchema,
    articleSchema,
    ...(faqSchema ? [faqSchema] : []),
    ...(qaSchema ? [qaSchema] : []),
    ...(personSchema ? [personSchema] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | Hair Pinns Blog`}
        description={post.excerpt}
        canonical={currentUrl}
        ogImage={post.image}
        ogType="article"
        hrefLang="en-AU"
        schemaJson={schemas}
      />

      <ProgressBar />
      <Header />
      
      <main id="main-content" tabIndex={-1} ref={revealRef as any}>
        {/* Hero Section - Overlay Style */}
        <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          <picture>
            <source
              type="image/webp"
              srcSet={[
                640,
                960,
                1200,
                1600,
              ].map((width) => `${shopifyImageWebp(post.image, width)} ${width}w`).join(", ")}
              sizes="100vw"
            />
            <img
              src={shopifyImage(post.image, 1600)}
              srcSet={[
                640,
                960,
                1200,
                1600,
              ].map((width) => `${shopifyImage(post.image, width)} ${width}w`).join(", ")}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1600"
              height="900"
              sizes="100vw"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-heading/90 via-heading/50 to-transparent" />
          
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-brand-600 font-bold text-sm mb-4">
                {post.category}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight max-w-4xl">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-white/90">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title }
            ]}
          />
        </div>

        {/* Article Content */}
        <article className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Answer Box - AI SEO Optimization */}
          {post.content.quickAnswer && (
            <div className="quick-answer">
              <QuickAnswer
                question={post.content.quickAnswer.question}
                answer={post.content.quickAnswer.answer}
              />
            </div>
          )}

          {/* Introduction with drop cap effect */}
          <p className="post-intro text-xl leading-relaxed text-text mb-8 first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:text-brand-500 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
            {renderInlineLinks(post.content.introduction)}
          </p>

          {/* Content Sections */}
          {post.content.sections.map((section, index) => (
            <div key={index} className="reveal mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-heading mb-6 mt-12">
                {section.heading}
              </h2>
              <div className="h-1 w-20 bg-brand-500 mb-6" />
              
              <p className="text-lg leading-relaxed text-text">
                {renderInlineLinks(section.content)}
              </p>

              {/* Insert Product Module after 3rd section */}
              {index === 2 && post.content.productModule && (
                <ProductModule 
                  title={post.content.productModule.title}
                  products={post.content.productModule.products}
                />
              )}

              {/* Insert Lead Magnet after 5th section */}
              {index === 4 && <LeadMagnetBox />}

              {/* Insert CTA after 2nd section if available */}
              {index === 1 && post.cta && (
                <BlogCTA 
                  type={post.cta.type}
                  servicePath={post.cta.servicePath}
                  productPath={post.cta.productPath}
                  customText={post.cta.customText}
                />
              )}
            </div>
          ))}

          {/* Key Takeaways - AI SEO Optimization */}
          {post.content.keyTakeaways && post.content.keyTakeaways.length > 0 && (
            <KeyTakeaways items={post.content.keyTakeaways} />
          )}

          {/* Final CTA before FAQ */}
          {post.cta && (
            <BlogCTA 
              type={post.cta.type}
              servicePath={post.cta.servicePath}
              productPath={post.cta.productPath}
              customText={post.cta.customText}
            />
          )}

          {/* FAQ Section */}
          <div className="reveal mt-16 pt-12 border-t border-border">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-heading mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {visibleFaqs.map((faq, index) => (
                <div key={index} className="bg-accent/5 rounded-card p-6 border border-accent/20">
                  <h3 className="font-heading font-semibold text-xl text-heading mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-text leading-relaxed mb-4">
                    {faq.answer}
                  </p>
                  <FaqFeedbackWidget question={faq.question} />
                </div>
              ))}
            </div>
          </div>

          {/* Author bio — E-E-A-T anchor matching the Person JSON-LD */}
          <AuthorBio />

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to All Articles
            </Link>
          </div>
        </article>

        {/* Related Posts (same category) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <RelatedPosts currentSlug={post.slug} />
        </div>

        {/* Related services / collections (topic cluster) */}
        <RelatedContent
          topics={topicsForBlogPost(post.slug).map((t) => t.slug)}
          show={["service", "collection"]}
          heading="Related services & products"
        />
      </main>

      <SocialShareBar url={currentUrl} title={post.title} />
      <Footer />
    </div>
  );
};

const blogPostLoaders = import.meta.glob("/src/data/blog-posts/*.tsx");

const BlogPost = () => {
  const { slug } = useParams();
  const loaderKey = slug ? `/src/data/blog-posts/${slug}.tsx` : null;
  const loader = loaderKey ? blogPostLoaders[loaderKey] : null;
  const [PostComponent, setPostComponent] = useState<null | ((props: any) => JSX.Element)>(null);
  const [loadError, setLoadError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    setPostComponent(null);
    setLoadError(null);

    if (!loader) return;

    loader()
      .then((mod: any) => {
        if (!cancelled) {
          setPostComponent(() => mod.default);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(`[BlogPost] Failed to load post module for ${loaderKey}:`, error);
          setLoadError(error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loader, loaderKey]);

  if (!loader) {
    return <Navigate to="/404" replace />;
  }

  if (loadError) {
    return <Navigate to="/404" replace />;
  }

  if (!PostComponent) {
    return <div className="min-h-screen bg-background" aria-label="Loading" />;
  }

  return <PostComponent />;
};

export default BlogPost;
