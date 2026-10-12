export type HomeFeaturedGuide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
};

export const homeFeaturedGuides: HomeFeaturedGuide[] = [
  {
    slug: "how-to-use-juuce-hair-products",
    title: "Which Juuce product does what?",
    excerpt: "A practical guide to choosing and using Juuce products, without adding every bottle to your routine.",
    category: "Products",
    readTime: "6 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
  },
  {
    slug: "where-to-buy-salon-hair-products-australia",
    title: "Where to Buy Salon Hair Products in Australia",
    excerpt: "Looking for professional hair care you can trust? Here's your guide to buying professional hair products in Australia, shipped Australia-wide.",
    category: "Products",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-118.jpg?v=1747030560",
  },
  {
    slug: "coloured-hair-care-routine",
    title: "What should you use on coloured hair between salon visits?",
    excerpt: "Find a simple coloured hair care routine: shampoo, conditioner, leave-ins and toning. Explore salon-picked products from Hair Pinns in Bangor.",
    category: "Hair care",
    readTime: "7 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-013.jpg?v=1744178584",
    imageAlt: "Juuce Radiant Colour Shampoo product photograph",
    imageFit: "contain",
  },
  {
    slug: "salon-vs-supermarket-hair-products",
    title: "Supermarket VS Salon Hair Products",
    excerpt: "We've all grabbed a $6 shampoo thinking we scored a bargain. But what if that 'cheap' product might be costing you more in the long run? Here's why salon hair products in Australia are the smarter choice.",
    category: "Products",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-064.jpg?v=1744178553",
  },
  {
    slug: "say-goodbye-to-frizzy-hair-march-2025",
    title: "Say Goodbye to Frizzy Hair for Good? (March Edition)",
    excerpt: "Learn about our Straight Up treatment - all-natural straightening without harsh chemicals.",
    category: "Treatments",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-050.jpg?v=1744178399",
  },
  {
    slug: "whats-a-straight-up-smoothing-treatment",
    title: "What's a Straight Up Smoothing Treatment?",
    excerpt: "Smooth, soft, frizz-free hair with QIQI Vega, a hair-friendly smoothing system with no harsh chemicals, no downtime, and results that last up to 6 months.",
    category: "Treatments",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-050.jpg?v=1744178399",
  },
];
