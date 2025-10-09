import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Sparkles, Wind, Scissors, Plus, MapPin } from "lucide-react";
import StickyBooking from "@/components/conversion/StickyBooking";
import TrustStrip from "@/components/conversion/TrustStrip";
import FAQSection from "@/components/FAQSection";
import ReviewStrip from "@/components/reviews/ReviewStrip";
import GoogleReviewBadge from "@/components/reviews/GoogleReviewBadge";
import { generateOrganizationSchema, generateLocalBusinessSchema, generateServiceSchema, generateFAQPageSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { comprehensiveFAQs } from "@/data/faqs";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
const Services = () => {
  const services = {
    colour: [{
      name: "Full Colour",
      value: "Rich, vibrant color that lasts",
      price: "From $120"
    }, {
      name: "Balayage",
      value: "Natural, sun-kissed dimension",
      price: "From $180"
    }, {
      name: "Highlights (Full)",
      value: "Brightening all-over lift",
      price: "From $180"
    }, {
      name: "Highlights (Partial)",
      value: "Focused brightness & dimension",
      price: "From $140"
    }, {
      name: "Toner & Gloss",
      value: "Eliminate brass, add shine",
      price: "From $45"
    }, {
      name: "Root Touch-Up",
      value: "Seamless color refresh",
      price: "From $95"
    }],
    treatments: [{
      name: "Keratin Smoothing",
      value: "Frizz control for 3-4 months",
      price: "From $250"
    }, {
      name: "Olaplex Bond Treatment",
      value: "Repair damage at the molecular level",
      price: "From $55"
    }, {
      name: "Deep Conditioning",
      value: "Instant hydration & shine",
      price: "From $45"
    }, {
      name: "Scalp Wellness Therapy",
      value: "Detox, exfoliate, nourish",
      price: "From $65"
    }],
    cuts: [{
      name: "Women's Cut & Style",
      value: "Precision cut tailored to your face shape",
      price: "From $85"
    }, {
      name: "Men's Cut",
      value: "Sharp, modern styling",
      price: "From $45"
    }, {
      name: "Bang/Fringe Trim",
      value: "Quick refresh between cuts",
      price: "From $25"
    }, {
      name: "Blow Dry & Style",
      value: "Smooth, polished finish",
      price: "From $55"
    }],
    addons: [{
      name: "Olaplex Boost",
      value: "Add to any color service",
      price: "+$35"
    }, {
      name: "K18 Leave-In Treatment",
      value: "Instant repair & softness",
      price: "+$40"
    }, {
      name: "Gloss Refresh",
      value: "Add shine to any service",
      price: "+$30"
    }, {
      name: "Scalp Massage",
      value: "10-minute relaxation add-on",
      price: "+$15"
    }]
  };

  // Generate schemas with comprehensive FAQs
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema('https://hairpinns.com/services');
  const serviceSchemas = [generateServiceSchema({
    name: 'Colour & Blonding Services',
    description: 'Expert hair colouring including balayage, highlights, full colour, and toning services for vibrant, long-lasting results.',
    url: 'https://hairpinns.com/services#colour'
  }), generateServiceSchema({
    name: 'Smoothing & Treatment Services',
    description: 'Keratin smoothing, deep conditioning, and bond-building treatments to restore health and eliminate frizz.',
    url: 'https://hairpinns.com/services#smoothing'
  }), generateServiceSchema({
    name: 'Cuts & Styling Services',
    description: 'Precision haircuts and expert styling tailored to your face shape, hair texture, and lifestyle.',
    url: 'https://hairpinns.com/services#cuts'
  })];
  const faqSchema = generateFAQPageSchema(comprehensiveFAQs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  })));
  return <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hair Services Bangor | Colour, Smoothing & Cuts | Hair Pinns</title>
        <meta name="description" content="Expert salon services: Balayage, Keratin Smoothing, Precision Cuts. 12+ years experience. Book online 24/7 via Fresha." />
        <link rel="canonical" href="https://hairpinns.com/services" />
        <meta property="og:title" content="Hair Services Bangor | Colour, Smoothing & Cuts" />
        <meta property="og:description" content="Balayage, highlights, keratin smoothing, cuts & styling. Expert care in Bangor. Book online now." />
        <meta property="og:url" content="https://hairpinns.com/services" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('service')} />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/services" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        {serviceSchemas.map((schema, index) => <script key={`service-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>)}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />
      
      <GoogleReviewBadge variant="micro" showCTA />
      
      {/* Trust Strip */}
      <TrustStrip />
      
      {/* Sticky Booking CTA (mobile only) */}
      <StickyBooking />
      
      <main>
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs items={[{
          label: 'Home',
          href: '/'
        }, {
          label: 'Services'
        }]} />
        </div>
        
        {/* Hero */}
        <section className="bg-accent py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
              Salon Services
            </h1>
            <p className="text-lg text-foreground leading-relaxed">Welcome to Hair Pinns, your boutique hair salon in Bangor, NSW. Serving the Sutherland Shire with expert cuts, color, and treatments since 2009. Jena brings over 16 years of professional experience, honest care, and a passion for helping you love your hair.</p>
          </div>
        </section>

        {/* Review Strip */}
        <ReviewStrip variant="compact" />

        {/* Why Choose Hair Pinns */}
        <section className="py-12 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-6 text-center">
              Why Choose Hair Pinns?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-card border border-border">
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-heading mb-2">Honest Care</h3>
                <p className="text-sm text-foreground">
                  No upsells, no gimmicks—just expert advice tailored to your hair goals and budget
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-card border border-border">
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-heading mb-2">Premium Products</h3>
                <p className="text-sm text-foreground">
                  Olaplex, Kevin Murphy, Moroccan Oil—salon-quality results you can trust
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-card border border-border">
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-heading mb-2">Local Love</h3>
                <p className="text-sm text-foreground">
                  Proud to serve Bangor & the Sutherland Shire with personalized, boutique service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Colour & Blonding */}
        <section id="colour" className="py-16 scroll-mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-brand-500" />
              <h2 className="text-h2-lg font-heading font-bold text-heading">
                Colour & Blonding
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.colour.map((service, index) => <div key={index} className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base">
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("services_colour_card", "/services")}>
                    <Button variant="primary" size="sm" className="w-full" aria-label="Book an appointment">
                      <Calendar className="w-4 h-4" />
                      {BOOK_CTA_LABEL}
                    </Button>
                  </a>
                  <a href="#colour" className="block text-center text-sm text-brand-500 hover:text-brand-600 mt-2 font-medium">
                    Learn more
                  </a>
                </div>)}
            </div>
          </div>
        </section>

        {/* Smoothing & Treatments */}
        <section id="treatments" className="py-16 bg-muted scroll-mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Wind className="w-8 h-8 text-brand-500" />
              <h2 className="text-h2-lg font-heading font-bold text-heading">
                Smoothing & Treatments
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.treatments.map((service, index) => <div key={index} className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base">
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("services_treatments_card", "/services")}>
                    <Button variant="primary" size="sm" className="w-full" aria-label="Book an appointment">
                      <Calendar className="w-4 h-4" />
                      {BOOK_CTA_LABEL}
                    </Button>
                  </a>
                  <a href="#treatments" className="block text-center text-sm text-brand-500 hover:text-brand-600 mt-2 font-medium">
                    Learn more
                  </a>
                </div>)}
            </div>
          </div>
        </section>

        {/* Mid-page Help CTA */}
        <section className="py-12 bg-brand-500 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h2-lg font-heading font-bold mb-4">
              Not sure which service is right for you?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Need help choosing? <Link to="/contact" className="text-white font-semibold hover:text-white/90 underline">Message us on the contact page.</Link>
            </p>
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("services_mid_page_cta", "/services")}>
              <Button variant="secondary" size="lg" className="bg-white text-brand-500 hover:bg-white/90" aria-label="Book an appointment">
                <Calendar className="w-5 h-5" />
                {BOOK_CTA_LABEL}
              </Button>
            </a>
          </div>
        </section>

        {/* Cuts & Styling */}
        <section id="cuts" className="py-16 scroll-mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Scissors className="w-8 h-8 text-brand-500" />
              <h2 className="text-h2-lg font-heading font-bold text-heading">
                Cuts & Styling
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.cuts.map((service, index) => <div key={index} className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base">
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("services_cuts_card", "/services")}>
                    <Button variant="primary" size="sm" className="w-full" aria-label="Book an appointment">
                      <Calendar className="w-4 h-4" />
                      {BOOK_CTA_LABEL}
                    </Button>
                  </a>
                  <a href="#cuts" className="block text-center text-sm text-brand-500 hover:text-brand-600 mt-2 font-medium">
                    Learn more
                  </a>
                </div>)}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section id="add-ons" className="py-16 bg-muted scroll-mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Plus className="w-8 h-8 text-brand-500" />
              <h2 className="text-h2-lg font-heading font-bold text-heading">
                Add-ons & Enhancements
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.addons.map((service, index) => <div key={index} className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base">
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("services_addons_card", "/services")}>
                    <Button variant="primary" size="sm" className="w-full" aria-label="Book an appointment">
                      <Calendar className="w-4 h-4" />
                      {BOOK_CTA_LABEL}
                    </Button>
                  </a>
                  <a href="#add-ons" className="block text-center text-sm text-brand-500 hover:text-brand-600 mt-2 font-medium">
                    Learn more
                  </a>
                </div>)}
            </div>
          </div>
        </section>

        {/* FAQ Section with comprehensive FAQs */}
        <FAQSection faqs={comprehensiveFAQs} title="Frequently Asked Questions" subtitle="Expert answers to your hair care questions from Jena and the Hair Pinns team." showFeedback={true} />
        
        {/* Nearby Suburbs We Serve */}
        <section className="py-12" id="areas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-brand-500" />
              <h2 className="text-h2 font-heading font-semibold text-heading">
                Areas We Serve
              </h2>
            </div>
            <p className="text-foreground mb-8 max-w-3xl">
              Hair Pinns proudly serves clients throughout the Sutherland Shire from our Bangor salon. 
              Click your area to see local info, drive times, and area-specific hair care tips.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/near/bangor" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Bangor
                </h3>
                <p className="text-sm text-muted-foreground">
                  On-site — our home salon in Bangor
                </p>
              </Link>
              <Link to="/near/menai" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Menai
                </h3>
                <p className="text-sm text-muted-foreground">
                  5–7 mins — expert colour, smoothing & cuts
                </p>
              </Link>
              <Link to="/near/illawong" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Illawong
                </h3>
                <p className="text-sm text-muted-foreground">
                  8–10 mins — riverside suburb specialist
                </p>
              </Link>
              <Link to="/near/alfords-point" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Alfords Point
                </h3>
                <p className="text-sm text-muted-foreground">
                  6–8 mins — coastal breeze hair care
                </p>
              </Link>
              <Link to="/near/woronora" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Woronora
                </h3>
                <p className="text-sm text-muted-foreground">
                  10–12 mins — river valley humidity solutions
                </p>
              </Link>
              <Link to="/near/sutherland" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Sutherland
                </h3>
                <p className="text-sm text-muted-foreground">
                  8–10 mins — hard water treatment specialists
                </p>
              </Link>
              <Link to="/near/kirrawee" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Kirrawee
                </h3>
                <p className="text-sm text-muted-foreground">
                  12–15 mins — coastal air protection
                </p>
              </Link>
              <Link to="/near/kareela" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Kareela
                </h3>
                <p className="text-sm text-muted-foreground">
                  10–12 mins — hydrating treatments for dry climates
                </p>
              </Link>
              <Link to="/near/como" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Como
                </h3>
                <p className="text-sm text-muted-foreground">
                  12–14 mins — riverside humidity expertise
                </p>
              </Link>
              <Link to="/near/gymea" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Gymea
                </h3>
                <p className="text-sm text-muted-foreground">
                  15–18 mins — salt air and sun protection
                </p>
              </Link>
              <Link to="/near/miranda" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Miranda
                </h3>
                <p className="text-sm text-muted-foreground">
                  15–18 mins — all-day style hold
                </p>
              </Link>
              <Link to="/near/engadine" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Engadine
                </h3>
                <p className="text-sm text-muted-foreground">
                  10–12 mins — dry bushland hair recovery
                </p>
              </Link>
              <Link to="/near/heathcote" className="group p-6 bg-card border border-border rounded-card hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  Hair Salon Heathcote
                </h3>
                <p className="text-sm text-muted-foreground">
                  5–7 mins — dust and pollen protection
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Services;