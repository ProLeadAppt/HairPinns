import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Calendar } from "lucide-react";

/**
 * InvalidSuburb Component
 * 
 * Friendly 404 page for unknown suburb slugs
 * Provides helpful navigation to valid areas and services
 */
const InvalidSuburb = () => {
  const popularSuburbs = [
    { name: "Bangor", slug: "bangor" },
    { name: "Menai", slug: "menai" },
    { name: "Illawong", slug: "illawong" },
    { name: "Sutherland", slug: "sutherland" },
    { name: "Engadine", slug: "engadine" },
    { name: "Miranda", slug: "miranda" },
  ];

  return (
    <>
      <Helmet>
        <title>Area Not Found | Hair Pinns Service Areas</title>
        <meta name="description" content="The area you're looking for isn't in our current service list. View all areas we serve around Bangor NSW." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center bg-muted py-16">
          <div className="container-custom max-w-2xl text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            
            <h1 className="text-h1 font-heading text-heading mb-4">
              Area Not Found
            </h1>
            
            <p className="text-lg text-foreground mb-8">
              We couldn't find a page for that suburb. We serve the Sutherland Shire 
              and surrounding areas from our Bangor salon.
            </p>

            <div className="bg-card border border-border rounded-card p-8 mb-8">
              <h2 className="text-h3 font-heading text-heading mb-6">
                Popular Areas We Serve
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {popularSuburbs.map((suburb) => (
                  <Link
                    key={suburb.slug}
                    to={`/near/${suburb.slug}`}
                    className="px-4 py-3 bg-accent hover:bg-accent/80 rounded-lg text-foreground hover:text-brand-500 transition-colors font-medium"
                  >
                    {suburb.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="primary" asChild>
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/services">
                  View All Services
                </Link>
              </Button>
              
              <Button size="lg" variant="accent" asChild>
                <a 
                  href="https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Now
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              Can't find your suburb? <Link to="/contact" className="text-brand-500 hover:text-brand-600 underline">Contact us</Link> to see if we serve your area.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default InvalidSuburb;
