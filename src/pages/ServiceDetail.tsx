import { Navigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ServiceDetailExperience from "@/components/services/ServiceDetailExperience";
import {
  generateEnhancedServiceSchema,
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateHowToSchema,
  generateWebPageSchema,
} from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { serviceDetailData } from "@/data/serviceDetails";
import { topicsForService } from "@/data/topicMap";

const parseDurationToISO = (duration: string | undefined): string | undefined => {
  if (!duration) return undefined;
  const hourMatch = duration.match(/(\d+)h/);
  const minuteMatch = duration.match(/(\d+)min/);
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  const parts: string[] = [];
  if (hours) parts.push(`${hours}H`);
  if (minutes) parts.push(`${minutes}M`);
  return parts.length ? `PT${parts.join("")}` : undefined;
};

const ServiceDetail = () => {
  const { categorySlug, serviceSlug } = useParams<{ categorySlug: string; serviceSlug: string }>();
  const categoryData = serviceDetailData.find((category) => category.slug === categorySlug);
  const serviceData = categoryData?.services.find((service) => service.slug === serviceSlug);

  if (!categoryData || !serviceData || !categorySlug || !serviceSlug) {
    return <Navigate to="/services" replace />;
  }

  const route = `/services/${categorySlug}/${serviceSlug}`;
  const canonical = `https://hairpinns.com${route}`;
  const breadcrumbItems = [
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "Services", url: "https://hairpinns.com/services" },
    { name: categoryData.title, url: `https://hairpinns.com/services#${categorySlug}` },
    { name: serviceData.title, url: canonical },
  ];

  const numericPrice = serviceData.price.replace(/[^\d.]/g, "") || undefined;
  const serviceSchema = generateEnhancedServiceSchema({
    name: serviceData.title,
    description: serviceData.description,
    url: canonical,
    ...(numericPrice && { price: numericPrice, priceCurrency: "AUD" }),
    ...(serviceData.duration && { duration: serviceData.duration }),
  });
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const faqSchema = serviceData.faqs.length ? generateFAQPageSchema(serviceData.faqs) : null;
  const howToSchema = serviceData.process.length
    ? generateHowToSchema({
        name: `${serviceData.title} - What to Expect`,
        description: serviceData.description,
        step: serviceData.process.map((processStep) => ({
          name: processStep.step,
          text: processStep.description,
        })),
        totalTime: parseDurationToISO(serviceData.duration),
      })
    : null;
  const webPageSchema = generateWebPageSchema({
    name: serviceData.title,
    description: serviceData.metaDescription,
    url: canonical,
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
    <div className="min-h-screen bg-[hsl(var(--after-hours-cream))]">
      <SEOHead
        title={`${serviceData.title} | Hair Pinns Bangor NSW`}
        description={serviceData.metaDescription}
        canonical={canonical}
        ogImage={getOGImage("service")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />
      <Header />
      <ServiceDetailExperience
        categoryData={categoryData}
        serviceData={serviceData}
        categorySlug={categorySlug}
        serviceSlug={serviceSlug}
        topics={topicsForService(`${categorySlug}/${serviceSlug}`).map((topic) => topic.slug)}
      />
      <Footer />
    </div>
  );
};

export default ServiceDetail;
