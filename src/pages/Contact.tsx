import { useState } from "react";
import { Helmet } from "react-helmet";
import { getOGImage } from "@/lib/sitemap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Input from "@/components/design-system/Input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageSquare, Car, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";
import ContactForm from "@/components/forms/ContactForm";
const Contact = () => {
  const {
    toast
  } = useToast();
  const [smsPhone, setSmsPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [smsSubmitted, setSmsSubmitted] = useState(false);
  const businessInfo = {
    name: "Hair Pinns",
    address: "60 Goorgool Rd, Bangor NSW 2234",
    phone: "0468 093 991",
    phoneRaw: "+61468093991",
    email: "hairpinns1@gmail.com",
    hours: [{
      day: "Monday",
      hours: "Closed",
      isOpen: false
    }, {
      day: "Tuesday",
      hours: "10:00 AM - 5:00 PM",
      isOpen: true
    }, {
      day: "Wednesday",
      hours: "6:00 PM - 9:00 PM",
      isOpen: true
    }, {
      day: "Thursday",
      hours: "9:00 AM - 9:00 PM",
      isOpen: true
    }, {
      day: "Friday",
      hours: "9:00 AM - 5:30 PM",
      isOpen: true
    }, {
      day: "Saturday",
      hours: "8:00 AM - 2:00 PM",
      isOpen: true
    }, {
      day: "Sunday",
      hours: "Closed",
      isOpen: false
    }]
  };
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": businessInfo.name,
    "image": "https://hairpinns.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "60 Goorgool Rd",
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
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Tuesday",
      "opens": "10:00",
      "closes": "17:00"
    }, {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Wednesday",
      "opens": "18:00",
      "closes": "21:00"
    }, {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Thursday",
      "opens": "09:00",
      "closes": "21:00"
    }, {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "09:00",
      "closes": "17:30"
    }, {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "14:00"
    }],
    "priceRange": "$$",
    "url": "https://hairpinns.com",
    "sameAs": ["https://www.facebook.com/Hair.Pinns", "https://www.instagram.com/hair.pinns/"]
  };
  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsConsent) {
      toast({
        title: "Consent Required",
        description: "Please agree to receive SMS updates to continue.",
        variant: "destructive"
      });
      return;
    }
    const hpCaptureModule = await import("@/lib/hpCapture");
    const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
    const success = await hpCapture.postToZapier({
      form_name: "sms_optin",
      phone: smsPhone,
      consent_marketing: smsConsent
    }, {
      event: "sms_subscription"
    });
    if (success) {
      setSmsSubmitted(true);
      toast({
        title: "Success!",
        description: "You're subscribed to our SMS updates."
      });
    } else {
      toast({
        title: "Submission Error",
        description: "We couldn't process your subscription. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Hair Pinns Bangor | Call 0468 093 991</title>
        <meta name="description" content="Visit Hair Pinns in Bangor, Sutherland Shire NSW. Call 0468 093 991. Free parking, easy access. Open Tue-Sat. Shop hair products Australia-wide online." />
        <link rel="canonical" href="https://hairpinns.com/contact" />
        <meta property="og:title" content="Contact Hair Pinns Bangor | Visit Our Salon" />
        <meta property="og:description" content="60 Goorgool Rd, Bangor NSW 2234. Call 0468 093 991. Free parking, open Tue-Sat." />
        <meta property="og:url" content="https://hairpinns.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('default')} />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/contact" />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <Header />
      
      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <Section className="pt-xl pb-lg">
          <SectionHeader title="Visit Hair Pinns Bangor" subtitle="Your Sutherland Shire hair specialists—easy parking, warm welcome, honest care." />
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
                      <a href="https://maps.google.com/?q=60+Goorgool+Rd+Bangor+NSW+2234" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-brand-500 transition-colors">
                        60 Goorgool Rd<br />Bangor NSW 2234
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-heading mb-1">Phone</h3>
                      <div className="flex flex-col gap-2">
                        <a href={`tel:${businessInfo.phoneRaw}`} className="text-foreground hover:text-brand-500 transition-colors">
                          {businessInfo.phone}
                        </a>
                        <a href={`sms:${businessInfo.phoneRaw}`} className="text-sm text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1">
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
                      <a href={`mailto:${businessInfo.email}`} className="text-foreground hover:text-brand-500 transition-colors">
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
                      {businessInfo.hours.map(item => <div key={item.day} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="text-foreground font-medium">{item.day}</span>
                          <span className={item.isOpen ? "text-foreground" : "text-muted-foreground"}>
                            {item.hours}
                          </span>
                        </div>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parking Tips */}
              <div className="bg-accent/10 border border-accent/20 rounded-card p-6">
                <div className="flex items-start gap-4">
                  <Car className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-heading mb-2">Parking Tips</h3>
                    <ul className="space-y-2 text-foreground text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                        <span>Free street parking directly in front of salon</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                        <span>Additional parking behind building (rear entrance)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
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
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.5!2d151.0333!3d-34.0186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c4d1c7b3c3b3%3A0xe36f79e949fabda0!2s60%20Goorgool%20Rd%2C%20Bangor%20NSW%202234!5e0!3m2!1sen!2sau!4v1234567890" width="100%" height="100%" style={{
                border: 0
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Hair Pinns Bangor Location" />
              </div>
            </div>
          </div>
        </Section>

        {/* SMS Opt-in — removed until form is implemented */}

        {/* AI Agents CTA Section */}
        <Section variant="muted" padding="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-heading text-heading mb-4">Need Help? We're Here 24/7</h2>
              <p className="text-lg text-foreground mb-8">
                Sam and Isabella are available around the clock to answer your questions, help with bookings, and provide product recommendations. For detailed inquiries that need Jena's expertise, you can leave a message and she'll call you back within 24 hours.
              </p>
            </div>

            {/* Primary Contact Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-card border border-border rounded-card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-xl font-heading font-bold text-heading mb-3">Call Sam</h3>
                <p className="text-foreground mb-6">
                  Speak directly with Sam for instant answers to your hair questions and booking assistance.
                </p>
                <Button 
                  asChild
                  size="lg"
                  variant="primary"
                  className="w-full bg-brand-500 hover:bg-brand-600"
                >
                  <a href="tel:+61468093991" className="no-link-color">
                    <Phone className="w-5 h-5" />
                    Call: 0468 093 991
                  </a>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-xl font-heading font-bold text-heading mb-3">Chat with Isabella</h3>
                <p className="text-foreground mb-6">
                  Get instant help from Isabella, our AI assistant, available 24/7 for product advice and booking.
                </p>
                <Button 
                  onClick={() => {
                    const selectors = [
                      'div[id*="chat-widget"]',
                      'div[class*="chat-widget"]',
                      '[data-chat-bubble]',
                      'button[aria-label*="chat"]'
                    ];
                    
                    for (const selector of selectors) {
                      const element = document.querySelector(selector) as HTMLElement | null;
                      if (element && element.tagName !== 'IFRAME') {
                        element.style.outline = '3px solid rgba(139,74,139,0.9)';
                        element.style.outlineOffset = '3px';
                        element.style.transition = 'outline-color 300ms ease';
                        setTimeout(() => {
                          element.style.outline = '';
                          element.style.outlineOffset = '';
                        }, 2500);
                        break;
                      }
                    }

                    toast({
                      title: "Chat with Isabella",
                      description: "Look for the chat bubble at the bottom-right to start chatting.",
                    });
                  }}
                  size="lg"
                  variant="primary"
                  className="w-full bg-brand-500 hover:bg-brand-600"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat Now
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-muted text-muted-foreground">Or leave a message for Jena</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="text-center mb-8">
              <h3 className="text-h3 font-heading font-bold text-heading mb-3">Leave a Message for Jena</h3>
              <p className="text-foreground">
                For detailed inquiries that need Jena's personal expertise, leave a message below. 
                She'll review it and call you back within 24 hours.
              </p>
            </div>

            <ContactForm formName="contact_page" title="" description="" showTopic={true} />
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>;
};
export default Contact;