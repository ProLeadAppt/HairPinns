import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Badge from "@/components/design-system/Badge";

const BlogTrio = () => {
  const posts = [
    {
      slug: "how-to-maintain-color-at-home",
      title: "How to Maintain Color at Home",
      hook: "Keep your salon color vibrant longer with these pro tips and product picks",
      image: "/placeholder.svg",
      category: "Hair Care"
    },
    {
      slug: "choosing-right-treatment",
      title: "Choosing the Right Treatment",
      hook: "Match your hair concerns to the perfect professional treatment for visible results",
      image: "/placeholder.svg",
      category: "Guides"
    },
    {
      slug: "holiday-hair-gifting-guide",
      title: "Holiday Hair Gifting Guide",
      hook: "Gift bundles that suit every hair type — from fine to curly to color-treated",
      image: "/placeholder.svg",
      category: "Gift Ideas"
    }
  ];

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
