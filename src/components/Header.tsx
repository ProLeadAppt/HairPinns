import { Menu, Calendar, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import {
  isStocktakeActive,
  QIQI_DISCOUNT_ACTIVE,
  SHAMPOO_CONDITIONER_OFFER_ACTIVE,
  SHAMPOO_CONDITIONER_HEADER_MESSAGE,
  STOCKTAKE_HEADER_MESSAGE,
  DEFAULT_HEADER_MESSAGE,
  PROMO_COLLECTIONS,
} from "@/config/promotions";
import ProductSearch from "@/components/product/ProductSearch";
import ShopDropdown from "@/components/navigation/ShopDropdown";
import { useCart } from "@/contexts/CartContext";
import hairPinnsLogo from "@/assets/images/hair-pinns-logo-full.webp";

function getPromoMessage(): string {
  if (isStocktakeActive()) return STOCKTAKE_HEADER_MESSAGE;
  if (SHAMPOO_CONDITIONER_OFFER_ACTIVE) return SHAMPOO_CONDITIONER_HEADER_MESSAGE;
  if (QIQI_DISCOUNT_ACTIVE) return "20% off QIQI range, shop now";
  return DEFAULT_HEADER_MESSAGE;
}

const Header = () => {
  const { openCart, itemCount } = useCart();
  const [showPromo, setShowPromo] = useState(true);
  const promoMessage = getPromoMessage();
  // Highest-priority offer drives the link target
  const promoLink = isStocktakeActive()
    ? "/collections"
    : SHAMPOO_CONDITIONER_OFFER_ACTIVE
      ? "/collections"
      : QIQI_DISCOUNT_ACTIVE
        ? `/collections/${PROMO_COLLECTIONS.qiqi}`
        : "/collections";
  // Highlight the headline offer with a subtle emoji
  const isHeadlineOffer = SHAMPOO_CONDITIONER_OFFER_ACTIVE && !isStocktakeActive();

  return <>
      {/* Top Promo Strip — link and close button are siblings so we don't ship invalid nested-interactive HTML. */}
      {showPromo && (
        <div className="bg-brand-600 text-white relative">
          <Link
            to={promoLink}
            className="block py-2.5 px-4 pr-12 text-center text-sm sm:text-base font-semibold text-white hover:bg-brand-500 transition-colors duration-fast"
            aria-label="Shop the buy any shampoo, get 50% off conditioner offer"
          >
            <p className="text-white">
              {(isStocktakeActive() || isHeadlineOffer) ? "✨ " : ""}{promoMessage}
            </p>
          </Link>
          <button
            type="button"
            onClick={() => setShowPromo(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded text-white hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Dismiss promo banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={hairPinnsLogo} alt="Hair Pinns - Happy Hair Specialist" className="h-12 lg:h-14 w-auto"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6" aria-label="Main navigation">
              <ShopDropdown />
              <Link to="/services" className="nav-link-animated text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Services
              </Link>
              <Link to="/areas" className="nav-link-animated text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Areas We Serve
              </Link>
              <Link to="/about" className="nav-link-animated text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                About
              </Link>
              <Link to="/blog" className="nav-link-animated text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Blog
              </Link>
              <Link to="/contact" className="nav-link-animated text-foreground hover:text-brand-500 transition-colors duration-fast font-medium">
                Contact
              </Link>
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <ProductSearch placeholder="Search products..." maxResults={6} />
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={openCart}
                aria-label={itemCount > 0 ? `View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "View cart"}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
                {itemCount > 0 && (
                  <span aria-hidden="true" className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
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