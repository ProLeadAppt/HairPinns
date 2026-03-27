import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { ShoppingBag, Scissors, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 Page Not Found | Hair Pinns</title>
        <meta name="description" content="This page could not be found. Shop hair products Australia-wide, visit our Bangor salon, or contact us." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-accent/30 to-background">
        <main id="main-content" className="text-center px-4 py-12 max-w-lg">
          <h1 className="mb-2 text-4xl font-heading font-bold text-heading">Hmm, that page doesn't exist</h1>
          <p className="mb-8 text-muted-foreground">
            Looks like this link got a bit tangled. Here's where you probably wanted to go:
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Link to="/collections" className="bg-card border border-border rounded-card p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <ShoppingBag className="w-6 h-6 text-brand-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-heading">Shop Products</span>
            </Link>
            <Link to="/services" className="bg-card border border-border rounded-card p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <Scissors className="w-6 h-6 text-brand-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-heading">Our Services</span>
            </Link>
            <Link to="/booking" className="bg-card border border-border rounded-card p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <Calendar className="w-6 h-6 text-brand-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-heading">Book Now</span>
            </Link>
            <Link to="/contact" className="bg-card border border-border rounded-card p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <Phone className="w-6 h-6 text-brand-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-heading">Contact Jena</span>
            </Link>
          </div>
          <Button asChild variant="primary" size="lg" className="mt-6">
            <Link to="/">Take Me Home</Link>
          </Button>
        </main>
      </div>
    </>
  );
};

export default NotFound;
