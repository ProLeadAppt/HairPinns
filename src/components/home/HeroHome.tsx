import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-home-new.webp";
import AIAgentsCTA from "./AIAgentsCTA";

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
          <h1 className="font-heading font-bold text-white mb-4 leading-[1.05]" style={{
            fontSize: 'clamp(32px, 6vw, 64px)',
            textShadow: '0 2px 24px rgba(0, 0, 0, 0.45)'
          }}>
            Questions About Your Hair?
          </h1>
          
          <p className="mb-6 max-w-lg leading-relaxed" style={{
            color: 'rgba(255, 255, 255, 0.92)',
            fontSize: 'clamp(18px, 2.4vw, 22px)',
            fontWeight: 500
          }}>
            Get Instant Expert Answers 24/7
          </p>

          <p className="mb-8 max-w-xl leading-relaxed" style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: 'clamp(15px, 2vw, 17px)'
          }}>
            <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Call Sam</strong> or <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Chat with Isabella</strong> — Our AI experts know every service, price range, and can help you choose the perfect treatment
          </p>
          
          {/* AI Agents CTAs */}
          <div className="mb-8">
            <AIAgentsCTA />
          </div>

          {/* Secondary: Shop Christmas Packs */}
          <div className="mb-8">
            <Button asChild size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 backdrop-blur-md" style={{
              borderRadius: '999px',
              padding: '0.85rem 1.3rem',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <Link to="/collections/christmas-gift-packs" className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Shop Christmas Gift Packs
              </Link>
            </Button>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
            <Link to="/reviews" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
              <span className="font-semibold">4.9★ Google</span>
            </Link>
            <a 
              href="https://www.google.com/maps/dir//Hair+Pinns,+60+Goorgool+Road,+Bangor+NSW+2234" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>Bangor, NSW</span>
            </a>
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
