import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "best-hair-salon-near-miranda",
    title: "Best Hair Salon Near Miranda: What the Locals Say",
    seoTitle: "Hair Salon Near Miranda: Local Guide | Hair Pinns",
    metaDescription: "Tired of busy shopping-centre salons near Miranda? See why locals visit Hair Pinns in Bangor for calm one-on-one colour, smoothing and cuts with Jena.",
    excerpt: "Tired of busy shopping-centre salons near Miranda? Hair Pinns is Jena's calm one-on-one studio in Bangor.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
    author: "Jena Pinn",
    content: {
      introduction: "Miranda has no shortage of salons around the shopping centre. Hair Pinns is the quieter booking: Jena Pinn, one client at a time, at " + BUSINESS_NAP.address.street + ", Bangor. The [Miranda area page](/areas/miranda-2228) covers the drive and the hours.",
      sections: [
        {
          heading: "Skip the centre car park",
          content: "The usual route is the Kingsway toward Old Illawarra Road, then north into Bangor. Check live directions. Street parking is at " + BUSINESS_NAP.address.street + ", which is the practical difference from a centre visit."
        },
        {
          heading: "A calm, one-on-one appointment",
          content: "Jena sees one client at a time. Parents, children and anyone else in the household each book their own time with her, including a child's cut when the live menu lists the current age bracket. There is no rotating roster."
        },
        {
          heading: "What Miranda clients book",
          content: "Colour, blonding, Straight Up Smoothing, cuts and formal styling are on the menu. The family angle is simple: book the services you need, at the live prices, in a room that is not a shopping-centre corridor. Use the [booking page](/booking) or call " + BUSINESS_NAP.phone.display + "."
        },
        {
          heading: "Evenings after the shops",
          content: "Wednesday is open 4pm to 9pm and Thursday is open 9am to 9pm. Saturday is 8am to 2pm. If you want to avoid the centre at peak time, those windows are the ones to check first."
        }
      ],
      quickAnswer: {
        question: "Where can Miranda locals book a quieter salon?",
        answer: "Hair Pinns is at " + BUSINESS_NAP.address.street + ", Bangor. Check live directions via the Kingsway and Old Illawarra Road. Jena works one-on-one. Book online or call " + BUSINESS_NAP.phone.display + "."
      },
      keyTakeaways: [
        "The usual roads from Miranda are the Kingsway and Old Illawarra Road",
        "Street parking is at " + BUSINESS_NAP.address.street + ", not a shopping-centre car park",
        "Jena sees one client at a time for colour, smoothing and cuts",
        "Children's cuts follow the age bracket on the live menu",
        "Wednesday and Thursday include evening hours"
      ],
      faqSection: [
        {
          question: "Why leave Miranda for a salon in Bangor?",
          answer: "Hair Pinns is an appointment-only studio, away from the shopping-centre crowds. Street parking is at " + BUSINESS_NAP.address.street + ". Check live directions before you leave."
        },
        {
          question: "Can I book a child's cut as well as my own?",
          answer: "Yes, when the live menu lists the child's service. Each person has their own time with Jena. She does not run several chairs at once."
        },
        {
          question: "What is different about the Miranda visit?",
          answer: "You are in a single-chair studio in Bangor, not a centre salon. Colour, smoothing and cuts are one-on-one, and the price is on the booking page before you confirm."
        },
        {
          question: "When can I come from Miranda after work?",
          answer: "Wednesday runs 4pm to 9pm and Thursday runs 9am to 9pm. Call " + BUSINESS_NAP.phone.display + " or use the booking page for the times that are actually open."
        }
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Miranda"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
