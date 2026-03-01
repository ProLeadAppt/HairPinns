import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    details: ["60 Goorgool Rd", "Bangor NSW 2234"],
    link: "https://maps.google.com/?q=60+Goorgool+Rd+Bangor+NSW+2234",
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["0468 093 991"],
    link: "tel:+61468093991",
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Tue: 10am-5pm, Wed: 6-9pm", "Thu: 9am-9pm, Fri: 9am-5:30pm", "Sat: 8am-2pm"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["hairpinns1@gmail.com"],
    link: "mailto:hairpinns1@gmail.com",
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Visit Our Salon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Located in Bangor NSW, we're easily accessible throughout the Sutherland Shire. 
            Need help? <a href="tel:+61468093991" className="text-brand-500 font-semibold hover:text-brand-600 underline">Call Sam on 0468 093 991</a> or chat with Isabella (look for the chat bubble) for instant answers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent-color/10 flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-accent-color" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {info.title}
                </h3>
                <div className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-muted-foreground text-sm">
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="hover:text-accent-color transition-colors duration-fast"
                          {...(info.link.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center space-y-4">
          <a 
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("contact_section", window.location.pathname)}
          >
            <Button 
              variant="primary" 
              size="xl"
              aria-label="Book an appointment"
            >
              {BOOK_CTA_LABEL}
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">
            Online booking available 24/7 • Same-day appointments often available
          </p>
        </div>
      </div>
      
      {/* JSON-LD Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Hair Pinns",
            "description": "Boutique hair salon in Bangor NSW serving Sutherland Shire",
            "url": "https://hairpinns.com/",
            "telephone": "+61468093991",
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
              "longitude": 151.0302
            },
            "openingHours": [
              "Tu 10:00-17:00",
              "We 18:00-21:00",
              "Th 09:00-21:00",
              "Fr 09:00-17:30",
              "Sa 08:00-14:00"
            ],
            "priceRange": "$65-$200",
            "servesCuisine": null,
            "acceptsReservations": true
          })
        }}
      />
    </section>
  );
};

export default ContactSection;