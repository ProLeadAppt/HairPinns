import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHome from "@/components/home/HeroHome";
import FeatureStrip from "@/components/home/FeatureStrip";
import ProductSpotlight from "@/components/home/ProductSpotlight";
import ReviewsHome from "@/components/home/ReviewsHome";
import BookingBanner from "@/components/home/BookingBanner";
import BlogTrio from "@/components/home/BlogTrio";
import FooterCTA from "@/components/home/FooterCTA";
import { 
  generateOrganizationSchema, 
  generateLocalBusinessSchema 
} from "@/lib/schema";

const Index = () => {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema('https://hairpinns.com');

  return (
    <div className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>Hair Pinns | Boutique Hair Salon in Bangor</title>
        <meta 
          name="description" 
          content="Expert hair salon in Bangor specializing in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Over 20 years of experience serving the Sutherland Shire." 
        />
        <link rel="canonical" href="https://hairpinns.com" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>
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
