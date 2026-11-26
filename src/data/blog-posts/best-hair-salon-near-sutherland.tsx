import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "best-hair-salon-near-sutherland",
    title: "Best Hair Salon Near Sutherland: What the Locals Say",
    seoTitle: "Hair Salon Near Sutherland Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Sutherland? See why locals head 10 minutes up to Bangor for Jena's one-on-one colour, smoothing and cuts at Hair Pinns.",
    excerpt: "Looking for a hairdresser near Sutherland? Many locals head up Old Illawarra Road to Jena's one-on-one studio in Bangor.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
    author: "Jena Pinn",
    content: {
      introduction: "Sutherland has salons in town. Hair Pinns is the one-on-one studio up the road in Bangor, at " + BUSINESS_NAP.address.street + ". The [Sutherland area page](/areas/sutherland-2232) has the route and the hours.",
      sections: [
        {
          heading: "Up Old Illawarra Road",
          content: "The usual drive is north on Old Illawarra Road. Many locals allow about 10 minutes, then check live directions before they leave. Street parking is at " + BUSINESS_NAP.address.street + ", which is often simpler than hunting for a park in central Sutherland."
        },
        {
          heading: "Jena, every visit",
          content: "You do not meet a new person each time. Jena consults and Jena does the hair. The live menu shows the service and the price before you confirm, so the quote is the booking, not a surprise at the end."
        },
        {
          heading: "Colour, smoothing and cuts",
          content: "Sutherland clients book colour packages, toner refreshes, Straight Up Smoothing and cuts. If a colour needs more than one visit, Jena says that in the consultation. Smoothing is for frizz control, and she explains aftercare rather than quoting one lifespan. Book on the [booking page](/booking) or call " + BUSINESS_NAP.phone.display + "."
        },
        {
          heading: "Try the service you actually need",
          content: "Start with the appointment you want, whether that is a cut or a colour correction. You can keep other bookings elsewhere. Call " + BUSINESS_NAP.phone.display + " if you want help matching the service before you drive up."
        }
      ],
      quickAnswer: {
        question: "How far is Hair Pinns from Sutherland?",
        answer: "The studio is in Bangor at " + BUSINESS_NAP.address.street + ". Old Illawarra Road is the usual route, and many locals allow about 10 minutes. Check live directions, then book online or call " + BUSINESS_NAP.phone.display + "."
      },
      keyTakeaways: [
        "Old Illawarra Road is the usual route north from Sutherland",
        "Allow about 10 minutes, and check live directions",
        "Street parking is at " + BUSINESS_NAP.address.street ,
        "Jena does colour, smoothing and cuts one-on-one",
        "A colour correction may be staged across visits"
      ],
      faqSection: [
        {
          question: "Why do Sutherland locals drive to Bangor?",
          answer: "Hair Pinns is Jena's one-on-one studio, about 10 minutes up Old Illawarra Road, with street parking at " + BUSINESS_NAP.address.street + ". Check live directions on the day."
        },
        {
          question: "How does a colour correction start?",
          answer: "Jena looks at what is already on the hair and says what this visit can do. If the change should wait for another appointment, she says so before you book."
        },
        {
          question: "Is smoothing sold with a fixed wear time?",
          answer: "No. Straight Up Smoothing is booked to calm frizz, and the aftercare is explained for your hair. This guide does not state a set number of weeks."
        },
        {
          question: "How do I book from Sutherland?",
          answer: "Use the booking page or call " + BUSINESS_NAP.phone.display + ". Wednesday is 4pm to 9pm and Thursday is 9am to 9pm. The Sutherland area page lists the rest of the week."
        }
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Sutherland"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
