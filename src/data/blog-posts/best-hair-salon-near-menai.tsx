import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "best-hair-salon-near-menai",
    title: "Best Hair Salon Near Menai: What the Locals Say",
    seoTitle: "Hair Salon Near Menai: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Menai? See why Menai locals choose Jena at Hair Pinns in Bangor, 5 mins away with free parking and honest pricing.",
    excerpt: "Looking for a hair salon near Menai? Here is the short trip to Hair Pinns in Bangor, and how Jena plans colour, smoothing and cuts one-on-one.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-120.jpg?v=1747030506",
    author: "Jena Pinn",
    content: {
      introduction: "If you are in Menai and looking for a hairdresser, Hair Pinns is Jena Pinn's one-on-one studio at " + BUSINESS_NAP.address.street + ", Bangor. This guide covers the short trip, what to book, and how a colour correction consultation actually works. Visit notes are on the [Menai area page](/areas/menai-2234).",
      sections: [
        {
          heading: "The short trip from Menai",
          content: "Menai Road links Menai with Bangor. Many clients allow about 5 minutes, then check live directions before they leave. Street parking is at " + BUSINESS_NAP.address.street + ". Wednesday runs from 4pm to 9pm and Thursday from 9am to 9pm if an evening visit suits you better than a shopping-centre appointment."
        },
        {
          heading: "One chair, with Jena",
          content: "You see Jena at every visit. Hair Pinns is her appointment-only studio, so the person who consults with you is the person who does the hair. The live booking menu shows the current service and price before you confirm. Call " + BUSINESS_NAP.phone.display + " if you want help choosing before you travel."
        },
        {
          heading: "Services Menai clients book",
          content: "Colour, foils, Straight Up Smoothing and cuts are the usual bookings. Straight Up Smoothing is for clients who want frizz calmed. Jena explains aftercare at the consultation and does not quote one lifespan for every head of hair. Book on the [booking page](/booking) or call the salon."
        },
        {
          heading: "How Jena plans a colour correction",
          content: "If a box colour or an old foil job needs work, Jena starts with the consultation, not a promise. She asks what was used at home or in the last salon, looks at the hair, and says what this visit can do. If the change should be staged, she says so before you book. You then choose the matching service at the live price. There is no one-visit guarantee."
        },
        {
          heading: "Try one service first",
          content: "You do not have to move every future appointment across. Book the service you actually want, then decide what comes next. If you are unsure, call " + BUSINESS_NAP.phone.display + " and Jena will help you match the booking to the hair."
        }
      ],
      quickAnswer: {
        question: "Where is the hair salon near Menai?",
        answer: "Hair Pinns is at " + BUSINESS_NAP.address.street + ", Bangor. Menai Road is the usual link, and many clients allow about 5 minutes. Check live directions, then book online or call " + BUSINESS_NAP.phone.display + "."
      },
      keyTakeaways: [
        "Menai Road links Menai with the Bangor studio at " + BUSINESS_NAP.address.street ,
        "Check live directions, and allow about 5 minutes for the usual trip",
        "Jena works one-on-one on colour, foils, smoothing and cuts",
        "A colour correction starts with a consultation, and may take more than one visit",
        "Wednesday and Thursday include evening hours"
      ],
      faqSection: [
        {
          question: "Is Hair Pinns in Menai or Bangor?",
          answer: "Hair Pinns is in Bangor at " + BUSINESS_NAP.address.street + ". Menai Road is the usual link from Menai. The Menai area page has the visit notes, including street parking and hours."
        },
        {
          question: "How does Jena handle a colour correction for Menai clients?",
          answer: "She asks what is already on the hair, looks at the condition, and says what this visit can do. If the change needs another appointment, she says that before you book. You pay the live price for the service you choose."
        },
        {
          question: "Does Straight Up Smoothing have one published duration?",
          answer: "No single number is published here. Jena talks through aftercare for your hair at the appointment, because home routine changes how the result wears."
        },
        {
          question: "How do I book from Menai?",
          answer: "Use the booking page for live times, or call " + BUSINESS_NAP.phone.display + ". Wednesday is open 4pm to 9pm and Thursday is open 9am to 9pm."
        }
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Menai"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
