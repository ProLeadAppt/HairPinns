import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyBookingCTA from "@/components/StickyBookingCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyBookingCTA />
    </div>
  );
};

export default Index;
