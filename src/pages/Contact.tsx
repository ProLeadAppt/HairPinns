import { useState } from "react";
import { getOGImage } from "@/lib/sitemap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Input from "@/components/design-system/Input";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageSquare, Car, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";
import ContactForm from "@/components/forms/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateFAQPageSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { BUSINESS_NAP } from "@/config/businessConfig";

const contactFaqs = [
  {
    question: "What's the fastest way to contact Hair Pinns?",
    answer: "Call or SMS Jena directly on 0416 037 663 for immediate replies during opening hours. You can also chat with our AI assistant Isabella 24/7 via the chat widget, or send a message through the contact form and we'll respond within one business day."
  },
  {
    question: "Can I book an appointment by phone?",
    answer: "Yes — call 0416 037 663. For after-hours bookings, use the 24/7 online booking system via Fresha at hairpinns.com/booking."
  },
  {
    question: "What are your opening hours?",
    answer: "Tuesday 10am–5pm, Wednesday 6pm–9pm, Thursday 9am–9pm, Friday 9am–5:30pm, Saturday 8am–2pm. Closed Sunday and Monday."
  },
  {
    question: "Is there parking at the salon?",
    answer: "Yes, there's free on-street parking directly outside the salon on Goorgool Rd, Bangor."
  }
];

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
    phone: "0416 037 663",
    phoneRaw: "+61416037663",
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
      <SEOHead
        title="Contact Hair Pinns Bangor | Call 0416 037 663"
        description="Visit Hair Pinns in Bangor, Sutherland Shire NSW. Call 0416 037 663. Free parking, easy access. Open Tue-Sat. Shop hair products Australia-wide online."
        canonical="https://hairpinns.com/contact"
        ogImage={getOGImage('default')}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={[
          localBusinessSchema,
          generateFAQPageSchema(contactFaqs),
          generateBreadcrumbSchema([
            { name: 'Home', url: 'https://hairpinns.com' },
            { name: 'Contact', url: 'https://hairpinns.com/contact' },
          ]),
        ]}
      />

      <Header />

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Contact" }
          ]} />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="flex-grow">
        {/* Hero Section */}
        <Section className="pt-xl pb-lg">
          <SectionHeader as="h1" title="Visit Hair Pinns Bangor" subtitle="Easy parking, friendly welcome, honest service." />
        </Section>

        {/* NAP Block & Map */}
        <Section variant="muted" padding="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="bg-card border border-border border-l-4 border-l-brand-500 rounded-card p-8 mb-8">
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
              <div className="bg-card border border-border border-l-4 border-l-green-500 rounded-card p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <Clock className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-semibold text-heading">Opening Hours</h3>
                      {(() => {
                        const now = new Date();
                        const day = now.getDay();
                        const hour = now.getHours();
                        const isOpen = (day === 2 && hour >= 10 && hour < 17) ||
                          (day === 3 && hour >= 18 && hour < 21) ||
                          (day === 4 && hour >= 9 && hour < 21) ||
                          (day === 5 && hour >= 9 && hour < 17) ||
                          (day === 6 && hour >= 8 && hour < 14);
                        return (
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isOpen ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                            {isOpen ? "Open now" : "Currently closed"}
                          </span>
                        );
                      })()}
                    </div>
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
              <div className="bg-accent/10 border border-accent/20 border-l-4 border-l-blue-500 rounded-card p-6">
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
                Jena and Isabella are available 24/7 to answer your questions, help with bookings, and provide product recommendations. For detailed inquiries that need Jena's expertise, you can leave a message and she'll call you back within 24 hours.
              </p>
            </div>

            {/* Primary Contact Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-card border border-border rounded-card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-xl font-heading font-bold text-heading mb-3">Call Jena</h3>
                <p className="text-foreground mb-6">
                  Speak directly with Jena for instant answers to your hair questions and booking assistance.
                </p>
                <Button 
                  asChild
                  size="lg"
                  variant="primary"
                  className="w-full bg-brand-500 hover:bg-brand-600"
                >
                  <a href={BUSINESS_NAP.phone.tel} className="no-link-color">
                    <Phone className="w-5 h-5" />
                    Call: 0416 037 663
                  </a>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-xl font-heading font-bold text-heading mb-3">Chat with Isabella</h3>
                <p className="text-foreground mb-6">
                  Get instant help from Isabella, available 24/7 for product advice and booking.
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
