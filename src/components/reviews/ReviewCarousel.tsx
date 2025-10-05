import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { googleReviews } from "@/data/reviews";

const ReviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const visibleReviews = 5;
  const displayedReviews = googleReviews.slice(0, visibleReviews);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayedReviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayedReviews.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + displayedReviews.length) % displayedReviews.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % displayedReviews.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="bg-accent py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-lg font-heading font-bold text-heading mb-3">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[hsl(var(--star-color))] fill-current" />
              ))}
            </div>
            <span className="font-semibold text-foreground">4.9 stars</span>
            <span>• {googleReviews.length} Google reviews</span>
          </div>
        </div>

        <div className="relative">
          {/* Review Cards */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {displayedReviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-card border border-border rounded-card p-8 shadow-sm h-full flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-foreground leading-relaxed mb-6 flex-grow">
                      "{review.text}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-heading">{review.author}</p>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-brand-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.location} • {review.service}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('en-AU', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors z-10"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors z-10"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {displayedReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-brand-500" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCarousel;
