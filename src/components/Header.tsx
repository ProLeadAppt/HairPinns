import { Menu, Calendar, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { lazy, Suspense, useRef, useState } from "react";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick, trackPromoClick } from "@/config/bookingConfig";
import { useCart } from "@/contexts/CartContext";
import { SHOP_BY_CONCERN } from "@/config/commerceNavigation";
import {
  isStocktakeActive,
  QIQI_DISCOUNT_ACTIVE,
  STOCKTAKE_HEADER_MESSAGE,
  DEFAULT_HEADER_MESSAGE,
  PROMO_COLLECTIONS,
} from "@/config/promotions";

import hairPinnsLogoFull from "@/assets/images/hair-pinns-logo-full.webp";
import hairPinnsLogoCompact from "@/assets/images/hair-pinns-logo-compact.webp";

function getPromoMessage(): string {
  if (isStocktakeActive()) return STOCKTAKE_HEADER_MESSAGE;
  if (QIQI_DISCOUNT_ACTIVE) return "20% off QIQI range, shop now";
  return DEFAULT_HEADER_MESSAGE;
}

const ProductSearch = lazy(() => import("@/components/product/ProductSearch"));
const ShopDropdown = lazy(() => import("@/components/navigation/ShopDropdown"));

const navLinkClass = "inline-flex min-h-11 items-center text-sm font-medium text-[hsl(var(--after-hours-plum))] transition-colors duration-fast hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";
const mobileNavLinkClass = "inline-flex min-h-11 items-center border-t border-[hsl(var(--after-hours-plum)/0.16)] text-lg font-medium text-[hsl(var(--after-hours-plum))] transition-colors duration-fast hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

