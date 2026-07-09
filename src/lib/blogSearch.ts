import { blogSummaries, type BlogSummary } from "@/data/blogSummaries";

export type BlogSearchResult = BlogSummary & {
  url: string;
  type: "article";
  score: number;
};

const normalise = (value: string) => value.toLowerCase().trim();

const scorePost = (post: BlogSummary, terms: string[]) => {
  const title = normalise(post.title);
  const category = normalise(post.category);
  const excerpt = normalise(post.excerpt);
  const slug = normalise(post.slug.replace(/-/g, " "));

  return terms.reduce((score, term) => {
    if (!term) return score;
    let next = score;
    if (title.includes(term)) next += 8;
    if (slug.includes(term)) next += 5;
    if (category.includes(term)) next += 4;
    if (excerpt.includes(term)) next += 2;
    return next;
  }, 0);
};

export const searchBlogPosts = (query: string, limit = 12): BlogSearchResult[] => {
  const terms = normalise(query)
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) return [];

  return blogSummaries
    .filter((post) => !post.archived)
    .map((post) => ({
      ...post,
      url: `/blog/${post.slug}`,
      type: "article" as const,
      score: scorePost(post, terms),
    }))
    .filter((post) => post.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
};
