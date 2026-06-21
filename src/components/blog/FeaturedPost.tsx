import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogSummary } from "@/data/blogSummaries";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

interface FeaturedPostProps {
  post: BlogSummary;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-card bg-surface shadow-card hover:shadow-xl transition-all duration-500">
        <div className="grid lg:grid-cols-2 gap-0 items-center">
          {/* Image Section */}
          <div className="relative aspect-[21/9] lg:aspect-square overflow-hidden">
            <picture>
              <source
                type="image/webp"
                srcSet={[
                  640,
                  800,
                  1000,
                  1200,
                  1400,
                ].map((width) => `${shopifyImageWebp(post.image, width)} ${width}w`).join(", ")}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <img
                src={shopifyImage(post.image, 1200)}
                srcSet={[
                  640,
                  800,
                  1000,
                  1200,
                  1400,
                ].map((width) => `${shopifyImage(post.image, width)} ${width}w`).join(", ")}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                width="1400"
                height="600"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-heading/80 via-heading/40 to-transparent lg:hidden" />
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-500 text-white font-bold text-sm shadow-xl">
                Latest from Jena
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-8 lg:p-12">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent text-brand-600 font-semibold text-sm mb-4">
              {post.category}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-heading mb-4 group-hover:text-brand-500 transition-colors leading-tight">
              {post.title}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed line-clamp-4">
              {post.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
            
            <div className="inline-flex items-center gap-2 text-brand-500 font-bold text-lg group-hover:gap-4 transition-all">
              Continue Reading
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;
