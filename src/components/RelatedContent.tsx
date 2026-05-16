import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { serviceDetailData } from "@/data/serviceDetails";
import {
  type TopicSlug,
  getTopic,
  relatedBlogsForTopic,
  relatedServicesForTopic,
  relatedCollectionsForTopic,
} from "@/data/topicMap";

interface RelatedContentProps {
  /** The topic(s) this page belongs to. */
  topics: TopicSlug[];
  /** Which content types to show. Defaults to all three. */
  show?: Array<"blog" | "service" | "collection">;
  /** Max items per type. */
  limit?: number;
  /** Heading override. */
  heading?: string;
  /** Slug to exclude (e.g. current page). */
  excludeSlug?: string;
}

/**
 * Cross-content-type "related" block. Pulls blog posts, services, and
 * collection pages from the topicMap so every page feeds traffic into
 * its topic cluster. Renders nothing if no matches — safe to drop in
 * anywhere.
 */
const RelatedContent = ({
  topics,
  show = ["blog", "service", "collection"],
  limit = 3,
  heading = "Keep reading",
  excludeSlug,
}: RelatedContentProps) => {
  const blogSlugs = new Set<string>();
  const serviceSlugs = new Set<string>();
  const collectionSlugs = new Set<string>();

  for (const topic of topics) {
    if (show.includes("blog")) {
      relatedBlogsForTopic(topic, limit).forEach((s) => {
        if (s !== excludeSlug) blogSlugs.add(s);
      });
    }
    if (show.includes("service")) {
      relatedServicesForTopic(topic, limit).forEach((s) => {
        if (s !== excludeSlug) serviceSlugs.add(s);
      });
    }
    if (show.includes("collection")) {
      relatedCollectionsForTopic(topic, limit).forEach((s) => {
        if (s !== excludeSlug) collectionSlugs.add(s);
      });
    }
  }

  const blogItems = Array.from(blogSlugs)
    .slice(0, limit)
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p && !p.archived);

  const serviceItems = Array.from(serviceSlugs)
    .slice(0, limit)
    .map((path) => {
      const [cat, svc] = path.split("/");
      const category = serviceDetailData.find((c) => c.slug === cat);
      const service = category?.services.find((s) => s.slug === svc);
      return service && category ? { category, service, path } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const collectionItems = Array.from(collectionSlugs).slice(0, limit);

  const total = blogItems.length + serviceItems.length + collectionItems.length;
  if (total === 0) return null;

  const topicNames = topics
    .map((t) => getTopic(t)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <section className="py-lg border-t border-border" aria-labelledby="related-content-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="related-content-heading" className="text-h2 font-heading text-heading mb-2">
          {heading}
        </h2>
        {topicNames && (
          <p className="text-sm text-muted-foreground mb-6">More on {topicNames}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogItems.map((post) => (
            <Link
              key={`blog-${post.slug}`}
              to={`/blog/${post.slug}`}
              className="group block rounded-md border border-border bg-card p-4 hover:border-brand-500 transition-colors"
            >
              <span className="text-xs uppercase tracking-wide text-brand-500 font-medium">
                {post.category}
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground group-hover:text-brand-500 transition-colors">
                {post.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            </Link>
          ))}

          {serviceItems.map(({ category, service, path }) => (
            <Link
              key={`service-${path}`}
              to={`/services/${path}`}
              className="group block rounded-md border border-border bg-card p-4 hover:border-brand-500 transition-colors"
            >
              <span className="text-xs uppercase tracking-wide text-brand-500 font-medium">
                Service
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground group-hover:text-brand-500 transition-colors">
                {service.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{category.title}</p>
            </Link>
          ))}

          {collectionItems.map((slug) => (
            <Link
              key={`collection-${slug}`}
              to={`/collections/${slug}`}
              className="group block rounded-md border border-border bg-card p-4 hover:border-brand-500 transition-colors"
            >
              <span className="text-xs uppercase tracking-wide text-brand-500 font-medium">
                Shop
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground group-hover:text-brand-500 transition-colors capitalize">
                {slug.replace(/-/g, " ")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Browse the collection</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedContent;
