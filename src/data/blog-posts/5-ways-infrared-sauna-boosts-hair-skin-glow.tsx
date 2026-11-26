import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "5-ways-infrared-sauna-boosts-hair-skin-glow",
    title: "A hair visit at Hair Pinns is not a sauna session",
    seoTitle: "Hair Visits, Not a Sauna | Hair Pinns",
    excerpt: "Hair Pinns does not offer infrared sauna sessions. A visit with Jena is a hair appointment: cut, colour, foils, or smoothing.",
    category: "Salon",
    date: "August 12, 2025",
    readTime: "2 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-043.jpg?v=1744250210",
    author: "Jena Pinn",
    content: {
      introduction: "If you landed here looking for a sauna at Hair Pinns, there is not one to book. Jena does not claim that a sauna boosts hair, skin, or glow.",
      sections: [
        {
          heading: "What a visit is",
          content: "You book a time, sit in the chair, and Jena does your hair. That can be a cut, colour, foils, or a smoothing treatment. Bring the questions you have about your hair."
        },
        {
          heading: "What a visit is not",
          content: "It is not a wellness session, a detox, or a heat room. Hair Pinns does not sell sauna passes and does not add a sauna to a colour or smoothing appointment."
        }
      ],
      faqSection: [
        {
          question: "Can I book a sauna at Hair Pinns?",
          answer: "No. Hair Pinns does not offer sauna sessions.",
        },
        {
          question: "Does the sauna help hair growth?",
          answer: "Hair Pinns does not claim that a sauna helps hair grow.",
        }
      ],
    },
    cta: {
      type: "call-jena",
      customText: "Book a hair appointment with Jena"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
