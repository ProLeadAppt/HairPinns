import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "truth-about-shampoo-after-straight-up-treatment",
    title: "The Truth About Shampoo After Straight Up Treatment",
    excerpt: "As a stylist, I want my clients to get the best results from their QIQI Straight Up Treatment. Here's what you really need to know about aftercare.",
    category: "Treatments",
    date: "May 25, 2025",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Aromaganics-1.jpg?v=1746879807",
    author: "Jena Pinn",
    content: {
      introduction: "I genuinely want my clients to get the best, longest-lasting results from their QIQI Straight Up Treatment. As a stylist, I never want to overwhelm my clients with product rules, but when it comes to QIQI Vega (Straight Up Treatment), aftercare really does matter. I recommend this treatment because it transforms your hair. Soft, smooth, frizz-free, and I want you to enjoy those results for as long as possible. But here's the thing: the wrong shampoo can undo it fast. And I've seen it happen more than once.",
      sections: [
        {
          heading: "Why Can One Wash Make a Difference?",
          content: "If you've just had your QIQI treatment and your hair suddenly feels frizzy again after one wash, chances are the shampoo you used wasn't compatible, even if it claimed to be \"natural\" or \"hydrating.\"\n\nWhat I always look out for are two ingredients that can affect results:\n\nSulphates – harsh cleansing agents that strip the hair\nSodium chloride (salt) – often used as a thickener in shampoos, but it can break down smoothing treatments\n\nEven one use of a shampoo with salt or sulphates can cause your hair to feel rougher, puffier, or less sleek; or worse- strip it out completely."
        },
        {
          heading: "It's Not About Selling You Stuff. It's About Protecting Your Results",
          content: "I only recommend salt- and sulphate-free products because I've tested them on my own clients and seen the difference. I want your QIQI Straight Up treatment to last as long as possible, not fade after a few washes."
        },
        {
          heading: "My Go-To Aftercare Recommendations:",
          content: "QIQI - The Shampoo, Conditioner & definitely the super soaker masque– made to extend and protect the treatment with longer lasting results.\nPure Haircare Goddess or Miracle Renew – gentle, clean, and smoothing.\nJuuce Heat Shield or Solar Enz – protects your hair from heat styling without buildup.\nJuuce Botanic Oil Serum - to keep that frizz away & add extra shine ✨\n\nThese aren't just \"nice to have\" products. They're the key to keeping your hair feeling the way it did when you left the salon."
        },
        {
          heading: "Not Sure What's Safe? Just Ask Me!",
          content: "If you're unsure whether a shampoo is 'Straight Up Treatment' safe, send me a photo of the ingredients or bring it to your next appointment. I'm more than happy to check. It's not about pushing products, it's about making sure you get the full value out of what you've already invested in.\n\nLet's keep your hair smooth, shiny, and manageable for as long as possible. You deserve it.\n\nHave a Happy Hair Day\n\nJena at Hair Pinns 💜"
        }
      ],
      productModule: {
        title: "Recommended Aftercare Products",
        products: [
          {
            name: "QIQI Aftercare Range",
            link: "/collections/qiqi",
            description: "Treatment-safe shampoo & conditioner"
          },
          {
            name: "Pure Goddess Range",
            link: "/collections/pure-certified-organic-hair-care",
            description: "Gentle, sulphate-free care"
          }
        ]
      },
      faqSection: [
        {
          question: "What is a Straight Up Smoothing treatment?",
          answer: "A chemical service that permanently relaxes the curl pattern at the bond level, leaving hair frizz-free, smooth, and blow-dryable in 5 minutes. Lasts 6-12 months depending on hair type and home care.",
        },
        {
          question: "What shampoo should I use after Straight Up Smoothing?",
          answer: "Sulfate-free, sodium-chloride-free only. Juuce Smoothing or Pure Precious are Jena's go-to. Sulfates strip the treatment within weeks and undo what you paid for.",
        },
        {
          question: "Can I colour my hair after Straight Up Smoothing?",
          answer: "Yes, but wait 2 weeks. The cuticle needs time to settle. Always do a strand test — colour can grab differently on smoothed hair, especially if it's been pre-lightened.",
        },
        {
          question: "How long does Straight Up Smoothing last?",
          answer: "6 months on fine hair, 9-12 months on coarse or virgin hair. The treatment grows out with your natural curl, so it's not 'gone' — it just returns gradually at the root.",
        },
        {
          question: "Is Straight Up Smoothing safe for coloured hair?",
          answer: "Yes, but colour must go on AFTER smoothing, not before. The smoothing service opens the cuticle, and applying colour on top of freshly smoothed hair causes uneven grab. Jena sequences them 2-3 weeks apart.",
        }
      ],
    },
    cta: {
      type: "call-jena",
      productPath: "https://hairpinns.com/collections/qiqi",
      customText: "Questions about aftercare products?"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
