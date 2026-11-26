import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "best-hair-salon-near-cronulla",
    title: "Best Hair Salon Near Cronulla: What the Locals Say",
    seoTitle: "Hair Salon Near Cronulla: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Cronulla? See why Shire locals drive to Hair Pinns in Bangor for one-on-one colour, smoothing, cuts and easy parking.",
    excerpt: "Looking for a hairdresser near Cronulla? Here is why some locals leave the beach strip for Jena's one-on-one studio in Bangor.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Accessories-016.jpg?v=1746738998",
    author: "Jena Pinn",
    content: {
      introduction: "Cronulla has plenty of salons along the beach strip. Hair Pinns is the quieter alternative: Jena Pinn's appointment-only studio at " + BUSINESS_NAP.address.street + ", Bangor. Directions and hours are on the [Cronulla area page](/areas/cronulla-2230).",
      sections: [
        {
          heading: "Leaving the beach strip",
          content: "The usual drive is the Kingsway, then Old Illawarra Road toward Bangor. Check live directions before you leave, because beach traffic changes the trip. Street parking is at " + BUSINESS_NAP.address.street + ", which is the practical reason many people make the drive instead of circling the Cronulla shops."
        },
        {
          heading: "One-on-one with Jena",
          content: "You book Jena, and Jena does the appointment. There is no second chair. Colour, blonding, smoothing and cuts are planned in that visit, with the current price shown on the live booking menu before you confirm."
        },
        {
          heading: "What Cronulla clients usually book",
          content: "Full foils, colour, Straight Up Smoothing and cuts are the common requests. If you swim or spend long days outside, tell Jena during the consultation so she can plan around that routine. Straight Up Smoothing is for frizz control. She explains aftercare in the chair and does not publish one lifespan for every client. Book on the [booking page](/booking) or call " + BUSINESS_NAP.phone.display + "."
        },
        {
          heading: "A calmer appointment",
          content: "The Bangor studio is appointment only. Wednesday runs from 4pm to 9pm and Thursday from 9am to 9pm if you want to come after the beach day rather than in the middle of it. Saturday is 8am to 2pm."
        }
      ],
      quickAnswer: {
        question: "Is there a hairdresser near Cronulla with parking?",
        answer: "Hair Pinns is in Bangor at " + BUSINESS_NAP.address.street + ", with street parking at the studio. Check live directions via the Kingsway and Old Illawarra Road, then book online or call " + BUSINESS_NAP.phone.display + "."
      },
      keyTakeaways: [
        "The usual roads from Cronulla are the Kingsway and Old Illawarra Road",
        "Check live directions before you leave the beach strip",
        "Street parking is at " + BUSINESS_NAP.address.street ,
        "Jena works one-on-one on colour, blonding, smoothing and cuts",
        "Wednesday and Thursday include evening hours"
      ],
      faqSection: [
        {
          question: "Where do Cronulla clients park at Hair Pinns?",
          answer: "Street parking is at " + BUSINESS_NAP.address.street + ", Bangor. Check live directions via the Kingsway and Old Illawarra Road before you leave."
        },
        {
          question: "Can Jena plan colour around beach days?",
          answer: "Tell her how often you swim or spend time outside. She uses that in the consultation. She will not promise that colour or smoothing will ignore sun and water."
        },
        {
          question: "Is a smoothing result given as a set number of weeks?",
          answer: "No. Straight Up Smoothing is booked to calm frizz, and Jena explains aftercare for your hair. This guide does not quote one duration."
        },
        {
          question: "How do I book from Cronulla?",
          answer: "Open the booking page for live times, or call " + BUSINESS_NAP.phone.display + ". The Cronulla area page lists the studio hours, including Wednesday and Thursday evenings."
        }
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Cronulla"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
