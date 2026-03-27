import { useState } from "react";
import { Helmet } from "react-helmet";
import { getOGImage } from "@/lib/sitemap";
import { generateWebPageSchema, generateBreadcrumbSchema, generateBlogItemListSchema } from "@/lib/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { Sparkles } from "lucide-react";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const visiblePosts = blogPosts.filter((post: any) => !post.archived);
  const categories = [
    "all",
    ...Array.from(new Set(visiblePosts.map(post => post.category)))
  ];
  const filteredPosts = activeCategory === "all" 
    ? visiblePosts 
    : visiblePosts.filter(post => post.category === activeCategory);

  const featuredPost = filteredPosts[0];
  const firstRowPosts = filteredPosts.slice(1, 3);
  const remainingPosts = filteredPosts.slice(3);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hair Tips & Product Advice | Hair Pinns Blog Australia</title>
        <meta 
          name="description" 
          content="Hair care tips and product advice from Jena at Hair Pinns. Professional recommendations for Australian hair. Shipped Australia-wide." 
        />
        <link rel="canonical" href="https://hairpinns.com/blog" />
        <link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/blog" />
        <meta property="og:title" content="Hair Tips & Product Advice | Hair Pinns Blog Australia" />
        <meta property="og:description" content="Hair care tips and product advice from Jena at Hair Pinns. Professional recommendations for Australian hair. Shipped Australia-wide." />
        <meta property="og:url" content="https://hairpinns.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('blog')} />
        <script type="application/ld+json">
          {JSON.stringify(generateWebPageSchema({
            name: "Hair Tips & Product Advice | Hair Pinns Blog",
            description: "Hair care tips and product advice from Jena at Hair Pinns. Professional recommendations for Australian hair. Shipped Australia-wide.",
            url: "https://hairpinns.com/blog",
          }))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Home", url: "https://hairpinns.com/" },
            { name: "Blog", url: "https://hairpinns.com/blog" },
          ]))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateBlogItemListSchema(visiblePosts.map((p) => ({
            name: p.title,
            url: `https://hairpinns.com/blog/${p.slug}`,
            datePublished: p.date,
          }))))}
        </script>
      </Helmet>

      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-[#773E77] to-[#5D2C5D] py-20 lg:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px"
            }} />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Tips from Jena
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Healthy, Glossy Hair.
              <br />
              <span className="text-accent">Made Easy</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Real advice and honest product recommendations. What I tell my clients, written down. Shop hair care Australia-wide.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-accent/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? "bg-brand-500 text-white shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-text"
                  }`}
                >
                  {category === "all" ? "All Posts" : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FeaturedPost post={featuredPost} />
            </div>
          </section>
        )}

        {/* First Row - Large Cards (2 columns) */}
        {firstRowPosts.length > 0 && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {firstRowPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} size="large" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Remaining Posts - 3 Column Grid */}
        {remainingPosts.length > 0 && (
          <section className="py-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-brand-500 to-[#5D2C5D] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "30px 30px"
            }} />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
              Want Hair Advice in Person?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Book a consultation with Jena at Hair Pinns Bangor
            </p>
            <a 
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("blog_cta", "/blog")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold text-lg rounded-full hover:bg-accent transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Book with Jena
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
