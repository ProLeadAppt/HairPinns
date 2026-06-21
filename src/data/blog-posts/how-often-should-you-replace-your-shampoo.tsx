import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "how-often-should-you-replace-your-shampoo",
    title: "How Often Should You Replace Your Shampoo?",
    excerpt: "Understanding shampoo longevity helps you plan ahead and keeps your hair clean and healthy without wasting product or money.",
    category: "Education",
    date: "September 01, 2025",
    readTime: "3 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Aromaganics-1.jpg?v=1746879807",
    author: "Jena Pinn",
    content: {
      introduction: "Shampoo isn't a \"forever\" product. Using the right amount keeps your hair clean and healthy without wasting product (or money). Plus, knowing when to replace it helps you plan ahead so you're never caught with an empty bottle in the shower!",
      sections: [
        {
          heading: "How Long Does a 300ml Shampoo Last?",
          content: "The average wash uses around 10ml of shampoo. That means:\n\n• 2 washes a week: ~20ml per week → 300ml lasts about 15 weeks (3.5 months)\n• 3 washes a week: ~30ml per week → 300ml lasts about 10 weeks (2.5 months)\n• Daily washers (7x): ~70ml per week → 300ml lasts about 4–5 weeks\n\n(Of course, hair length, thickness, and how much you lather up all make a difference!)"
        },
        {
          heading: "Signs It's Time to Restock",
          content: "• Your bottle feels lighter and you're squeezing the last drops.\n• Your hair isn't feeling as fresh. Sometimes product loses its effectiveness if it's been open too long (12–18 months shelf life is standard).\n• You're tempted to use way more than you need because it's not lathering well anymore."
        },
        {
          heading: "Pro Tip: Don't Overdo It",
          content: "A 5–10 cent coin-sized amount is enough for most people. Fine or short hair = less, thick or long hair = a touch more. Overusing only makes you run out faster and can dry out your scalp."
        },
        {
          heading: "Keep Your Routine Fresh",
          content: "On average, most clients should expect to replace their 300ml shampoo every 2–3 months. If you wash less often, it'll stretch a bit longer.\n\n👉 Shop your next bottle here: HairPinns.com Shampoo Collection"
        }
      ],
      productModule: {
        title: "Shop Our Shampoo Collection",
        products: [
          {
            name: "Juuce Shampoos",
            link: "/collections/juuce-botanicals",
            description: "Premium professional shampoos"
          },
          {
            name: "Pure Organic Shampoos",
            link: "/collections/pure-certified-organic-hair-care",
            description: "Certified organic hair care"
          }
        ]
      },
      faqSection: [
        {
          question: "How often should you replace your shampoo?",
          answer: "Every 6-8 weeks once opened, regardless of the brand. Active ingredients oxidise after opening and lose potency. A bottle you've had for 6 months is essentially coloured water.",
        },
        {
          question: "What happens if I use old shampoo?",
          answer: "Less cleaning power, more build-up on the scalp, and the preservatives stop working. If your scalp has been flakier than usual, check the open-date on the bottle before you blame the brand.",
        },
        {
          question: "How do I know when my shampoo is going off?",
          answer: "Three signs: smell changes (sharp, sour, or just 'flat'), texture separates (watery layer on top), or colour shifts. If any of those appear, bin it.",
        },
        {
          question: "Should I keep shampoo in the shower?",
          answer: "No. Heat and humidity from the shower accelerate ingredient breakdown. Store in a cool, dark cabinet and only bring into the shower what you'll use in a week.",
        },
        {
          question: "Are salon shampoos harder to replace than supermarket ones?",
          answer: "Yes — they don't have the strong synthetic fragrance that masks age. This is a sign of clean formulation, not a fault. Mark the open date with a Sharpie on the lid.",
        }
      ],
    },
    cta: {
      type: "chat-isabella",
      productPath: "https://hairpinns.com/collections",
      customText: "Shop shampoo Australia-wide"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
