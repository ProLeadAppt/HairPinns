import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Award, Heart, ShoppingBag, Calendar, MapPin } from "lucide-react";
import { getOGImage } from "@/lib/sitemap";

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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Jena & Hair Pinns Bangor | Boutique Hair Salon</title>
        <meta 
          name="description" 
          content="Meet Jena, founder of Hair Pinns boutique salon in Bangor. 15+ years experience in colour, smoothing & cuts. Sutherland Shire expert. Honest care, expert results." 
        />
        <link rel="canonical" href="https://hairpinns.com/about" />
        <meta property="og:title" content="About Jena & Hair Pinns | Boutique Salon Bangor" />
        <meta property="og:description" content="Meet Jena, your expert stylist with 15+ years experience. Specializing in colour, smoothing & cuts in Bangor and Sutherland Shire, NSW." />
        <meta property="og:url" content="https://hairpinns.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('default')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Jena & Hair Pinns Bangor" />
        <meta name="twitter:description" content="15+ years experience in colour, smoothing & cuts. Sutherland Shire expert. Honest care, expert results." />
        <meta name="twitter:image" content={getOGImage('default')} />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/about" />
        <script type="application/ld+json">
          {JSON.stringify(jenaPersonSchema)}
        </script>
      </Helmet>
      <Header />
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
      </main>
      <Footer />
    </div>
  );
};

export default About;