const Header = () => {
  const { openCart, itemCount } = useCart();
  const [showPromo, setShowPromo] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuFirstLinkRef = useRef<HTMLAnchorElement>(null);
  const promoMessage = getPromoMessage();
  const promoLink = isStocktakeActive()
    ? "/collections"
    : QIQI_DISCOUNT_ACTIVE
      ? `/collections/${PROMO_COLLECTIONS.qiqi}`
      : "/collections";
  const headerPromoOfferId = (() => {
    if (isStocktakeActive()) return "stocktake_2025";
    if (QIQI_DISCOUNT_ACTIVE) return "qiqi_20_off";
    return "none";
  })();

  return (
    <>
      {showPromo && (
        <div className="relative min-h-11 border-b border-[hsl(var(--after-hours-copper)/0.5)] bg-[hsl(var(--after-hours-near-black))] text-[hsl(var(--after-hours-cream))]">
          <Link
            to={promoLink}
            data-cta="header-promo-strip"
            data-cta-placement="header_promo_strip"
            data-cta-offer={headerPromoOfferId}
            onClick={() =>
              trackPromoClick("header_promo_strip", typeof window !== "undefined" ? window.location.pathname : "/")
            }
            className="flex min-h-11 items-center justify-center px-14 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-cream))] transition-colors duration-fast hover:text-[hsl(var(--after-hours-copper))]"
            aria-label={`Shop the current Hair Pinns offer: ${promoMessage}`}
          >
            {isStocktakeActive() ? "Stocktake / " : ""}{promoMessage}
          </Link>
          <button
            type="button"
            onClick={() => setShowPromo(false)}
            className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[hsl(var(--after-hours-cream)/0.8)] transition-colors hover:text-[hsl(var(--after-hours-copper))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))]"
            aria-label="Dismiss promo banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 h-16 border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-cream)/0.97)] text-[hsl(var(--after-hours-plum))] backdrop-blur-sm">
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center gap-2 xl:gap-5">
            <Link to="/" className="inline-flex min-h-11 flex-shrink-0 items-center" aria-label="Hair Pinns home">
              <picture>
                <source media="(max-width: 640px)" srcSet={hairPinnsLogoCompact} />
                <img
                  src={hairPinnsLogoFull}
                  alt="Hair Pinns — Happy Hair Specialist"
                  className="h-10 w-auto sm:h-12 xl:h-11"
                  loading="eager"
                  decoding="async"
                  width="250"
                  height="160"
                />
              </picture>
            </Link>

            <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">
              <Suspense fallback={<Link to="/collections" className={navLinkClass}>Shop</Link>}>
                <ShopDropdown />
              </Suspense>
              <Link to="/blog" className={navLinkClass}>Hair care guides</Link>
              <Link to="/about" className={navLinkClass}>About Jena</Link>
              <Link to="/services" className={navLinkClass}>Salon</Link>
              <Link to="/contact" className={navLinkClass}>Contact</Link>
            </nav>

            <div className="mx-3 hidden min-w-0 max-w-[18rem] flex-1 xl:block 2xl:max-w-sm [&_input]:h-11 [&_input]:rounded-none [&_input]:border-[hsl(var(--after-hours-plum)/0.28)] [&_input]:bg-transparent [&_input]:text-[hsl(var(--after-hours-plum))]">
              <Suspense fallback={<div className="flex h-11 items-center border border-[hsl(var(--after-hours-plum)/0.28)] px-3 text-sm text-[hsl(var(--after-hours-plum)/0.58)]">Search products and articles...</div>}>
                <ProductSearch placeholder="Search products and articles..." maxResults={6} />
              </Suspense>
            </div>

            <div className="ml-auto hidden flex-shrink-0 items-center gap-2 xl:flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={(event) => openCart(event.currentTarget)}
                aria-label={itemCount > 0 ? `View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "View cart"}
                className="relative min-h-11 rounded-none px-3 text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-plum)/0.07)]"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                {itemCount > 0 && (
                  <span aria-hidden="true" className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-[hsl(var(--after-hours-plum))] px-1 text-[10px] font-bold text-[hsl(var(--after-hours-cream))]">
                    {itemCount}
                  </span>
                )}
              </Button>
              <Button asChild variant="outline" size="sm" className="min-h-11 rounded-none border-[hsl(var(--after-hours-copper))] bg-transparent px-4 text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-plum))] hover:text-[hsl(var(--after-hours-cream))]">
                <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("header_desktop", window.location.pathname)}>
                  <Calendar className="h-4 w-4" />
                  {BOOK_CTA_LABEL}
                </a>
              </Button>
            </div>

            <div className="ml-auto flex items-center xl:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={(event) => openCart(event.currentTarget)}
                aria-label={itemCount > 0 ? `View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "View cart"}
                className="relative h-11 w-11 rounded-none text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-plum)/0.07)]"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span aria-hidden="true" className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-[hsl(var(--after-hours-plum))] px-1 text-[10px] font-bold text-[hsl(var(--after-hours-cream))]">
                    {itemCount}
                  </span>
                )}
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button ref={mobileMenuTriggerRef} variant="ghost" size="icon" className="h-11 w-11 flex-shrink-0 rounded-none text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-plum)/0.07)]">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[calc(100%-2rem)] max-w-sm overflow-y-auto border-l border-[hsl(var(--after-hours-copper)/0.55)] bg-[hsl(var(--after-hours-cream))] p-0 text-[hsl(var(--after-hours-plum))] [&>button]:inline-flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center"
                  onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    mobileMenuFirstLinkRef.current?.focus();
                  }}
                >
                  <SheetTitle className="sr-only">Mobile menu</SheetTitle>
                  <div className="px-6 pb-6 pt-14">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">Hair Pinns / Menu</p>
                    <nav className="mt-6" aria-label="Mobile navigation">
                      <div className="mb-6 [&_input]:h-11 [&_input]:rounded-none [&_input]:border-[hsl(var(--after-hours-plum)/0.28)] [&_input]:bg-transparent">
                        {mobileMenuOpen ? (
                          <Suspense fallback={<div className="flex h-11 items-center border border-[hsl(var(--after-hours-plum)/0.28)] px-3 text-sm text-[hsl(var(--after-hours-plum)/0.58)]">Search products and articles...</div>}>
                            <ProductSearch placeholder="Search shop + guides" maxResults={5} />
                          </Suspense>
                        ) : null}
                      </div>

                      <Link ref={mobileMenuFirstLinkRef} to="/collections" onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-11 items-center font-heading text-2xl text-[hsl(var(--after-hours-plum))] hover:text-brand-600">
                        Shop all products
                      </Link>
                      <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">Shop by concern</p>
                      <div className="mt-2 grid grid-cols-2 border-t border-[hsl(var(--after-hours-plum)/0.18)]" aria-label="Shop by concern">
                        {SHOP_BY_CONCERN.slice(0, 4).map((concern, index) => (
                          <Link
                            key={concern.handle}
                            to={concern.href}
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label={`Shop ${concern.name.toLowerCase()}`}
                            className="inline-flex min-h-11 items-center border-b border-[hsl(var(--after-hours-plum)/0.18)] pr-2 text-sm font-medium text-[hsl(var(--after-hours-plum))] transition-colors hover:text-brand-600 even:pl-3"
                          >
                            <span className="mr-2 text-[0.62rem] text-[hsl(var(--after-hours-copper))]">0{index + 1}</span>
                            {concern.shortName}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-7 flex flex-col border-b border-[hsl(var(--after-hours-plum)/0.16)]">
                        <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Hair care guides</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>About Jena</Link>
                        <Link to="/services" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Salon services</Link>
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Contact</Link>
                      </div>

                      <div className="mt-7 grid gap-3">
                        <Button
                          variant="default"
                          size="lg"
                          className="min-h-11 w-full justify-center rounded-none bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))] hover:bg-brand-700"
                          onClick={() => {
                            const returnTarget = mobileMenuTriggerRef.current || undefined;
                            setMobileMenuOpen(false);
                            window.setTimeout(() => openCart(returnTarget), 0);
                          }}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Cart
                        </Button>
                        <Button asChild variant="outline" size="lg" className="min-h-11 w-full rounded-none border-[hsl(var(--after-hours-copper))] bg-transparent text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-plum))] hover:text-[hsl(var(--after-hours-cream))]">
                          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("header_mobile", window.location.pathname)}>
                            <Calendar className="h-5 w-5" />
                            {BOOK_CTA_LABEL}
                          </a>
                        </Button>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
