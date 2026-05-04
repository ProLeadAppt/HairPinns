import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Award, Heart, ShoppingBag, Calendar, MapPin } from "lucide-react";
import { getOGImage } from "@/lib/sitemap";
import ImageGallery from "@/components/gallery/ImageGallery";
import SEOHead from "@/components/SEOHead";
import { generateFAQPageSchema, generateBreadcrumbSchema } from "@/lib/schema";

// Salon & results gallery images
import salonInterior from "@/assets/images/hair.pinns_1773312619_3851143514822403759_2244281067.avif";
import meetJena from "@/assets/images/hair.pinns_1773475216_3852511796603497709_2244281067.avif";
import stylingResult from "@/assets/images/hair.pinns_1772611255_3845264367588032981_2244281067.avif";
import beforeAfter from "@/assets/images/hair.pinns_1773039624_3848857785505671354_2244281067.avif";
import blondeResult from "@/assets/images/hair.pinns_1765910087_3789049150835962518_2244281067.avif";
import curlsResult from "@/assets/images/hair.pinns_1762034298_3756538425064543892_2244281067.avif";
import bobResult from "@/assets/images/hair.pinns_1765870058_3788713832378613694_2244281067.avif";
import highlightResult from "@/assets/images/hair.pinns_1766442955_3793520917994535355_2244281067.avif";
import pureProducts from "@/assets/images/hair.pinns_1773699035_3854389326693067947_2244281067.avif";

const jenaPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jena Pinn",
  "jobTitle": "Hair Stylist & Colorist",
  "description": "Founder of Hair Pinns boutique salon in Bangor, NSW. 15+ years experience specializing in Colour & Blonding, Straight Up Smoothing Treatments, and precision Cuts & Styling for the Sutherland Shire.",
  "image": "https://hairpinns.com/jena-headshot.webp",
  "url": "https://hairpinns.com/about",
  "worksFor": {
    "@type": "Organization",
    "name": "Hair Pinns",
    "url": "https://hairpinns.com"
  },
  "knowsAbout": ["Hair Coloring", "Hair Blonding", "Balayage", "Hair Smoothing", "Keratin Treatments", "Hair Cutting", "Hair Styling"],
  "areaServed": {
    "@type": "City",
    "name": "Sutherland Shire",
    "addressRegion": "NSW",
    "addressCountry": "AU"
  }
};
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import Breadcrumbs from "@/components/Breadcrumbs";
// Use salon hero image until Jena provides a headshot
import jenaHeadshot from "@/assets/images/hero-salon-1280w.webp";

