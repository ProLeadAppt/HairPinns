import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

interface SearchBarProps {
  onSelect?: () => void;
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const result = await searchProducts(query, 5);
        if (result?.products) {
          const products = result.products
            .filter((p: any) => p.availableForSale)
            .slice(0, 5)
            .map((product: any) => {
              const firstImage = product.images?.edges?.[0]?.node;
              const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
              return {
                id: product.id,
                slug: product.handle,
                title: product.title,
                price: price,
                currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                image: firstImage?.url || "/placeholder.svg",
              };
            });
          setResults(products);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (slug: string) => {
    navigate(`/products/${slug}`);
    setShowResults(false);
    setQuery("");
    onSelect?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      onSelect?.();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setShowResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 border-b border-border">
                <p className="text-sm font-semibold text-heading">Products</p>
              </div>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.slug)}
                  className="w-full p-3 hover:bg-accent flex items-center gap-3 text-left transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-heading line-clamp-1">{product.title}</p>
                    <p className="text-sm font-bold text-brand-500">
                      {formatPrice(product.price, product.currency)}
                    </p>
                  </div>
                </button>
              ))}
              <div className="p-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                    setShowResults(false);
                    onSelect?.();
                  }}
                >
                  View All Results
                </Button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
