import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "say-goodbye-to-frizzy-hair-march-2025",
    title: "Say Goodbye to Frizzy Hair for Good? (March Edition)",
    excerpt: "Thinking about a smoothing treatment? Here are the questions to ask Jena before booking.",
    category: "Treatments",
    date: "March 21, 2025",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-050.jpg?v=1744178399",
    author: "Jena Pinn",
    content: {
      introduction: "Frizz can be frustrating, especially when the weather changes before you've even left the house. A smoothing treatment might make styling easier, but the right choice depends on your hair history and the finish you want. Have a chat with me before you book so we can work that out together.",
      sections: [
        {
          heading: "Why Choose a Straight Up?",
          content: "Start with what bothers you most: frizz, the time you spend styling, or a finish that's harder to manage between appointments. Tell me about previous colour or treatments too. I can then explain the available smoothing options, the process, aftercare and what result is realistic for your hair. No treatment can promise the same result for everyone, so a proper consultation matters."
        },
        {
          heading: "Pricing",
          content: "The current starting prices on Fresha are A$289 for teens, A$339 for mid-length hair and A$362 for long or thick hair. Please check the live booking page for the final option and price before confirming. Treatment suitability and maintenance vary with your hair, so ask me if you are unsure which appointment to choose."
        }
      ],
      faqSection: [
        {
          question: "How do I stop my hair going frizzy in Sydney humidity?",
          answer: "Three things: a sulfate-free shampoo (Juuce Smoothing or Pure Precious), a silicone-free smoothing serum, and a microfibre towel. Skip the heavy butters, they attract water from the air and make frizz worse in our climate.",
        },
        {
          question: "What's the best shampoo for frizzy hair in Australia?",
          answer: "Juuce Smoothing Shampoo and Conditioner are Jena's top pick for the Sutherland Shire climate. They seal the cuticle with lamellar technology and don't weigh fine hair down.",
        },
        {
          question: "Why does my hair frizz more in winter?",
          answer: "Wool clothing, indoor heating, and hot showers all dehydrate the hair shaft. The cuticle lifts to find moisture in the air, which is what reads as frizz. A weekly deep mask (like QIQI Vega Mask) for the first month of winter fixes it.",
        },
        {
          question: "Is humidity bad for coloured hair?",
          answer: "UV and humidity together lift dye from colour-treated hair fastest. Wear a hat, use a UV-protective leave-in, and book a glossing toner every 6 weeks to keep the tone fresh.",
        },
        {
          question: "Should I use anti-frizz products every day?",
          answer: "Light serum or leave-in: yes, every wash. Heavy cream or oil: only on mid-lengths and ends, not the roots. Heavy product on fine hair at the root line causes flatness and oiliness within 24 hours.",
        }
      ],
    },
    cta: {
      type: "call-jena",
      servicePath: "/services/smoothing/mid-length-straight-up-smoothing",
      customText: "Want to try a Straight Up treatment?"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
