import { useState, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { searchProducts } from "@/lib/shopify";
import { OptimizedImage } from "@/components/OptimizedImage";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string | null;
      };
    }>;
  };
}

interface ProductSearchProps {
  onProductClick?: (handle: string) => void;
  placeholder?: string;
  maxResults?: number;
}

export default function ProductSearch({ 
  onProductClick,
  placeholder = "Search products...",
  maxResults = 8 
}: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { products } = await searchProducts(searchQuery, maxResults);
      setResults(products);
      setShowResults(true);
    } catch (error) {
      console.error("Product search error:", error);
      setResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  }, [maxResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    setHasSearched(false);
  };

  const handleProductClick = (handle: string) => {
    if (onProductClick) {
      onProductClick(handle);
    }
    setShowResults(false);
  };

  const formatProductPrice = (product: Product) => {
    const min = parseFloat(product.priceRange.minVariantPrice.amount);
    const max = parseFloat(product.priceRange.maxVariantPrice.amount);
    const currency = product.priceRange.minVariantPrice.currencyCode;
    
    if (min === max) {
      return formatPrice(min, currency);
    }
    return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0 || hasSearched) {
              setShowResults(true);
            }
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {isSearching ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <ul className="divide-y divide-border">
                {results.map((product) => {
                  const image = product.images.edges[0]?.node;
                  return (
                    <li key={product.id}>
                      <Link
                        to={`/products/${product.handle}`}
                        onClick={() => handleProductClick(product.handle)}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        {image && (
                          <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            <OptimizedImage
                              src={image.url}
                              alt={image.altText || product.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{product.title}</h3>
                          <p className="text-sm font-semibold text-foreground mt-1">
                            {formatProductPrice(product)}
                          </p>
                          {!product.availableForSale && (
                            <span className="text-xs text-muted-foreground">Out of stock</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : hasSearched ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No products found for "{query}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

