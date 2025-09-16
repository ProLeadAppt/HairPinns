import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  logo?: string;
  logoText?: string;
  navItems?: { href: string; label: string }[];
  onCtaClick?: () => void;
  ctaText?: string;
}

const Header = ({ 
  logo, 
  logoText = "Brand", 
  navItems = [],
  onCtaClick,
  ctaText = "Get Started"
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo ? (
              <img src={logo} alt={logoText} className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-semibold text-foreground">{logoText}</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="text-foreground hover:text-accent-color transition-colors duration-fast text-button"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-4">
            {onCtaClick && (
              <Button 
                variant="primary" 
                size="default"
                onClick={onCtaClick}
                className="hidden sm:inline-flex"
              >
                {ctaText}
              </Button>
            )}
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-6 mt-8" aria-label="Mobile navigation">
                  {navItems.map((item, index) => (
                    <a 
                      key={index}
                      href={item.href} 
                      className="text-lg font-medium text-foreground hover:text-accent-color transition-colors duration-fast"
                    >
                      {item.label}
                    </a>
                  ))}
                  {onCtaClick && (
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={onCtaClick}
                      className="mt-4"
                    >
                      {ctaText}
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;