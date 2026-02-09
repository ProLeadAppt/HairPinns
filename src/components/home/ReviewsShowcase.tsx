import { Link } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import Section from "@/components/design-system/Section";
import { Button } from "@/components/ui/button";
import { FRESHA_REVIEWS_URL } from "@/config/bookingConfig";

const ReviewsShowcase = () => {
  return (
    <Section className="bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
          Trusted by Thousands
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See why our clients love Hair Pinns — from in-salon services to premium products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Google Reviews */}
        <div className="bg-card border border-border rounded-card p-8 text-center hover:shadow-xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-[hsl(var(--star-color))] fill-current animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold text-heading mb-2 group-hover:text-brand-500 transition-colors duration-300">4.9</p>
            <p className="text-muted-foreground">out of 5 stars</p>
          </div>
          <div className="mb-6">
            <p className="text-2xl font-semibold text-heading mb-1">53+ Reviews</p>
            <p className="text-sm text-muted-foreground">on Google</p>
          </div>
          <Link to="/reviews">
            <Button variant="outline" className="w-full group/button hover:bg-brand-50 hover:border-brand-500 transition-all duration-300">
              Read Google Reviews
              <ExternalLink className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>

        {/* Fresha Reviews */}
        <div className="bg-card border border-border rounded-card p-8 text-center hover:shadow-xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1 group">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-[hsl(var(--star-color))] fill-current animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold text-heading mb-2 group-hover:text-brand-500 transition-colors duration-300">5.0</p>
            <p className="text-muted-foreground">out of 5 stars</p>
          </div>
          <div className="mb-6">
            <p className="text-2xl font-semibold text-heading mb-1">762+ Reviews</p>
            <p className="text-sm text-muted-foreground">on Fresha</p>
          </div>
          <a
            href={FRESHA_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" className="w-full group/button hover:shadow-lg transition-all duration-300 hover:scale-105">
              Read Fresha Reviews
              <ExternalLink className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
            </Button>
          </a>
        </div>
      </div>

      {/* Trust Statement */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          <strong className="text-heading">15+ years of expertise</strong> since 2009. 
          Join thousands of satisfied clients across Sutherland Shire and Australia.
        </p>
      </div>
    </Section>
  );
};

export default ReviewsShowcase;

