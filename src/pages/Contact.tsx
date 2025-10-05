import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Input from "@/components/design-system/Input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader 
            title="Get In Touch" 
            subtitle="We'd love to hear from you"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-h2 font-heading text-heading mb-6">Visit Our Salon</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-heading mb-1">Address</h3>
                    <p className="text-foreground">123 River Road<br/>Bangor NSW 2234</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-heading mb-1">Phone</h3>
                    <a 
                      href="tel:+61295550123" 
                      className="text-foreground hover:text-brand-500 transition-colors"
                    >
                      (02) 9555 0123
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-heading mb-1">Email</h3>
                    <a 
                      href="mailto:hello@hairpinns.com" 
                      className="text-foreground hover:text-brand-500 transition-colors"
                    >
                      hello@hairpinns.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-heading mb-1">Hours</h3>
                    <div className="text-foreground">
                      <p>Monday - Friday: 9am - 7pm</p>
                      <p>Saturday: 8am - 5pm</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-muted rounded-card overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <p>Map integration would go here</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-h2 font-heading text-heading mb-6">Send Us a Message</h2>
              
              <form className="space-y-6">
                <Input 
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  required
                />
                
                <Input 
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
                
                <Input 
                  label="Phone"
                  type="tel"
                  placeholder="(02) 1234 5678"
                />
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </Label>
                  <Textarea 
                    id="message"
                    placeholder="How can we help you?"
                    rows={6}
                    className="rounded-btn"
                    required
                  />
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit"
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
