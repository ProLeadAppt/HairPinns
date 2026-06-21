import { blogSummaries } from "@/data/blogSummaries";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  currentSlug: string;
  limit?: number;
}

const RelatedPosts = ({ currentSlug, limit = 3 }: RelatedPostsProps) => {
  const currentPost = blogSummaries.find(post => post.slug === currentSlug);
  
  if (!currentPost) return null;

  // Get posts from same category, excluding current post
  const relatedPosts = blogSummaries
    .filter(post => 
      post.slug !== currentSlug && 
      post.category === currentPost.category
    )
    .slice(0, limit);

  // If not enough same-category posts, fill with recent posts
  if (relatedPosts.length < limit) {
    const additionalPosts = blogSummaries
      .filter(post => 
        post.slug !== currentSlug && 
        !relatedPosts.includes(post)
      )
      .slice(0, limit - relatedPosts.length);
    
    relatedPosts.push(...additionalPosts);
  }

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-h2 font-heading text-heading mb-8 text-center">
        You Might Also Love
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
