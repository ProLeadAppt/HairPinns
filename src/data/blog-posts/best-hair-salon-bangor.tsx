import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
  slug: "best-hair-salon-bangor",
  title: "Hair Salon in Bangor: What to Know Before Booking",
  excerpt: "A practical introduction to Hair Pinns in Bangor, including its location, current service focus, and how to check live availability before booking.",
  category: "Local",
  date: "April 19, 2026",
  readTime: "4 min read",
  image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-119.jpg?v=1747030697",
  author: "Jena Pinn",
  content: {
    introduction: "If you live in Bangor and are looking for a local hair salon, Hair Pinns is at 60 Goorgool Road. This guide covers the details you can verify before booking: who runs the salon, the current service focus, and where to find live prices and availability.",
    sections: [
      {
        heading: "A Bangor Salon Since 2009",
        content: "Hair Pinns has operated in Bangor since 2009. Jena Pinn is the founder and stylist behind the salon. The location serves Bangor and nearby Sutherland Shire suburbs."
      },
      {
        heading: "Current Service Focus",
        content: "The current service menu includes colour and foils, smoothing treatments, cuts, and styling. Service names, prices, durations, and available times can change, so use the [booking page](/booking) to check the live Fresha menu rather than relying on an old article or screenshot."
      },
      {
        heading: "Before Your First Booking",
        content: "Choose the service that most closely matches what you need and review the details in Fresha before confirming. For colour corrections, major changes, or uncertainty about which service to select, call Hair Pinns on 0416 037 663 before booking."
      },
      {
        heading: "Address and Contact",
        content: "Hair Pinns is at 60 Goorgool Road, Bangor NSW 2234. You can view live availability online or call 0416 037 663 for help with service selection."
      }
    ],
    quickAnswer: {
      question: "Is there a hair salon in Bangor?",
      answer: "Yes. Hair Pinns is at 60 Goorgool Road, Bangor NSW 2234. The salon has operated since 2009 and offers colour, foils, smoothing treatments, cuts, and styling."
    },
    keyTakeaways: [
      "Hair Pinns is at 60 Goorgool Road in Bangor",
      "The salon has operated since 2009",
      "Jena Pinn is the founder and stylist",
      "Current prices, durations, and availability are shown in Fresha",
      "Call 0416 037 663 if you need help choosing a service"
    ],
    faqSection: [
      {
        question: "Where is Hair Pinns in Bangor?",
        answer: "Hair Pinns is at 60 Goorgool Road, Bangor NSW 2234."
      },
      {
        question: "What services are currently available?",
        answer: "The service menu includes colour and foils, smoothing treatments, cuts, and styling. Check Fresha through the Hair Pinns booking page for the current menu."
      },
      {
        question: "How do I see current prices and appointment times?",
        answer: "Open the Hair Pinns booking page to view the live Fresha menu, including the service details and times currently available."
      },
      {
        question: "What if I am unsure which service to book?",
        answer: "Call Hair Pinns on 0416 037 663 before confirming so Jena can help you choose the closest service."
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
