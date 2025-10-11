import straightUpHero from "@/assets/blog/straight-up-smoothing-hero.png";
import lamellarPack from "@/assets/blog/lamellar-vitality-pack.png";
import shampooHero from "@/assets/blog/shampoo-replacement-hero.png";
import saunaRoom from "@/assets/blog/infrared-sauna-room.png";
import hotTowel from "@/assets/blog/hot-towel-treatment.png";
import qiqiOil from "@/assets/blog/qiqi-bare-repair-oil.png";
import pureEnds from "@/assets/blog/pure-precious-ends.png";
import hairspray from "@/assets/blog/juuce-hairspray-collection.png";
import wetBrush from "@/assets/blog/wet-brush-collection.png";
import saunaInterior from "@/assets/blog/infrared-sauna-interior.png";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      content: string;
    }[];
    productModule?: {
      title: string;
      products: {
        name: string;
        link: string;
        description: string;
      }[];
    };
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: "say-goodbye-to-frizzy-hair-for-good",
    title: "Say Goodbye to Frizzy Hair for Good?",
    excerpt: "An all-natural, permanent hair straightening treatment designed to give you sleek, smooth locks without compromising hair health.",
    category: "Treatments",
    date: "March 21, 2025",
    readTime: "4 min read",
    image: straightUpHero,
    author: "Jena Pinn",
    content: {
      introduction: "An all-natural, permanent hair straightening treatment designed to give you sleek, smooth locks without compromising hair health. Unlike traditional methods that often rely on harsh chemicals, Straight Up utilizes organic compounds, including citric acid, to achieve long lasting straightness safely.",
      sections: [
        {
          heading: "Why Choose a Straight Up?",
          content: "Time-Efficient: Achieve silky, straight hair in under two hours, perfect for those with busy schedules.\n\nLow Maintenance: Enjoy a simplified daily hair routine with minimal styling effort, giving you more time for other activities.\n\nWeather Resistant: Maintain frizz-free hair regardless of humidity or rain, ensuring a perfect hair day every day.\n\nChemical-Free: Free from harsh chemicals, this treatment ensures no damage to your hair or scalp, promoting overall hair health.\n\nReduced Heat Styling: With naturally straight hair, there's less need for heat styling tools, minimizing potential heat damage."
        },
        {
          heading: "Pricing",
          content: "Teens: $214\nMid-length: $324\nLong: $349\n\nExperience the benefits of a Straight Up and transform your hair care routine. For more information or to book an appointment, reach out!\n\nJena 0416037663\nE: hairpinns1@gmail.com"
        }
      ]
    }
  },
  {
    slug: "christmas-gift-packs-at-hair-pinns",
    title: "🎁 Christmas Gift Packs at Hair Pinns 🎁",
    excerpt: "The season of giving has arrived! Spoil someone special with our Juuce and Pure Christmas gift packs loaded with hair-loving products.",
    category: "Seasonal",
    date: "September 20, 2025",
    readTime: "5 min read",
    image: lamellarPack,
    author: "Jena Pinn",
    content: {
      introduction: "The season of giving has arrived, and at Hair Pinns we've made it simple to spoil someone special (or yourself!) with our Juuce and Pure Christmas gift packs. Each one is loaded with hair-loving products that suit different needs and comes with a little bonus gift to make it even better value.",
      sections: [
        {
          heading: "✨ Juuce Christmas Packs",
          content: "Juuce is loved for its salon-quality formulas that combine natural extracts with targeted results. This year's Christmas packs cover a variety of hair goals, so there's something for everyone:\n\nFrizz control & smoothing – Tame unruly hair and create silky, polished finishes.\nColour care – Keep coloured and blonde hair vibrant, shiny and protected.\nRepair & nourishment – Strengthen damaged strands and restore softness.\nVolume & body – Add lift, bounce and fullness to fine hair.\n\nAnd as a festive bonus, every Juuce pack includes a free leave-in treatment. This hero product works behind the scenes all day to detangle, protect against heat and UV, and keep hair silky between washes. It's an everyday essential that makes these packs even more irresistible."
        },
        {
          heading: "🌿 Pure Christmas Packs",
          content: "Pure is Hair Pinns' go-to brand for certified organic, eco-friendly hair care that doesn't compromise on performance. Each pack is carefully matched to hair concerns like:\n\nDeep hydration – Perfect for dry or thirsty hair that needs moisture.\nRepair & strength – Ideal for restoring damaged or chemically treated hair.\nCurl care & definition – Designed to nourish natural curls while enhancing bounce.\nShine & smoothness – Great for anyone wanting naturally glossy, frizz-free locks.\n\nEvery Pure pack also comes with a free mask — a rich, intensive treatment designed to be used weekly for a big dose of nourishment. It's the kind of self-care product that makes hair feel instantly healthier and stronger, which is why it's such a special addition to these festive bundles."
        },
        {
          heading: "💜 The Perfect Gift",
          content: "Whether you go for Juuce with its everyday must-have leave-in treatment, or Pure with its luxurious free mask, these Christmas packs are the perfect way to give the gift of healthy, beautiful hair. They're great for family, friends, teachers, or even as a little holiday treat for yourself.\n\n👉 Browse them all here: Hair Pinns Christmas Gift Packs"
        }
      ],
      productModule: {
        title: "Shop Christmas Gift Packs",
        products: [
          {
            name: "Juuce Christmas Packs",
            link: "/collections/juuce",
            description: "Salon-quality formulas with free leave-in treatment"
          },
          {
            name: "Pure Christmas Packs",
            link: "/collections/pure-organic",
            description: "Certified organic care with free mask"
          }
        ]
      }
    }
  },
  {
    slug: "whats-a-straight-up-smoothing-treatment",
    title: "What's a Straight Up Smoothing Treatment??",
    excerpt: "Smooth, Soft, Frizz-Free - Meet QIQI Vega, Your Hair's New Best Friend. The answer to all your frizz problems.",
    category: "Treatments",
    date: "September 02, 2025",
    readTime: "5 min read",
    image: straightUpHero,
    author: "Jena Pinn",
    content: {
      introduction: "If you've ever wished your hair would just behave — no frizz, no puff, no morning wrestling match — then our Straight Up Smoothing Treatment might be the answer you've been dreaming of. And here's the secret: we use QIQI Vega, one of the most advanced and hair-friendly smoothing systems in the world.",
      sections: [
        {
          heading: "This Isn't Your Typical Keratin Treatment",
          content: "There's no harsh chemicals, no overpowering fumes, and no \"don't wash your hair for three days\" awkwardness. You'll leave the salon with hair that looks and feels ready for anything and it stays that way for months."
        },
        {
          heading: "Why Clients Love QIQI Vega 💗",
          content: "Frizz? Gone. Humidity has nothing on you. Your hair will stay sleek and smooth, even on the muggiest days.\n\nTime-saving magic. Blow-drying is faster and easier, and some clients don't even need to touch the straightener afterward.\n\nKeeps your hair's natural body. It smooths without making hair poker straight — unless that's the look you want.\n\nShiny, healthy finish. Your hair will feel silky and soft, not coated or heavy.\n\nLasts for months. Enjoy your smooth, low-maintenance hair for up to 6 months, depending on your hair type and routine.\n\nNo downtime. Wash, style, and enjoy your hair the same day."
        },
        {
          heading: "Perfect For:",
          content: "• Hair that frizzes at the first hint of moisture\n• Waves or curls that you'd like to soften without losing all shape\n• Thick, hard-to-manage hair that takes forever to style\n• Anyone wanting a sleek, polished look without damage"
        },
        {
          heading: "The QIQI Vega Difference",
          content: "Most straightening systems rely on formaldehyde or harsh chemicals that can leave hair brittle or flat. QIQI Vega is formaldehyde-free and works on all hair types — even bleached or colour-treated hair — without compromising condition. In fact, many clients find their hair feels healthier after the treatment because it locks in moisture and seals the cuticle."
        },
        {
          heading: "Your Hair Will Thank You 🙏🏼",
          content: "Imagine waking up and your hair already looks good.\n\nImagine walking out into humid weather and still having a great hair day.\n\nImagine cutting your styling time in half while your hair stays smooth, shiny, and soft for months.\n\nThat's what QIQI Vega delivers.\n\n💜 Book your Straight Up Smoothing Treatment today and let your hair do less fighting and more shining.\n\n📲 Send me a message with any further questions or to secure your appointment"
        }
      ]
    }
  },
  {
    slug: "how-often-should-you-replace-your-shampoo",
    title: "How Often Should You Replace Your Shampoo?",
    excerpt: "Understanding shampoo longevity helps you plan ahead and keeps your hair clean and healthy without wasting product or money.",
    category: "Education",
    date: "September 01, 2025",
    readTime: "3 min read",
    image: shampooHero,
    author: "Jena Pinn",
    content: {
      introduction: "Shampoo isn't a \"forever\" product. Using the right amount keeps your hair clean and healthy without wasting product (or money). Plus, knowing when to replace it helps you plan ahead so you're never caught with an empty bottle in the shower!",
      sections: [
        {
          heading: "How Long Does a 300ml Shampoo Last?",
          content: "The average wash uses around 10ml of shampoo. That means:\n\n• 2 washes a week: ~20ml per week → 300ml lasts about 15 weeks (3.5 months)\n• 3 washes a week: ~30ml per week → 300ml lasts about 10 weeks (2.5 months)\n• Daily washers (7x): ~70ml per week → 300ml lasts about 4–5 weeks\n\n(Of course, hair length, thickness, and how much you lather up all make a difference!)"
        },
        {
          heading: "Signs It's Time to Restock",
          content: "• Your bottle feels lighter and you're squeezing the last drops.\n• Your hair isn't feeling as fresh—sometimes product loses its effectiveness if it's been open too long (12–18 months shelf life is standard).\n• You're tempted to use way more than you need because it's not lathering well anymore."
        },
        {
          heading: "Pro Tip: Don't Overdo It",
          content: "A 5–10 cent coin-sized amount is enough for most people. Fine or short hair = less, thick or long hair = a touch more. Overusing only makes you run out faster and can dry out your scalp."
        },
        {
          heading: "Keep Your Routine Fresh",
          content: "On average, most clients should expect to replace their 300ml shampoo every 2–3 months. If you wash less often, it'll stretch a bit longer.\n\n👉 Shop your next bottle here: HairPinns.com Shampoo Collection"
        }
      ],
      productModule: {
        title: "Shop Our Shampoo Collection",
        products: [
          {
            name: "Juuce Shampoos",
            link: "/collections/juuce",
            description: "Premium salon-quality shampoos"
          },
          {
            name: "Pure Organic Shampoos",
            link: "/collections/pure-organic",
            description: "Certified organic hair care"
          }
        ]
      }
    }
  },
  {
    slug: "5-ways-infrared-sauna-boosts-hair-skin-glow",
    title: "5 Ways Infrared Sauna Sessions Boost Your Hair, Skin & Overall Glow",
    excerpt: "In today's fast paced world, stress, pollution, and product buildup can leave your strands dull. Our infrared sauna experience works from the inside out.",
    category: "Wellness",
    date: "August 12, 2025",
    readTime: "5 min read",
    image: saunaRoom,
    author: "Jena Pinn",
    content: {
      introduction: "When was the last time you gave your hair and skin the deep care they truly deserve? In today's fast paced world, stress, pollution, and product buildup can leave your strands dull and your skin feeling tired. At Hairpinns, our infrared sauna experience is more than just a way to relax it's a beauty and wellness treatment that works from the inside out. Whether you're looking for smoother hair, clearer skin, or an all over glow, here's how regular sauna sessions can transform your self care routine.",
      sections: [
        {
          heading: "1. Detox for Healthy Skin & Hair",
          content: "Infrared heat penetrates deeper than traditional saunas, encouraging a healthy sweat that helps remove toxins and impurities. By clearing out the buildup that clogs pores and weighs hair down, your scalp feels refreshed, and your hair can regain its natural shine."
        },
        {
          heading: "2. Boosted Blood Circulation",
          content: "Better circulation means more oxygen and nutrients reach your hair follicles and skin cells. This natural boost supports stronger hair growth, a healthier scalp, and a more radiant complexion helping you look and feel your best after every session."
        },
        {
          heading: "3. Deep Hydration & Product Absorption",
          content: "Heat from the infrared sauna gently opens the cuticles in your hair and the pores in your skin. This makes it the perfect time to apply nourishing treatments like our Hairpinns Hair Mask so they can penetrate deeper and work more effectively."
        },
        {
          heading: "4. Stress Relief = Better Hair Growth",
          content: "Stress is one of the most overlooked causes of hair thinning and poor skin health. Infrared sauna sessions help reduce cortisol (the stress hormone), creating a more relaxed state that supports healthy hair growth and a glowing complexion."
        },
        {
          heading: "5. The Ultimate Self-Care Ritual",
          content: "Pairing your sauna session with a hair mask, hydration, and relaxation time creates the ultimate self-care experience. You'll walk out not only looking refreshed but feeling renewed from the inside out."
        },
        {
          heading: "Ready to Experience the Glow-Up?",
          content: "Now is the perfect time to invest in your hair, skin, and overall wellness.\n\nFor a limited time at Hairpinns, enjoy our 10-session sauna pack for only $200 (was $250) and receive:\n✔ Free Head Towel\n✔ Free Hair Mask Sachet\n✔ Free Hairpinns Drink Bottle\n\n📅 Book your sauna experience today and let's make your self-care a priority."
        }
      ]
    }
  },
  {
    slug: "the-secret-behind-that-steamy-towel-moment",
    title: "The Secret Behind That Steamy Towel Moment 🔥💆",
    excerpt: "Why hot towel treatments deserve a spot in your hair routine. Beyond the spa-like feels, there's real hair and scalp science happening.",
    category: "Treatments",
    date: "August 04, 2025",
    readTime: "4 min read",
    image: hotTowel,
    author: "Jena Pinn",
    content: {
      introduction: "If you've ever had a hot towel wrapped around your hair or neck during a salon treatment, you'll know it's heavenly. That moment when the warmth hits? Instant exhale. But beyond the spa-like feels, there's real hair and scalp science happening under that steamy towel. So let's break it down — why is everyone loving hot towel treatments, and should you be saying yes please at your next appointment?",
      sections: [
        {
          heading: "🌿 1. It Opens the Hair Cuticle for Deeper Treatment",
          content: "Your hair cuticle is like a protective outer shell. When it's closed, treatments can only do so much. The heat from a hot towel gently opens the cuticle, allowing masks, treatments, and conditioners to penetrate deeper. That means more moisture, more repair, and longer-lasting results.\n\nThink of it as giving your hair a VIP pass to hydration and nourishment."
        },
        {
          heading: "💆 2. It Boosts Scalp Circulation",
          content: "Your scalp is skin too – and it thrives on good circulation. The warmth from the towel increases blood flow, which helps stimulate hair follicles, support healthy growth, and even soothe tension headaches.\n\nWin-win-win."
        },
        {
          heading: "🧘 3. It's Relaxation You Can Feel",
          content: "Let's be honest – salon time is often the only real \"me time\" many of us get. A hot towel moment gives your nervous system a break. The warmth triggers a calming response in the body, helping reduce stress and tension.\n\nAnd less stress = healthier hair (it's all connected!)."
        },
        {
          heading: "🌸 4. It Enhances Product Performance",
          content: "Using a treatment mask? Adding a hot towel supercharges the results. It's like turning your in-salon treatment into a deep conditioning powerhouse, especially when paired with our fave nourishing masks and serums."
        },
        {
          heading: "💜 So, Is It Worth It?",
          content: "Absolutely. Hot towel treatments may feel indulgent, but they're actually functional self-care for your hair and your headspace.\n\nNext time you visit Hair Pinns, ask for a hot towel wrap with your treatment or blowdry. Your hair will feel it — and so will your soul.\n\nWant a mini spa moment during your next salon visit? We've got the towels ready. You just sit back and enjoy 🖤"
        }
      ]
    }
  },
  {
    slug: "qiqi-bare-repair-oil-shine-strength-smoothness",
    title: "QIQI Bare Repair Oil – Shine, Strength & Smoothness in a Bottle",
    excerpt: "If you're chasing healthier, shinier, frizz-free hair without that heavy, greasy feel — QIQI Bare Repair Oil is the answer.",
    category: "Products",
    date: "July 27, 2025",
    readTime: "3 min read",
    image: qiqiOil,
    author: "Jena Pinn",
    content: {
      introduction: "If you're chasing healthier, shinier, frizz-free hair without that heavy, greasy feel QIQI Bare Repair Oil is the answer. This luxe, dry-touch oil is designed to repair, smooth, and strengthen all hair types (yes, even fine or chemically treated strands). It's powered by performance-driven plant oils that hydrate and restore, while keeping your hair light, bouncy, and full of shine.",
      sections: [
        {
          heading: "🌿 What Makes It So Good?",
          content: "Lightweight, Dry Oil Finish – absorbs instantly with no residue\nPlant-Based Repair Blend – hydrates, protects and strengthens without buildup\nFrizz Control & Smooth Texture – say goodbye to flyaways and rough ends\nBoosts Shine & Softness – leaves hair silky, glossy and touchable\nSafe for All Hair Types – including coloured, dry, or damaged hair\n\nThis is not your average hair oil — it delivers deep nourishment and long-lasting results without ever feeling greasy or heavy."
        },
        {
          heading: "🧴 How to Use It",
          content: "1. Pump 1–3 drops into your palms and warm between your hands.\n2. Apply to damp or dry hair, focusing on the mid-lengths and ends.\n3. Style as usual – or use it to smooth flyaways and finish your look.\n4. Use daily or as needed. Avoid roots to keep volume natural.\n\nPro tip: A little goes a long way, so start small and build it up if your hair needs more love."
        },
        {
          heading: "✨ The Result…",
          content: "Stronger, shinier, smoother hair with every use — without any heaviness. Whether you're blowdrying, letting it air dry, or just refreshing in-between washes, QIQI Bare Repair Oil is your new go-to.\n\nTreat your hair to the repair oil it's been begging for.\n\nGET IT HERE"
        }
      ],
      productModule: {
        title: "Shop QIQI Products",
        products: [
          {
            name: "QIQI Bare Repair Oil",
            link: "/collections/qiqi",
            description: "Lightweight dry-touch repair oil"
          },
          {
            name: "Browse QIQI Collection",
            link: "/collections/qiqi",
            description: "Professional hair care range"
          }
        ]
      }
    }
  },
  {
    slug: "smooth-seal-strengthen-pure-precious-ends",
    title: "💧Smooth, Seal & Strengthen: Why Your Ends Need Pure Precious Ends",
    excerpt: "If your hair feels dry at the ends, breaks easily, or looks frazzled — Pure Precious Ends is your new secret weapon.",
    category: "Products",
    date: "July 26, 2025",
    readTime: "3 min read",
    image: pureEnds,
    author: "Jena Pinn",
    content: {
      introduction: "If your hair feels dry at the ends, breaks easily, or looks a bit frazzled no matter how much you trim—Pure Precious Ends is your new secret weapon. Designed to rescue and protect your ends, this lightweight leave-in is a must-have in your routine (especially if you style with heat or colour your hair).",
      sections: [
        {
          heading: "✨ Key Benefits:",
          content: "• Repairs and seals split ends\n• Prevents breakage and frizz\n• Adds shine without weighing hair down\n• Protects against heat styling and environmental damage\n• Lightweight and silicone-free"
        },
        {
          heading: "🌿 Hero Ingredients:",
          content: "Certified Organic Goji Berry Extract – rich in antioxidants to nourish and restore damaged ends\n\nVitamin E – strengthens and smooths the hair cuticle for a glossy finish"
        },
        {
          heading: "📋 How to Use:",
          content: "1. Apply a small amount to dry or towel-dried hair\n2. Focus on the mid-lengths to ends (especially the driest areas)\n3. Style as usual – blowdry, straighten, or let it air dry\n4. Use daily or as needed for a silky, polished finish\n\n💡 Bonus Tip: You can also run a tiny bit over dry hair after styling to tame frizz and add shine!"
        },
        {
          heading: "🛍️ Ready to rescue those ends?",
          content: "👉 Shop Pure Precious Ends Now"
        }
      ],
      productModule: {
        title: "Shop Pure Organic Range",
        products: [
          {
            name: "Pure Precious Ends",
            link: "/collections/pure-organic",
            description: "Leave-in treatment for split ends"
          },
          {
            name: "Browse Pure Collection",
            link: "/collections/pure-organic",
            description: "Certified organic hair care"
          }
        ]
      }
    }
  },
  {
    slug: "whats-the-best-hairspray-to-use",
    title: "What's the Best Hairspray to Use?",
    excerpt: "The 3 Types of Hair Spray We Love at Hair Pinns - delivering results without compromising hair health.",
    category: "Products",
    date: "July 13, 2025",
    readTime: "5 min read",
    image: hairspray,
    author: "Jena Pinn",
    content: {
      introduction: "When it comes to styling, hairspray is a must-have — but not all sprays are created equal. At Hair Pinns, we only recommend styling products that deliver results without compromising hair health. Today, we're breaking down the three go-to hairsprays we use behind the chair and sell in our salon — so you can choose the right one for your hair goals!",
      sections: [
        {
          heading: "1. Juuce Stuck Up – Maximum Hold Hairspray",
          content: "If you're after serious staying power, Juuce Stuck Up is your styling soulmate. This is our favourite strong-hold hairspray for securing updos, taming frizz, or locking in curls that last all day (and night). It adds high shine, resists humidity, and is completely brush-out friendly — which means no sticky build-up and no drama when it's time to restyle or refresh.\n\n🖤 Best for: Upstyles, curls, frizz control\n💨 Hold level: Strong\n🪮 Formula: Brush-out formula with zero build-up\n🌿 Bonus: Vegan, paraben-free, and cruelty-free"
        },
        {
          heading: "2. Pure Halo Spray – Flexible Everyday Hold",
          content: "Think of Pure Halo Spray as your everyday go-to for soft, touchable hold. It keeps your style in place while allowing movement — so your hair never feels stiff or crunchy. Plus, it's enriched with organic extracts to nourish and protect your hair while you style.\n\n💛 Best for: Daily styling, soft waves, natural movement\n💨 Hold level: Flexible to medium\n🌿 Bonus: Sulphate- and paraben-free, with organic ingredients"
        },
        {
          heading: "3. Pure Plumping Clay Spray – Texture + Volume",
          content: "Need volume and texture without the stickiness of a traditional hairspray? Say hello to Pure Plumping Clay Spray. This unique spray blends the benefits of a texturiser, root booster, and dry clay into one. It lifts fine hair at the roots, adds body through the mid-lengths, and gives that lived-in, effortless look we all love.\n\n💗 Best for: Fine or flat hair, texture, volume at the roots\n💨 Hold level: Light to medium, with a matte finish\n🌿 Bonus: Gentle on the scalp, ideal for creating tousled styles or prepping for updos"
        },
        {
          heading: "Which One Should You Choose?",
          content: "It depends on your style goals!\n\n✔️ For volume and texture: Go with Pure Plumping Clay Spray\n✔️ For soft, flexible hold: Try Pure Halo Spray\n✔️ For strong, long-lasting styles: You'll love Juuce Stuck Up\n\nAll three are available now at HairPinns.com or in-salon. Need help choosing the best one? Pop in and chat with one of our stylists — we're always happy to help!"
        }
      ],
      productModule: {
        title: "Shop Our Hairspray Range",
        products: [
          {
            name: "Juuce Stuck Up",
            link: "/collections/juuce",
            description: "Maximum hold hairspray"
          },
          {
            name: "Pure Halo Spray",
            link: "/collections/pure-organic",
            description: "Flexible everyday hold"
          }
        ]
      }
    }
  },
  {
    slug: "why-wet-brush-is-a-must-have",
    title: "💖 Why a Wet Brush Is a Must-Have in Every Hair Routine",
    excerpt: "Did you know your hair is at its most fragile when it's wet? That's why the right brush matters.",
    category: "Products",
    date: "July 13, 2025",
    readTime: "3 min read",
    image: wetBrush,
    author: "Jena Pinn",
    content: {
      introduction: "Did you know your hair is at its most fragile when it's wet? That's why tugging a regular brush through wet hair can lead to unnecessary breakage, split ends, and hair fall — especially if your hair is fine, coloured, curly, or damaged.",
      sections: [
        {
          heading: "So… what makes the Wet Brush different?",
          content: "Wet Brushes are specifically designed to detangle gently without causing damage — even on soaking wet, delicate strands."
        },
        {
          heading: "✅ Here's why we love them at Hair Pinns:",
          content: "Ultra-soft, flexible bristles\nThe IntelliFlex® bristles bend as needed to gently loosen knots without pulling or snapping your hair.\n\nSafe for all hair types\nWhether your hair is curly, straight, thick, fine, or somewhere in between — Wet Brushes work with your hair, not against it.\n\nKid & curl friendly\nNo more tears or tantrums! Great for sensitive scalps, kids, and anyone with curls that tangle easily.\n\nPerfect for treatments\nUse your Wet Brush to evenly distribute leave-ins, masks, or oils through damp hair without overworking it.\n\nSalon-approved + original quality\nWe only stock the original Wet Brush — no knock-offs. You'll notice the difference with every stroke."
        },
        {
          heading: "💡 Hair Tip:",
          content: "Always start brushing from the ends and gently work your way up — especially when hair is wet."
        },
        {
          heading: "🛍️ Shop Our Range",
          content: "Shop our range of original Wet Brushes here: https://hairpinns.com/collections/wet-brush-detanglers"
        }
      ],
      productModule: {
        title: "Shop Wet Brush Collection",
        products: [
          {
            name: "Original Wet Brush",
            link: "/collections/wet-brush-detanglers",
            description: "Gentle detangling for all hair types"
          },
          {
            name: "Browse Accessories",
            link: "/collections/accessories",
            description: "Hair tools and care essentials"
          }
        ]
      }
    }
  }
];

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};
