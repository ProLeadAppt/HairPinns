import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import StickyBooking from "@/components/conversion/StickyBooking";
import TrustStrip from "@/components/conversion/TrustStrip";
import FAQSection from "@/components/FAQSection";
import ReviewStrip from "@/components/reviews/ReviewStrip";
import GoogleReviewBadge from "@/components/reviews/GoogleReviewBadge";
import { generateOrganizationSchema, generateLocalBusinessSchema, generateServiceSchema, generateFAQPageSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { comprehensiveFAQs } from "@/data/faqs";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

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
          description: "Express Sauna Seah — 30min — A$ 25\n1 hour Seesion — 1h — A$ 35",
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
          description: "Escape to a blissful retreat as you surrender to a luxurious hair and scalp revamp, unveiling magnificent shine, banishing frizz, and experiencing a rejuvenating transformation. Leave the world behind and revel in being pampered and reclaim your hair's youthful charm while soaring to new heights of beauty.\nIncluded in this package is a scalp cleanse, deep conditioning treatment under heat or with hot towel, scalp massage and style so you can continue your Happy Hair Day :)",
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
          description: "Mens — 20min — A$ 39\n\nWomens — 30min — A$ 54",
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
          description: "Boys/Girls 0-10 years old — 20min — A$ 24\n\nBoys/Girls 11-17 years old — 20min — A$ 32",
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
  const localBusinessSchema = generateLocalBusinessSchema('https://hairpinns.com/services');
  const faqSchema = generateFAQPageSchema(comprehensiveFAQs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  })));

  return (
    <div className="min-h-screen bg-bg">
      <Helmet>
        <title>Hair Services Bangor | Colour, Smoothing & Cuts | Hair Pinns</title>
        <meta name="description" content="Expert salon services: Straight Up Smoothing, Colour Packages, Cuts & Styling. Exact pricing and timings as listed in our booking system." />
        <link rel="canonical" href="https://hairpinns.com/services" />
        <meta property="og:title" content="Hair Services Bangor | Colour, Smoothing & Cuts" />
        <meta property="og:description" content="Expert salon services with transparent pricing. Book online now via Fresha." />
        <meta property="og:url" content="https://hairpinns.com/services" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('service')} />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />
      <GoogleReviewBadge variant="micro" showCTA />
      <TrustStrip />
      <StickyBooking />

      <main>
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
        </div>

        {/* Hero - Compact Premium */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-[#FBF7FD] to-bg"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-brand-500 tracking-wide uppercase mb-3">
              Our Services
            </p>
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4" style={{ letterSpacing: '-0.2px' }}>
              Services & Packages
            </h1>
            <p className="text-lg text-foreground leading-relaxed" style={{ lineHeight: '1.5' }}>
              Exact pricing and timings as listed in our booking system.
            </p>
          </div>
        </section>

        {/* Sticky Sub-Nav */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[rgba(139,74,139,0.10)] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              <span className="text-sm whitespace-nowrap mr-2" style={{ color: 'hsl(var(--text))', opacity: 0.7 }}>Jump to:</span>
              {[
                { id: 'smoothing', label: 'Smoothing' },
                { id: 'foil-packages', label: 'Foil Packages' },
                { id: 'colouring-packages', label: 'Colour' },
                { id: 'cut-packages', label: 'Cuts' },
                { id: 'braids', label: 'Braids' },
                { id: 'styling', label: 'Styling' }
              ].map(nav => (
                <a
                  key={nav.id}
                  href={`#${nav.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(nav.id);
                    if (element) {
                      const offset = 120;
                      const top = element.offsetTop - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                    activeSection === nav.id
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'hover:bg-accent'
                  }`}
                  style={activeSection !== nav.id ? { color: 'hsl(var(--text))', opacity: 0.8 } : {}}
                >
                  {nav.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <ReviewStrip variant="compact" />

        {/* Service Categories */}
        {serviceCategories.map((category, catIndex) => (
          <section
            key={category.id}
            id={category.id}
            className={`py-16 scroll-mt-32 ${catIndex % 2 === 1 ? 'bg-muted' : ''}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-h2-lg font-heading font-bold text-heading mb-8" style={{ letterSpacing: '-0.2px', lineHeight: '1.5' }}>
                {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-card p-6 border border-[rgba(139,74,139,0.10)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all duration-150"
                    style={{ 
                      boxShadow: 'var(--shadow)',
                      borderRadius: 'var(--radius-card)'
                    }}
                  >
                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold mb-2" style={{ color: 'hsl(var(--heading))', lineHeight: '1.5' }}>
                      {service.title}
                    </h3>

                    {/* Subtitle */}
                    {service.subtitle && (
                      <p className="text-sm mb-3" style={{ color: 'hsl(var(--text))', lineHeight: '1.5', opacity: 0.9 }}>
                        {service.subtitle}
                      </p>
                    )}

                    {/* Meta chips */}
                    {(service.duration || service.serviceCount) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {service.duration && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ border: '1px solid rgba(139,74,139,0.25)', color: 'hsl(var(--text))', opacity: 0.8 }}>
                            {service.duration}
                          </span>
                        )}
                        {service.serviceCount && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ border: '1px solid rgba(139,74,139,0.25)', color: 'hsl(var(--text))', opacity: 0.8 }}>
                            {service.serviceCount}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {service.description && (
                      <p className="text-sm mb-4 whitespace-pre-line" style={{ color: 'hsl(var(--text))', lineHeight: '1.5', opacity: 0.9 }}>
                        {service.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      <span 
                        className="inline-block px-4 py-1.5 rounded-full bg-brand-500 text-white text-sm font-bold"
                        style={{ borderRadius: '999px' }}
                      >
                        {service.price}
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-2">
                      <a 
                        href={BOOK_URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackBookingClick(`services_${category.id}_card`, "/services")}
                        aria-label={`Book now — ${service.title}`}
                      >
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="w-full transition-all duration-150 hover:scale-[1.02]"
                          style={{ borderRadius: 'var(--radius-btn)' }}
                        >
                          <Calendar className="w-4 h-4 group-hover:animate-pulse" />
                          Book now
                        </Button>
                      </a>
                      {/* Learn more link - coming soon with detail pages */}
                      <div className="text-center">
                        <span className="text-sm" style={{ color: 'hsl(var(--text))', opacity: 0.6 }}>
                          More details coming soon
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* FAQ Section */}
        <FAQSection 
          faqs={comprehensiveFAQs} 
          title="Frequently Asked Questions" 
          subtitle="Expert answers to your hair care questions from Jena and the Hair Pinns team." 
          showFeedback={true} 
        />

        {/* Areas We Serve */}
        <section className="py-12 bg-muted" id="areas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-brand-500" />
              <h2 className="text-h2 font-heading font-semibold text-heading">
                Areas We Serve
              </h2>
            </div>
            <p className="text-foreground mb-8 max-w-3xl" style={{ lineHeight: '1.5' }}>
              Hair Pinns proudly serves clients throughout the Sutherland Shire from our Bangor salon.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Bangor", slug: "bangor" },
                { name: "Menai", slug: "menai" },
                { name: "Illawong", slug: "illawong" },
                { name: "Barden Ridge", slug: "barden-ridge" },
                { name: "Woronora Heights", slug: "woronora-heights" },
                { name: "Sutherland", slug: "sutherland" }
              ].map(area => (
                <Link
                  key={area.slug}
                  to={`/near/${area.slug}`}
                  className="group p-6 bg-card border border-[rgba(139,74,139,0.10)] rounded-card hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all duration-150"
                  style={{ 
                    boxShadow: 'var(--shadow)',
                    borderRadius: 'var(--radius-card)'
                  }}
                >
                  <h3 className="font-semibold text-heading mb-1 group-hover:text-brand-500 transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-sm text-muted">View local info →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="py-6 text-center bg-white">
          <p className="text-sm text-muted">
            All services, durations and prices shown exactly as listed in our booking system.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
