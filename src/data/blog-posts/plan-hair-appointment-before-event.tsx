import { BUSINESS_NAP } from "@/config/businessConfig";
import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
  "slug": "plan-hair-appointment-before-event",
  "title": "Planning your hair for Christmas parties and special events",
  "seoTitle": "Christmas Party & Event Hair Planning | Hair Pinns",
  "excerpt": "A practical checklist for planning your hair for Christmas parties and special events at Hair Pinns in Bangor.",
  "metaDescription": "Plan your Christmas party or event hair with a practical appointment checklist. Explore Hair Pinns services in Bangor and check current booking options.",
  "category": "Salon advice",
  "date": "11 November 2026",
  "publishedDate": "2026-11-11",
  "readTime": "4 min read",
  "image": "/blog-images/event-appointment-jena.webp",
  "imageAlt": "Jena from Hair Pinns in Bangor with softly waved, highlighted hair",
  "author": "Jena Pinn",
  "showLeadMagnet": false,
  "content": {
    "introduction": "An invitation arrives, the date goes in the diary, and suddenly there are outfits, travel plans and a dozen other things to organise. Your hair appointment is easier to plan when you start with three details: when you need to be ready, the finish you have in mind and what your hair is like now.\n\nWhether you’re getting ready for a Christmas party, a wedding or a dinner with friends, this checklist will help you choose your appointment and know what to ask before you arrive.",
    "sections": [
      {
        "heading": "Start with your ready-by time",
        "content": "Your event might begin at six, but you may need to leave home much earlier. Allow time for getting dressed, makeup, photographs and travel. Then tell your stylist when your hair needs to be finished.\n\nBe clear about whether you want styling on the day or a cut or colour beforehand. These may need separate appointments. Check the booked service and its duration rather than assuming an extra treatment or styling step can fit into the same visit.\n\nIf you’re considering a bigger cut or colour change, mention the event while discussing the plan. There isn’t one timing rule for everyone. Your starting point, the change you want and the appointments available all matter."
      },
      {
        "heading": "Choose the service that matches the finish",
        "content": "A blow-dry, curls and an upstyle can involve different work and appointment lengths. Start with the look you want, then check which service suits it. Your hair’s length and thickness are useful details to share too.\n\nBrowse the Hair Pinns service menu before choosing a time. If you aren’t sure which option to book, ask the salon before confirming. That helps avoid arriving with a plan that needs a different appointment."
      },
      {
        "heading": "Bring inspiration you can explain",
        "content": "A couple of photos is enough. What do you like about each one? It might be the shape around the face, soft movement, volume at the crown or having your hair pinned away from your neck.\n\nPhotos of similar hair length and texture can be useful starting points. They help you discuss a look, rather than promise an identical result. An outfit photo can help explain the neckline, and it’s worth mentioning any hair accessory you would like included.\n\nKeep your photos together with a short note, such as “soft around my face, with the back pinned up”. It makes the conversation more specific than a folder full of unrelated styles."
      },
      {
        "heading": "Keep the lead-up simple",
        "content": "An event doesn’t need to mean a whole new product routine. Use products as directed and ask your stylist before trying a treatment or preparation step you aren’t familiar with.\n\nMention recent colour, lightening, smoothing or other treatments, including anything done at home or at another salon. If you don’t remember a product name, a photo of its label can help."
      },
      {
        "heading": "Ask how to arrive",
        "content": "Should you wash your hair before an appointment? Check with the salon. Preparation depends on your hair and the booked service, so a general rule about washing the night before may not suit your appointment.\n\nAsk whether washing is included, whether your hair should be dry when you arrive and whether there are products to avoid beforehand. Save the instructions with your appointment details, then bring your photos and any accessories on the day."
      },
      {
        "heading": "Styling at home? Have a practice run",
        "content": "Try the look before the event using tools and products you already know. You’ll get a better idea of how much time you need and whether you want to simplify any steps.\n\nIf you use heat, follow the tool’s instructions and your heat-protection product’s directions. You don’t need to replace suitable products you already own just because an occasion is coming up."
      },
      {
        "heading": "Save this appointment checklist",
        "content": "Before booking:\n• Event date and the time you need to be ready.\n• The finish you’d like and a couple of inspiration photos.\n• Current hair length and any recent colour or treatments.\n• Any accessory you would like included.\n• Questions about the right service and how to prepare.\n\nAfter booking, keep the service, date, time and preparation instructions together.\n\nReady to make a plan? Explore Hair Pinns services at [Hair Pinns services](/services/) and check the current booking options.\n\nHair Pinns is at " + BUSINESS_NAP.address.street + ", " + BUSINESS_NAP.address.locality + " NSW 2234."
      }
    ]
  }
} as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post} />;
}
