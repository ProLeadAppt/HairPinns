import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 Page Not Found | Hair Pinns</title>
        <meta name="description" content="This page could not be found. Return to Hair Pinns homepage." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
        <h1 className="mb-4 text-4xl font-heading font-bold text-heading">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-link hover:text-brand-600 underline">
          Return to Home
        </a>
      </div>
      </div>
    </>
  );
};

export default NotFound;
