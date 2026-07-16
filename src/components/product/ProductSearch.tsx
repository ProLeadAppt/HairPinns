import { useEffect, useId, useRef, useState } from "react";
import { BookOpen, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { searchProducts } from "@/lib/shopify";
import { searchBlogPosts } from "@/lib/blogSearch";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{ node: { id: string; url: string; altText: string | null } }>;
  };
}

interface ProductSearchProps {
  onProductClick?: (handle: string) => void;
  placeholder?: string;
  maxResults?: number;
}

export default function ProductSearch({
  onProductClick,
  placeholder = "Search products and articles...",
  maxResults = 8,
}: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const requestSequence = useRef(0);
  const inputId = useId();
  const suggestionsId = useId();
  const navigate = useNavigate();
  const trimmedQuery = query.trim();
  const articles = trimmedQuery.length >= 2 ? searchBlogPosts(trimmedQuery, Math.min(maxResults, 3)) : [];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowResults(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const sequence = ++requestSequence.current;
    if (trimmedQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      setSearchError(false);
      setIsSearching(false);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setSearchError(false);
    setShowResults(true);
    const timeout = window.setTimeout(async () => {
      try {
        const response = await searchProducts(trimmedQuery, maxResults);
        if (sequence !== requestSequence.current) return;
        setResults((response?.products || []).filter((product: Product) => product.availableForSale && product.handle));
      } catch (error) {
        if (sequence !== requestSequence.current) return;
        console.error("Product search error:", error);
        setResults([]);
        setSearchError(true);
      } finally {
        if (sequence === requestSequence.current) {
          setHasSearched(true);
          setIsSearching(false);
        }
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [trimmedQuery, maxResults]);

  const closeSuggestions = () => setShowResults(false);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmedQuery) return;
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    closeSuggestions();
  };

  const clearSearch = () => {
    requestSequence.current += 1;
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setSearchError(false);
    setShowResults(false);
    document.getElementById(inputId)?.focus();
  };

  const productPrice = (product: Product) => {
    const minimum = parseFloat(product.priceRange.minVariantPrice.amount);
    const maximum = parseFloat(product.priceRange.maxVariantPrice.amount);
    const currency = product.priceRange.minVariantPrice.currencyCode;
    return minimum === maximum
      ? formatPrice(minimum, currency)
      : `${formatPrice(minimum, currency)} – ${formatPrice(maximum, currency)}`;
  };

  const suggestionCount = results.length + articles.length;
  const panelVisible = showResults && trimmedQuery.length >= 2;

  return (
    <div ref={searchRef} data-predictive-search="" className="relative w-full">
      <form role="search" onSubmit={submitSearch} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--after-hours-plum)/0.62)]" aria-hidden="true" />
        <label htmlFor={inputId} className="sr-only">Search products and articles</label>
        <input
          id={inputId}
          type="text"
          role="searchbox"
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => trimmedQuery.length >= 2 && setShowResults(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setShowResults(false);
              event.currentTarget.focus();
            }
          }}
          aria-expanded={panelVisible}
          aria-controls={panelVisible ? suggestionsId : undefined}
          aria-describedby={`${inputId}-hint`}
          autoComplete="off"
          className="h-11 w-full border border-[hsl(var(--after-hours-plum)/0.28)] bg-transparent py-2 pl-10 pr-12 text-sm text-[hsl(var(--after-hours-plum))] outline-none placeholder:text-[hsl(var(--after-hours-plum)/0.54)] focus:border-[hsl(var(--after-hours-plum))] focus:ring-2 focus:ring-[hsl(var(--after-hours-copper)/0.45)]"
        />
        <span id={`${inputId}-hint`} className="sr-only">Enter at least two characters. Press Enter for all results.</span>
        {query && (
          <button type="button" onClick={clearSearch} className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[hsl(var(--after-hours-plum)/0.66)] hover:text-[hsl(var(--after-hours-plum))]" aria-label="Clear search">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </form>

      {panelVisible && (
        <section id={suggestionsId} data-search-suggestions="" aria-label="Search suggestions" className="absolute right-0 top-full z-50 mt-2 max-h-[min(32rem,70vh)] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto border border-[hsl(var(--after-hours-plum)/0.3)] bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))] shadow-[0_1rem_3rem_hsl(var(--after-hours-plum)/0.18)]">
          <div className="flex items-center justify-between border-b border-[hsl(var(--after-hours-plum)/0.16)] px-4 py-3">
            <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.65)]">Search / {trimmedQuery}</p>
            {!isSearching && hasSearched && !searchError && <span className="font-mono text-[0.64rem]">{suggestionCount} found</span>}
          </div>

          {isSearching ? (
            <div data-search-loading="" className="px-4 py-8 text-sm" role="status">Searching products…</div>
          ) : searchError ? (
            <div data-search-error="" className="px-4 py-7">
              <p className="font-heading text-lg font-semibold">Products could not load.</p>
              <p className="mt-2 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.7)]">Press Enter to open the full search page, or try again.</p>
            </div>
          ) : results.length > 0 || articles.length > 0 ? (
            <div>
              {results.length > 0 && (
                <div data-search-products="">
                  <p className="border-b border-[hsl(var(--after-hours-plum)/0.14)] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[hsl(var(--after-hours-plum)/0.64)]">Products</p>
                  <ul>
                    {results.map((product, index) => {
                      const image = product.images?.edges?.[0]?.node;
                      return (
                        <li key={product.id} className="border-b border-[hsl(var(--after-hours-plum)/0.14)]">
                          <Link to={`/products/${product.handle}`} onClick={() => { onProductClick?.(product.handle); closeSuggestions(); }} className="grid min-h-20 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3" style={{ color: "hsl(var(--after-hours-plum))" }}>
                            <div className="aspect-square bg-white p-1">
                              <img src={image?.url || "/placeholder.svg"} alt={image?.altText || product.title} width="104" height="104" loading="lazy" decoding="async" className="h-full w-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-mono text-[0.58rem] text-[hsl(var(--after-hours-plum)/0.55)]">{String(index + 1).padStart(2, "0")}</span>
                              <p className="line-clamp-2 font-heading text-sm font-semibold leading-tight">{product.title}</p>
                            </div>
                            <span className="text-xs font-semibold">{productPrice(product)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {articles.length > 0 && (
                <div data-search-articles="">
                  <p className="border-b border-[hsl(var(--after-hours-plum)/0.14)] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[hsl(var(--after-hours-plum)/0.64)]">Jena’s guides</p>
                  <ul>
                    {articles.map((article) => (
                      <li key={article.slug} className="border-b border-[hsl(var(--after-hours-plum)/0.14)]">
                        <Link to={article.url} onClick={closeSuggestions} className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 text-sm" style={{ color: "hsl(var(--after-hours-plum))" }}>
                          <span className="line-clamp-2">{article.title}</span>
                          <BookOpen className="h-4 w-4 flex-none" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : hasSearched ? (
            <div data-search-empty="" className="px-4 py-8">
              <p className="font-heading text-xl font-semibold">No matching products or guides.</p>
              <p className="mt-2 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.7)]">Check the spelling or press Enter to continue.</p>
            </div>
          ) : null}

          <button type="button" onClick={() => { navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`); closeSuggestions(); }} className="flex min-h-12 w-full items-center justify-between bg-[hsl(var(--after-hours-plum))] px-4 py-3 text-sm font-semibold text-[hsl(var(--after-hours-cream))]">
            <span>All results for “{trimmedQuery}”</span><span aria-hidden="true">→</span>
          </button>
        </section>
      )}

      <span className="sr-only" role="status" aria-live="polite">
        {isSearching ? "Searching products" : hasSearched ? (searchError ? "Product search failed" : `${suggestionCount} search suggestions available`) : ""}
      </span>
    </div>
  );
}
