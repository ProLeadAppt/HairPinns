import { Star, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { averageRating, totalReviews, googleReviewsUrl } from "@/data/reviews";

interface GoogleReviewBadgeProps {
  variant?: "micro" | "default";
  showCTA?: boolean;
}

const GoogleReviewBadge = ({ variant = "default", showCTA = false }: GoogleReviewBadgeProps) => {
  if (variant === "micro") {
    return (
      <Link to="/reviews" className="block bg-background border-b border-border hover:bg-accent/5 transition-colors cursor-pointer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
                <span className="font-semibold text-foreground">{averageRating}</span>
              </div>
              <span className="text-muted-foreground">on Google</span>
              <CheckCircle className="w-4 h-4 text-brand-500" />
              <span className="text-xs text-muted-foreground">({totalReviews} reviews)</span>
            </div>
            
            {showCTA && (
              <span className="text-sm text-brand-500 hover:text-brand-600 font-medium inline-flex items-center gap-1">
                Share your result
                <ExternalLink className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-accent/50 border border-accent/20 rounded-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-3xl font-bold text-heading">{averageRating}</span>
              <Star className="w-6 h-6 text-[hsl(var(--star-color))] fill-current" />
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-[hsl(var(--star-color))] fill-current" />
              ))}
            </div>
          </div>
          
          <div className="border-l border-border pl-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-heading">Google Reviews</span>
              <CheckCircle className="w-4 h-4 text-brand-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews} verified reviews
            </p>
          </div>
        </div>

        <a
          href={googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 hover:text-brand-600 font-medium inline-flex items-center gap-2 transition-colors"
        >
          View all reviews
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default GoogleReviewBadge;
