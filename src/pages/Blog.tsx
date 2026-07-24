import { useState } from "react";
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

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const visiblePosts = blogSummaries.filter((post) => !post.archived);
  const categories = ["all", ...Array.from(new Set(visiblePosts.map((post) => post.category)))];
  const filteredPosts = activeCategory === "all"
    ? visiblePosts
    : visiblePosts.filter((post) => post.category === activeCategory);
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
      />
      <Header />

      <div className="border-b border-[hsl(var(--after-hours-cream)/0.16)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[78rem]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} variant="dark" />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} data-blog-index="">
        <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]" aria-labelledby="journal-title">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[0.68fr_0.32fr] lg:gap-20 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Hair Pinns / The journal</p>
              <h1 id="journal-title" className="mt-5 max-w-[10ch] font-heading text-[clamp(3.6rem,9vw,8rem)] font-semibold leading-[0.87] tracking-[-0.06em] text-[hsl(var(--after-hours-cream))]">
                Good hair starts with honest advice.
              </h1>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-6">
              <p className="max-w-[31rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.76)]">
                The advice Jena gives behind the chair, written down. Hair care, product notes, salon answers, and practical routines for Australian hair.
              </p>
              <p className="mt-8 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-copper))]">
                {visiblePosts.length} field notes / Bangor, NSW
              </p>
            </div>
          </div>
        </section>

        <nav aria-label="Filter journal stories" className="sticky top-16 z-30 border-b border-[hsl(var(--after-hours-plum)/0.2)] bg-[hsl(var(--after-hours-paper)/0.96)] backdrop-blur-sm">
          <div className="mx-auto max-w-[78rem] overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-max items-center gap-7 py-4">
              <span className="font-mono text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-plum)/0.5)]">Filter /</span>
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
                    className={`min-h-11 border-b py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${isActive ? "border-[hsl(var(--after-hours-copper))] text-[hsl(var(--after-hours-plum))]" : "border-transparent text-[hsl(var(--after-hours-plum)/0.58)] hover:border-[hsl(var(--after-hours-plum)/0.34)] hover:text-[hsl(var(--after-hours-plum))]"}`}
                  >
                    {category === "all" ? "All stories" : category}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

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
                  <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.68)]">02 / From Jena’s chair</p>
                  <h2 id="all-stories-title" className="mt-4 max-w-[9ch] font-heading text-[clamp(2.8rem,7vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))]">
                    Notes worth keeping.
                  </h2>
                </div>
                <p className="max-w-[38rem] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.66)] md:justify-self-end">
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
                    className="inline-flex min-h-12 items-center justify-between gap-10 border border-[hsl(var(--after-hours-plum)/0.36)] px-5 text-sm font-semibold text-[hsl(var(--after-hours-plum))] transition-colors hover:border-[hsl(var(--after-hours-copper))]"
                    aria-label={`Show more journal stories. ${remainingPosts.length - visibleCount} remaining`}
                  >
                    <span>Show more stories</span>
                    <span aria-hidden="true">+{Math.min(12, remainingPosts.length - visibleCount)}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="bg-[hsl(var(--after-hours-near-black))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.65fr_0.35fr] lg:gap-20 lg:px-8 lg:py-24">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Need a human answer?</p>
              <h2 className="mt-5 max-w-[12ch] font-heading text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))]">
                Bring the question to Jena.
              </h2>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.28)] pt-6">
              <p className="text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.7)]">For advice that needs a closer look, book a consultation at Hair Pinns in Bangor.</p>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("blog_cta", "/blog")}
                className="mt-7 flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-copper))] hover:no-underline"
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
