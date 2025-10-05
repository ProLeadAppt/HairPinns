import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Clock, MapPin } from "lucide-react";

const Booking = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader 
            title="Book Your Appointment" 
            subtitle="Schedule your visit with our expert stylists"
          />
          <div className="max-w-4xl mx-auto">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card border border-border rounded-card p-6 text-center">
                <Clock className="w-8 h-8 text-brand-500 mx-auto mb-3" />
                <h3 className="font-semibold text-heading mb-2">Hours</h3>
                <p className="text-sm text-muted-foreground">Mon-Fri: 9am-7pm<br/>Sat: 8am-5pm</p>
              </div>
              <div className="bg-card border border-border rounded-card p-6 text-center">
                <MapPin className="w-8 h-8 text-brand-500 mx-auto mb-3" />
                <h3 className="font-semibold text-heading mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">123 River Road<br/>Bangor NSW 2234</p>
              </div>
              <div className="bg-card border border-border rounded-card p-6 text-center">
                <Calendar className="w-8 h-8 text-brand-500 mx-auto mb-3" />
                <h3 className="font-semibold text-heading mb-2">Online</h3>
                <p className="text-sm text-muted-foreground">24/7 booking<br/>available on Fresha</p>
              </div>
            </div>

            {/* Fresha Embed Placeholder */}
            <div className="bg-card border border-border rounded-card p-12 text-center mb-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-h2 font-heading text-heading mb-4">
                  Book Online with Fresha
                </h3>
                <p className="text-foreground mb-6">
                  Choose your service, select your preferred time, and book instantly. 
                  It's quick, easy, and secure.
                </p>
                <Button 
                  variant="primary" 
                  size="xl"
                  onClick={() => window.open('https://fresha.com', '_blank')}
                  className="mb-4"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open Fresha Booking
                </Button>
                <p className="text-sm text-muted-foreground">
                  First-time client? Get 15% off your first visit
                </p>
              </div>
            </div>

            {/* Alternative Contact */}
            <div className="text-center">
              <p className="text-foreground mb-2">Prefer to call?</p>
              <a 
                href="tel:+61295550123" 
                className="text-brand-500 font-semibold text-lg hover:text-brand-600 transition-colors"
              >
                (02) 9555 0123
              </a>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
