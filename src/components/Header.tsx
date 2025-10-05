import { Menu, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Hair Pinns
            </h1>
            <span className="ml-2 text-sm text-muted-foreground hidden sm:block">
              Boutique Salon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link to="/collections" className="text-foreground hover:text-brand-500 transition-colors duration-fast">
              Shop
            </Link>
            <Link to="/services" className="text-foreground hover:text-brand-500 transition-colors duration-fast">
              Services
            </Link>
            <Link to="/blog" className="text-foreground hover:text-brand-500 transition-colors duration-fast">
              Blog
            </Link>
            <Link to="/about" className="text-foreground hover:text-brand-500 transition-colors duration-fast">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-brand-500 transition-colors duration-fast">
              Contact
            </Link>
            <Link to="/booking">
              <Button variant="primary" size="sm">
                <Calendar className="w-4 h-4" />
                Book on Fresha
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-6 mt-8" aria-label="Mobile navigation">
                <Link to="/collections" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                  Shop
                </Link>
                <Link to="/services" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                  Services
                </Link>
                <Link to="/blog" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                  Blog
                </Link>
                <Link to="/about" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                  About
                </Link>
                <Link to="/contact" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                  Contact
                </Link>
                <Link to="/booking">
                  <Button variant="primary" size="lg" className="w-full">
                    <Calendar className="w-5 h-5" />
                    Book on Fresha
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;