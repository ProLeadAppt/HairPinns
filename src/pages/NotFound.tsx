import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Home, ShoppingBag, MapPin, Mail } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/collections", label: "Shop Hair Products", icon: ShoppingBag },
    { to: "/near/sydney", label: "Sydney Area", icon: MapPin },
    { to: "/contact", label: "Contact Us", icon: Mail },
  ];

  return (
    <>
      <Helmet>
        <title>404 Page Not Found | Hair Pinns</title>
        <meta name="description" content="This page could not be found. Shop hair products Australia-wide, visit our Bangor salon, or contact us." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <main id="main-content" className="text-center px-4 py-12 max-w-lg">
          <h1 className="mb-2 text-4xl font-heading font-bold text-heading">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="mb-8 text-muted-foreground">
            The page you're looking for doesn't exist. Here are some helpful links:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {quickLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:text-brand-500 hover:border-brand-500 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFound;
