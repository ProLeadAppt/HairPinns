import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-home.png";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const HeroHome = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Hair Pinns - Elevate your hairstyle journey with expert care featuring beautiful hairstyles"
          className="w-full h-full object-cover object-[65%_center] brightness-[0.92]"
          loading="eager"
          fetchPriority="high"
          width="1920"
          height="1080"
          sizes="100vw"
          style={{ filter: 'brightness(0.92)' }}
        />
        {/* Left Scrim Behind Text Only */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(90deg, rgba(6, 0, 10, 0.75) 0%, rgba(6, 0, 10, 0.55) 35%, rgba(6, 0, 10, 0) 70%)',
            zIndex: 1
          }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20" style={{ zIndex: 3 }}>
        <div className="max-w-[46rem]">
          <h1 className="font-heading font-bold text-white mb-6 leading-[1.05]" style={{
            fontSize: 'clamp(32px, 6vw, 72px)'
          }}>
            Hair Pinns — Salon & Self-Care
          </h1>
          
          <p className="text-white mb-8 max-w-lg leading-relaxed" style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)'
          }}>
            Beautiful hair, honest care, salon-quality at home.
          </p>
          
          <div className="mb-8 hero-ctas flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Primary CTA: Book Now - Solid White */}
            <Button asChild size="lg" className="w-full sm:w-auto font-bold transition-all duration-200 focus-visible:outline-none btn--primary" style={{
              background: '#FFFFFF',
              color: '#5E225E',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.9rem 1.25rem',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.25)'
            }}>
              <a 
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("hero_home", "/")}
                aria-label="Book an appointment"
                className="hover:bg-[#F7F7F9] focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.9),0_0_0_6px_rgba(139,74,139,0.55)]"
                style={{ background: 'inherit', color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F7F7F9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
              >
                <Calendar className="w-5 h-5" style={{ color: 'currentColor' }} />
                {BOOK_CTA_LABEL}
              </a>
            </Button>
            
            {/* Secondary CTA: Shop Christmas Packs - Outline */}
            <Button asChild size="lg" className="w-full sm:w-auto font-semibold transition-all duration-200 focus-visible:outline-none btn--secondary" style={{
              background: 'transparent',
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              borderRadius: '9999px',
              padding: '0.9rem 1.25rem'
            }}>
              <Link 
                to="/collections/christmas-gift-packs"
                className="hover:bg-[rgba(255,255,255,0.12)] focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.7)]"
                style={{ background: 'inherit', color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <ShoppingBag className="w-5 h-5" style={{ color: 'currentColor' }} />
                Shop Christmas Packs
              </Link>
            </Button>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
              <span className="font-semibold">4.9★ Google</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white" />
              <span>Bangor, NSW</span>
            </div>
            <div>
              <span className="opacity-90">Est. by Jena Pinn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
