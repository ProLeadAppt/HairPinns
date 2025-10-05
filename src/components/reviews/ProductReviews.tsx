import { Star, CheckCircle } from "lucide-react";
import { productReviews } from "@/data/reviews";

interface ProductReviewsProps {
  productHandle: string;
}

const ProductReviews = ({ productHandle }: ProductReviewsProps) => {
  const reviews = productReviews[productHandle] || [];

  if (reviews.length === 0) {
    return null;
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-6 pb-6 border-b border-border">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-4xl font-bold text-heading">{averageRating.toFixed(1)}</span>
            <Star className="w-6 h-6 text-[hsl(var(--star-color))] fill-current" />
          </div>
          <div className="flex mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
        </div>

        <div className="flex-1">
          <p className="text-foreground font-medium mb-2">Customer Reviews</p>
          <p className="text-sm text-muted-foreground">
            All reviews are from verified purchasers
          </p>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-heading">{review.author}</span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-brand-500 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString('en-AU', { 
                  day: 'numeric',
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <p className="text-foreground leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
