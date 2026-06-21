import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import type { BlogSummary } from "@/data/blogSummaries";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

interface BlogCardProps {
  post: BlogSummary;
  size?: "large" | "regular";
}

const BlogCard = ({ post, size = "regular" }: BlogCardProps) => {
  const isLarge = size === "large";

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block h-full"
    >
      <article className="h-full flex flex-col bg-surface rounded-card overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 border border-accent/20 hover:-translate-y-1 content-visibility-auto" style={{ containIntrinsicSize: isLarge ? "0 620px" : "0 540px" }}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <picture>
            <source
              type="image/webp"
              srcSet={[
                480,
                640,
                800,
                960,
              ].map((width) => `${shopifyImageWebp(post.image, width)} ${width}w`).join(", ")}
              sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
            <img
              src={shopifyImage(post.image, isLarge ? 960 : 720)}
              srcSet={[
                480,
                640,
                800,
                960,
              ].map((width) => `${shopifyImage(post.image, width)} ${width}w`).join(", ")}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              width="640"
              height="360"
              sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
          </picture>
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-500 text-white font-semibold text-xs shadow-lg">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col p-6">
          <h3 className={`font-heading text-heading mb-3 group-hover:text-brand-500 transition-colors leading-tight line-clamp-2 ${
            isLarge ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
          }`}>
            {post.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-accent/20">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
