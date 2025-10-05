import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Sparkles, Wind, Scissors, MessageCircle } from "lucide-react";
import { getOGImage } from "@/lib/sitemap";

const Booking = () => {
  const bookingCategories = [
    {
      title: "Colour & Blonding",
      icon: Sparkles,
      description: "Balayage, highlights, full color, toning",
      deepLink: "https://www.fresha.com/book-now/hair-pinns-example?category=colour"
    },
    {
      title: "Smoothing & Treatments",
      icon: Wind,
      description: "Keratin, Olaplex, deep conditioning",
      deepLink: "https://www.fresha.com/book-now/hair-pinns-example?category=treatments"
    },
    {
      title: "Cuts & Styling",
      icon: Scissors,
      description: "Women's, men's, blow dry, styling",
      deepLink: "https://www.fresha.com/book-now/hair-pinns-example?category=cuts"
    },
    {
      title: "Free Consultation",
      icon: MessageCircle,
      description: "15-min hair & product advice",
      deepLink: "https://www.fresha.com/book-now/hair-pinns-example?service=consultation"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Select Service",
      description: "Browse our services and choose what suits your hair goals. Not sure? Book a free consultation first."
    },
    {
      number: 2,
      title: "Choose Time",
      description: "Pick a date and time that works for you. View real-time availability 24/7 through Fresha."
    },
    {
      number: 3,
      title: "Confirm",
      description: "Enter your details, add any notes, and confirm. You'll receive instant confirmation via email and SMS."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Book Appointment Online | Hair Pinns Bangor | 24/7 Booking</title>
        <meta 
          name="description" 
          content="Book your hair appointment online 24/7 via Fresha. Colour, treatments, cuts & styling. Instant confirmation. Same-day available." 
        />
        <link rel="canonical" href="https://hairpinns.com/booking" />
        <meta property="og:title" content="Book Your Appointment | Hair Pinns Bangor" />
        <meta property="og:description" content="Book online 24/7 via Fresha. Colour, smoothing, cuts & styling. Instant confirmation. Free consultations available." />
        <meta property="og:url" content="https://hairpinns.com/booking" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('service')} />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/booking" />
      </Helmet>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-accent py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
              Book Your Appointment
            </h1>
            <p className="text-lg text-foreground mb-8 leading-relaxed">
              Ready to transform your hair? Book online 24/7 through Fresha—choose your service, 
              pick your time, and get instant confirmation. It's fast, secure, and hassle-free.
            </p>
            
            {/* Above-the-fold Consult Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.fresha.com/book-now/hair-pinns-example"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="xl">
                  <Calendar className="w-5 h-5" />
                  Book Now on Fresha
                </Button>
              </a>
              <a
                href="https://www.fresha.com/book-now/hair-pinns-example?service=consultation"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="accent" size="xl">
                  <MessageCircle className="w-5 h-5" />
                  Free Consultation
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Booking Categories */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              Choose Your Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bookingCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <a
                    key={index}
                    href={category.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base text-center h-full flex flex-col">
                      <div className="w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-base">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-foreground mb-4 flex-grow">
                        {category.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Book This Service
                      </Button>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 bg-muted">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-12 text-center">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="bg-card border border-border rounded-card p-6 h-full">
                    <div className="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-heading mb-3">
                      {step.title}
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {/* Connector Arrow (hidden on mobile, shown on desktop) */}
                  {step.number < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-brand-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fresha Embed */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              Book Online Now
            </h2>
            
            {/* Fresha iframe embed (replace with actual embed code) */}
            <div className="bg-card border border-border rounded-card overflow-hidden" style={{ minHeight: "600px" }}>
              <div className="p-12 text-center">
                <p className="text-foreground mb-6">
                  Click below to open the Fresha booking widget and secure your appointment.
                </p>
                <a
                  href="https://www.fresha.com/book-now/hair-pinns-example"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="xl">
                    <Calendar className="w-5 h-5" />
                    Open Fresha Booking
                  </Button>
                </a>
                <p className="text-sm text-muted-foreground mt-6">
                  Prefer to call? <a href="tel:+61295550123" className="text-brand-500 font-semibold hover:text-brand-600">(02) 9555 0123</a>
                </p>
              </div>
            </div>

            {/* Integration note: Replace the div above with actual Fresha embed code */}
            {/* Example: 
            <iframe 
              src="https://www.fresha.com/embed/YOUR_SALON_ID" 
              width="100%" 
              height="600" 
              frameBorder="0"
            ></iframe>
            */}
          </div>
        </section>

        {/* Policies & Info */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              Before You Book
            </h2>
            
            <div className="bg-card border border-border rounded-card p-8 mb-8">
              <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                Important Information
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>Cancellation Policy:</strong> Please give us 24 hours notice if you need to reschedule. 
                    Late cancellations may incur a 50% fee.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>Late Arrivals:</strong> Arriving more than 15 minutes late may result in a shortened 
                    service or rescheduling to accommodate other clients.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>Consultation:</strong> All color services include a complimentary consultation. 
                    First-time clients are encouraged to book a separate consultation first.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>Payment:</strong> We accept cash, card, and digital payments. 
                    Klarna & Afterpay available for services over $100.
                  </span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                By booking, you agree to our terms and policies.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/policies/returns" className="text-brand-500 hover:text-brand-600 transition-colors">
                  Cancellation Policy
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/privacy" className="text-brand-500 hover:text-brand-600 transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/terms" className="text-brand-500 hover:text-brand-600 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Alternative */}
        <section className="py-12 bg-brand-500 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-h2-lg font-heading font-bold mb-4">
              Questions About Booking?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              We're here to help! Call or text us, or visit our FAQ page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+61295550123">
                <Button variant="secondary" size="lg" className="bg-white text-brand-500 hover:bg-white/90">
                  Call: (02) 9555 0123
                </Button>
              </a>
              <Link to="/services#faqs">
                <Button variant="secondary" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-500">
                  View FAQs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
