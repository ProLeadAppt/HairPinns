import { Calendar, ShoppingBag, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-salon.jpg";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Hair Pinns boutique salon interior with elegant styling chairs and professional atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-brand-500" />
          <span className="text-sm text-muted-foreground">Bangor NSW • Sutherland Shire</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-heading mb-6 leading-tight">
          Where Hair Dreams
          <span className="text-brand-500 block">Come to Life</span>
        </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg">
            Expert styling, premium treatments, and personalized care. 
            Your boutique salon experience in the heart of Sutherland Shire.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
              onClick={() => trackBookingClick("hero_section", window.location.pathname)}
            >
              <Button 
                variant="primary" 
                size="xl"
                className="w-full sm:w-auto"
                aria-label="Book an appointment"
              >
                <Calendar className="w-5 h-5" />
                {BOOK_CTA_LABEL}
              </Button>
            </a>
            <Button 
              variant="accent" 
              size="xl"
              onClick={() => window.open('https://shopify.com', '_blank')}
              className="w-full sm:w-auto"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Our Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;