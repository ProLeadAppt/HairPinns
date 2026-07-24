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
    <section className="mt-20 border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-10">
      <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.62)]">Continue reading</p>
      <h2 className="mb-10 mt-4 max-w-[12ch] font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]">
        More from Jena’s chair.
      </h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
