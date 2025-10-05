import { ShoppingCart, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Badge from "./Badge";
import { getProductUrl } from "@/lib/shopify";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
  handle?: string; // Shopify product handle
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  onViewProduct?: () => void;
  isFavorite?: boolean;
  className?: string;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  description,
  rating,
  reviewCount,
  badge,
  inStock = true,
  handle,
  onAddToCart,
  onToggleFavorite,
  onViewProduct,
  isFavorite = false,
  className
}: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = async () => {
    if (!inStock) return;
    
    setIsAddingToCart(true);
    
    try {
      if (onAddToCart) {
        await onAddToCart();
      } else if (handle) {
        // Fallback: redirect to product page on hairpinns.com
        window.location.href = getProductUrl(handle);
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      // Fallback to product page
      if (handle) {
        window.location.href = getProductUrl(handle);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct();
    } else if (handle) {
      window.location.href = getProductUrl(handle);
    }
  };
  const renderRating = () => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "w-3 h-3",
                i < Math.floor(rating) ? "text-[hsl(var(--star-color))] fill-current" : "text-muted-foreground"
              )} 
            />
          ))}
        </div>
        {reviewCount && (
          <span className="text-xs text-muted-foreground">
            ({reviewCount})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-base",
      !inStock && "opacity-75",
      className
    )}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {badge && <Badge variant="accent" size="sm">{badge}</Badge>}
          {!inStock && <Badge variant="destructive" size="sm">Out of Stock</Badge>}
        </div>
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-colors duration-fast",
              isFavorite 
                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" 
                : "bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {renderRating()}
        
        <h3 className="font-medium text-foreground mb-2 line-clamp-2">
          {name}
        </h3>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-semibold text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
          {(onViewProduct || handle) && (
            <Button
              onClick={handleViewProduct}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;