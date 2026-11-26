import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "best-hair-salon-near-como",
    title: "Best Hair Salon Near Como: What the Locals Say",
    seoTitle: "Hair Salon Near Como: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Como? Discover one-on-one colour, smoothing and cuts with Jena at Hair Pinns in Bangor, with free parking out front.",
    excerpt: "Looking for a hairdresser near Como? Hair Pinns is Jena's one-on-one studio in Bangor, with parking at the salon.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-042.jpg?v=1744250283",
    author: "Jena Pinn",
    content: {
      introduction: "Como has fewer salons than the bigger Shire centres, so many locals drive to Hair Pinns in Bangor. Jena Pinn works one-on-one at " + BUSINESS_NAP.address.street + ". The [Como area page](/areas/como-2226) has the visit notes.",
      sections: [
        {
          heading: "From Como toward Bangor",
          content: "A common drive is toward the Princes Highway, then north on Old Illawarra Road into Bangor. Check live directions before you leave. Street parking is at the front of " + BUSINESS_NAP.address.street + "."
        },
        {
          heading: "Jena remembers the hair",
          content: "You see Jena every visit. Hair Pinns is a single-chair studio, so the colour history stays with her. The live menu shows the price before you confirm."
        },
        {
          heading: "Foils, cuts and smoothing",
          content: "Como clients book foils, mid-length cuts and Straight Up Smoothing. Smoothing is for clients who want frizz calmed between visits. Jena explains aftercare in the consultation and does not quote one duration for everyone. Book on the [booking page](/booking) or call " + BUSINESS_NAP.phone.display + "."
        },
        {
          heading: "One service is enough to start",
          content: "Book the appointment you want first. You can decide later whether to move other visits across. Call " + BUSINESS_NAP.phone.display + " if you want help choosing the service before you drive."
        }
      ],
      quickAnswer: {
        question: "Where is the hairdresser near Como?",
        answer: "Hair Pinns is in Bangor at " + BUSINESS_NAP.address.street + ". Check live directions via the Princes Highway and Old Illawarra Road. Book online or call " + BUSINESS_NAP.phone.display + "."
      },
      keyTakeaways: [
        "The usual corridor is the Princes Highway and Old Illawarra Road",
        "Check live directions from Como before you leave",
        "Street parking is at the front of " + BUSINESS_NAP.address.street ,
        "Jena does foils, cuts and smoothing one-on-one",
        "Start with one booked service"
      ],
      faqSection: [
        {
          question: "How do Como clients reach Hair Pinns?",
          answer: "Head toward the Princes Highway, then north on Old Illawarra Road into Bangor. Check live directions. The studio is at " + BUSINESS_NAP.address.street + "."
        },
        {
          question: "What is the parking like for the Como trip?",
          answer: "There is street parking at the front of " + BUSINESS_NAP.address.street + ". The Como area page repeats the address and the hours."
        },
        {
          question: "Who does the colour if I come from Como?",
          answer: "Jena does. Hair Pinns is her one-on-one studio, so the consultation and the service are with the same person."
        },
        {
          question: "Can I book an evening from Como?",
          answer: "Wednesday is 4pm to 9pm and Thursday is 9am to 9pm. Use the booking page for a live time, or call " + BUSINESS_NAP.phone.display + "."
        }
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Como"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
