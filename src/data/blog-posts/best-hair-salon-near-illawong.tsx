import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "best-hair-salon-near-illawong",
    title: "Best Hair Salon Near Illawong: What the Locals Say",
    seoTitle: "Hair Salon Near Illawong: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hair salon near Illawong? Visit Jena at Hair Pinns in nearby Bangor for one-on-one colour, smoothing, cuts and free parking.",
    excerpt: "Looking for a hair salon near Illawong? Hair Pinns is Jena's one-on-one studio in nearby Bangor, with street parking at the salon.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-120.jpg?v=1747030506",
    author: "Jena Pinn",
    content: {
      introduction: "Illawong is a short local drive from Hair Pinns. Jena Pinn works one-on-one at " + BUSINESS_NAP.address.street + ", Bangor. The [Illawong area page](/areas/illawong-2234) lists the route, parking and hours.",
      sections: [
        {
          heading: "Fowler Road to Bangor",
          content: "The usual local route is Fowler Road and Menai Road. Check live directions before you leave, then use the street parking at " + BUSINESS_NAP.address.street + ". It is a neighbourhood trip, not a drive into a shopping centre."
        },
        {
          heading: "You see Jena",
          content: "Hair Pinns is a single chair. The consultation and the service are with Jena, so your colour history stays with the person doing the hair. Prices are on the live booking menu before you confirm."
        },
        {
          heading: "Bookings from Illawong",
          content: "Colour, foils, Straight Up Smoothing and cuts are the services people book, along with children's cuts when the live menu shows the current age bracket. Straight Up Smoothing calms frizz. Jena explains aftercare in the appointment and does not give one duration for every client. Book on the [booking page](/booking) or call " + BUSINESS_NAP.phone.display + "."
        },
        {
          heading: "Evenings and Saturdays",
          content: "Wednesday is open 4pm to 9pm and Thursday is open 9am to 9pm. Saturday is 8am to 2pm. Sunday and Monday are closed. If the weekday commute is tight, book one of those later windows."
        }
      ],
      quickAnswer: {
        question: "Where is the hair salon near Illawong?",
        answer: "Hair Pinns is at " + BUSINESS_NAP.address.street + ", Bangor. Fowler Road and Menai Road are the usual route. Check live directions, then book online or call " + BUSINESS_NAP.phone.display + "."
      },
      keyTakeaways: [
        "Fowler Road and Menai Road are the usual route from Illawong",
        "Street parking is at " + BUSINESS_NAP.address.street ,
        "Jena does colour, smoothing and cuts one-on-one",
        "Smoothing aftercare is explained in the consultation",
        "Wednesday, Thursday and Saturday have the later or weekend times"
      ],
      faqSection: [
        {
          question: "How do Illawong clients get to Hair Pinns?",
          answer: "Use Fowler Road and Menai Road, then check live directions. The studio is at " + BUSINESS_NAP.address.street + ", with street parking at the salon."
        },
        {
          question: "Will someone other than Jena do the appointment?",
          answer: "No. Hair Pinns is Jena's one-on-one studio. She consults and she does the service."
        },
        {
          question: "What should I know before booking smoothing from Illawong?",
          answer: "Straight Up Smoothing is for frizz control. Jena will talk through aftercare for your hair. This page does not quote a set number of weeks."
        },
        {
          question: "Which Illawong-friendly times are open?",
          answer: "Wednesday 4pm to 9pm, Thursday 9am to 9pm, and Saturday 8am to 2pm are the later or weekend options. Book the live time online or call " + BUSINESS_NAP.phone.display + "."
        }
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Illawong"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
