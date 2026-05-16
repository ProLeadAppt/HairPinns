import { Link, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, CheckCircle2, Users, ArrowRight, Heart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import StickyBooking from "@/components/conversion/StickyBooking";
import TrustStrip from "@/components/conversion/TrustStrip";
import ReviewStrip from "@/components/reviews/ReviewStrip";
import GoogleReviewBadge from "@/components/reviews/GoogleReviewBadge";
import { generateEnhancedServiceSchema, generateBreadcrumbSchema, generateFAQPageSchema, generateHowToSchema, generateWebPageSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { serviceDetailData } from "@/data/serviceDetails";
import RelatedContent from "@/components/RelatedContent";
import { topicsForService } from "@/data/topicMap";

const ServiceDetail = () => {
  const { categorySlug, serviceSlug } = useParams<{ categorySlug: string; serviceSlug: string }>();
  
  // Find the service data
  const categoryData = serviceDetailData.find(cat => cat.slug === categorySlug);
  const serviceData = categoryData?.services.find(svc => svc.slug === serviceSlug);

  // If no service found, redirect to services page
  if (!serviceData || !categoryData) {
    return <Navigate to="/services" replace />;
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: categoryData.title, href: `/services#${categorySlug}` },
    { label: serviceData.title }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems.map((item, index) => ({
    name: item.label,
    url: item.href ? `https://hairpinns.com${item.href}` : `https://hairpinns.com/services/${categorySlug}/${serviceSlug}`
  })));

  // Parse "A$ 324" or "$324" → "324" for schema. Currency comes from data.
  const numericPrice = serviceData.price?.replace(/[^\d.]/g, '') || undefined;

  const serviceSchema = generateEnhancedServiceSchema({
    name: serviceData.title,
    description: serviceData.description,
    url: `https://hairpinns.com/services/${categorySlug}/${serviceSlug}`,
    ...(numericPrice && { price: numericPrice, priceCurrency: 'AUD' }),
    ...(serviceData.duration && { duration: serviceData.duration }),
  });

  const faqSchema = serviceData.faqs?.length
    ? generateFAQPageSchema(serviceData.faqs)
    : null;

  const parseDurationToISO = (dur: string | undefined): string | undefined => {
    if (!dur) return undefined;
    const hMatch = dur.match(/(\d+)h/);
    const mMatch = dur.match(/(\d+)min/);
    const h = hMatch ? parseInt(hMatch[1], 10) : 0;
    const m = mMatch ? parseInt(mMatch[1], 10) : 0;
    const parts = [];
    if (h) parts.push(`${h}H`);
    if (m) parts.push(`${m}M`);
    return parts.length ? `PT${parts.join("")}` : undefined;
  };

  const howToSchema = serviceData.process?.length
    ? generateHowToSchema({
        name: `${serviceData.title} - What to Expect`,
        description: serviceData.description,
        step: serviceData.process.map((p) => ({ name: p.step, text: p.description })),
        totalTime: parseDurationToISO(serviceData.duration),
      })
    : null;

  const webPageSchema = generateWebPageSchema({
    name: serviceData.title,
    description: serviceData.metaDescription,
    url: `https://hairpinns.com/services/${categorySlug}/${serviceSlug}`,
    speakable: serviceData.quickAnswer ? { cssSelector: [".speakable-quick-answer"] } : undefined,
  });

  const schemas = [
    serviceSchema,
    breadcrumbSchema,
    ...(faqSchema ? [faqSchema] : []),
    ...(howToSchema ? [howToSchema] : []),
    webPageSchema,
  ];

  return (
    <div className="min-h-screen bg-bg">
      <SEOHead
        title={`${serviceData.title} | Hair Pinns Bangor NSW`}
        description={serviceData.metaDescription}
        canonical={`https://hairpinns.com/services/${categorySlug}/${serviceSlug}`}
        ogImage={getOGImage('service')}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />

      <Header />
      <GoogleReviewBadge variant="micro" showCTA />
      <TrustStrip />
      <StickyBooking />

      <main id="main-content" tabIndex={-1}>
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FBF7FD] via-bg to-[#F5EFF8]"></div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-brand-500 tracking-wide uppercase mb-3">
                {categoryData.title}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6" style={{ color: 'hsl(var(--heading))', letterSpacing: '-0.5px', lineHeight: '1.1' }}>
                {serviceData.title}
              </h1>
              {serviceData.quickAnswer && (
                <p className="speakable-quick-answer text-lg md:text-xl mb-6 max-w-3xl mx-auto font-medium" style={{ color: 'hsl(var(--text))', lineHeight: '1.6', opacity: 0.95 }}>
                  {serviceData.quickAnswer}
                </p>
              )}
              <p className="text-xl md:text-2xl mb-8" style={{ color: 'hsl(var(--text))', lineHeight: '1.6', opacity: 0.9 }}>
                {serviceData.tagline}
              </p>

              {/* Key Info Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {serviceData.duration && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(139,74,139,0.15)]">
                    <Clock className="w-4 h-4 text-brand-500" />
                    <span className="text-sm font-medium" style={{ color: 'hsl(var(--text))' }}>{serviceData.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[rgba(139,74,139,0.15)]">
                  <DollarSign className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-medium" style={{ color: 'hsl(var(--text))' }}>{serviceData.price}</span>
                </div>
              </div>

              {/* Hero CTA */}
              <a 
                href={BOOK_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackBookingClick(`service_detail_hero_${serviceSlug}`, `/services/${categorySlug}/${serviceSlug}`)}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-150 hover:scale-105"
                  style={{ borderRadius: 'var(--radius-btn)', background: 'hsl(var(--brand-500))' }}
                >
                  <Calendar className="w-5 h-5" />
                  {BOOK_CTA_LABEL}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* What's Included */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-6 h-6 text-brand-500" />
                <h2 className="text-2xl font-heading font-bold" style={{ color: 'hsl(var(--heading))' }}>
                  What's Included
                </h2>
              </div>
              <ul className="space-y-3">
                {serviceData.whatsIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span style={{ color: 'hsl(var(--text))', lineHeight: '1.6' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who It's For */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-brand-500" />
                <h2 className="text-2xl font-heading font-bold" style={{ color: 'hsl(var(--heading))' }}>
                  Who It's For
                </h2>
              </div>
              <ul className="space-y-3">
                {serviceData.whoItsFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span style={{ color: 'hsl(var(--text))', lineHeight: '1.6' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What to Expect */}
          <div className="mb-16">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center" style={{ color: 'hsl(var(--heading))' }}>
              What to Expect
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {serviceData.process.map((step, index) => (
                <div 
                  key={index} 
                  className="relative p-6 rounded-card bg-white border border-[rgba(139,74,139,0.10)]"
                  style={{ boxShadow: 'var(--shadow)' }}
                >
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-2 mt-2" style={{ color: 'hsl(var(--heading))' }}>
                    {step.step}
                  </h3>
                  <p style={{ color: 'hsl(var(--text))', lineHeight: '1.6', opacity: 0.9 }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          {serviceData.benefits && serviceData.benefits.length > 0 && (
            <div className="mb-16 p-8 rounded-card bg-gradient-to-br from-[#FBF7FD] to-[#F5EFF8]">
              <h2 className="text-3xl font-heading font-bold mb-6 text-center" style={{ color: 'hsl(var(--heading))' }}>
                Benefits
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {serviceData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span style={{ color: 'hsl(var(--text))', lineHeight: '1.6' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing CTA */}
          <div className="text-center py-12 px-6 rounded-card bg-white border-2 border-brand-500/20 mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4" style={{ color: 'hsl(var(--heading))' }}>
              Ready to Transform Your Hair?
            </h2>
            <p className="text-xl mb-2" style={{ color: 'hsl(var(--text))' }}>
              Starting from <span className="font-bold text-brand-500">{serviceData.price}</span>
            </p>
            <p className="text-sm mb-6" style={{ color: 'hsl(var(--text))', opacity: 0.7 }}>
              {serviceData.duration && `Approximately ${serviceData.duration}`}
            </p>
            <a 
              href={BOOK_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackBookingClick(`service_detail_pricing_${serviceSlug}`, `/services/${categorySlug}/${serviceSlug}`)}
            >
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-150 hover:scale-105"
                style={{ borderRadius: 'var(--radius-btn)', background: 'hsl(var(--brand-500))' }}
              >
                <Calendar className="w-5 h-5" />
                Book Your Appointment
              </Button>
            </a>
          </div>

          {/* FAQs */}
          {serviceData.faqs && serviceData.faqs.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-heading font-bold mb-8 text-center" style={{ color: 'hsl(var(--heading))' }}>
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {serviceData.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="border border-[rgba(139,74,139,0.10)] rounded-card px-6 bg-white"
                    style={{ boxShadow: 'var(--shadow)' }}
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-4" style={{ color: 'hsl(var(--heading))' }}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4" style={{ color: 'hsl(var(--text))', lineHeight: '1.6' }}>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Related Services */}
          {serviceData.relatedServices && serviceData.relatedServices.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-heading font-bold mb-8 text-center" style={{ color: 'hsl(var(--heading))' }}>
                You Might Also Like
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {serviceData.relatedServices.map((relatedSlug, index) => {
                  // Find the related service
                  let relatedService = null;
                  let relatedCategory = null;
                  for (const cat of serviceDetailData) {
                    const found = cat.services.find(s => s.slug === relatedSlug);
                    if (found) {
                      relatedService = found;
                      relatedCategory = cat;
                      break;
                    }
                  }
                  if (!relatedService || !relatedCategory) return null;

                  return (
                    <Link
                      key={index}
                      to={`/services/${relatedCategory.slug}/${relatedService.slug}`}
                      className="group p-6 rounded-card bg-white border border-[rgba(139,74,139,0.10)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-150"
                      style={{ boxShadow: 'var(--shadow)' }}
                    >
                      <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-brand-500 transition-colors" style={{ color: 'hsl(var(--heading))' }}>
                        {relatedService.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'hsl(var(--text))', opacity: 0.8 }}>
                        {relatedService.tagline}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-500 font-semibold">{relatedService.price}</span>
                        <ArrowRight className="w-4 h-4 text-brand-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <ReviewStrip variant="compact" />

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-br from-[#FBF7FD] via-bg to-[#F5EFF8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" style={{ color: 'hsl(var(--heading))' }}>
              Let's Make Your Hair Dreams Come True
            </h2>
            <p className="text-lg mb-8" style={{ color: 'hsl(var(--text))', opacity: 0.9 }}>
              Book your appointment with Jena today and experience the Hair Pinns difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={BOOK_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackBookingClick(`service_detail_bottom_${serviceSlug}`, `/services/${categorySlug}/${serviceSlug}`)}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-150 hover:scale-105"
                  style={{ borderRadius: 'var(--radius-btn)', background: 'hsl(var(--brand-500))' }}
                >
                  <Calendar className="w-5 h-5" />
                  Book Now
                </Button>
              </a>
              <Link to="/services">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  style={{ borderRadius: 'var(--radius-btn)' }}
                >
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <RelatedContent
          topics={topicsForService(`${categorySlug}/${serviceSlug}`).map((t) => t.slug)}
          excludeSlug={`${categorySlug}/${serviceSlug}`}
          heading="Learn more about this treatment"
        />
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
