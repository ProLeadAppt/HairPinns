import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
  slug: "christmas-hair-gifts-2026",
  title: "Christmas Hair Care Gift Guide 2026",
  excerpt: "A simple guide to the current Juuce and Pure Christmas packs at Hair Pinns, plus a festive styling duo and salon-selected gift ideas.",
  category: "Seasonal",
  date: "5 September 2026",
  readTime: "4 min read",
  image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-118.jpg?v=1747030560",
  author: "Jena Pinn",
  content: {
    introduction: "Christmas hair care should be easy to choose and useful after the wrapping comes off. This year's Hair Pinns edit starts with the current Juuce and Pure Christmas packs, plus a Festive Finish duo. Each product page carries the latest pack options, price and availability, so you can choose from current information rather than an old seasonal list.",
    sections: [
      {
        heading: "Juuce Christmas Packs",
        content: "The Juuce Christmas Packs bring the current Juuce gift options together on one product page. Open the product page to compare the available variants and choose the option that best matches the recipient's hair routine.",
      },
      {
        heading: "Pure Christmas Packs",
        content: "The Pure Christmas Packs are the seasonal place to start for someone who already uses Pure or prefers that range. Current variants and availability are shown on the product page before you add a pack to your bag.",
      },
      {
        heading: "Festive Finish Gift Set Duo",
        content: "The Festive Finish Gift Set Duo is another simple gifting option in the Haircare Bundles & Gift Sets collection. Check the product page for the current details and availability.",
      },
      {
        heading: "Choose by hair need when you are unsure",
        content: "If you do not know the recipient's preferred brand, start with the Hair Pinns shop and browse by hair need. Frizz control, blonde care, heat protection, fine and flat hair, curls, scalp care and colour-treated hair each have their own clear path.",
      },
      {
        heading: "Christmas shipping",
        content: "Hair Pinns ships products Australia-wide, with free standard shipping on orders over $150. Delivery timing depends on the destination and the carrier, so check the current shipping information before ordering. Hair Pinns will publish any confirmed Christmas cut-off separately rather than promise a date that may change.",
      },
    ],
    productModule: {
      title: "Shop the Christmas edit",
      products: [
        { name: "Juuce Christmas Packs", link: "/products/christmas-packs", description: "See current Juuce pack options" },
        { name: "Pure Christmas Packs", link: "/products/pure-christmas-packs-2025", description: "See current Pure pack options" },
        { name: "Festive Finish Gift Set Duo", link: "/products/festive-finish-gift-set-duo", description: "View the festive styling duo" },
      ],
    },
    quickAnswer: {
      question: "What Christmas hair care packs can I buy from Hair Pinns?",
      answer: "Hair Pinns currently features Juuce Christmas Packs, Pure Christmas Packs and the Festive Finish Gift Set Duo. Check each product page for current variants, price and availability.",
    },
    keyTakeaways: [
      "Compare current Juuce and Pure pack variants on their product pages",
      "Use the Festive Finish Gift Set Duo as another ready-made option",
      "Browse by hair need if you are unsure which brand to choose",
      "Check current availability and shipping information before ordering",
    ],
    faqSection: [
      {
        question: "Where can I see the current Hair Pinns Christmas packs?",
        answer: "Open the Juuce Christmas Packs or Pure Christmas Packs product page, or browse Haircare Bundles & Gift Sets. Those pages show the current options and availability.",
      },
      {
        question: "Can I buy Hair Pinns Christmas packs online?",
        answer: "Yes. Packs that are available to purchase can be added to your bag from their Hair Pinns product page and checked out online.",
      },
      {
        question: "Does Hair Pinns ship Christmas packs Australia-wide?",
        answer: "Hair Pinns ships products Australia-wide. Free standard shipping applies to orders over $150. Check the shipping policy for current details.",
      },
      {
        question: "What if I do not know which pack to choose?",
        answer: "Browse by hair need in the Hair Pinns shop, or ask Jena for guidance before choosing. The product page will show the current variants available for each pack.",
      },
    ],
  },
  cta: {
    type: "product",
    productPath: "/collections/haircare-bundles-gift-sets",
    customText: "Shop bundles & gifts",
  },
} as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