const About = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      text: "I went to Jena after a box dye went wrong. She didn't try to fix it all in one go. Took three sessions, was upfront about the cost, and now my blonde actually looks like I wanted it to. Won't go anywhere else.",
      rating: 5
    },
    {
      name: "Emma L.",
      text: "Been going to Jena for three years. She told me not to get a smoothing treatment once because my hair wasn't damaged enough to need one. That's when I knew she was genuine.",
      rating: 5
    },
    {
      name: "Michelle T.",
      text: "Finally found someone who knows how to cut curly hair without straightening it first. Jena cuts it dry, knows how curls sit, and the shape actually holds between washes. Game changer.",
      rating: 5
    }
  ];

  // Gallery images hidden until Jena provides real salon photos
  // To restore: add real image paths and uncomment the gallery section below
  // const galleryImages = [
  //   { src: "...", alt: "Hair Pinns salon interior with styling stations" },
  //   { src: "...", alt: "Jena styling a client" },
  //   { src: "...", alt: "Product display with premium hair care" },
  //   { src: "...", alt: "Welcome area and reception" }
  // ];

  const aboutFaqs = [
    {
      question: "How long has Jena been doing hair?",
      answer: "Jena has been a professional hairstylist since 2009 — more than 15 years behind the chair. She runs Hair Pinns in Bangor as a boutique salon serving the Sutherland Shire."
    },
    {
      question: "What services does Hair Pinns specialise in?",
      answer: "Hair Pinns specialises in colour and blonding, Straight Up Smoothing treatments, and precision cuts. The salon also offers foil packages, kids and formal styling, and retails professional hair care products with Australia-wide shipping."
    },
    {
      question: "Where is Hair Pinns located?",
      answer: "Hair Pinns is at 60 Goorgool Rd, Bangor NSW 2234, in Sydney's Sutherland Shire. The salon serves clients from across the Shire including Menai, Illawong, Sutherland, Cronulla, Miranda, and surrounding suburbs."
    },
    {
      question: "Do I need to book in advance?",
      answer: "Yes, Hair Pinns operates by appointment. Book online 24/7 through Fresha at hairpinns.com/booking or call 0468 093 991. Same-day appointments are sometimes available — call to ask."
    },
    {
      question: "Can I buy hair products without coming to the salon?",
      answer: "Yes. Hair Pinns ships professional hair care products Australia-wide through the online store. Jena personally selects every product she sells based on what she uses on her own clients."
    }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://hairpinns.com' },
    { name: 'About', url: 'https://hairpinns.com/about' },
  ]);
  const faqSchema = generateFAQPageSchema(aboutFaqs);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Jena & Hair Pinns Bangor | Boutique Hair Salon"
        description="Meet Jena, founder of Hair Pinns boutique salon in Bangor. 15+ years experience in colour, smoothing & cuts. Sutherland Shire expert. Honest care, expert results."
        canonical="https://hairpinns.com/about"
        ogImage={getOGImage('default')}
        ogType="website"
        schemaJson={[jenaPersonSchema, breadcrumbSchema, faqSchema]}
      />
      <Header />

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "About" }
          ]} />
        </div>
      </div>

      <main id="main-content">
        {/* Hero with Jena's Photo */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Photo */}
              <div className="order-2 lg:order-1">
                <div className="aspect-[3/4] bg-muted rounded-card overflow-hidden">
                  <img
                    src={jenaHeadshot}
                    alt="Jena Pinn, founder and lead stylist at Hair Pinns salon"
                    className="w-full h-full object-cover"
                    width="600"
                    height="800"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="order-1 lg:order-2">
                <h1 className="text-h1-lg font-heading font-bold text-heading mb-6">
                  Meet Jena
                </h1>
                <p className="text-lg text-foreground leading-relaxed mb-6">
                  I started sweeping floors and assisting in salons from 13 years old. Qualified at 17, 
                  then opened my own home salon at the end of 2009. With over 15 years of experience, 
                  I specialize in Colour & Blonding, Straight Up Smoothing Treatments, and precision Cuts & Styling 
                  for clients across the Sutherland Shire.
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  I believe beautiful hair starts with listening. Whether you're looking for a subtle refresh 
                  or a complete transformation, I'll take the time to understand your hair goals, lifestyle, 
                  and concerns, then create a plan that actually works for you. No gimmicks, no upsells, 
                  just real results you can feel good about.
                </p>

                {/* Credentials & Certifications */}
                <div className="space-y-3 mb-8">
                  <h3 className="text-lg font-heading font-semibold text-heading mb-3">Credentials & Certifications</h3>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      <strong>Vidal Sassoon Advanced Cutting ABC</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      <strong>Specialist in QIQI & Straight Up smoothing treatments</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      <strong>Foiling Master</strong>, dimensional colour and highlights
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      <strong>Sutherland Shire local</strong>, understands local climate and hair care needs
                    </span>
                  </div>
                </div>

                <p className="text-foreground italic">
                  "My favorite part of this job? Seeing clients leave the salon feeling confident and beautiful. 
                  That's what it's all about."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How I work */}
        <section className="py-16 bg-accent">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-6">
              How I work
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                I've had clients come in wanting a $400 full colour when a $95 toner would've done the job. I told them. That's the kind of salon I run.
              </p>
              <p>
                I won't upsell you. I won't recommend a treatment your hair doesn't need. If I think you should wait another month before your next appointment, I'll say so.
              </p>
              <p>
                You'll get honest advice, transparent pricing, and a plan that actually makes sense for your hair, your budget, and your life.
              </p>
            </div>
          </div>
        </section>

        {/* Our Work Gallery */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-3 text-center">
              Our Work
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              Real results from real clients. No filters, no stock photos.
            </p>
            <ImageGallery
              columns={3}
              images={[
                { src: meetJena, alt: "Jena — owner of Hair Pinns salon" },
                { src: salonInterior, alt: "Hair Pinns salon interior, Bangor" },
                { src: beforeAfter, alt: "Before and after smoothing treatment" },
                { src: stylingResult, alt: "Formal styling — curls and braids" },
                { src: blondeResult, alt: "Blonde balayage result" },
                { src: curlsResult, alt: "Bouncy curls styling" },
                { src: bobResult, alt: "Layered bob blowout" },
                { src: highlightResult, alt: "Dimensional highlights" },
                { src: pureProducts, alt: "Pure organic hair care products" },
              ]}
            />
          </div>
        </section>

        {/* Product Line Story */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-h2-lg font-heading font-bold text-heading mb-6">
                  Why I Pick My Own Products
                </h2>
                <p className="text-foreground leading-relaxed mb-6">
                  After years of trying every brand on the market, I got tired of recommending products 
                  that didn't live up to their promises. So I partnered with brands I actually trust,
                  like Juuce, QIQI, Pure and Wet Brush, to build a product range that delivers real results.
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  Every product in our collection is salon-tested and client-approved. I use these same formulas 
                  in my own hair and in the salon every day. If it doesn't pass my standards, it doesn't make the cut.
                </p>
                <p className="text-foreground leading-relaxed">
                  Need help choosing? <a href="tel:+61468093991" className="text-brand-500 font-semibold hover:text-brand-600 underline">Call us</a> or chat with Isabella for instant recommendations.
                </p>
              </div>
              <div className="aspect-square bg-muted rounded-card overflow-hidden">
                <img
                  src={jenaHeadshot}
                  alt="Jena from Hair Pinns with her product range"
                  className="w-full h-full object-cover"
                  width="600"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Community Love */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-6">
              Proud to Call Bangor Home
            </h2>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Hair Pinns is more than a salon. It's part of the Bangor community. We're proud to serve 
              clients from across the Sutherland Shire, from Menai to Woronora, Engadine to Illawong. 
              Many of our clients have been with us since day one, and we've built relationships that go 
              beyond just hair appointments.
            </p>
            <p className="text-foreground leading-relaxed max-w-2xl mx-auto">
              Located just off Menai Road with free parking out front, we're easy to find and accessible 
              for the whole Shire. Whether you're a local or visiting from nearby suburbs, 
              you'll always feel welcome here.
            </p>
          </div>
        </section>

        {/* What I specialise in */}
        <section className="py-16 bg-accent/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              What I specialise in
            </h2>
            <div className="space-y-6 text-foreground leading-relaxed">
              <p>
                <strong className="text-heading">Colour correction.</strong> If you've had a box dye disaster or your blonde has gone brassy, this is what I do best. I won't rush it. Sometimes it takes two or three sessions to get right, and I'll be upfront about that from the start.
              </p>
              <p>
                <strong className="text-heading">Smoothing treatments.</strong> Sydney's humidity is relentless. I use QIQI Vega and Juuce formulas that actually hold up in our climate. Most clients get 3 to 5 months between treatments.
              </p>
              <p>
                <strong className="text-heading">Cuts that work with your hair.</strong> I don't do one-size-fits-all. If you've got curls, I cut for curls. If your hair is fine, I cut for volume. The goal is hair you can manage yourself between visits.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-12 text-center">
              What Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-card border border-border border-l-4 border-l-brand-500 rounded-card p-6"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[hsl(var(--star-color))] fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-4xl text-brand-500/20 font-serif leading-none">&ldquo;</span>
                  <p className="text-foreground leading-relaxed mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-heading">— {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery — hidden until Jena provides real salon photos
        <section className="py-16 bg-muted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-12 text-center">
              Inside Hair Pinns
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded-card overflow-hidden">
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-slow" loading="lazy" width="400" height="400" />
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* CTA Row */}
        <section className="py-16 bg-brand-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h2-lg font-heading font-bold mb-4">
              Ready to sort your hair out?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Book your appointment or browse the products I stock.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections">
                <Button variant="secondary" size="xl" className="bg-white text-brand-500 hover:bg-white/90 w-full sm:w-auto">
                  <ShoppingBag className="w-5 h-5" />
                  Shop Collections
                </Button>
              </Link>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("about_footer_cta", "/about")}
              >
                <Button variant="secondary" size="xl" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-500 w-full sm:w-auto" aria-label="Book an appointment">
                  <Calendar className="w-5 h-5" />
                  {BOOK_CTA_LABEL}
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-lg bg-background" aria-labelledby="about-faq-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="about-faq-heading" className="text-h2 font-heading text-heading mb-6 text-center">
              Frequently asked
            </h2>
            <dl className="space-y-4">
              {aboutFaqs.map((faq) => (
                <div key={faq.question} className="rounded-md border border-border bg-card p-4">
                  <dt className="font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
