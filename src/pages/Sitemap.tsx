import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, ShoppingBag, MapPin, BookOpen, Info } from "lucide-react";
import { generateWebPageSchema, generateBreadcrumbSchema } from "@/lib/schema";

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
        { title: "Jena's Daily Trio", url: "/collections/jenas-daily-trio" },
        { title: "Juuce", url: "/collections/juuce-botanicals" },
        { title: "QIQI", url: "/collections/qiqi" },
        { title: "Pure Organic", url: "/collections/pure-certified-organic-hair-care" },
        { title: "Wet Brush", url: "/collections/wet-brush-detanglers" },
        { title: "Aromaganic", url: "/collections/aromaganic" },
        { title: "Island Vibes", url: "/collections/island-vibes-tanning" },
      ]
    },
    {
      title: "Service Areas",
      icon: MapPin,
      links: [
        { title: "All Service Areas", url: "/areas" },
        { title: "Bangor", url: "/areas/bangor-2234" },
        { title: "Menai", url: "/areas/menai-2234" },
        { title: "Illawong", url: "/areas/illawong-2234" },
        { title: "Alfords Point", url: "/areas/alfords-point-2234" },
        { title: "Sutherland", url: "/areas/sutherland-2232" },
        { title: "Kirrawee", url: "/areas/kirrawee-2232" },
        { title: "Kareela", url: "/areas/kareela-2232" },
        { title: "Como", url: "/areas/como-2226" },
        { title: "Gymea", url: "/areas/gymea-2227" },
        { title: "Miranda", url: "/areas/miranda-2228" },
        { title: "Cronulla", url: "/areas/cronulla-2230" },
        { title: "Sydney CBD", url: "/areas/sydney" },
        { title: "Caringbah", url: "/areas/caringbah-2229" },
        { title: "Sylvania", url: "/areas/sylvania-2224" },
      ]
    },
    {
      title: "Shipping Destinations",
      icon: MapPin,
      links: [
        { title: "Shipping Policy", url: "/policies/shipping" },
        { title: "Shipping to New South Wales", url: "/shipping-to/new-south-wales" },
        { title: "Shipping to Victoria", url: "/shipping-to/victoria" },
        { title: "Shipping to Queensland", url: "/shipping-to/queensland" },
        { title: "Shipping to Western Australia", url: "/shipping-to/western-australia" },
        { title: "Shipping to South Australia", url: "/shipping-to/south-australia" },
        { title: "Shipping to Tasmania", url: "/shipping-to/tasmania" },
        { title: "Shipping to ACT", url: "/shipping-to/australian-capital-territory" },
        { title: "Shipping to Northern Territory", url: "/shipping-to/northern-territory" },
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

  const schemas = [
    generateWebPageSchema({
      name: "Sitemap",
      description: "Browse all pages on Hair Pinns website - services, products, blog articles, service areas, and policies.",
      url: "https://hairpinns.com/sitemap",
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "Sitemap", url: "https://hairpinns.com/sitemap" },
    ]),
  ];

  return (
    <div className="editorial-route min-h-screen bg-background">
      <SEOHead
        title="Sitemap | Hair Pinns Bangor"
        description="Browse all pages on Hair Pinns website - services, products, blog articles, service areas, and policies."
        canonical="https://hairpinns.com/sitemap"
        schemaJson={schemas}
      />

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
