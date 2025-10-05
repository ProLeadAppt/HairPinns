import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, ShoppingBag, MapPin, BookOpen, Info } from "lucide-react";

const Sitemap = () => {
  const sitemapSections = [
    {
      title: "Main Pages",
      icon: FileText,
      links: [
        { title: "Home", url: "/" },
        { title: "Services", url: "/services" },
        { title: "About Us", url: "/about" },
        { title: "Booking", url: "/booking" },
        { title: "Contact", url: "/contact" },
        { title: "Blog", url: "/blog" },
      ]
    },
    {
      title: "Shop Collections",
      icon: ShoppingBag,
      links: [
        { title: "All Collections", url: "/collections" },
        { title: "Christmas Gift Packs", url: "/collections/christmas-gift-packs" },
        { title: "Hair Care", url: "/collections/hair-care" },
        { title: "Treatments & Masks", url: "/collections/treatments" },
        { title: "Styling Products", url: "/collections/styling" },
      ]
    },
    {
      title: "Service Areas",
      icon: MapPin,
      links: [
        { title: "Near Menai", url: "/near/menai" },
        { title: "Near Engadine", url: "/near/engadine" },
        { title: "Near Bangor", url: "/near/bangor" },
        { title: "Near Woronora", url: "/near/woronora" },
        { title: "Near Illawong", url: "/near/illawong" },
        { title: "Near Barden Ridge", url: "/near/barden-ridge" },
        { title: "Near Lucas Heights", url: "/near/lucas-heights" },
        { title: "Near Alfords Point", url: "/near/alfords-point" },
      ]
    },
    {
      title: "Policies & Legal",
      icon: Info,
      links: [
        { title: "Shipping Policy", url: "/policies/shipping" },
        { title: "Returns & Exchanges", url: "/policies/returns" },
        { title: "Privacy Policy", url: "/privacy" },
        { title: "Terms of Service", url: "/terms" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sitemap | Hair Pinns Bangor</title>
        <meta 
          name="description" 
          content="Browse all pages on Hair Pinns website - services, products, blog articles, service areas, and policies." 
        />
        <link rel="canonical" href="https://hairpinns.com/sitemap" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <Header />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-h1-lg font-heading font-bold text-heading mb-4 text-center">
            Sitemap
          </h1>
          <p className="text-lg text-foreground text-center mb-12 max-w-2xl mx-auto">
            Find all pages and content on Hair Pinns website
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sitemapSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-heading font-semibold text-heading">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.url}
                          className="text-foreground hover:text-brand-500 transition-colors inline-flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Looking for our XML sitemap for search engines?
            </p>
            <a
              href="/sitemap.xml"
              className="text-brand-500 hover:text-brand-600 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              View XML Sitemap →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
