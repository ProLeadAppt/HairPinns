import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SEOHead from "@/components/SEOHead";
import { ShoppingBag, Scissors, Calendar, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <>
      <SEOHead
        title="404 Page Not Found | Hair Pinns"
        description="This page could not be found. Shop hair products Australia-wide, visit our Bangor salon, or contact us."
        canonical="https://hairpinns.com/404"
        noIndex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-accent/30 to-background">
        <main id="main-content" tabIndex={-1} className="text-center px-4 py-12 max-w-lg">
          <h1 className="mb-2 text-4xl font-heading font-bold text-heading">Hmm, that page doesn't exist</h1>
          <p className="mb-6 text-muted-foreground">
            Looks like this link got a bit tangled. Try searching for what you need:
          </p>
          <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Button type="submit" variant="primary">Search</Button>
          </form>
          <p className="mb-4 text-sm text-muted-foreground">Or jump to:</p>
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
