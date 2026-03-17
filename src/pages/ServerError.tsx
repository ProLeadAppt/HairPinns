import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const ServerError = () => {
  return (
    <>
      <Helmet>
        <title>500 Server Error | Hair Pinns</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-heading font-bold text-heading mb-4">500</h1>
          <h2 className="text-xl font-semibold text-heading mb-4">Something went wrong</h2>
          <p className="text-foreground mb-8 leading-relaxed">
            We've been notified and are working to fix it. Please try again in a moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServerError;
