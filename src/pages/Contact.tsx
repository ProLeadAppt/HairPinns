import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Input from "@/components/design-system/Input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageSquare, Car, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [smsPhone, setSmsPhone] = useState("");
  const [smsSubmitted, setSmsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const businessInfo = {
    name: "Hair Pinns",
    address: "123 River Road, Bangor NSW 2234",
    phone: "(02) 9555 0123",
    phoneRaw: "+61295550123",
    email: "hello@hairpinns.com",
    hours: [
      { day: "Monday", hours: "9:00 AM - 7:00 PM", isOpen: true },
      { day: "Tuesday", hours: "9:00 AM - 7:00 PM", isOpen: true },
      { day: "Wednesday", hours: "9:00 AM - 7:00 PM", isOpen: true },
      { day: "Thursday", hours: "9:00 AM - 7:00 PM", isOpen: true },
      { day: "Friday", hours: "9:00 AM - 7:00 PM", isOpen: true },
      { day: "Saturday", hours: "8:00 AM - 5:00 PM", isOpen: true },
      { day: "Sunday", hours: "Closed", isOpen: false }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": businessInfo.name,
    "image": "https://hairpinns.com.au/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 River Road",
      "addressLocality": "Bangor",
      "addressRegion": "NSW",
      "postalCode": "2234",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -34.0186,
      "longitude": 151.0367
    },
    "telephone": businessInfo.phoneRaw,
    "email": businessInfo.email,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$",
    "url": "https://hairpinns.com.au",
    "sameAs": [
      "https://www.facebook.com/hairpinns",
      "https://www.instagram.com/hairpinns"
    ]
  };

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { hpCapture } = await import("@/lib/hpCapture");
    
    const success = await hpCapture.postToZapier(
      {
        form_name: "sms_optin",
        phone: smsPhone,
      },
      { event: "sms_subscription" }
    );
    
    if (success) {
      setSmsSubmitted(true);
      toast({
        title: "Success!",
        description: "You're subscribed to our SMS updates.",
      });
    } else {
      toast({
        title: "Submission Error",
        description: "We couldn't process your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { hpCapture } = await import("@/lib/hpCapture");
    
    const success = await hpCapture.postToZapier(
      {
        form_name: "contact_jena",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      },
      { event: "contact_form_submission" }
    );
    
    if (success) {
      toast({
        title: "Message Sent!",
        description: "Jena will get back to you within 24 hours.",
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
    } else {
      toast({
        title: "Submission Error",
        description: "We couldn't send your message. Please call us instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Hair Pinns Bangor | Book Your Appointment</title>
        <meta name="description" content="Visit Hair Pinns salon in Bangor, Sutherland Shire. Call (02) 9555 0123 or message Jena directly. Easy parking, walk-ins welcome." />
        <link rel="canonical" href="https://hairpinns.com.au/contact" />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Section className="pt-xl pb-lg">
          <SectionHeader 
            title="Visit Hair Pinns Bangor" 
            subtitle="Your Sutherland Shire hair specialists—easy parking, warm welcome, honest care."
          />
        </Section>

        {/* NAP Block & Map */}
        <Section variant="muted" padding="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="bg-card border border-border rounded-card p-8 mb-8">
                <h2 className="text-h2 font-heading text-heading mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-heading mb-1">Address</h3>
                      <a 
                        href="https://maps.google.com/?q=123+River+Road+Bangor+NSW+2234"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-brand-500 transition-colors"
                      >
                        123 River Road<br/>Bangor NSW 2234
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-heading mb-1">Phone</h3>
                      <div className="flex flex-col gap-2">
                        <a 
                          href={`tel:${businessInfo.phoneRaw}`}
                          className="text-foreground hover:text-brand-500 transition-colors"
                        >
                          {businessInfo.phone}
                        </a>
                        <a 
                          href={`sms:${businessInfo.phoneRaw}`}
                          className="text-sm text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Send SMS
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-heading mb-1">Email</h3>
                      <a 
                        href={`mailto:${businessInfo.email}`}
                        className="text-foreground hover:text-brand-500 transition-colors"
                      >
                        {businessInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-card border border-border rounded-card p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <Clock className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-heading mb-4">Opening Hours</h3>
                    <div className="space-y-2">
                      {businessInfo.hours.map((item) => (
                        <div 
                          key={item.day}
                          className="flex justify-between items-center py-2 border-b border-border last:border-0"
                        >
                          <span className="text-foreground font-medium">{item.day}</span>
                          <span className={item.isOpen ? "text-foreground" : "text-muted-foreground"}>
                            {item.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parking Tips */}
              <div className="bg-accent/10 border border-accent/20 rounded-card p-6">
                <div className="flex items-start gap-4">
                  <Car className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-heading mb-2">Parking Tips</h3>
                    <ul className="space-y-2 text-foreground text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Free street parking directly in front of salon</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Additional parking behind building (rear entrance)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Wheelchair accessible entrance and facilities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="aspect-square bg-muted rounded-card overflow-hidden sticky top-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3314.3!2d151.0367!3d-34.0186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAxJzA2LjkiUyAxNTHCsDAyJzEyLjEiRQ!5e0!3m2!1sen!2sau!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hair Pinns Bangor Location"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* SMS Opt-in */}
        <Section padding="lg">
          <div className="max-w-2xl mx-auto">
            <div className="bg-brand-500 text-white rounded-card p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-h2 font-heading mb-3">Get Appointment Reminders via SMS</h3>
              <p className="mb-6 opacity-90">
                Never miss your appointment. Plus, receive exclusive offers and hair care tips.
              </p>
              
              {!smsSubmitted ? (
                <form onSubmit={handleSmsSubmit} className="max-w-md mx-auto">
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="Your mobile number"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Button 
                      type="submit"
                      className="bg-white text-brand-500 hover:bg-white/90 whitespace-nowrap"
                    >
                      Sign Up
                    </Button>
                  </div>
                  <p className="text-xs mt-3 opacity-75">
                    By signing up, you agree to receive SMS updates. Reply STOP to opt out anytime.
                  </p>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>You're subscribed! Thank you.</span>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Message Jena Form */}
        <Section variant="muted" padding="xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-h2 font-heading text-heading mb-3">Message Jena</h2>
              <p className="text-foreground">
                Have questions about services, products, or availability? Send Jena a direct message 
                and she'll reply within 24 hours.
              </p>
            </div>

            <div className="bg-card border border-border rounded-card p-8">
              <form onSubmit={handleMessageSubmit} className="space-y-6">
                <Input 
                  label="Your Name"
                  type="text"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                
                <Input 
                  label="Email Address"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                
                <Input 
                  label="Phone Number"
                  type="tel"
                  placeholder="(02) 1234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    Your Message
                  </Label>
                  <Textarea 
                    id="message"
                    placeholder="Tell Jena what you need help with..."
                    rows={6}
                    className="rounded-btn"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit"
                  className="w-full"
                >
                  Send Message to Jena
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  For urgent appointments, please call <a href={`tel:${businessInfo.phoneRaw}`} className="text-brand-500 hover:underline">{businessInfo.phone}</a>
                </p>
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
