import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Sparkles, Wind, Scissors, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateFAQPageSchema,
} from "@/lib/schema";

const Services = () => {
  const services = {
    colour: [
      {
        name: "Full Colour",
        value: "Rich, vibrant color that lasts",
        price: "From $120",
      },
      {
        name: "Balayage",
        value: "Natural, sun-kissed dimension",
        price: "From $180",
      },
      {
        name: "Highlights (Full)",
        value: "Brightening all-over lift",
        price: "From $180",
      },
      {
        name: "Highlights (Partial)",
        value: "Focused brightness & dimension",
        price: "From $140",
      },
      {
        name: "Toner & Gloss",
        value: "Eliminate brass, add shine",
        price: "From $45",
      },
      {
        name: "Root Touch-Up",
        value: "Seamless color refresh",
        price: "From $95",
      },
    ],
    treatments: [
      {
        name: "Keratin Smoothing",
        value: "Frizz control for 3-4 months",
        price: "From $250",
      },
      {
        name: "Olaplex Bond Treatment",
        value: "Repair damage at the molecular level",
        price: "From $55",
      },
      {
        name: "Deep Conditioning",
        value: "Instant hydration & shine",
        price: "From $45",
      },
      {
        name: "Scalp Wellness Therapy",
        value: "Detox, exfoliate, nourish",
        price: "From $65",
      },
    ],
    cuts: [
      {
        name: "Women's Cut & Style",
        value: "Precision cut tailored to your face shape",
        price: "From $85",
      },
      {
        name: "Men's Cut",
        value: "Sharp, modern styling",
        price: "From $45",
      },
      {
        name: "Bang/Fringe Trim",
        value: "Quick refresh between cuts",
        price: "From $25",
      },
      {
        name: "Blow Dry & Style",
        value: "Smooth, polished finish",
        price: "From $55",
      },
    ],
    addons: [
      {
        name: "Olaplex Boost",
        value: "Add to any color service",
        price: "+$35",
      },
      {
        name: "K18 Leave-In Treatment",
        value: "Instant repair & softness",
        price: "+$40",
      },
      {
        name: "Gloss Refresh",
        value: "Add shine to any service",
        price: "+$30",
      },
      {
        name: "Scalp Massage",
        value: "10-minute relaxation add-on",
        price: "+$15",
      },
    ],
  };

  const faqs = [
    {
      question: "What's the best treatment for frizz in humid Sydney weather?",
      answer: "A keratin-free smoothing treatment paired with a humidity-resistant leave-in works best for Sydney's changeable climate. Start with a gentle, sulphate-free wash, add a protein-balanced mask weekly, then seal with a heat-activated protectant before blow-drying. On high-humidity days, finish with a light, flexible-hold spray rather than heavy oils (they can collapse volume). If your hair is colour-treated, choose formulas labelled 'colour-safe' to prevent fade. For persistent halo frizz around the hairline, sleep on a silk pillowcase and avoid rough towel drying."
    },
    {
      question: "How often should I tone blonde hair at home?",
      answer: "Every 1–2 weeks for maintenance, using a pH-balanced violet or blue-violet treatment, depending on your undertone. Keep dwell time short (3–5 mins) to avoid over-ash. Follow with a hydrating mask because toners can be slightly drying. If your water is mineral-rich (common around the Shire), use a chelating shampoo once every 2–4 weeks to remove buildup that accelerates brassiness. In-salon glosses every 6–8 weeks will keep the tone fresher for longer."
    },
    {
      question: "Keratin vs. smoothing — which lasts longer?",
      answer: "Keratin treatments (formaldehyde-free) generally outlast quick smoothing services, giving 2–4 months of frizz reduction with proper care. Smoothing services are gentler and great for first-timers or colour-treated hair, lasting 4–8 weeks. Longevity depends on aftercare: sulphate-free cleanser, low heat, UV protection, and avoiding salt/chlorine. If you're blonde or fine-textured, start with smoothing; if you're coarse or highly porous, a keratin option may give better durability."
    },
    {
      question: "How do I book an appointment?",
      answer: "Click any 'Book on Fresha' button on this page or visit our booking page. You can book 24/7 online and choose your preferred date and time. New clients are always welcome! If you're unsure which service to book, start with a free consultation."
    },
    {
      question: "What should I do to prepare for my color appointment?",
      answer: "Come with clean, dry hair (no product). Bring inspiration photos if you have them. During your complimentary consultation, we'll discuss your hair goals, assess your current condition, and create a custom color plan tailored to your lifestyle and maintenance preferences."
    },
    {
      question: "How long do color services take?",
      answer: "Full color and highlights typically take 2-3 hours. Balayage can take 3-4 hours for a full application. Root touch-ups are usually 90 minutes. We always allocate extra time for consultations and customization to ensure you're comfortable throughout."
    },
    {
      question: "Are your products safe for color-treated hair?",
      answer: "Yes! All our retail products and in-salon treatments are sulfate-free and formulated to protect color. We use premium brands like Olaplex, Kevin Murphy, and Moroccan Oil—chosen specifically for their gentle, color-preserving formulas that extend vibrancy between appointments."
    },
    {
      question: "What's the difference between Olaplex and Keratin treatments?",
      answer: "Olaplex repairs broken bonds in damaged hair—great for color-treated or over-processed hair that needs structural repair. Keratin smooths frizz and adds shine for 3–4 months by infusing proteins into the cuticle. Both can be combined for maximum results if you want repair and smoothing."
    },
  ];

  // Generate schemas
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema('https://hairpinns.com/services');
  
  const serviceSchemas = [
    generateServiceSchema({
      name: 'Colour & Blonding Services',
      description: 'Expert hair colouring including balayage, highlights, full colour, and toning services for vibrant, long-lasting results.',
      url: 'https://hairpinns.com/services#colour',
    }),
    generateServiceSchema({
      name: 'Smoothing & Treatment Services',
      description: 'Keratin smoothing, deep conditioning, and bond-building treatments to restore health and eliminate frizz.',
      url: 'https://hairpinns.com/services#smoothing',
    }),
    generateServiceSchema({
      name: 'Cuts & Styling Services',
      description: 'Precision haircuts and expert styling tailored to your face shape, hair texture, and lifestyle.',
      url: 'https://hairpinns.com/services#cuts',
    }),
  ];

  const faqSchema = generateFAQPageSchema(faqs);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hair Salon Services | Colour, Smoothing & Cuts | Hair Pinns Bangor</title>
        <meta
          name="description"
          content="Expert hair services in Bangor: Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Over 20 years of experience. Book online now."
        />
        <link rel="canonical" href="https://hairpinns.com/services" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        {serviceSchemas.map((schema, index) => (
          <script key={`service-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />
      <main>
        {/* Hero */}
        <section className="bg-accent py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
              Salon Services
            </h1>
            <p className="text-lg text-foreground leading-relaxed">
              Welcome to Hair Pinns, your boutique hair salon in Bangor, NSW. 
              Serving the Sutherland Shire with expert cuts, color, and treatments since 2018. 
              Jena brings over 10 years of professional experience, honest care, 
              and a passion for helping you love your hair.
            </p>
          </div>
        </section>

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
              {services.colour.map((service, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base"
                >
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a
                    href="https://www.fresha.com/book-now/hair-pinns-example"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <Calendar className="w-4 h-4" />
                      Book on Fresha
                    </Button>
                  </a>
                </div>
              ))}
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
              {services.treatments.map((service, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base"
                >
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a
                    href="https://www.fresha.com/book-now/hair-pinns-example"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <Calendar className="w-4 h-4" />
                      Book on Fresha
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mid-page Consult CTA */}
        <section className="py-12 bg-brand-500 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h2-lg font-heading font-bold mb-4">
              Not sure which service is right for you?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Book a free 15-minute consultation with Jena. We'll assess your hair, 
              discuss your goals, and create a custom plan.
            </p>
            <a
              href="https://www.fresha.com/book-now/hair-pinns-example"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg" className="bg-white text-brand-500 hover:bg-white/90">
                <Calendar className="w-5 h-5" />
                Book Free Consult
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
              {services.cuts.map((service, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base"
                >
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a
                    href="https://www.fresha.com/book-now/hair-pinns-example"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <Calendar className="w-4 h-4" />
                      Book on Fresha
                    </Button>
                  </a>
                </div>
              ))}
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
              {services.addons.map((service, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base"
                >
                  <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground mb-4">{service.value}</p>
                  <p className="text-xl font-bold text-brand-500 mb-4">
                    {service.price}
                  </p>
                  <a
                    href="https://www.fresha.com/book-now/hair-pinns-example"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <Calendar className="w-4 h-4" />
                      Book on Fresha
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card border border-border rounded-card px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-heading hover:text-brand-500">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground leading-relaxed">
                    <div>{faq.answer}</div>
                    <FaqFeedbackWidget question={faq.question} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-12 pt-8 border-t border-border">
              <p className="text-foreground mb-6">
                Still have questions? We're here to help.
              </p>
              <a
                href="https://www.fresha.com/book-now/hair-pinns-example"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  <Calendar className="w-5 h-5" />
                  Book Your Appointment
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
