import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Award, Heart, ShoppingBag, Calendar, MapPin } from "lucide-react";
import { getOGImage } from "@/lib/sitemap";

const About = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      text: "Jena transformed my damaged hair into something I'm actually proud of. She took the time to understand what I needed and recommended a treatment plan that really worked. Best salon experience I've ever had!",
      rating: 5
    },
    {
      name: "Emma L.",
      text: "I've been coming to Hair Pinns for 3 years now. Jena's balayage is flawless, and I love that she's honest about what will and won't work for my hair. No upselling, just genuine care.",
      rating: 5
    },
    {
      name: "Michelle T.",
      text: "As someone with curly hair, I've struggled to find a stylist who gets it. Jena is amazing! She understands texture and gave me a cut that actually works with my curls. Plus, her product recommendations are spot-on.",
      rating: 5
    }
  ];

  const galleryImages = [
    { src: "/placeholder.svg", alt: "Hair Pinns salon interior with styling stations" },
    { src: "/placeholder.svg", alt: "Jena styling a client" },
    { src: "/placeholder.svg", alt: "Product display with premium hair care" },
    { src: "/placeholder.svg", alt: "Welcome area and reception" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Jena & Hair Pinns Bangor | Boutique Hair Salon</title>
        <meta 
          name="description" 
          content="Meet Jena, founder of Hair Pinns boutique salon in Bangor. 12+ years experience in colour, balayage & keratin. Honest care, expert results." 
        />
        <link rel="canonical" href="https://hairpinns.com/about" />
        <meta property="og:title" content="About Jena & Hair Pinns | Boutique Salon Bangor" />
        <meta property="og:description" content="Meet Jena, your expert stylist with 12+ years experience. Specializing in colour, balayage & treatments in Bangor, NSW." />
        <meta property="og:url" content="https://hairpinns.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('default')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Jena & Hair Pinns Bangor" />
        <meta name="twitter:description" content="12+ years experience in colour, balayage & keratin treatments. Honest care, expert results." />
        <meta name="twitter:image" content={getOGImage('default')} />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/about" />
      </Helmet>
      <Header />
      <main>
        {/* Hero with Jena's Photo */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Photo */}
              <div className="order-2 lg:order-1">
                <div className="aspect-[3/4] bg-muted rounded-card overflow-hidden">
                  <img
                    src="/placeholder.svg"
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
                  Hi, I'm Jena Pinn—founder and lead stylist at Hair Pinns. After over 12 years in the industry, 
                  I opened my own boutique salon in 2018 with one goal: to create a space where honest care, 
                  expert technique, and genuine connection come together.
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  I believe beautiful hair starts with listening. Whether you're looking for a subtle refresh 
                  or a complete transformation, I'll take the time to understand your hair goals, lifestyle, 
                  and concerns—then create a plan that actually works for you. No gimmicks, no upsells, 
                  just real results you can feel good about.
                </p>

                {/* Credentials */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      <strong>Advanced Colorist Certificate</strong> — Toni&Guy Academy
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      <strong>Olaplex Certified Specialist</strong> — Bond-building treatments
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      <strong>12+ years experience</strong> — Specializing in color, balayage & keratin
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

        {/* Salon Philosophy */}
        <section className="py-16 bg-accent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-6">
              Our Philosophy: Honest Care
            </h2>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              At Hair Pinns, "honest care" isn't just a tagline—it's how we operate every day. 
              I'll never recommend a service you don't need or push products that won't work for your hair. 
              Instead, I focus on what will genuinely help you achieve your goals, within your budget and lifestyle.
            </p>
            <p className="text-foreground leading-relaxed max-w-2xl mx-auto">
              Whether you're maintaining healthy color, repairing damage, or trying something new, 
              you'll always get my honest opinion, transparent pricing, and a plan that makes sense for you. 
              That's the Hair Pinns difference.
            </p>
          </div>
        </section>

        {/* Product Line Story */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-h2-lg font-heading font-bold text-heading mb-6">
                  Why We Curate Our Own Product Line
                </h2>
                <p className="text-foreground leading-relaxed mb-6">
                  After years of trying every brand on the market, I got tired of recommending products 
                  that didn't live up to their promises. So I partnered with premium brands I actually trust—
                  like Olaplex, Kevin Murphy, and Moroccan Oil—to create a curated retail line that delivers real results.
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  Every product in our collection is salon-tested and client-approved. I use these same formulas 
                  in my own hair and in the salon every day. If it doesn't pass my standards, it doesn't make the cut.
                </p>
                <p className="text-foreground leading-relaxed">
                  Our Christmas Gift Packs make it easy to try complete routines at a great price. 
                  Need help choosing? <a href="/contact" className="text-brand-500 font-semibold hover:text-brand-600 underline">Message us on the contact page.</a>
                </p>
              </div>
              <div className="aspect-square bg-muted rounded-card overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Hair Pinns curated product collection display"
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
              Hair Pinns is more than a salon—it's part of the Bangor community. We're proud to serve 
              clients from across the Sutherland Shire, from Menai to Woronora, Engadine to Illawong. 
              Many of our clients have been with us since day one, and we've built relationships that go 
              beyond just hair appointments.
            </p>
            <p className="text-foreground leading-relaxed max-w-2xl mx-auto">
              Located on River Road with free parking out front, we're easy to find and accessible 
              for the whole Shire. Whether you're a local or visiting from nearby suburbs, 
              you'll always feel welcome here.
            </p>
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
                  className="bg-card border border-border rounded-card p-6"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[hsl(var(--star-color))] fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-heading">— {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 bg-muted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-12 text-center">
              Inside Hair Pinns
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-muted rounded-card overflow-hidden"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-slow"
                    loading="lazy"
                    width="400"
                    height="400"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Row */}
        <section className="py-16 bg-brand-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h2-lg font-heading font-bold mb-4">
              Ready to Experience Hair Pinns?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Book your appointment or explore our curated product collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections/christmas-gift-packs">
                <Button variant="secondary" size="xl" className="bg-white text-brand-500 hover:bg-white/90 w-full sm:w-auto">
                  <ShoppingBag className="w-5 h-5" />
                  Shop Featured Packs
                </Button>
              </Link>
              <a
                href="https://www.fresha.com/book-now/hair-pinns-example"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="xl" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-500 w-full sm:w-auto">
                  <Calendar className="w-5 h-5" />
                  Book on Fresha
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
