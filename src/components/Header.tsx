import { Menu, Calendar, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import ProductSearch from "@/components/product/ProductSearch";
import ShopDropdown from "@/components/navigation/ShopDropdown";
import { useCart } from "@/contexts/CartContext";
import hairPinnsLogo from "@/assets/hair-pinns-logo-full.webp";

const Header = () => {
  const { openCart } = useCart();
  const [showPromo, setShowPromo] = useState(true);
  return <>
      {/* Top Promo Strip */}
      {showPromo && <Link to="/collections" className="block bg-brand-500 text-primary-foreground py-2 px-4 text-center text-sm relative hover:bg-brand-600 transition-colors duration-fast">
          <p className="font-medium">✨ Free shipping on orders over $150</p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPromo(false);
            }} 
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80" 
            aria-label="Close promo banner"
          >
            <X className="w-4 h-4" />
          </button>
        </Link>}

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={hairPinnsLogo} alt="Hair Pinns - Happy Hair Specialist" className="h-12 lg:h-14 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6" aria-label="Main navigation">
              <ShopDropdown />
              <Link to="/services" className="text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Services
              </Link>
              <Link to="/areas" className="text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Areas We Serve
              </Link>
              <Link to="/about" className="text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                About
              </Link>
              <Link to="/blog" className="text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Blog
              </Link>
              <Link to="/contact" className="text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Contact
              </Link>
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <ProductSearch placeholder="Search products..." maxResults={6} />
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={openCart} aria-label="View cart">
                <ShoppingCart className="w-4 h-4" />
                Cart
              </Button>
              <Link to="/collections">
                <Button variant="ghost" size="sm">
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </Button>
              </Link>
              <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("header_desktop", window.location.pathname)}>
                <Button variant="primary" size="sm" aria-label="Book an appointment">
                  <Calendar className="w-4 h-4" />
                  {BOOK_CTA_LABEL}
                </Button>
              </a>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-6 mt-8" aria-label="Mobile navigation">
                  {/* Mobile Search */}
                  <div className="mb-4">
                    <ProductSearch placeholder="Search products..." maxResults={5} />
                  </div>
                  
                  <Link to="/collections" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                    Shop
                  </Link>
                  <Link to="/services" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                    Services
                  </Link>
                  <Link to="/areas" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                    Areas We Serve
                  </Link>
                  <Link to="/about" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                    About
                  </Link>
                  <Link to="/blog" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                    Blog
                  </Link>
                  <Link to="/contact" className="text-lg font-medium text-foreground hover:text-brand-500 transition-colors duration-fast">
                    Contact
                  </Link>

                  <div className="pt-6 border-t border-border space-y-3">
                    <Button variant="ghost" size="lg" className="w-full justify-start" onClick={openCart}>
                      <ShoppingCart className="w-5 h-5" />
                      Cart
                    </Button>
                    <Link to="/collections" className="block">
                      <Button variant="ghost" size="lg" className="w-full justify-start">
                        <ShoppingBag className="w-5 h-5" />
                        Shop
                      </Button>
                    </Link>
                    <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="block" onClick={() => trackBookingClick("header_mobile", window.location.pathname)}>
                      <Button variant="primary" size="lg" className="w-full" aria-label="Book an appointment">
                        <Calendar className="w-5 h-5" />
                        {BOOK_CTA_LABEL}
                      </Button>
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>;
};
export default Header;