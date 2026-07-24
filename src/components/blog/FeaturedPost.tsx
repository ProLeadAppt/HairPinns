import { Link } from "react-router-dom";
import type { BlogSummary } from "@/data/blogSummaries";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

interface FeaturedPostProps {
  post: BlogSummary;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => (
  <article className="border-y border-[hsl(var(--after-hours-plum)/0.24)]">
    <Link
      to={`/blog/${post.slug}`}
      className="group grid !text-[hsl(var(--after-hours-plum))] hover:no-underline lg:grid-cols-[1.08fr_0.92fr]"
    >
      <div className="relative min-h-[19rem] overflow-hidden bg-[hsl(var(--after-hours-plum)/0.06)] sm:min-h-[28rem] lg:min-h-[38rem]">
        <picture>
          <source
            type="image/webp"
            srcSet={[640, 800, 1000, 1200, 1400].map((width) => `${shopifyImageWebp(post.image, width)} ${width}w`).join(", ")}
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <img
            src={shopifyImage(post.image, 1200)}
            srcSet={[640, 800, 1000, 1200, 1400].map((width) => `${shopifyImage(post.image, width)} ${width}w`).join(", ")}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            width="1400"
            height="900"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </picture>
      </div>

      <div className="flex flex-col justify-between border-t border-[hsl(var(--after-hours-plum)/0.24)] bg-[hsl(var(--after-hours-cream))] p-6 sm:p-10 lg:border-l lg:border-t-0 lg:p-12 xl:p-16">
        <div>
          <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.68)]">01 / Latest from Jena</p>
          <h2 className="mt-8 max-w-[11ch] font-heading text-[clamp(2.75rem,5.5vw,5.75rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))] transition-colors group-hover:text-[hsl(var(--after-hours-copper))]">
            {post.title}
          </h2>
          <p className="mt-7 max-w-[42ch] text-base leading-7 text-[hsl(var(--after-hours-plum)/0.72)]">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-12 border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.66)]">
            <span>{post.category} / {post.readTime}</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">Read the story →</span>
          </div>
        </div>
      </div>
    </Link>
  </article>
);

export default FeaturedPost;
