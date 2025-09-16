import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Hair Pinns
            </h1>
            <span className="ml-2 text-sm text-muted-foreground hidden sm:block">
              Boutique Salon
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-rose-gold transition-smooth">
              Services
            </a>
            <a href="#products" className="text-foreground hover:text-rose-gold transition-smooth">
              Products
            </a>
            <a href="#about" className="text-foreground hover:text-rose-gold transition-smooth">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-rose-gold transition-smooth">
              Contact
            </a>
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
              <nav className="flex flex-col space-y-6 mt-8">
                <a href="#services" className="text-lg font-medium text-foreground hover:text-rose-gold transition-smooth">
                  Services
                </a>
                <a href="#products" className="text-lg font-medium text-foreground hover:text-rose-gold transition-smooth">
                  Products
                </a>
                <a href="#about" className="text-lg font-medium text-foreground hover:text-rose-gold transition-smooth">
                  About
                </a>
                <a href="#contact" className="text-lg font-medium text-foreground hover:text-rose-gold transition-smooth">
                  Contact
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;