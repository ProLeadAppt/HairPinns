import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Badge from "@/components/design-system/Badge";
import { blogPosts } from "@/data/blogPosts";

const BlogTrio = () => {
  // Select 3 featured blog posts that are most relevant for homepage
  // Priority: Product-focused, educational, and popular topics
  const featuredSlugs = [
    "salon-vs-supermarket-hair-products", // Products - very relevant for sales
    "prevent-heat-damage-on-your-hair", // Hair Care - practical guide
    "whats-the-best-hairspray-to-use", // Products - helpful buying guide
  ];

  const posts = blogPosts
    .filter((post) => featuredSlugs.includes(post.slug))
    .slice(0, 3)
    .map((post) => ({
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
        subtitle="Expert tips to get the most from your products and services"
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
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                  loading="lazy"
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
