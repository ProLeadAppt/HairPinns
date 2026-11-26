import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "infrared-sauna-for-hair-scalp-health",
    title: "Scalp care is done in the chair, not a sauna",
    seoTitle: "Scalp Care in the Chair | Hair Pinns",
    excerpt: "Hair Pinns does not use a sauna for scalp or hair care. Build-up, itch, and dryness are handled in the chair with Jena.",
    category: "Salon",
    date: "April 20, 2025",
    readTime: "2 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-042.jpg?v=1744250283",
    author: "Jena Pinn",
    content: {
      introduction: "Hair Pinns does not offer a sauna, and Jena does not claim that infrared heat strengthens hair, clears toxins, or stops shedding.",
      sections: [
        {
          heading: "What actually helps a scalp",
          content: "If your scalp is itchy, flaky, or heavy with product, book a scalp detox or a gentle wash and blow-dry. Jena looks at the scalp in the chair and chooses the cleanse from there."
        },
        {
          heading: "No heat-room add-on",
          content: "A mask or treatment stays a hair service. It is not paired with a sauna, and Hair Pinns does not sell sauna passes."
        }
      ],
      faqSection: [
        {
          question: "Does Hair Pinns treat the scalp with a sauna?",
          answer: "No. Scalp care is done in the chair.",
        },
        {
          question: "Will a sauna make my hair grow faster?",
          answer: "Hair Pinns does not claim that. See a doctor if you are worried about hair loss.",
        }
      ],
    },
    cta: {
      type: "call-jena",
      customText: "Book a scalp or hair appointment"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
