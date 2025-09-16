import { Instagram, Facebook, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Hair Pinns</h3>
            <p className="text-primary-foreground/80 mb-4">
              Your boutique salon experience in Bangor NSW. 
              Expert styling, premium treatments, personalized care.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-fast"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-fast"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <a href="#services" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-fast text-sm">
                Services & Pricing
              </a>
              <a href="#products" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-fast text-sm">
                Professional Products
              </a>
              <a href="#about" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-fast text-sm">
                About Our Team
              </a>
              <a 
                href="https://fresha.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-fast text-sm"
              >
                Online Booking
              </a>
            </nav>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Visit Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-color mt-0.5" />
                <div>
                  <p className="text-primary-foreground/80">123 River Road</p>
                  <p className="text-primary-foreground/80">Bangor NSW 2234</p>
                </div>
              </div>
              <p className="text-primary-foreground/80">
                <strong>Mon-Fri:</strong> 9am-7pm<br />
                <strong>Saturday:</strong> 8am-5pm<br />
                <strong>Sunday:</strong> Closed
              </p>
              <p className="text-primary-foreground/80">
                <a href="tel:+61295550123" className="hover:text-primary-foreground transition-colors duration-fast">
                  (02) 9555 0123
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Hair Pinns. All rights reserved. • Boutique Salon • Bangor NSW • Sutherland Shire
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;