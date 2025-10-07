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
        {/* Desktop/Tablet: Left to Right Gradient */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[rgba(24,0,30,0.78)] via-[rgba(24,0,30,0.22)] to-transparent"></div>
        {/* Mobile: Top to Bottom Gradient */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[rgba(24,0,30,0.82)] via-[rgba(24,0,30,0.18)] to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        {/* Text Backplate Container */}
        <div className="max-w-[46rem] rounded-[14px] p-5 sm:p-6 md:p-8" style={{
          background: 'rgba(24, 0, 30, 0.38)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.25)'
        }}>
          <h1 className="font-heading font-bold text-white mb-6 leading-[1.05]" style={{
            fontSize: 'clamp(32px, 6vw, 72px)',
            textShadow: '0 2px 24px rgba(0, 0, 0, 0.45)'
          }}>
            Hair Pinns — Salon & Self-Care
          </h1>
          
          <p className="mb-8 max-w-lg leading-relaxed" style={{
            color: 'rgba(255, 255, 255, 0.92)',
            fontSize: 'clamp(16px, 2.2vw, 20px)'
          }}>
            Beautiful hair, honest care, salon-quality at home.
          </p>
          
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-3 no-link-color">
              {/* Primary CTA: Book Now */}
              <Button asChild size="lg" className="w-full sm:w-auto text-white font-medium transition-all duration-200 focus-visible:outline-none" style={{
                background: 'var(--brand-500)',
                borderRadius: '9999px',
                padding: '0.9rem 1.25rem',
                boxShadow: '0 10px 24px rgba(139, 74, 139, 0.35)',
                border: 'none'
              }}>
                <a 
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("hero_home", "/")}
                  aria-label="Book an appointment"
                  className="hover:bg-[#783D78] focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.35),0_0_0_6px_rgba(139,74,139,0.45)]"
                  style={{ background: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#783D78'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'inherit'}
                >
                  <Calendar className="w-5 h-5 text-white" />
                  {BOOK_CTA_LABEL}
                </a>
              </Button>
              
              {/* Secondary CTA: Shop Christmas Packs */}
              <Button asChild size="lg" className="w-full sm:w-auto text-white font-medium transition-all duration-200 focus-visible:outline-none" style={{
                background: 'rgba(255, 255, 255, 0.16)',
                border: '2px solid rgba(255, 255, 255, 0.45)',
                borderRadius: '9999px',
                padding: '0.9rem 1.25rem'
              }}>
                <Link 
                  to="/collections/christmas-gift-packs"
                  className="hover:bg-[rgba(255,255,255,0.24)] focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.55)]"
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.24)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  Shop Christmas Packs
                </Link>
              </Button>
            </div>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
              <span className="font-semibold">4.9★ Google</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white" />
              <span>Bangor, NSW</span>
            </div>
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Est. by Jena Pinn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
