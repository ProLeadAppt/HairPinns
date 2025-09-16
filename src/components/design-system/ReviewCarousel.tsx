import { useState } from "react";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Testimonial from "./Testimonial";

interface Review {
  id: string;
  quote: string;
  author: string;
  title?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface ReviewCarouselProps {
  reviews: Review[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  variant?: "default" | "card" | "minimal";
  className?: string;
}

const ReviewCarousel = ({
  reviews,
  autoPlay = false,
  interval = 5000,
  showControls = true,
  variant = "default",
  className
}: ReviewCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && reviews.length > 1) {
      const timer = setInterval(nextReview, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, reviews.length]);

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Review Content */}
      <div className="mb-6">
        <Testimonial
          quote={currentReview.quote}
          author={currentReview.author}
          title={currentReview.title}
          company={currentReview.company}
          avatar={currentReview.avatar}
          rating={currentReview.rating}
          variant={variant}
        />
      </div>

      {/* Controls */}
      {showControls && reviews.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevReview}
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-fast ${
                  index === currentIndex 
                    ? "bg-accent-color" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextReview}
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Review Counter */}
      {reviews.length > 1 && (
        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {reviews.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewCarousel;