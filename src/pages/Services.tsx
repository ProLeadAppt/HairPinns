import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceDirectory from "@/components/services/ServiceDirectory";
import SEOHead from "@/components/SEOHead";

import { generateOrganizationSchema, generateEnhancedLocalBusinessSchema, generateFAQPageSchema, generateBreadcrumbSchema, generateServiceItemListSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { comprehensiveFAQs } from "@/data/faqs";
import { serviceDetailData } from "@/data/serviceDetails";


interface Service {
  title: string;
  subtitle?: string;
  duration?: string;
  serviceCount?: string;
  price: string;
  description?: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  services: Service[];
}

const serviceSlugMap: Record<string, string> = {
  "Mid-Length Straight Up Smoothing Treatment": "mid-length-straight-up-smoothing",
  "Long/Thick Straight Up Smoothing Treatment": "long-thick-straight-up-smoothing",
  "Straight Up Smoothing for Teens": "straight-up-smoothing-teens",
  "Full Head of Foils Package": "full-head-foils-package",
  "1/2 Head of Foils, Cut & Blow-dry": "half-head-foils-cut-blowdry",
  "1/4 Head Foils, Cut & Blow-dry": "quarter-head-foils-cut-blowdry",
  "Long Hair Colour Package": "long-hair-colour-package",
  "Mid-Length Colour Package": "mid-length-colour-package",
  "Short Hair Colour Package": "short-hair-colour-package",
  "Long Cut/Blow-dry": "long-hair-wash-cut-blowdry",
  "Mid-Length Cut/Blowdry": "mid-length-wash-cut-blowdry",
  "Short Hair Cut & Blowdry": "short-wash-cut-blowdry",
  "Kids Cut & Blow-dry Bundle": "kids-cut-blowdry-bundle",
  "Primary Formal Hairstyle": "primary-formal-hairstyle",
  "High School Formal Hairstyle": "high-school-formal-hairstyle",
};

// Public Fresha booking prices are the reference for current appointments.
// Unlisted legacy options need Jena's confirmation before returning to this menu.
export const serviceCategories: ServiceCategory[] = [
    {
      id: "smoothing",
      title: "Straight Up Smoothing Treatments",
      services: [
        {
          title: "Mid-Length Straight Up Smoothing Treatment",
          duration: "2h 20min",
          serviceCount: "2 services",
          price: "A$ 339"
        },
        {
          title: "Long/Thick Straight Up Smoothing Treatment",
          duration: "2h 20min",
          serviceCount: "2 services",
          description: "Discuss the intended finish, hair history and aftercare with Jena before choosing this service.",
          price: "A$ 362"
        },
        {
          title: "Straight Up Smoothing for Teens",
          duration: "2h 20min",
          serviceCount: "2 services",
          description: "Confirm age eligibility and suitability with Jena before booking. QIQI ProCtrl products are not for under-16s.",
          price: "A$ 289"
        }
      ]
    },
    {
      id: "foil-packages",
      title: "Foil Packages",
      services: [
        {
          title: "Regrowth + Foils & cut/Blowdry for short/mid-length hair",
          duration: "2h 30min",
          serviceCount: "2 services",
          description: "Root touch up, highlights, cut and blow-dry package",
          price: "A$ 273"
        },
        {
          title: "Regrowth + Foils & cut/blowdry for Long Hair",
          duration: "2h 30min",
          serviceCount: "2 services",
          price: "A$ 283"
        },
        {
          title: "1/4 Head Foils, Cut & Blow-dry",
          duration: "2h 15min",
          serviceCount: "2 services",
          description: "Enhance your hair with a 1/4 head of foils, cut and blow-dry. Toner is not included. Pricing may vary with hair length.",
          price: "A$ 223"
        },
        {
          title: "1/2 Head of Foils, Cut & Blow-dry",
          duration: "2h 15min",
          serviceCount: "2 services",
          description: "Spice up is the perfect package that combines highlights, style cut and blowdry in one pampering session. Toner is not included. Pricing may vary with hair length.",
          price: "A$ 253"
        },
        {
          title: "Full Head of Foils Package",
          duration: "2h 45min",
          serviceCount: "2 services",
          description: "This package includes a full head of foils, style-cut & blow-dry. Toner is not included. Pricing may vary with hair length.",
          price: "A$ 283"
        }
      ]
    },
    {
      id: "colouring-packages",
      title: "Colouring Packages",
      services: [
        {
          title: "Long Hair Colour Package",
          duration: "2h 15min",
          serviceCount: "2 services",
          description: "Freshen up your look with regrowth or full colour, plus a cut and blowdry for women with long hair. Enjoy a complete service designed especially for long-haired clients.",
          price: "A$ 213"
        },
        {
          title: "Mid-Length Colour Package",
          duration: "2h 15min",
          serviceCount: "2 services",
          description: "Regrowth or full colour, cut and blowdry for mid length hair",
          price: "A$ 198"
        },
        {
          title: "Short Hair Colour Package",
          duration: "2h",
          serviceCount: "2 services",
          description: "Regrowth or full colour cut and blowdry for short hair",
          price: "A$ 184"
        }
      ]
    },
    {
      id: "cut-packages",
      title: "Cut & Blow-dry Packages",
      services: [
        {
          title: "Kids Cut & Blow-dry Bundle",
          duration: "1h",
          description: "Pamper your kids with a deep cleanse shampoo, relaxing head massage and condition paired with a haircut and blowdry",
          price: "A$ 67"
        },
        {
          title: "Short Hair Cut & Blowdry",
          duration: "45min",
          price: "A$ 87"
        },
        {
          title: "Mid-Length Cut/Blowdry",
          duration: "1h",
          price: "A$ 94"
        },
        {
          title: "Long Cut/Blow-dry",
          duration: "1h",
          price: "A$ 104"
        }
      ]
    },
    {
      id: "braids",
      title: "Pretty Princess Braids",
      services: [
        {
          title: "Coloured Hair Braids",
          duration: "20min",
          price: "from A$ 33"
        },
        {
          title: "Single Braid",
          duration: "15min",
          description: "Headband style braid or one directly down the centre of the head",
          price: "A$ 25"
        },
        {
          title: "Double Braids",
          duration: "20min",
          price: "A$ 35"
        },
        {
          title: "3-4 Braids (cornrows)",
          duration: "40min",
          price: "A$ 45"
        },
        {
          title: "Custom Braided Hairstyle",
          duration: "1h",
          price: "from A$ 55"
        }
      ]
    },
    {
      id: "timeout",
      title: "Time-Out",
      services: [
        {
          title: "Hot Towel Express Treatment Add On",
          duration: "10min",
          description: "Add a hot towel treatment to any service to relax, unwind and get the best results from a hair mask.",
          price: "A$ 15"
        },
        {
          title: "Infrared Sauna",
          subtitle: "Enjoy flexible wellness options with our casual, 5, or 10 visit passes. Choose the package that suits your lifestyle and experience soothing infrared sauna sessions whenever you need a relaxing escape.",
          description: "Express Sauna Seah, 30min, A$ 25\n1 hour Session, 1h, A$ 35",
          price: "from A$ 25"
        },
        {
          title: "Scalp Detox",
          duration: "1h",
          description: "Refresh your scalp with a gentle treatment designed to remove everyday buildup and impurities. Enjoy a soothing experience that leaves your hair feeling cleaner and your scalp revitalised. Perfect for anyone seeking a clean, balanced foundation for healthier hair.\nWe use a scope camera to check your scalp for impurities and build up then after the specialized cleanse and blowdry, we re-scope to show you the amazing results afterwards",
          price: "A$ 74"
        },
      ]
    },
    {
      id: "hair",
      title: "Hair",
      services: [
        {
          title: "Kids Blow-dry",
          duration: "30min",
          description: "Spoil your kids with a deep cleanse shampoo, condition & blow-dry\nThis is great to give your kids a deep wash to remove any scalp build up and pamper them with knot-.free smooth hair",
          price: "A$ 45"
        },
        {
          title: "Haircut",
          description: "Choose your haircut option and check the current price when booking with Jena.",
          price: "from A$ 45"
        },
        {
          title: "Hair Wash & dry off",
          duration: "15min",
          price: "A$ 19"
        },
        {
          title: "Fringe Trim",
          duration: "15min",
          description: "Keep your fringe perfect and pop in for a quick trim",
          price: "A$ 22.50"
        },
        {
          title: "Kids Haircuts",
          description: "Choose the age-appropriate option and check the current price when booking with Jena.",
          price: "from A$ 33"
        }
      ]
    },
    {
      id: "styling",
      title: "Styling",
      services: [
        {
          title: "Add curls to other service",
          duration: "10min",
          price: "A$ 27"
        },
        {
          title: "GHD Curls Short/Mid-Length",
          duration: "30min",
          price: "A$ 49"
        },
        {
          title: "GHD Curls LONG",
          duration: "45min",
          price: "A$ 64"
        },
        {
          title: "Upstyle SHORT",
          duration: "30min",
          price: "A$ 89"
        },
        {
          title: "Upstyle mid-length",
          duration: "45min",
          price: "A$ 99"
        },
        {
          title: "Upstyle LONG",
          duration: "1h",
          price: "A$ 104"
        },
        {
          title: "Wedding Hairstyles",
          duration: "1h",
          price: "from A$ 114"
        },
        {
          title: "Iron Straight Add On",
          duration: "5min",
          price: "A$ 24"
        }
      ]
    },
    {
      id: "kids-formal",
      title: "Kids Formal Hairstyle",
      services: [
        {
          title: "Primary Formal Hairstyle",
          duration: "45min",
          price: "A$ 69"
        },
        {
          title: "High School Formal Hairstyle",
          duration: "1h",
          price: "A$ 79"
        }
      ]
    },
    {
      id: "treatments",
      title: "Treatments",
      services: [
        {
          title: "Superior Conditioning Treatment",
          duration: "20min",
          description: "Enjoy a deep scalp cleanse & a superior conditioning masque under heat for deep hydration and long-lasting shine and smoothness.\nCan be added to any hair treatment",
          price: "A$ 34"
        }
      ]
    },
    {
      id: "straight-up",
      title: "Straight Up Treatment",
      services: [
        {
          title: "Step 1- Cleanse, Treat & Heat",
          duration: "1h 20min",
          description: "Want straighter hair with less work each morning? Straight Up is completed in two parts during the same appointment. Please book both Step 1 and Step 2 so enough processing and finishing time is reserved. If you are not sure whether it suits your hair, book a consultation with Jena first.",
          price: "Free"
        },
        {
          title: "Step 2- Rinse, dry/straighten",
          duration: "2h",
          price: "A$ 419"
        }
      ]
    },
    {
      id: "blow-dry",
      title: "Blow Dry",
      services: [
        {
          title: "Short Hair",
          duration: "30min",
          price: "A$ 49"
        },
        {
          title: "Mid-length Hair",
          duration: "30min",
          price: "A$ 54"
        },
        {
          title: "Long Hair",
          duration: "45min",
          price: "A$ 59"
        }
      ]
    }
];

const Services = () => {
  const [activeSection, setActiveSection] = useState("smoothing");

  const totalServices = serviceCategories.reduce((total, category) => total + category.services.length, 0);

  // Scroll spy for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = serviceCategories.map(cat => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate schemas
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateEnhancedLocalBusinessSchema("https://hairpinns.com/services");
  const faqSchema = generateFAQPageSchema(comprehensiveFAQs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  })));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://hairpinns.com' },
    { name: 'Services', url: 'https://hairpinns.com/services' },
  ]);

  // Aggregate every bookable service for AI overviews + sitelinks.
  // Prices already publicly visible on Services + ServiceDetail pages, so
  // emitting them in schema adds no new disclosure, just machine-readability.
  const serviceItemListSchema = generateServiceItemListSchema(
    serviceDetailData.flatMap((category) =>
      category.services.map((svc) => ({
        name: svc.title,
        url: `/services/${category.slug}/${svc.slug}`,
        description: svc.tagline || svc.metaDescription,
        price: svc.price?.replace(/[^\d.]/g, '') || undefined,
      }))
    )
  );

  const schemas = [organizationSchema, localBusinessSchema, faqSchema, breadcrumbSchema, serviceItemListSchema];

  return (
    <div className="min-h-screen bg-bg">
      <SEOHead
        title="Hair Services Bangor | Colour, Smoothing & Cuts | Hair Pinns"
        description="Explore Jena's salon services, from smoothing and colour to cuts and styling. Check the current options and total price in Fresha before confirming your booking."
        canonical="https://hairpinns.com/services"
        ogImage={getOGImage('service')}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />

      <Header />
      <ServiceDirectory
        categories={serviceCategories}
        activeSection={activeSection}
        totalServices={totalServices}
        serviceSlugMap={serviceSlugMap}
      />

      <Footer />
    </div>
  );
};

export default Services;
