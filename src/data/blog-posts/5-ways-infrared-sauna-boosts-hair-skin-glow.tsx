import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "5-ways-infrared-sauna-boosts-hair-skin-glow",
    title: "What to Expect From an Infrared Sauna Session at Hair Pinns",
    excerpt: "A simple, honest guide to the Hair Pinns infrared sauna, including what to bring, what a session feels like and how to plan your visit.",
    category: "Wellness",
    date: "August 12, 2025",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-043.jpg?v=1744250210",
    author: "Jena Pinn",
    content: {
      introduction: "If you have never tried an infrared sauna, it is completely fair to wonder what actually happens in there. The short version is simple. It is private time to sit, warm up and switch off for a bit. Here is what I would want to know before booking.",
      sections: [
        {
          heading: "1. Come ready to slow down",
          content: "You do not need to perform, pose or make conversation. Bring water, wear something comfortable and give yourself a few quiet minutes before and after the session."
        },
        {
          heading: "2. The warmth builds gradually",
          content: "An infrared sauna uses infrared heat rather than filling the room with steam. Everyone experiences heat differently, so the important thing is to listen to your body and finish early if you feel uncomfortable."
        },
        {
          heading: "3. Keep your hair comfortable",
          content: "Tie long hair up loosely if that feels better and avoid adding heavy product before you arrive. After the session, rinse or wash your hair as you normally would and use the care products that already suit it."
        },
        {
          heading: "4. It is your quiet time",
          content: "Some people listen to music. Some close their eyes. Some are just happy nobody is asking them a question for half an hour. There is no correct way to relax."
        },
        {
          heading: "5. Ask before booking if you are unsure",
          content: "The sauna is a wellness service, not a medical treatment. If you have a health condition, are pregnant, take medication that affects heat tolerance, or simply are not sure whether it is suitable, check with a qualified health professional first."
        },
        {
          heading: "Want to have a look?",
          content: "Send me a message or check the current booking page. I can talk you through the setup and the latest session options before you decide. No hard sell."
        }
      ],
      faqSection: [
        {
          question: "What is an infrared sauna and how is it different from a regular sauna?",
          answer: "An infrared sauna uses infrared heat rather than steam. The experience is warm and dry, and the heat builds gradually during the session.",
        },
        {
          question: "Is infrared sauna good for hair growth?",
          answer: "Hair Pinns does not advertise the sauna as a hair-growth treatment. Speak with a qualified health professional about hair loss or scalp concerns.",
        },
        {
          question: "How often can I book?",
          answer: "That depends on your health, heat tolerance and personal preference. Ask Jena about the current session options and check with a qualified health professional if you are unsure.",
        },
        {
          question: "Is infrared sauna safe with coloured hair?",
          answer: "Heat and sweat can affect how your hair feels. Tie it up loosely if you prefer, then rinse or wash and condition it as normal after your session.",
        },
        {
          question: "Can I use infrared sauna on the same day as a hair appointment?",
          answer: "Ask Jena before combining it with a colour, smoothing or extension appointment. The best order can depend on the service you are having.",
        }
      ],
    },
    cta: {
      type: "call-jena",
      customText: "Ask Jena about the sauna"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
