import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "pure-walnut-scrub-scalp-detox",
    title: "Pure Walnut Scrub – The Scalp Detox You Didn't Know You Needed",
    excerpt: "When was the last time you gave your scalp a proper detox? Meet the Pure Walnut Scrub Hair & Scalp Pre-Wash Treatment.",
    category: "Products",
    date: "June 11, 2025",
    readTime: "3 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-050.jpg?v=1744178399",
    author: "Jena Pinn",
    content: {
      introduction: "When was the last time you gave your scalp a proper detox? If your answer is \"never\" or \"I don't remember,\" it's time to meet the Pure Walnut Scrub Hair & Scalp Pre-Wash Treatment.",
      sections: [
        {
          heading: "What Is It?",
          content: "This gentle, natural scrub is designed to be used before shampooing. Made with crushed walnut shells, it exfoliates the scalp to remove product build-up, oil, dry skin, and other impurities that your regular shampoo can't always tackle."
        },
        {
          heading: "Why You'll Love It:",
          content: "• Deep-cleansing action clears blocked follicles and refreshes the scalp\n• Boosts circulation, encouraging healthy hair growth\n• Improves product absorption. Your treatments and shampoos work better after a clean sweep\n• Reduces itchiness and flaking\n• Vegan, cruelty-free, and free from sulfates and parabens"
        },
        {
          heading: "Why You Need It:",
          content: "Your scalp is skin too, and just like your face, it needs exfoliating. If you're using dry shampoo, styling products, or treatments regularly, this scrub helps reset everything so your scalp can breathe and your hair can thrive."
        },
        {
          heading: "How to Use:",
          content: "Apply before shampooing on damp hair. Massage gently into the scalp, then rinse and follow with your usual Pure shampoo and conditioner. Use once a week for best results.\n\n🛍 Ready to refresh your scalp?\n\nGrab the Pure Walnut Scrub now and feel the difference from your roots up.\n\nhttps://hairpinns.com/collections/pure-certified-organic-hair-care/products/walnut-scrub-hair-scalp-pre-wash-treatment"
        }
      ],
      productModule: {
        title: "Shop Pure Scalp Care",
        products: [
          {
            name: "Pure Walnut Scrub",
            link: "/collections/pure-certified-organic-hair-care",
            description: "Pre-wash scalp treatment"
          },
          {
            name: "Browse Pure Collection",
            link: "/collections/pure-certified-organic-hair-care",
            description: "Organic hair care range"
          }
        ]
      },
      faqSection: [
        {
          question: "What is the Pure Walnut Scrub?",
          answer: "A physical exfoliant for the scalp that lifts dead skin, product build-up, and excess sebum. The walnut shell particles are fine enough to scrub without scratching the scalp.",
        },
        {
          question: "How often should I use a scalp scrub?",
          answer: "Once a week if you use styling product daily, once a fortnight for low-maintenance hair. Over-scrubbing strips the scalp's natural oils and causes rebound oiliness.",
        },
        {
          question: "Is scalp exfoliation safe for coloured hair?",
          answer: "Yes — the scrub doesn't penetrate the hair shaft, only the scalp. Use it 48 hours after colour, not before, so the cuticle is fully closed.",
        },
        {
          question: "Can scalp scrub help with dandruff?",
          answer: "For product-buildup flake, yes. For seborrheic dermatitis or fungal dandruff, no — you need a medicated shampoo like Nizoral. If flakes persist after 3 scrubs, see a GP or trichologist.",
        },
        {
          question: "Does the Walnut Scrub promote hair growth?",
          answer: "Indirectly — by clearing the follicle of build-up, new growth can emerge without obstruction. It's not a growth stimulant, but it's a healthy-scalp prerequisite for any growth product to work.",
        }
      ],
    },
    cta: {
      type: "product",
      productPath: "https://hairpinns.com/collections/pure-certified-organic-hair-care",
      customText: "Try the Pure Walnut Scrub"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
