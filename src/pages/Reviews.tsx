import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet";

const Reviews = () => {
  const navigate = useNavigate();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const handleStarClick = (rating: number) => {
    setSelectedStar(rating);
    
    // Slight delay for visual feedback
    setTimeout(() => {
      if (rating <= 3) {
        navigate("/reviews/feedback", { state: { rating } });
      } else {
        navigate("/reviews/google", { state: { rating } });
      }
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>Share Your Experience | Hair Pinns</title>
        <meta name="description" content="How was your experience with Hair Pinns? Share your feedback to help us improve." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-surface rounded-card shadow-card p-8 md:p-12 text-center animate-fade-in">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-h2-lg md:text-[2.5rem] font-heading text-heading mb-4">
                How was your experience with Hair Pinns?
              </h1>
              <p className="text-lg text-muted max-w-md mx-auto">
                Tap a star below to rate us
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-3 md:gap-6 mb-8">
              {[1, 2, 3, 4, 5].map((star) => {
                const isHovered = hoveredStar !== null && star <= hoveredStar;
                const isSelected = selectedStar !== null && star <= selectedStar;
                const shouldFill = isSelected || isHovered;

                return (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className={cn(
                      "transform transition-all duration-200 hover:scale-110 active:scale-95",
                      "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-lg p-2",
                      isSelected && "scale-105"
                    )}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={cn(
                        "w-12 h-12 md:w-16 md:h-16 transition-all duration-200",
                        shouldFill
                          ? "fill-brand-500 text-brand-500"
                          : "text-border hover:text-brand-500/50"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            {/* Helper Text */}
            <p className="text-sm text-muted-foreground">
              Your feedback helps us serve you better
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Your feedback is confidential and helps us improve our service
          </p>
        </div>
      </div>
    </>
  );
};

export default Reviews;
