import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceDirectory from "@/components/services/ServiceDirectory";
import SEOHead from "@/components/SEOHead";

import { generateOrganizationSchema, generateEnhancedLocalBusinessSchema, generateFAQPageSchema, generateBreadcrumbSchema, generateServiceItemListSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { comprehensiveFAQs } from "@/data/faqs";
import { serviceDetailData } from "@/data/serviceDetails";
import { googleReviews } from "@/data/reviews";

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
  "1/2 Head of Foils, cut & blowdry": "half-head-foils-cut-blowdry",
  "1/4 Head Foils, cut and blowdry": "quarter-head-foils-cut-blowdry",
  "Long Hair Colour Package": "long-hair-colour-package",
  "Mid-Length Colour Package": "mid-length-colour-package",
  "Short Hair Colour Package": "short-hair-colour-package",
  "Long Hair wash/cut/blow-dry": "long-hair-wash-cut-blowdry",
  "Mid-length wash/cut/blow-dry": "mid-length-wash-cut-blowdry",
  "Short wash/cut/blow-dry": "short-wash-cut-blowdry",
  "Kids cut & blowdry bundle": "kids-cut-blowdry-bundle",
  "Primary Formal Hairstyle": "primary-formal-hairstyle",
  "High School Formal Hairstyle": "high-school-formal-hairstyle",
};

