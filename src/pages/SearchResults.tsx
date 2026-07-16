import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { searchBlogPosts } from "@/lib/blogSearch";
import { generateBreadcrumbSchema, generateSearchResultsItemListSchema } from "@/lib/schema";
import { searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

type SortMode = "relevance" | "price-low" | "price-high" | "name-asc";

interface SearchProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  imageAlt: string;
}

const POPULAR_SEARCHES = ["Juuce", "Shampoo", "Conditioner", "Smoothing", "Wet Brush"];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get("q") || "").trim();
  const [draftQuery, setDraftQuery] = useState(query);
  const [rawProducts, setRawProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [productError, setProductError] = useState(false);
  const [sortBy, setSortBy] = useState<SortMode>("relevance");
  const requestSequence = useRef(0);
  const articles = useMemo(() => searchBlogPosts(query, 12), [query]);

  useEffect(() => {
    setDraftQuery(query);
    setSortBy("relevance");
  }, [query]);

  useEffect(() => {
    if (query && typeof window.gtag === "function") {
      window.gtag("event", "search", { search_term: query });
    }
  }, [query]);

  useEffect(() => {
    const sequence = ++requestSequence.current;
    if (!query) {
      setRawProducts([]);
      setProductError(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setProductError(false);
    searchProducts(query, 50)
      .then((result) => {
        if (sequence !== requestSequence.current) return;
        const mapped = (result?.products || [])
          .filter((product: any) => product.availableForSale && product.handle)
          .map((product: any): SearchProduct => {
            const firstImage = product.images?.edges?.[0]?.node;
            const originalPrice = product.compareAtPriceRange?.minVariantPrice?.amount
              ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
              : undefined;
            return {
              id: product.id,
              slug: product.handle,
              title: product.title,
              price: parseFloat(product.priceRange?.minVariantPrice?.amount || "0"),
              originalPrice,
              currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
              image: firstImage?.url || "/placeholder.svg",
              imageAlt: firstImage?.altText || product.title,
            };
          });
        setRawProducts(mapped);
      })
      .catch((error) => {
        if (sequence !== requestSequence.current) return;
        console.error("Search failed:", error);
        setRawProducts([]);
        setProductError(true);
      })
      .finally(() => {
        if (sequence === requestSequence.current) setLoading(false);
      });
  }, [query]);

  const products = useMemo(() => {
    const sorted = [...rawProducts];
    if (sortBy === "price-low") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [rawProducts, sortBy]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const nextQuery = draftQuery.trim();
    if (!nextQuery) {
      navigate("/search");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  const totalResults = products.length + articles.length;
  const hasResults = totalResults > 0;
  const canonicalUrl = query
    ? `https://hairpinns.com/search?q=${encodeURIComponent(query)}`
    : "https://hairpinns.com/search";
  const itemListSchema = products.length > 0
    ? generateSearchResultsItemListSchema({
        query,
        url: canonicalUrl,
        items: products.slice(0, 20).map((product) => ({
          name: product.title,
          url: `/products/${product.slug}`,
          image: product.image,
          price: product.price,
          currency: product.currency,
        })),
      })
    : null;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "Search", url: "https://hairpinns.com/search" },
    ...(query ? [{ name: query, url: canonicalUrl }] : []),
  ]);

  return (
    <div data-search-page="" className="min-h-screen bg-[hsl(var(--after-hours-cream))]">
      <SEOHead
        title={query ? `${query} | Hair Pinns Search` : "Search Hair Care | Hair Pinns"}
        description={query ? `Search Hair Pinns products and Jena’s hair care guides for ${query}.` : "Search Hair Pinns products and Jena’s hair care guides."}
        canonical={canonicalUrl}
        hrefLang="en-AU"
        ogImage="https://hairpinns.com/og-default.jpg"
        schemaJson={[breadcrumbSchema, ...(itemListSchema ? [itemListSchema] : [])]}
        noIndex={true}
      />
      <Header />

      <main id="main-content" tabIndex={-1}>
        <section data-search-hero="" className="border-b border-[hsl(var(--after-hours-cream)/0.14)] bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto max-w-7xl px-5 pb-14 pt-5 sm:px-8 lg:px-12 lg:pb-20">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }, ...(query ? [{ label: `“${query}”` }] : [])]} variant="dark" />
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Shop + advice / Search desk</p>
                <h1 className="mt-5 max-w-[13ch] font-heading text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[hsl(var(--after-hours-cream))]">
                  {query ? <>Results for <em className="font-normal">“{query}”</em></> : <>What are you <em className="font-normal">looking for?</em></>}
                </h1>
              </div>
              <p className="max-w-sm border-l border-[hsl(var(--after-hours-copper))] pl-5 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.76)]">
                Search the product shelf and Jena’s practical hair care guides together.
              </p>
            </div>
          </div>
        </section>

        <section data-search-desk="" className="border-b border-[hsl(var(--after-hours-plum)/0.2)]">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
            <form role="search" onSubmit={submitSearch} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label htmlFor="search-page-query" className="sr-only">Search products and hair care guides</label>
              <input id="search-page-query" type="search" value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} placeholder="Product, brand, concern or guide" className="min-h-12 w-full border border-[hsl(var(--after-hours-plum)/0.35)] bg-transparent px-4 py-3 text-[hsl(var(--after-hours-plum))] outline-none placeholder:text-[hsl(var(--after-hours-plum)/0.52)] focus:border-[hsl(var(--after-hours-plum))] focus:ring-2 focus:ring-[hsl(var(--after-hours-copper)/0.42)]" />
              <button type="submit" className="min-h-12 bg-[hsl(var(--after-hours-plum))] px-7 py-3 text-sm font-semibold text-[hsl(var(--after-hours-cream))]">Search</button>
            </form>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
          {loading ? (
            <section data-search-page-loading="" aria-label="Loading search results" aria-busy="true">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.62)]">Searching the shelf</p>
              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => <div key={item} className="animate-pulse"><div className="aspect-[4/5] bg-[hsl(var(--after-hours-plum)/0.08)]" /><div className="mt-4 h-4 w-4/5 bg-[hsl(var(--after-hours-plum)/0.08)]" /></div>)}
              </div>
            </section>
          ) : !query ? (
            <section data-search-start="" className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div>
                <p className="after-hours-kicker text-[#8b3f20]">A useful place to start</p>
                <h2 className="mt-5 max-w-[11ch] font-heading text-4xl font-semibold leading-[0.98] text-[hsl(var(--after-hours-plum))] sm:text-6xl">Search by what your hair needs.</h2>
              </div>
              <div className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
                {POPULAR_SEARCHES.map((term, index) => (
                  <Link key={term} to={`/search?q=${encodeURIComponent(term)}`} className="grid min-h-16 grid-cols-[2.5rem_1fr_auto] items-center border-b border-[hsl(var(--after-hours-plum)/0.22)] py-3 text-[hsl(var(--after-hours-plum))]" style={{ color: "hsl(var(--after-hours-plum))" }}>
                    <span className="font-mono text-[0.62rem] text-[hsl(var(--after-hours-plum)/0.78)]">{String(index + 1).padStart(2, "0")}</span><span className="font-heading text-xl font-semibold">{term}</span><span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : productError && articles.length === 0 ? (
            <section data-search-page-error="" className="border-y border-[hsl(var(--after-hours-plum)/0.3)] py-10 text-[hsl(var(--after-hours-plum))]">
              <p className="after-hours-kicker text-[#8b3f20]">Search interrupted</p>
              <h2 className="mt-4 font-heading text-4xl font-semibold">Products could not load.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.72)]">Try the search again, browse the full product catalogue, or read Jena’s guides.</p>
              <div className="mt-7 flex flex-wrap gap-3"><Link to="/collections" className="inline-flex min-h-11 items-center bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>Browse products</Link><Link to="/blog" className="inline-flex min-h-11 items-center border border-[hsl(var(--after-hours-plum)/0.4)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>Read the guides</Link></div>
            </section>
          ) : !hasResults ? (
            <section data-search-page-empty="" className="grid gap-8 border-y border-[hsl(var(--after-hours-plum)/0.3)] py-10 text-[hsl(var(--after-hours-plum))] lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div><p className="after-hours-kicker text-[#8b3f20]">No exact match</p><h2 className="mt-4 max-w-[14ch] font-heading text-4xl font-semibold leading-tight">Nothing found for “{query}”.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.72)]">Check the spelling, try a broader hair concern, or browse all products.</p></div>
              <div className="flex flex-col justify-end gap-3"><Link to="/collections" className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>Browse products <span aria-hidden="true">→</span></Link><Link to="/blog" className="flex min-h-11 items-center justify-between border border-[hsl(var(--after-hours-plum)/0.38)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>Read Jena’s guides <span aria-hidden="true">→</span></Link></div>
            </section>
          ) : (
            <div data-search-page-results="" className="space-y-20 text-[hsl(var(--after-hours-plum))]">
              <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[hsl(var(--after-hours-plum)/0.28)] pb-5">
                <div><p className="after-hours-kicker text-[#8b3f20]">Search return / {String(totalResults).padStart(2, "0")}</p><p className="mt-2 text-sm text-[hsl(var(--after-hours-plum)/0.68)]">{products.length} {products.length === 1 ? "product" : "products"} · {articles.length} {articles.length === 1 ? "guide" : "guides"}</p></div>
                {products.length > 1 && <div><label htmlFor="search-sort" className="mr-3 text-xs font-semibold">Sort products</label><select id="search-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortMode)} className="min-h-11 border border-[hsl(var(--after-hours-plum)/0.35)] bg-transparent px-3 text-sm"><option value="relevance">Relevance</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name-asc">Name: A–Z</option></select></div>}
              </div>

              {productError && <aside data-search-partial-error="" className="border-l-2 border-[hsl(var(--after-hours-copper))] pl-4 text-sm leading-6">Products could not load, but matching guides are shown below.</aside>}

              {products.length > 0 && (
                <section data-search-product-results="" aria-labelledby="product-results-heading">
                  <div className="mb-8 flex items-end justify-between border-b border-[hsl(var(--after-hours-plum)/0.24)] pb-4"><div><p className="after-hours-kicker text-[#8b3f20]">01 / Shop</p><h2 id="product-results-heading" className="mt-3 font-heading text-4xl font-semibold">Products</h2></div><Link to="/collections" className="hidden min-h-11 items-center text-xs font-semibold underline underline-offset-4 sm:inline-flex" style={{ color: "hsl(var(--after-hours-plum))" }}>All products</Link></div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                    {products.map((product, index) => {
                      const currentPrice = formatPrice(product.price, product.currency);
                      const comparePrice = product.originalPrice && product.originalPrice > product.price ? formatPrice(product.originalPrice, product.currency) : "";
                      return <article key={product.id} className="min-w-0"><Link to={`/products/${product.slug}`} className="group block"><div className="relative aspect-[4/5] overflow-hidden bg-white p-3 sm:p-5"><img src={product.image} alt={product.imageAlt} width="800" height="1000" loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" /><span className="absolute left-3 top-3 font-mono text-[0.58rem] text-[hsl(var(--after-hours-plum)/0.55)]">{String(index + 1).padStart(2, "0")}</span></div><h3 className="mt-4 line-clamp-2 font-heading text-base font-semibold leading-tight sm:text-lg" style={{ color: "hsl(var(--after-hours-plum))" }}>{product.title}</h3><div className="mt-2 flex flex-wrap items-baseline gap-2 text-sm" style={{ color: "hsl(var(--after-hours-plum))" }}>{currentPrice && <span className="font-semibold">{currentPrice}</span>}{comparePrice && <span className="text-xs line-through opacity-58">{comparePrice}</span>}</div></Link></article>;
                    })}
                  </div>
                </section>
              )}

              {articles.length > 0 && (
                <section data-search-article-results="" aria-labelledby="article-results-heading">
                  <div className="mb-8 border-b border-[hsl(var(--after-hours-plum)/0.24)] pb-4"><p className="after-hours-kicker text-[#8b3f20]">02 / Learn</p><h2 id="article-results-heading" className="mt-3 font-heading text-4xl font-semibold">Jena’s guides</h2></div>
                  <div className="border-t border-[hsl(var(--after-hours-plum)/0.24)]">
                    {articles.map((article, index) => <article key={article.slug} className="grid gap-4 border-b border-[hsl(var(--after-hours-plum)/0.22)] py-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center"><Link to={article.url} className="aspect-[4/3] overflow-hidden bg-[hsl(var(--after-hours-plum)/0.08)]"><img src={article.image} alt={article.title} width="280" height="210" loading="lazy" decoding="async" className="h-full w-full object-cover" /></Link><div><p className="font-mono text-[0.6rem] text-[hsl(var(--after-hours-plum)/0.55)]">{String(index + 1).padStart(2, "0")} / {article.category}</p><h3 className="mt-2 font-heading text-xl font-semibold leading-tight"><Link to={article.url} style={{ color: "hsl(var(--after-hours-plum))" }}>{article.title}</Link></h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.68)]">{article.excerpt}</p></div><Link to={article.url} className="inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4" style={{ color: "hsl(var(--after-hours-plum))" }}>Read guide</Link></article>)}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
