import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "christmas-gift-packs-at-hair-pinns",
    title: "🎁 Gift Packs at Hair Pinns 🎁",
    archived: true, // Jena doesn't currently offer gift packs
    redirectTo: "/products", // Send seasonal traffic to the live product catalogue
    excerpt: "Spoil someone special with our Juuce and Pure gift packs loaded with hair-loving products.",
    category: "Products",
    date: "September 20, 2025",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-120.jpg?v=1747030506",
    author: "Jena Pinn",
    content: {
      introduction: "At Hair Pinns we've made it simple to spoil someone special (or yourself!) with our Juuce and Pure gift packs. Each one is loaded with hair-loving products that suit different needs and comes with a little bonus gift to make it even better value.",
      sections: [
        {
          heading: "✨ Juuce Gift Packs",
          content: "Juuce is loved for its professional formulas that combine natural extracts with targeted results. Our gift packs cover a variety of hair goals, so there's something for everyone:\n\nFrizz control & smoothing – Tame unruly hair and create silky, polished finishes.\nColour care – Keep coloured and blonde hair vibrant, shiny and protected.\nRepair & nourishment – Strengthen damaged strands and restore softness.\nVolume & body – Add lift, bounce and fullness to fine hair.\n\nAs a bonus, every Juuce pack includes a free leave-in treatment. This hero product works behind the scenes all day to detangle, protect against heat and UV, and keep hair silky between washes. It's an everyday essential that makes these packs even more irresistible."
        },
        {
          heading: "🌿 Pure Gift Packs",
          content: "Pure is Hair Pinns' go-to brand for certified organic, eco-friendly hair care that doesn't compromise on performance. Each pack is carefully matched to hair concerns like:\n\nDeep hydration – Perfect for dry or thirsty hair that needs moisture.\nRepair & strength – Ideal for restoring damaged or chemically treated hair.\nCurl care & definition – Designed to nourish natural curls while enhancing bounce.\nShine & smoothness – Great for anyone wanting naturally glossy, frizz-free locks.\n\nEvery Pure pack also comes with a free mask, a rich, intensive treatment designed to be used weekly for a big dose of nourishment. It's the kind of self-care product that makes hair feel instantly healthier and stronger, which is why it's such a special addition to these bundles."
        },
        {
          heading: "💜 The Perfect Gift",
          content: "Whether you go for Juuce with its everyday must-have leave-in treatment, or Pure with its luxurious free mask, these gift packs are the perfect way to give the gift of healthy, beautiful hair. They're great for family, friends, teachers, or even as a little treat for yourself.\n\n👉 Browse them all here: Hair Pinns Gift Packs"
        }
      ],
      productModule: {
        title: "Shop Gift Packs",
        products: [
          {
            name: "Juuce Gift Packs",
            link: "/collections/juuce-botanicals",
            description: "Professional formulas with free leave-in treatment"
          },
          {
            name: "Pure Gift Packs",
            link: "/collections/pure-certified-organic-hair-care",
            description: "Certified organic care with free mask"
          }
        ]
      },
      faqSection: [
        {
          question: "What's in the Hair Pinns Christmas gift packs?",
          answer: "Three sizes — $45, $75, and $120. Each combines a Jena-curated shampoo, conditioner, and either a Wet Brush, treatment mask, or styling oil. Wrapped in a keepsake box with a handwritten note from Jena.",
        },
        {
          question: "Do you ship gift packs with a card?",
          answer: "Yes — add a message at checkout and Jena writes it by hand. We can also ship direct to the recipient with no pricing in the box, so it's a true gift experience.",
        },
        {
          question: "What's the cut-off for Christmas delivery in Australia?",
          answer: "Order by 18 December for metro NSW, VIC, QLD. For WA, SA, TAS, NT and rural postcodes, order by 15 December. After that, we still ship but use Express Post and you'll get a tracking link.",
        },
        {
          question: "Can I build a custom gift pack?",
          answer: "Yes — for orders over $75, pick any shampoo + conditioner + one accessory and we'll wrap it. Email jena@hairpinns.com with the items and we'll send you a custom link.",
        },
        {
          question: "Do gift packs include a discount code for the recipient?",
          answer: "Yes — every gift pack includes a 15% off code for the recipient's first salon booking at Hair Pinns, valid for 90 days.",
        }
      ],
    },
    cta: {
      type: "product",
      productPath: "https://hairpinns.com/collections",
      customText: "Shop hair care Australia-wide"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
