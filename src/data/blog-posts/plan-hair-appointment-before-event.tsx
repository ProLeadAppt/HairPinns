import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
  "slug": "plan-hair-appointment-before-event",
  "title": "Planning your hair appointment before a special event",
  "seoTitle": "Planning Your Event Hair Appointment | Hair Pinns Bangor",
  "excerpt": "A date in the diary? Start with your ready-by time, a little inspiration and the right service. Here’s a simple checklist for your next event appointment.",
  "metaDescription": "Planning hair for a special event? Use this simple appointment checklist, explore Hair Pinns services in Bangor and choose the right booking for your plans.",
  "category": "Salon advice",
  "date": "3 November 2026",
  "publishedDate": "2026-11-03",
  "readTime": "4 min read",
  "image": "https://hairpinns.com/assets/images/jena-founder-1080w-Ky6yef-B.webp",
  "imageAlt": "Jena from Hair Pinns in Bangor with softly waved, highlighted hair",
  "author": "Jena Pinn",
  "showLeadMagnet": false,
  "content": {
    "introduction": "Start with the time you need to be ready, the finish you’d like and what your hair is like now. Those three details make it easier to choose a suitable appointment. Whether it’s a wedding invitation, a party or a dinner you’ve been looking forward to, a little planning leaves you with one less thing to organise on the day.\n\nHere’s a simple checklist for planning your event hair at Hair Pinns in Bangor.",
    "sections": [
      {
        "heading": "Work backwards from your ready time",
        "content": "Your event might start at six, but you may need to leave much earlier. Allow for getting dressed, travel, makeup and photographs, then tell the salon when you need to be ready.\n\nBe clear about whether you want styling on the day or a cut or colour appointment beforehand. These may need separate bookings. Check the duration of the service you choose, and ask before assuming an extra service can fit into the same visit.\n\nFor a bigger colour or cut change, mention your event when discussing the plan. There isn’t one number of days that suits every head of hair. Your starting point, the change you want and the appointments available all matter."
      },
      {
        "heading": "Choose the service, then the time",
        "content": "A blow-dry, curls and an upstyle aren’t interchangeable bookings. Start with the finish you’re after, then choose the service that fits. Hair length and thickness can affect the plan too.\n\nBrowse the [Hair Pinns service menu and current booking options](/services/). If you’re unsure which appointment to choose, call " + BUSINESS_NAP.phone.display + " before booking. That’s easier than discovering on the day that you’ve booked time for something different."
      },
      {
        "heading": "Bring a little inspiration",
        "content": "A couple of photos is plenty. Tell your stylist what you like about them: the shape at the front, the loose finish, the volume or the way the hair is tucked away.\n\nPhotos of similar hair length and texture can help, but they’re a starting point rather than a promise of an identical result. You can also show your outfit’s neckline or bring the hair accessory you’d like included. Ask ahead if you’re unsure how it will work.\n\nSave the photos together with a short note. “Soft around my face, with the back pinned up” is a useful place to start."
      },
      {
        "heading": "Keep the lead-up simple",
        "content": "You don’t need a bathroom full of new products before an event. Stick with the routine you know, follow the product directions and ask before adding a heavy treatment or changing your usual preparation.\n\nTell your stylist about recent colour, lightening, smoothing or other treatments, including anything done at home or elsewhere. You don’t need all the technical names. A photo of the label or the name of your last service can help.\n\nIf you’re sorting out the bottles you already own, our [guide to using Juuce products](/blog/how-to-use-juuce-hair-products/) explains what each product is for. It’s a starting point for your routine, not a shopping list for the occasion."
      },
      {
        "heading": "Ask how to arrive",
        "content": "Should you wash your hair first? It depends on your hair, the style and the booked service. Check whether washing is included, whether your hair should be dry when you arrive and whether there are products to avoid beforehand.\n\nFollow the advice for your actual appointment rather than assuming yesterday’s hair always holds better. Make a quick note of the instructions, then bring your photos and accessories with you.\n\nStyling at home instead? Practise with the tools and products you already know so you can allow enough time. If you use heat, follow your tool’s instructions and your heat-protection product’s directions. You can [view Juuce Heat Shield](/products/juuce-heat-shield/) if you’re comparing options, but there’s no need to replace a suitable product you already use."
      },
      {
        "heading": "Your quick appointment checklist",
        "content": "Before booking, have these handy:",
        "bullets": [
          "Your event date and the time you need to be ready.",
          "The finish you’d like and a couple of inspiration photos.",
          "Your current hair length and any recent treatments.",
          "Any accessories you’d like included.",
          "Questions about the right service and how to prepare."
        ]
      },
      {
        "heading": "Ready to make a plan?",
        "content": "Once you’ve booked, save the service, date, time and preparation instructions together.\n\nReady to make a plan? [Explore services and book online](/services/), or call " + BUSINESS_NAP.phone.display + " if you need help choosing. Hair Pinns is at " + BUSINESS_NAP.address.street + ", " + BUSINESS_NAP.address.locality + "."
      }
    ],
    "quickAnswer": {
      "question": "How should I plan a hair appointment before an event?",
      "answer": "Start with your event date, the time you need to be ready and the finish you’d like. Choose the service that fits, share a couple of inspiration photos and ask how to prepare. Discuss a cut or colour change separately rather than assuming it fits into a styling booking."
    },
    "faqSection": [
      {
        "question": "How many days before an event should I book a cut or colour?",
        "answer": "There isn’t one number of days that suits everyone. Tell Jena your event date, your hair history and the change you want, then discuss the timing and current appointment options before booking."
      },
      {
        "question": "Should I wash my hair before an event styling appointment?",
        "answer": "Ask about your booked service. Check whether washing is included, whether to arrive with dry hair and whether there are products to avoid. Follow the preparation advice for your actual appointment."
      },
      {
        "question": "What should I bring to my appointment?",
        "answer": "Bring a couple of inspiration photos and any hair accessory you’d like included. Tell your stylist what you like about the photos and mention recent colour, lightening, smoothing or other treatments."
      }
    ]
  },
  "cta": {
    "type": "service",
    "servicePath": "/services/",
    "customText": "Plan your next appointment"
  }
} as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
