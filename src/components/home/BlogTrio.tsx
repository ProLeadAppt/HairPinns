import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Badge from "@/components/design-system/Badge";

const BlogTrio = () => {
  const posts = [
    {
      slug: "winter-hair-care-tips",
      title: "Winter Hair Care: Essential Tips",
      hook: "Keep your hair healthy and vibrant through the cold months",
      image: "/placeholder.svg",
      category: "Hair Care"
    },
    {
      slug: "latest-color-trends",
      title: "2024 Hair Color Trends",
      hook: "From warm caramels to icy blondes, discover this season's hottest colors",
      image: "/placeholder.svg",
      category: "Trends"
    },
    {
      slug: "product-recommendations",
      title: "Our Top Picks for Damaged Hair",
      hook: "Professional recommendations for repairing over-processed hair",
      image: "/placeholder.svg",
      category: "Products"
    }
  ];

  return (
    <Section className="content-visibility-auto">
      <SectionHeader 
        title="From the Blog"
        subtitle="Hair care tips, trends, and expert advice"
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
