import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "what-is-an-infrared-sauna",
    title: "Hair Pinns does not offer sauna sessions",
    seoTitle: "No Sauna at Hair Pinns | Hair Pinns",
    excerpt: "Hair Pinns is a hair salon in Bangor. Jena does not offer infrared sauna sessions, and she does not claim a sauna helps hair.",
    category: "Salon",
    date: "April 11, 2025",
    readTime: "2 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-042.jpg?v=1744250283",
    author: "Jena Pinn",
    content: {
      introduction: "Hair Pinns is a hair salon in Bangor, run by Jena. There is no infrared sauna to book, and this page does not claim that a sauna grows hair, detoxes the scalp, or improves colour.",
      sections: [
        {
          heading: "What you can book",
          content: "Book a cut, colour, foils, or a smoothing treatment with Jena. If your hair feels dry, dull, or hard to manage, that is a hair appointment, not a heat room."
        },
        {
          heading: "If you were looking for a sauna",
          content: "Hair Pinns cannot help with that. A hair visit covers your hair in the chair. Ask Jena what your hair actually needs before you book."
        }
      ],
      faqSection: [
        {
          question: "Does Hair Pinns offer an infrared sauna?",
          answer: "No. Hair Pinns does not offer sauna sessions.",
        },
        {
          question: "Can a sauna help my hair grow?",
          answer: "Hair Pinns does not claim that a sauna helps hair grow. Talk to a doctor about hair loss.",
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
