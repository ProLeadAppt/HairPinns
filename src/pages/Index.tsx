import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHome from "@/components/home/HeroHome";
import FeatureStrip from "@/components/home/FeatureStrip";
import ProductSpotlight from "@/components/home/ProductSpotlight";
import ReviewsHome from "@/components/home/ReviewsHome";
import BookingBanner from "@/components/home/BookingBanner";
import BlogTrio from "@/components/home/BlogTrio";
import FooterCTA from "@/components/home/FooterCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <HeroHome />
        <FeatureStrip />
        <ProductSpotlight />
        <ReviewsHome />
        <BookingBanner />
        <BlogTrio />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
