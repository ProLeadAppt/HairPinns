import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Badge from "@/components/design-system/Badge";
import { blogPosts } from "@/data/blogPosts";
import { shopifyImage } from "@/lib/shopifyImage";

const BlogTrio = () => {
  // Auto-pick 3 non-archived posts by commercial intent.
  // Score = 2 if category matches a high-intent commercial category
  // (Smoothing, Colour, Products) + 1 if post has a `datePublished` set.
  // Tie-break: most recent `datePublished` first, then source-array order.
  // No hardcoded slugs — adding a new high-intent post automatically promotes
  // it into the homepage trio.
  const HIGH_INTENT_CATEGORIES = new Set([
    "Smoothing",
    "Colour",
    "Products",
    "Treatments",
  ]);

  const posts = blogPosts
    .filter((p: any) => !p.archived)
    .map((post: any, index: number) => {
      const intentScore = HIGH_INTENT_CATEGORIES.has(post.category) ? 2 : 0;
      const recency = post.datePublished ? new Date(post.datePublished).getTime() : 0;
      return { post, intentScore, recency, index };
    })
    .sort((a, b) => {
      if (b.intentScore !== a.intentScore) return b.intentScore - a.intentScore;
      if (b.recency !== a.recency) return b.recency - a.recency;
      return a.index - b.index;
    })
    .slice(0, 3)
    .map(({ post }) => ({
      slug: post.slug,
      title: post.title,
      hook: post.excerpt,
      image: post.image,
      category: post.category,
    }));

  return (
    <Section className="content-visibility-auto">
      <SectionHeader 
        title="Hair Care Guides"
        subtitle="What I tell my clients about looking after their hair"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ containIntrinsicSize: "0 1500px" }}>
        {posts.map((post) => (
          <Link 
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={shopifyImage(post.image, 720)}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="338"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <Badge variant="accent" size="sm" className="mb-3">
                  {post.category}
                </Badge>
                
                <h3 className="text-xl font-heading font-semibold text-heading mb-2 group-hover:text-brand-500 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-sm text-foreground mb-4 line-clamp-2">
                  {post.hook}
                </p>
                
                <div className="flex items-center text-brand-500 font-medium text-sm group-hover:gap-2 transition-all">
                  <span>Read</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link 
          to="/blog"
          className="text-brand-500 font-semibold hover:text-brand-600 transition-colors inline-flex items-center gap-2"
        >
          View All Articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
};

export default BlogTrio;
