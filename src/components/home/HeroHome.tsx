import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero-home-new.webp";

const HeroHome = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-end overflow-hidden">
      {/* Background video — full bleed, muted autoplay loop */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroImage}
          className="w-full h-full object-cover"
          preload="auto"
        >
          <source src="/hero-reel.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,0,30,0.9)] via-[rgba(24,0,30,0.3)] to-transparent" />
      </div>

      {/* Content — left-aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-24">
        <div className="max-w-2xl hero-stagger">
          <h1
            className="speakable-hero-intro font-heading font-bold text-white leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            Hair care from someone who actually does hair.
          </h1>

          <p className="text-white/80 mb-8 max-w-lg" style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}>
            Jena Pinn. Bangor salon. Shipping nationwide.
          </p>

          <div>
            <Button
              asChild
              size="lg"
              variant="primary"
              className="text-white font-semibold"
              style={{ borderRadius: '999px', padding: '0.875rem 2.5rem' }}
            >
              <Link to="/collections">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
