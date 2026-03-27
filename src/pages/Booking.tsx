import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Check } from "lucide-react";
import { getOGImage } from "@/lib/sitemap";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const Booking = () => {

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
        <meta property="og:description" content="Book online 24/7 via Fresha. Colour, smoothing, cuts & styling. Instant confirmation." />
        <meta property="og:url" content="https://hairpinns.com/booking" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('service')} />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/booking" />
      </Helmet>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-accent py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
              Book Your Appointment
            </h1>
            <p className="text-lg text-foreground mb-8 leading-relaxed">
              Book whenever suits you. Pick your service, pick your time, and you're sorted.
              Takes about 2 minutes.
            </p>
            <p className="text-foreground mb-8">
              Need help choosing? <a href="tel:+61468093991" className="text-brand-500 font-semibold hover:text-brand-600 underline">Call Sam</a> or chat with Isabella for instant help.
            </p>
            
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("booking_hero", "/booking")}
            >
              <Button variant="primary" size="xl" aria-label="Book an appointment">
                <Calendar className="w-5 h-5" />
                {BOOK_CTA_LABEL}
              </Button>
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="py-8 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { step: "1", label: "Pick your service" },
                { step: "2", label: "Choose a time" },
                { step: "3", label: "You're booked" },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg">{s.step}</div>
                  <p className="text-sm font-medium text-heading">{s.label}</p>
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

            <div className="bg-card border border-border rounded-card p-8 md:p-12 text-center">
              <p className="text-lg text-foreground mb-6">
                Pick your service, choose a time that works, and you're sorted. Takes about 2 minutes.
              </p>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("booking_widget", "/booking")}
                className="inline-block"
              >
                <Button variant="primary" size="xl" aria-label="Book an appointment via Fresha">
                  <Calendar className="w-5 h-5" />
                  {BOOK_CTA_LABEL}
                </Button>
              </a>

              <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">Instant confirmation</span>
                <span className="flex items-center gap-1">Free rescheduling</span>
                <span className="flex items-center gap-1">762+ five-star reviews</span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a href="tel:+61468093991" className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
                  Call 0468 093 991
                </a>
                <span className="hidden sm:inline text-muted-foreground">or</span>
                <a
                  href="https://wa.me/61468093991?text=Hi%20Jena%2C%20I%27d%20like%20to%20book%20an%20appointment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-500 font-semibold hover:text-brand-600 transition-colors"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Policies & Info */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              Heads Up Before You Book
            </h2>
            
            <div className="bg-card border border-border rounded-card p-8 mb-8">
              <h3 className="text-xl font-heading font-semibold text-heading mb-4">
                Important Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-card border border-border rounded-card p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>Cancellation Policy:</strong> Please give us 24 hours notice if you need to reschedule.
                    Late cancellations will need to be charged a 50% fee.
                  </span>
                </div>
                <div className="bg-card border border-border rounded-card p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>Late Arrivals:</strong> If you're more than 15 minutes late, you might need to reschedule
                    so we can look after everyone properly.
                  </span>
                </div>
                <div className="bg-card border border-border rounded-card p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>First-Time Clients:</strong> We'll discuss your hair goals and recommend the best service for you during your appointment.
                  </span>
                </div>
                <div className="bg-card border border-border rounded-card p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    <strong>Payment:</strong> We accept cash, card, and digital payments.
                    Klarna & Afterpay available for services over $100.
                  </span>
                </div>
              </div>
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
              <a href="tel:+61468093991">
                <Button variant="secondary" size="lg" className="bg-white text-brand-500 hover:bg-white/90">
                  Call: 0468 093 991
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
