interface FooterLink {
  href: string;
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: string;
  logoText?: string;
  tagline?: string;
  sections?: FooterSection[];
  socialLinks?: { platform: string; href: string; icon: React.ReactNode }[];
  copyright?: string;
}

const Footer = ({ 
  logo,
  logoText = "Brand",
  tagline = "Building amazing experiences",
  sections = [],
  socialLinks = [],
  copyright = `© ${new Date().getFullYear()} All rights reserved.`
}: FooterProps) => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            {logo ? (
              <img src={logo} alt={logoText} className="h-8 w-auto brightness-0 invert" />
            ) : (
              <span className="text-xl font-semibold">{logoText}</span>
            )}
            {tagline && (
              <p className="text-primary-foreground/80 text-sm max-w-xs">
                {tagline}
              </p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-fast"
                    aria-label={`Follow us on ${link.platform}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-medium">{section.title}</h4>
              <nav className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <a 
                    key={linkIndex}
                    href={link.href} 
                    className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-fast text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;