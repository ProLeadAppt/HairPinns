import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "hair-products-melbourne-brisbane-perth-australia",
    title: "Hair Products Melbourne, Brisbane & Perth: Salon Hair Care Australia-Wide",
    excerpt: "Where to buy professional hair products in Melbourne, Brisbane, Perth and across Australia. Hair Pinns ships hair care to every state and territory. Free shipping over $150.",
    category: "Products",
    date: "February 25, 2025",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-119.jpg?v=1747030697",
    author: "Jena Pinn",
    content: {
      introduction: "Whether you're in Melbourne, Brisbane, Perth, Sydney or anywhere in Australia, you deserve access to professional hair care. Hair Pinns has been stocking professional hair products since 2009, and we ship to every state and territory. Here's your guide to buying the best hair products Australia-wide.",
      sections: [
        {
          heading: "Hair Products Melbourne: Same Quality, Delivered",
          content: "Melbourne's humidity and hard water can be tough on hair. We ship Juuce, QIQI, Pure and Wet Brush to Melbourne with free shipping on orders over $150. Jena picks every product and tests it for results. No guesswork. Standard delivery 3–5 business days; express 1–2 days."
        },
        {
          heading: "Hair Products Brisbane: Queensland-Wide Delivery",
          content: "Brisbane's subtropical climate demands products that protect against humidity and UV. We ship professional hair care to Brisbane and all of Queensland. Bond repair, colour protection, smoothing treatments, all available with free shipping over $150. Gold Coast and Sunshine Coast included."
        },
        {
          heading: "Hair Products Perth: Western Australia Covered",
          content: "Perth and Western Australia are fully covered. We ship professional hair care Australia-wide, no exceptions. Whether you're in Perth CBD, Fremantle or regional WA, your order arrives in 3–5 business days standard, 1–2 days express. Free shipping over $150."
        },
        {
          heading: "Why Hair Pinns for Australia-Wide Hair Care",
          content: "20+ years in the salon. Genuine professional brands only. Free shipping over $150. 14-day hassle-free returns. We ship to Melbourne, Brisbane, Perth, Sydney, Adelaide, Darwin, Hobart, Canberra, every state and territory. Your best hair is a click away."
        }
      ],
      productModule: {
        title: "Shop Hair Care Australia-Wide",
        products: [
          { name: "All Collections", link: "https://hairpinns.com/collections", description: "Browse salon hair care, shipped Australia-wide" },
          { name: "Juuce Hair Care", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Professional formulas for all hair types" },
          { name: "Pure Organic", link: "https://hairpinns.com/collections/pure-certified-organic-hair-care", description: "Certified organic, Australia-wide delivery" }
        ]
      },
      quickAnswer: {
        question: "Where can I buy hair products in Melbourne, Brisbane or Perth?",
        answer: "Hair Pinns ships professional hair care to Melbourne, Brisbane, Perth and all of Australia. Free shipping over $150. Personally chosen by Jena since 2009. Shop Juuce, QIQI, Pure, Wet Brush at hairpinns.com."
      },
      faqSection: [
        {
          question: "Does Hair Pinns ship professional hair products to Melbourne?",
          answer: "Yes. Melbourne's humidity and hard water are tough on hair, and we ship Juuce, QIQI, Pure, and Wet Brush to Melbourne with free shipping on orders over $150. Standard delivery is 3–5 business days, express is 1–2 days. Every product is personally tested by me, so you get professional-grade hair care delivered to your door."
        },
        {
          question: "What hair products should I use in Brisbane's subtropical climate?",
          answer: "Brisbane's heat and humidity demand products that protect against both. Bond repair, colour protection, and smoothing aftercare are all available with free shipping over $150. The subtropical climate is similar to Sydney's, so the same routines work — sulfate-free shampoo, heat protection, and weekly masks make a huge difference."
        },
        {
          question: "Can I get professional hair products shipped to Perth and Western Australia?",
          answer: "Absolutely. Perth and Western Australia are fully covered. Whether you're in Perth CBD, Fremantle, or regional WA, your order arrives in 3–5 business days standard or 1–2 days express. Free shipping over $150. No exceptions — your best hair is a click away no matter where you are in Australia."
        },
        {
          question: "Why should I buy hair products from Hair Pinns instead of a big retailer?",
          answer: "20+ years of salon experience. Genuine professional brands only — no cheap knockoffs. 14-day hassle-free returns. We ship to every state and territory. But most importantly: the products are chosen by Jena personally based on what actually works in the salon. You're supporting a local salon that genuinely cares about your hair health, not a corporation trying to move volume."
        }
      ]
    },
    cta: { type: "product", productPath: "https://hairpinns.com/collections", customText: "Shop hair products Australia-wide" }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
