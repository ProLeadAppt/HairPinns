import { Star } from "lucide-react";
import { googleReviews } from "@/data/reviews";

interface ReviewStripProps {
  variant?: "default" | "compact";
}

const ReviewStrip = ({ variant = "default" }: ReviewStripProps) => {
  const displayedReviews = googleReviews.slice(0, 3);

  if (variant === "compact") {
    return (
      <div className="bg-muted/50 border-y border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {displayedReviews.map((review, index) => (
              <div key={review.id} className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[hsl(var(--star-color))] fill-current" />
                  ))}
                </div>
                <span className="text-foreground/90">"{review.text.slice(0, 50)}..."</span>
                <span className="font-medium text-foreground">— {review.author}</span>
                {index < displayedReviews.length - 1 && (
                  <span className="text-border">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-card p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-3 line-clamp-3">
                "{review.text}"
              </p>
              <p className="text-xs font-medium text-heading">{review.author}</p>
              <p className="text-xs text-muted-foreground">{review.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStrip;
