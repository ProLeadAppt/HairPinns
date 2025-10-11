import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { BlogPost } from "@/data/blogPosts";

interface BlogCardProps {
  post: BlogPost;
  size?: "large" | "regular";
}

const BlogCard = ({ post, size = "regular" }: BlogCardProps) => {
  const isLarge = size === "large";

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block h-full"
    >
      <article className="h-full flex flex-col bg-surface rounded-card overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 border border-accent/20 hover:-translate-y-1">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
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
