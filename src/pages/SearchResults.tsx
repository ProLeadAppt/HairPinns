import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search } from "lucide-react";
import { searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateSearchResultsItemListSchema, generateBreadcrumbSchema, generateFAQPageSchema } from "@/lib/schema";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Track GA4 search event when query changes
  useEffect(() => {
    if (query && typeof window.gtag === 'function') {
      window.gtag('event', 'search', { search_term: query });
    }
  }, [query]);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const result = await searchProducts(query, 50);
        if (result?.products) {
          const mappedProducts = result.products
            .filter((p: any) => p.availableForSale)
            .map((product: any) => {
              const firstImage = product.images?.edges?.[0]?.node;
              const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
              const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
                ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                : undefined;
              return {
                id: product.id,
                slug: product.handle,
                title: product.title,
                price: price,
                originalPrice: compareAtPrice,
                currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                image: firstImage?.url || "/placeholder.svg",
                availableForSale: product.availableForSale,
              };
            });

          // Sort products
          const sorted = [...mappedProducts].sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "name-asc") return a.title.localeCompare(b.title);
            return 0; // Default: relevance
          });

          setProducts(sorted);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, sortBy]);

  const canonicalUrl = query
    ? `https://hairpinns.com/search?q=${encodeURIComponent(query)}`
    : "https://hairpinns.com/search";
  const itemListSchema =
    products.length > 0
      ? generateSearchResultsItemListSchema({
          query,
          url: canonicalUrl,
          items: products.slice(0, 20).map((p) => ({
            name: p.title,
            url: `/products/${p.slug}`,
            image: p.image,
            price: p.price,
            currency: p.currency,
          })),
        })
      : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "Search", url: "https://hairpinns.com/search" },
    ...(query ? [{ name: query, url: canonicalUrl }] : []),
  ]);

  const faqSchema = products.length > 0 && query ? generateFAQPageSchema([
    { question: `Where can I buy ${query} in Australia?`, answer: `Hair Pinns stocks ${query} and ships Australia-wide. Free shipping over $150. Shop professional hair care at hairpinns.com.` },
    { question: `Does Hair Pinns ship ${query} Australia-wide?`, answer: `Yes. Hair Pinns ships ${query} to Melbourne, Brisbane, Perth, Sydney, and all of Australia. Free shipping on orders over $150.` },
  ]) : null;

  const schemas = [
    breadcrumbSchema,
    ...(faqSchema ? [faqSchema] : []),
    ...(itemListSchema ? [itemListSchema] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={query ? `${query} | Hair Products Australia | Hair Pinns` : "Search Products | Hair Pinns Australia"}
        description={
          query
            ? `Find ${query} and more hair care products. Shipped Australia-wide. Free shipping over $150.`
            : "Search hair care products. Shipped Australia-wide. Free shipping over $150."
        }
        canonical={canonicalUrl}
        hrefLang="en-AU"
        ogImage="https://hairpinns.com/og-default.jpg"
        schemaJson={schemas}
      />

      <Header />

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Search', href: '/search' },
              ...(query ? [{ label: `"${query}"` }] : []),
            ]}
          />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-2">
              {query ? `Results for "${query}"` : "Search"}
            </h1>
            {!loading && query && products.length > 0 && (
              <p className="text-sm text-muted-foreground">{products.length} {products.length === 1 ? 'product' : 'products'} found</p>
            )}
          </div>

          {/* Sort */}
          {products.length > 0 && (
            <div className="mb-6 flex justify-end">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    <div className="h-9 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : !query ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold text-heading mb-2">
                What are you after?
              </h2>
              <p className="text-muted-foreground mb-6">
                Use the search bar above or jump to something popular below.
              </p>
              <div>
                <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Juuce", "Smoothing", "Blonde Care", "Gift Sets", "Shampoo"].map((term) => (
                    <Link
                      key={term}
                      to={`/search?q=${encodeURIComponent(term)}`}
                      className="px-3 py-1.5 text-sm bg-accent/50 text-foreground rounded-full hover:bg-accent transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold text-heading mb-2">
                No products found for "{query}"
              </h2>
              <p className="text-muted-foreground mb-6">
                Try a different search or browse our collections
              </p>
              <div className="flex gap-3 justify-center mb-8">
                <Button asChild variant="outline">
                  <Link to="/collections">Browse Collections</Link>
                </Button>
                <Button asChild variant="primary">
                  <Link to="/collections/best-sellers">View Best Sellers</Link>
                </Button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Juuce", "Smoothing", "Blonde Care", "Gift Sets", "Shampoo"].map((term) => (
                    <Link
                      key={term}
                      to={`/search?q=${encodeURIComponent(term)}`}
                      className="px-3 py-1.5 text-sm bg-accent/50 text-foreground rounded-full hover:bg-accent transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((product) => product.slug && typeof product.slug === "string")
                .map((product) => (
                <div
                  key={product.id}
                  className="group bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link to={`/products/${product.slug}`} className="block aspect-square bg-muted relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
                    {!product.availableForSale && (
                      <Badge variant="destructive" className="absolute top-3 left-3">
                        Out of Stock
                      </Badge>
                    )}
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold text-heading mb-2 line-clamp-2">
                      <Link to={`/products/${product.slug}`} className="hover:text-brand-500 transition-colors">
                        {product.title}
                      </Link>
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <p className="text-xl font-bold text-brand-500">
                        {formatPrice(product.price, product.currency)}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm font-semibold text-muted-foreground line-through decoration-muted-foreground/30">
                          {formatPrice(product.originalPrice, product.currency)}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/products/${product.slug}`}>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        View Product
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
