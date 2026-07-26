import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
  slug: "scalp-buildup-how-to-reset-hair",
  title: "Scalp Buildup: How to Reset Your Hair Without Overdoing It",
  excerpt: "Heavy roots, dull lengths or an itchy scalp can point to buildup. Here is how I handle it in the salon and at home.",
  category: "Education",
  date: "July 26, 2026",
  readTime: "4 min read",
  image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-010.jpg?v=1744179511",
  author: "Jena Pinn",
  content: {
    introduction: "If your roots feel heavy straight after washing, your hair has lost its usual shine or your scalp feels itchy, buildup could be the reason. It is common when you use dry shampoo, hairspray, oils or live with mineral-heavy water. The fix is a proper cleanse, not aggressive scrubbing.",
    sections: [
      {
        heading: "What scalp buildup looks like",
        content: "The usual signs are flat roots, a waxy feel, flakes that stick to the scalp, dull colour and styling products that stop working the way they normally do. Buildup can come from oil, dry shampoo, hairspray, silicone, sweat and minerals in tap water."
      },
      {
        heading: "Start with a clarifying wash",
        content: "Use a clarifying shampoo such as [Juuce Deep Cleanse](/products/juuce-deep-cleanse-shampoo) once a week, or less often if your scalp is dry. Wet your hair properly, work the shampoo into the scalp with your fingertips and rinse well. You can shampoo twice if the first wash does not lather."
      },
      {
        heading: "Do not scrub harder",
        content: "A sore or flaky scalp does not need rough treatment. Avoid scratching with your nails. Massage gently with your fingertips and let the shampoo do the work. If your scalp is inflamed, weeping or still itchy after a few washes, speak with your GP or a dermatologist."
      },
      {
        heading: "Put moisture back through the lengths",
        content: "Clarifying is for the scalp and roots. Follow with conditioner through the mid-lengths and ends. If your hair feels dry, use a mask such as [Juuce Super Soft Hydration Moisture Mask](/products/juuce-super-soft-hydration-moisture-mask) after the cleanse."
      },
      {
        heading: "How often should you reset?",
        content: "Once a week suits people who use a lot of styling product or dry shampoo. Once a fortnight is enough for many others. If your hair starts feeling rough or your scalp feels tight, space it out. Your regular shampoo should handle the washes in between."
      }
    ],
    productModule: {
      title: "Shop scalp care",
      products: [
        {
          name: "Juuce Deep Cleanse Shampoo",
          link: "/products/juuce-deep-cleanse-shampoo",
          description: "Weekly clarifying wash for oil and buildup"
        },
        {
          name: "Juuce Super Soft Hydration Moisture Mask",
          link: "/products/juuce-super-soft-hydration-moisture-mask",
          description: "Weekly moisture for dry lengths and ends"
        },
        {
          name: "Scalp Health and Care",
          link: "/collections/scalp-health-care",
          description: "Browse the current scalp care shelf"
        }
      ]
    },
    quickAnswer: {
      question: "How do I remove scalp buildup?",
      answer: "Use a clarifying shampoo once a week or once a fortnight, massage gently with your fingertips and rinse well. Follow with conditioner or a mask through the lengths. Do not scratch an irritated scalp."
    },
    keyTakeaways: [
      "Heavy roots, dull hair and sticky flakes can point to buildup",
      "Clarifying shampoo is safer than aggressive scalp scrubbing",
      "Condition the lengths after a clarifying wash",
      "Persistent irritation needs medical advice, not another product"
    ],
    faqSection: [
      {
        question: "How often should I use a clarifying shampoo?",
        answer: "Once a week if you use styling products most days. Once a fortnight may be enough if you use less product or have a dry scalp."
      },
      {
        question: "Can clarifying shampoo fade colour?",
        answer: "Using it too often can fade colour faster. Keep it to the scalp and roots, use it only when needed and follow with conditioner through the lengths."
      },
      {
        question: "Is scalp buildup the same as dandruff?",
        answer: "Not always. Product buildup can look like flakes, but dandruff may need a medicated shampoo. If flakes or irritation persist, ask your GP or dermatologist."
      },
      {
        question: "Should I shampoo twice?",
        answer: "You can shampoo twice when the first wash does not lather or your roots still feel coated. Use a small amount each time and rinse properly."
      }
    ]
  },
  cta: {
    type: "product",
    productPath: "https://hairpinns.com/collections/scalp-health-care",
    customText: "Shop scalp care"
  }
} as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
