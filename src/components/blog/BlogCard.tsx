import { Link } from "react-router-dom";
import type { BlogSummary } from "@/data/blogSummaries";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

interface BlogCardProps {
  post: BlogSummary;
  size?: "large" | "regular";
  index?: number;
}

const BlogCard = ({ post, size = "regular", index }: BlogCardProps) => {
  const isLarge = size === "large";

  return (
    <article
      className="group border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-4 content-visibility-auto"
      style={{ containIntrinsicSize: isLarge ? "0 650px" : "0 540px" }}
    >
      <Link to={`/blog/${post.slug}`} className="block !text-[hsl(var(--after-hours-plum))] hover:no-underline">
        <div className={`overflow-hidden bg-[hsl(var(--after-hours-plum)/0.06)] ${isLarge ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
          <picture>
            <source
              type="image/webp"
              srcSet={[480, 640, 800, 960].map((width) => `${shopifyImageWebp(post.image, width)} ${width}w`).join(", ")}
              sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
            <img
              src={shopifyImage(post.image, isLarge ? 960 : 720)}
              srcSet={[480, 640, 800, 960].map((width) => `${shopifyImage(post.image, width)} ${width}w`).join(", ")}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              loading="lazy"
              decoding="async"
              width="960"
              height="768"
              sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
          </picture>
        </div>

        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)]">
          <span className="pt-1 font-mono text-[0.62rem] font-semibold tracking-[0.16em] text-[hsl(var(--after-hours-plum)/0.58)]">
            {typeof index === "number" ? String(index + 1).padStart(2, "0") : "HP"}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--after-hours-plum)/0.64)]">
              <span>{post.category}</span>
              <span aria-hidden="true">/</span>
              <span>{post.readTime}</span>
            </div>
            <h3 className={`mt-3 max-w-[19ch] font-heading font-normal leading-[1.05] tracking-[-0.025em] transition-colors group-hover:text-[hsl(var(--after-hours-copper))] ${isLarge ? "text-3xl sm:text-4xl" : "text-[1.65rem] sm:text-3xl"}`}>
              {post.title}
            </h3>
            <p className="mt-4 line-clamp-3 max-w-[48ch] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.7)]">
              {post.excerpt}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--after-hours-plum)/0.16)] pt-3 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-[hsl(var(--after-hours-plum)/0.68)]">
              <span>{post.date}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">Read →</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