const Services = () => {
  const [activeSection, setActiveSection] = useState("smoothing");

  // Exact Fresha data - Source of Truth
  const serviceCategories: ServiceCategory[] = [
    {
      id: "smoothing",
      title: "Straight Up Smoothing Treatments",
      services: [
        {
          title: "Mid-Length Straight Up Smoothing Treatment",
          duration: "2h 20min",
          serviceCount: "2 services",
          price: "A$ 324"
        },
        {
          title: "Long/Thick Straight Up Smoothing Treatment",
          duration: "2h 20min",
          serviceCount: "2 services",
          description: "Straight Up is the first natural hair smoothing treatment\nThis package includes the 2.5 hour pampering session where you leave feeling great with smooth and silky hair and a take home hair mask to prolong your amazing results",
          price: "A$ 349"
        },
        {
          title: "Straight Up Smoothing for Teens",
          duration: "2h 20min",
          serviceCount: "2 services",
          description: "The perfect treatment for your Teen who needs to tame her mane",
          price: "A$ 234"
        }
      ]
    },
    {
      id: "foil-packages",
      title: "Foil Packages",
      services: [
        {
          title: "Short Hair Colour+ Foils & cut/blowdry",
          duration: "2h 30min",
          serviceCount: "3 services",
          description: "Root touch up, highlights, cut and blow-dry package",
          price: "A$ 257"
        },
        {
          title: "Long Hair Colour + Foils & cut/blowdry",
          duration: "2h 45min",
          serviceCount: "3 services",
          price: "A$ 262"
        },
        {
          title: "1/4 Head Foils, cut and blowdry",
          duration: "2h 15min",
          serviceCount: "3 services",
          description: "Enhance your hair with a 1/4 head of foils, cut and blow-dry",
          price: "A$ 202"
        },
        {
          title: "1/2 Head of Foils, cut & blowdry",
          duration: "2h 15min",
          serviceCount: "3 services",
          description: "Spice up is the perfect package that combines highlights, style cut and blowdry in one pampering session",
          price: "A$ 237"
        },
        {
          title: "Full Head of Foils Package",
          duration: "2h 45min",
          serviceCount: "3 services",
          description: "This package includes a full head of foils, style-cut & blow-dry",
          price: "A$ 267"
        }
      ]
    },
    {
      id: "colouring-packages",
      title: "Colouring Packages",
      services: [
        {
          title: "Long Hair Colour Package",
          duration: "2h 30min",
          serviceCount: "3 services",
          description: "Freshen up your look with regrowth or full colour, plus a cut and blowdry for women with long hair. Enjoy a complete service designed especially for long-haired clients.",
          price: "A$ 205"
        },
        {
          title: "Mid-Length Colour Package",
          duration: "2h 15min",
          serviceCount: "3 services",
          description: "Regrowth or full colour, cut and blowdry for mid length hair",
          price: "A$ 178"
        },
        {
          title: "Short Hair Colour Package",
          duration: "2h 15min",
          serviceCount: "3 services",
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
          title: "Kids cut & blowdry bundle",
          duration: "40min",
          serviceCount: "2 services",
          description: "Pamper your kids with a deep cleanse shampoo, relaxing head massage and condition paired with a haircut and blowdry",
          price: "A$ 54"
        },
        {
          title: "Short wash/cut/blow-dry",
          duration: "1h",
          serviceCount: "2 services",
          price: "A$ 79"
        },
        {
          title: "Mid-length wash/cut/blow-dry",
          duration: "1h",
          serviceCount: "2 services",
          price: "A$ 89"
        },
        {
          title: "Long Hair wash/cut/blow-dry",
          duration: "1h 15min",
          serviceCount: "2 services",
          price: "A$ 99"
        }
      ]
    },
    {
      id: "braids",
      title: "Pretty Princess Braids",
      services: [
        {
          title: "Little Princess Crown Braid",
          duration: "20min",
          price: "A$ 29"
        },
        {
          title: "2 x Hair Braids with Coloured Extensions",
          duration: "20min",
          price: "A$ 45"
        },
        {
          title: "Single Braid",
          duration: "15min",
          description: "Headband style braid or one directly down the centre of the head",
          price: "A$ 20"
        },
        {
          title: "Double Braids",
          duration: "20min",
          price: "A$ 30"
        },
        {
          title: "3-4 Braids (cornrows)",
          duration: "40min",
          price: "A$ 40"
        },
        {
          title: "Custom Braided Hairstyle",
          duration: "1h",
          price: "from A$ 50"
        }
      ]
    },
    {
      id: "timeout",
      title: "Time-Out",
      services: [
        {
          title: "Hot Towel Treatment Add On",
          duration: "10min",
          description: "Add a hot towel treatment to any service to relax, unwind and get the best results from a hair mask.",
          price: "A$ 12.50"
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
          price: "A$ 62"
        },
        {
          title: "Complete Pamper Package",
          duration: "1h",
          serviceCount: "2 services",
          description: "Scalp cleanse, deep conditioning under heat or with a hot towel, scalp massage, then a blow-dry finish. Book it when your hair feels heavy or your week has been heavy. A$62 for the lot.\n\nIf you want a real reset, ask me to scope your scalp before and after — most clients can see the difference straight away.",
          price: "A$ 62"
        }
      ]
    },
    {
      id: "hair",
      title: "Hair",
      services: [
        {
          title: "Kids Blow-dry",
          duration: "20min",
          description: "Spoil your kids with a deep cleanse shampoo, condition & blow-dry\nThis is great to give your kids a deep wash to remove any scalp build up and pamper them with knot-.free smooth hair",
          price: "A$ 34"
        },
        {
          title: "Haircut",
          description: "Mens, 20min, A$ 39\n\nWomens, 30min, A$ 54",
          price: "from A$ 39"
        },
        {
          title: "Hair Wash & dry off",
          duration: "20min",
          price: "A$ 15.50"
        },
        {
          title: "Fringe Trim",
          duration: "10min",
          description: "Keep your fringe perfect and pop in for a quick trim",
          price: "A$ 15.50"
        },
        {
          title: "Kids Haircuts",
          description: "Boys/Girls 0-10 years old, 20min, A$ 24\n\nBoys/Girls 11-17 years old, 20min, A$ 32",
          price: "from A$ 24"
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
          price: "A$ 24"
        },
        {
          title: "GHD Curls SHORT",
          duration: "30min",
          price: "A$ 52"
        },
        {
          title: "Child Formal Hairstyle",
          duration: "45min",
          price: "A$ 59"
        },
        {
          title: "GHD Curls LONG",
          duration: "45min",
          price: "A$ 67"
        },
        {
          title: "Upstyle SHORT",
          duration: "30min",
          price: "A$ 87"
        },
        {
          title: "Upstyle short/mid-length",
          duration: "45min",
          price: "A$ 94"
        },
        {
          title: "Upstyle LONG",
          duration: "1h",
          price: "A$ 107"
        },
        {
          title: "Wedding PP",
          duration: "1h",
          price: "A$ 114"
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
          price: "A$ 59"
        },
        {
          title: "High School Formal Hairstyle",
          duration: "1h",
          price: "A$ 69"
        }
      ]
    },
    {
      id: "treatments",
      title: "Treatments",
      services: [
        {
          title: "Superior Conditioning Treatment",
          duration: "15min",
          description: "Enjoy a deep scalp cleanse & a superior conditioning masque under heat for deep hydration and long-lasting shine and smoothness.\nCan be added to any hair treatment",
          price: "A$ 32"
        },
        {
          title: "Express Miracle Treatment",
          duration: "5min",
          description: "Add a 1 minute miracle treatment & hot towel to any service and give your hair a new life :)\nWith the value of Moroccan clay, this treatment quickly binds to your hair creating the soft and silky hair you deserve in only 60 seconds",
          price: "A$ 22"
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
          description: "Perfectly Straight Hair That Lasts\nInstantly boost your confidence in just a few hours. Lose that unmanageable mop forever and wake up every morning feeling sexy and looking good with beautiful straight hair.\nIn just two hours and lasting for months, transform your hair with a market leading hair straightening treatment that's quick, easy and completely natural – using eco friendly, hair-protecting products for the very best results.\nPlease book both Step 1 & 2. These are both completed at time of your appointment & are just split to allow for processing time.",
          price: "Free"
        },
        {
          title: "Step 2- Rinse, dry/straighten",
          duration: "2h",
          price: "A$ 350"
        },
        {
          title: "Rinse-out Colour",
          duration: "10min",
          description: "If not having cut or blow-dry, please select the rinse-out options to allow time.",
          price: "Free"
        },
        {
          title: "OSTEO",
          duration: "1h",
          price: "Free"
        }
      ]
    },
    {
      id: "tints",
      title: "Tints",
      services: [
        {
          title: "Toner",
          duration: "40min",
          price: "from A$ 29"
        },
        {
          title: "Men's Colour",
          duration: "1h",
          price: "A$ 49"
        },
        {
          title: "Regrowth of Colour",
          duration: "1h 10min",
          price: "A$ 79"
        },
        {
          title: "Full Colour Short Hair",
          duration: "1h 15min",
          price: "A$ 86"
        },
        {
          title: "Full Colour Mid-length",
          duration: "1h 15min",
          price: "A$ 92"
        },
        {
          title: "Full Colour Long Hair",
          duration: "1h 15min",
          price: "A$ 97"
        },
        {
          title: "Regrowth colour + 20 foils",
          duration: "1h 30min",
          price: "A$ 154"
        }
      ]
    },
    {
      id: "foils",
      title: "Foils",
      services: [
        {
          title: "1/4 head of foils",
          duration: "1h 15min",
          price: "A$ 99"
        },
        {
          title: "1/2 head of foils",
          duration: "1h 15min",
          price: "A$ 134"
        },
        {
          title: "Full Head of Foils",
          duration: "1h 45min",
          price: "A$ 164"
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
          price: "A$ 44"
        },
        {
          title: "Mid-length Hair",
          duration: "30min",
          price: "A$ 49"
        },
        {
          title: "Long Hair",
          duration: "45min",
          price: "A$ 54"
        }
      ]
    }
  ];

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
  const localBusinessSchema = generateEnhancedLocalBusinessSchema('https://hairpinns.com/services', googleReviews);
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
  // emitting them in schema adds no new disclosure — just machine-readability.
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
        description="Salon services: Straight Up Smoothing, Colour Packages, Cuts & Styling. Prices and times are exactly what you'll see when you book."
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
