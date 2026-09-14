import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getOGImage } from "@/lib/sitemap";
import { generateWebPageSchema, generateBreadcrumbSchema, generateBlogItemListSchema } from "@/lib/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";
import { blogSummaries } from "@/data/blogSummaries";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { filterBlogSummaries } from "@/lib/blogSearch";
import { getPublicBlog, publicExcerpt } from "@/lib/shopifyContent";
import { SHOPIFY_JOURNAL_START } from "@/config/journalPublication";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopifyPosts, setShopifyPosts] = useState<typeof blogSummaries>([]);
  const [contentLoading, setContentLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getPublicBlog("blogs").then((blog) => {
      if (!active) return;
      const legacySlugs = new Set(blogSummaries.map((post) => post.slug));
      setShopifyPosts((blog?.articles.nodes || []).filter((article) => !legacySlugs.has(article.handle) && Date.parse(article.publishedAt) >= Date.parse(SHOPIFY_JOURNAL_START)).map((article) => ({
        slug: article.handle, title: article.title,
        excerpt: publicExcerpt(article.excerpt, article.contentHtml),
        image: article.image?.url || getOGImage("blog"),
        date: article.publishedAt, author: article.author?.name || "Jena Pinn",
        category: "Hair care", readTime: "3 min read",
      })));
    }).catch((error) => console.error("Shopify journal unavailable:", error))
      .finally(() => { if (active) setContentLoading(false); });
    return () => { active = false; };
  }, []);
  const visiblePosts = [...shopifyPosts, ...blogSummaries.filter((post) => !post.archived)];
  const categories = ["all", ...Array.from(new Set(visiblePosts.map((post) => post.category)))];
  const searchedPosts = filterBlogSummaries(visiblePosts, searchQuery);
  const filteredPosts = activeCategory === "all"
    ? searchedPosts
    : searchedPosts.filter((post) => post.category === activeCategory);
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);
  const displayedPosts = remainingPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < remainingPosts.length;

  const schemas = [
    generateWebPageSchema({
      name: "Hair Tips & Product Advice | Hair Pinns Blog",
      description: "Hair care tips and product advice from Jena at Hair Pinns. Professional recommendations for Australian hair. Shipped Australia-wide.",
      url: "https://hairpinns.com/blog",
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "Blog", url: "https://hairpinns.com/blog" },
    ]),
    generateBlogItemListSchema(visiblePosts.map((post) => ({
      name: post.title,
      url: `https://hairpinns.com/blog/${post.slug}`,
      datePublished: post.date,
    }))),
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-paper))]">
      <SEOHead
        title="Hair Tips & Product Advice | Hair Pinns Blog Australia"
        description="Hair care tips and product advice from Jena at Hair Pinns. Professional recommendations for Australian hair. Shipped Australia-wide."
        canonical="https://hairpinns.com/blog"
        ogImage={getOGImage("blog")}
        ogType="website"
        schemaJson={schemas}
        prerenderReady={!contentLoading}
      />
      <Header />

      <div className="border-b border-[hsl(var(--hp-ink)/0.16)] bg-[hsl(var(--hp-lavender))] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[78rem]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} variant="dark" />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} data-blog-index="">
        <section className="bg-[hsl(var(--hp-lavender))] text-[hsl(var(--hp-ink))]" aria-labelledby="journal-title">
          <div className="mx-auto grid max-w-[78rem] gap-6 px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-[0.68fr_0.32fr] lg:gap-20 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Hair Pinns / The journal</p>
              <h1 id="journal-title" className="mt-4 max-w-[12ch] font-heading text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[hsl(var(--hp-ink))]">
                Good hair starts with honest advice.
              </h1>
            </div>
            <div className="self-end border-t border-[hsl(var(--hp-ink)/0.3)] pt-4 lg:pt-6">
              <p className="max-w-[31rem] text-base leading-7 text-[hsl(var(--hp-ink)/0.76)]">
                The advice Jena gives behind the chair, written down. Hair care, product notes, salon answers, and practical routines for Australian hair.
              </p>
              <p className="mt-4 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-copper))] lg:mt-8">
                {visiblePosts.length} field notes / Bangor, NSW
              </p>
            </div>
          </div>
        </section>

        <nav aria-label="Filter journal stories" className="sticky top-16 z-30 border-b border-[hsl(var(--after-hours-plum)/0.2)] bg-[hsl(var(--after-hours-paper)/0.96)] backdrop-blur-sm">
          <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
            <div className="relative border-b border-[hsl(var(--after-hours-plum)/0.14)] py-3">
              <label htmlFor="journal-search" className="sr-only">Search journal stories</label>
              <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--hp-ink)/0.56)]" aria-hidden="true" />
              <input
                id="journal-search"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setVisibleCount(12);
                }}
                placeholder="Search hair advice, products or services"
                className="min-h-11 w-full bg-transparent pl-7 pr-12 text-sm text-[hsl(var(--hp-ink))] outline-none placeholder:text-[hsl(var(--hp-ink)/0.5)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--after-hours-copper))]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[hsl(var(--hp-ink)/0.68)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))]"
                  aria-label="Clear journal search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <div className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-7 py-4">
              <span className="font-mono text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--hp-ink)/0.5)]">{filteredPosts.length} found /</span>
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      setVisibleCount(12);
                    }}
                    aria-pressed={isActive}
                    className={`min-h-11 border-b py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${isActive ? "border-[hsl(var(--after-hours-copper))] text-[hsl(var(--hp-ink))]" : "border-transparent text-[hsl(var(--hp-ink)/0.58)] hover:border-[hsl(var(--after-hours-plum)/0.34)] hover:text-[hsl(var(--hp-ink))]"}`}
                  >
                    {category === "all" ? "All stories" : category}
                  </button>
                );
              })}
            </div>
            </div>
          </div>
        </nav>

        {filteredPosts.length === 0 ? (
          <section className="bg-[hsl(var(--after-hours-paper))] py-14 sm:py-20" aria-live="polite">
            <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
              <p className="after-hours-kicker text-[hsl(var(--hp-ink)/0.66)]">No matching notes</p>
              <h2 className="mt-4 font-heading text-3xl text-[hsl(var(--hp-ink))]">Try a broader hair question.</h2>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-6 min-h-11 border-b border-[hsl(var(--after-hours-copper))] text-sm font-semibold text-[hsl(var(--hp-ink))]"
              >
                Clear search and filters
              </button>
            </div>
          </section>
        ) : null}

        {featuredPost ? (
          <section className="bg-[hsl(var(--after-hours-paper))] py-12 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
              <FeaturedPost post={featuredPost} />
            </div>
          </section>
        ) : null}

        {remainingPosts.length > 0 ? (
          <section className="border-t border-[hsl(var(--after-hours-plum)/0.2)] bg-[hsl(var(--after-hours-cream))] py-16 lg:py-24" aria-labelledby="all-stories-title">
            <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
              <div className="grid gap-6 border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-5 md:grid-cols-[0.72fr_1.28fr] md:items-end">
                <div>
                  <p className="after-hours-kicker text-[hsl(var(--hp-ink)/0.68)]">02 / From Jena’s chair</p>
                  <h2 id="all-stories-title" className="mt-4 max-w-[9ch] font-heading text-[clamp(2.8rem,7vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--hp-ink))]">
                    Notes worth keeping.
                  </h2>
                </div>
                <p className="max-w-[38rem] text-sm leading-6 text-[hsl(var(--hp-ink)/0.66)] md:justify-self-end">
                  Filter by concern or browse the full journal. Every guide is grounded in the questions clients ask in the Bangor salon.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-x-7 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {displayedPosts.map((post, index) => <BlogCard key={post.slug} post={post} index={index + 1} />)}
              </div>

              {hasMorePosts ? (
                <div className="mt-12 border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + 12)}
                    className="inline-flex min-h-12 items-center justify-between gap-10 border border-[hsl(var(--after-hours-plum)/0.36)] px-5 text-sm font-semibold text-[hsl(var(--hp-ink))] transition-colors hover:border-[hsl(var(--after-hours-copper))]"
                    aria-label={`Show more journal stories. ${remainingPosts.length - visibleCount} remaining`}
                  >
                    <span>Show more stories</span>
                    <span aria-hidden="true">+{Math.min(12, remainingPosts.length - visibleCount)}</span>
                  </button>
                </div>
              ) : null}

              <details className="mt-12 border-y border-[hsl(var(--after-hours-plum)/0.24)] py-5">
                <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[hsl(var(--hp-ink))]">
                  Browse all journal guides
                </summary>
                <ul className="grid gap-x-8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visiblePosts.map((post) => (
                    <li key={post.slug} className="border-t border-[hsl(var(--after-hours-plum)/0.14)]">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex min-h-11 items-center py-2 text-sm leading-5 text-[hsl(var(--hp-ink)/0.78)] hover:text-[hsl(var(--after-hours-copper))]"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </section>
        ) : null}

        <section className="bg-[hsl(var(--hp-lavender))] text-[hsl(var(--hp-ink))]">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.65fr_0.35fr] lg:gap-20 lg:px-8 lg:py-24">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Need a human answer?</p>
              <h2 className="mt-5 max-w-[12ch] font-heading text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--hp-ink))]">
                Bring the question to Jena.
              </h2>
            </div>
            <div className="self-end border-t border-[hsl(var(--hp-ink)/0.28)] pt-6">
              <p className="text-sm leading-6 text-[hsl(var(--hp-ink)/0.7)]">For advice that needs a closer look, book a consultation at Hair Pinns in Bangor.</p>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("blog_cta", "/blog")}
                className="mt-7 flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--hp-ink))] hover:bg-[hsl(var(--hp-lilac))] hover:no-underline"
              >
                Book with Jena <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
