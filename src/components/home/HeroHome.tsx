import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-salon.jpg";

const HeroHome = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Hair Pinns boutique salon interior with professional styling stations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          <h1 className="text-h1-lg font-heading font-bold text-heading mb-6 leading-tight">
            Hair Pinns — Salon & Self-Care
          </h1>
          
          <p className="text-xl text-foreground mb-8 max-w-lg leading-relaxed">
            Beautiful hair, honest care, salon-quality at home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/collections/christmas-gift-packs">
              <Button variant="primary" size="xl" className="w-full sm:w-auto">
                <ShoppingBag className="w-5 h-5" />
                Shop Christmas Packs
              </Button>
            </Link>
            <Link to="/booking">
              <Button variant="accent" size="xl" className="w-full sm:w-auto">
                <Calendar className="w-5 h-5" />
                Book on Fresha
              </Button>
            </Link>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
              <span className="font-semibold">4.9★ Google</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>Bangor, NSW</span>
            </div>
            <div>
              <span className="text-muted-foreground">Est. by Jena Pinn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
