import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "best-hair-salon-near-engadine",
    title: "Best Hair Salon Near Engadine: What the Locals Say",
    seoTitle: "Hair Salon Near Engadine: Local Guide | Hair Pinns",
    metaDescription: "Searching for a hair salon near Engadine? Discover one-on-one colour, smoothing and cuts with Jena at Hair Pinns in Bangor with easy street parking.",
    excerpt: "Searching for a hair salon near Engadine? Hair Pinns is Jena's one-on-one studio in Bangor, with street parking and online booking.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-064.jpg?v=1744178553",
    author: "Jena Pinn",
    content: {
      introduction: "Engadine clients who want a one-on-one appointment come north to Hair Pinns in Bangor. Jena Pinn works from " + BUSINESS_NAP.address.street + ". The new [Engadine area page](/areas/engadine-2233) has the route, hours and booking notes.",
      sections: [
        {
          heading: "The drive north from Engadine",
          content: "Head north on the Princes Highway, then Old Illawarra Road toward Bangor. Check live directions before you leave. Street parking is at " + BUSINESS_NAP.address.street + ". Wednesday runs from 4pm to 9pm and Thursday from 9am to 9pm if you are coming after work."
        },
        {
          heading: "The same person every visit",
          content: "Hair Pinns is a single-chair studio. You see Jena, and she keeps the notes from the last visit. That is the point of the trip for clients who are tired of explaining their colour from the start each time."
        },
        {
          heading: "What to book",
          content: "Colour, blonding, Straight Up Smoothing and cuts are on the live menu, including children's cuts where the current age bracket is listed. Check Fresha for the present price rather than an old screenshot. Book on the [booking page](/booking) or call " + BUSINESS_NAP.phone.display + "."
        },
        {
          heading: "Start with one appointment",
          content: "Book the service you need first. If you want a colour change, Jena will say whether it fits in one visit or should be staged. There is no membership and no requirement to move every appointment across."
        }
      ],
      quickAnswer: {
        question: "Is there a hair salon near Engadine?",
        answer: "Hair Pinns is in Bangor at " + BUSINESS_NAP.address.street + ". The usual roads are the Princes Highway and Old Illawarra Road. Check live directions, then book online or call " + BUSINESS_NAP.phone.display + "."
      },
      keyTakeaways: [
        "Engadine to Bangor follows the Princes Highway and Old Illawarra Road",
        "Check live directions, then use the street parking at " + BUSINESS_NAP.address.street ,
        "Jena works one-on-one on colour, smoothing and cuts",
        "Children's cuts follow the age bracket on the live menu",
        "Wednesday and Thursday include evening hours"
      ],
      faqSection: [
        {
          question: "Which roads connect Engadine to Hair Pinns?",
          answer: "The Princes Highway north, then Old Illawarra Road into Bangor. Check live directions on the day. The studio is at " + BUSINESS_NAP.address.street + "."
        },
        {
          question: "Can more than one person in the household book?",
          answer: "Yes. Each person books their own time with Jena, including a child's cut when the live menu lists that service. She sees one client at a time."
        },
        {
          question: "How do Engadine clients see the price before they travel?",
          answer: "The booking page opens the live Fresha menu. Call " + BUSINESS_NAP.phone.display + " if you want Jena to help you choose the closest service first."
        },
        {
          question: "Are there evening appointments for the drive from Engadine?",
          answer: "Wednesday is 4pm to 9pm and Thursday is 9am to 9pm. Sunday and Monday are closed. The Engadine area page repeats the full week."
        }
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Engadine"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
