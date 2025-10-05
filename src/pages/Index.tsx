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
import { getOGImage } from "@/lib/sitemap";

const Index = () => {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema('https://hairpinns.com');

  return (
    <div className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>Hair Pinns | Boutique Hair Salon Bangor | Expert Colour & Cuts</title>
        <meta 
          name="description" 
          content="Boutique hair salon in Bangor. Expert Colour & Blonding, Keratin Smoothing, Precision Cuts. 12+ years experience. Book online 24/7." 
        />
        <link rel="canonical" href="https://hairpinns.com" />
        <meta property="og:title" content="Hair Pinns | Boutique Hair Salon in Bangor NSW" />
        <meta property="og:description" content="Expert colour, smoothing & cuts. Serving Sutherland Shire with 12+ years experience. Book online via Fresha." />
        <meta property="og:url" content="https://hairpinns.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('default')} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com" />
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
