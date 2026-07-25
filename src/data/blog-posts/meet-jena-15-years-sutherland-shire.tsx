import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
  slug: "meet-jena-15-years-sutherland-shire",
  title: "Meet Jena: Hair Pinns Founder and Bangor Stylist",
  excerpt: "Meet Jena Pinn, the founder and stylist behind Hair Pinns in Bangor, serving local clients since the salon opened in 2009.",
  category: "About",
  date: "April 19, 2026",
  readTime: "5 min read",
  image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
  author: "Jena Pinn",
  content: {
    introduction: "I'm Jena Pinn, the founder and stylist behind Hair Pinns in Bangor. Hair Pinns has served local clients since 2009. I built the salon around clear advice, continuity, and hair care that fits the person sitting in the chair.",
    sections: [
      {
        heading: "Hair Pinns Since 2009",
        content: "Hair Pinns opened in Bangor in 2009. The salon now serves clients from Bangor and surrounding Sutherland Shire suburbs from 60 Goorgool Road. If you are comparing salons, start with the practical details: the current service menu, live booking availability, and whether the stylist's approach matches what you need."
      },
      {
        heading: "What I Work On",
        content: "My current service menu centres on colour and foils, smoothing treatments, cuts, and styling. Every starting point is different, especially with previous colour or chemical services, so the safest recommendation begins with your actual hair history rather than a generic promise."
      },
      {
        heading: "How I Approach a Consultation",
        content: "Bring reference photos and be open about previous colour, treatments, and home products. I will talk through the service that fits the starting point and direct you to the live Fresha menu for current pricing, duration, and availability before you confirm a booking."
      },
      {
        heading: "Where to Find Hair Pinns",
        content: "Hair Pinns is at 60 Goorgool Road, Bangor NSW 2234. You can view the current service menu and live availability through the [booking page](/booking), or call 0416 037 663 if you need help choosing a service."
      }
    ],
    quickAnswer: {
      question: "Who is Jena Pinn?",
      answer: "Jena Pinn is the founder and stylist behind Hair Pinns, a Bangor hair salon operating since 2009. The current service menu includes colour, foils, smoothing treatments, cuts, and styling."
    },
    keyTakeaways: [
      "Hair Pinns has operated in Bangor since 2009",
      "Jena is the founder and stylist behind the salon",
      "The current menu covers colour, foils, smoothing treatments, cuts, and styling",
      "Current prices, durations, and availability are shown through Fresha",
      "Hair Pinns is at 60 Goorgool Road, Bangor NSW 2234"
    ],
    faqSection: [
      {
        question: "How long has Hair Pinns been open?",
        answer: "Hair Pinns has operated in Bangor since 2009."
      },
      {
        question: "Can I book with Jena?",
        answer: "Use the Hair Pinns booking page to open the live Fresha menu and see the professionals and times currently available for your chosen service."
      },
      {
        question: "What services does Hair Pinns offer?",
        answer: "The current menu includes colour and foils, smoothing treatments, cuts, and styling. Fresha shows the latest service names, prices, durations, and availability."
      },
      {
        question: "Where is Hair Pinns?",
        answer: "Hair Pinns is at 60 Goorgool Road, Bangor NSW 2234."
      }
    ]
  },
  cta: {
    type: "booking",
    customText: "View current appointments"
  }
} as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
