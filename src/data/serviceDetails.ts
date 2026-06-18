// Service detail data for dedicated service pages
// Each service gets rich content for SEO and conversion

export interface ServiceDetailData {
  slug: string;
  title: string;
  tagline: string;
  /** 1–2 sentence featured-snippet-style answer for Answer Optimization (AO) */
  quickAnswer?: string;
  duration?: string;
  price: string;
  description: string;
  metaDescription: string;
  whatsIncluded: string[];
  whoItsFor: string[];
  process: { step: string; description: string }[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
  /**
   * Take-it-home product recommendations specific to this service.
   * Renders as a "Continue the result at home" module on the service page.
   * Jena's actual pick-list per service. Drives cross-sell from booked
   * clients to product orders.
   */
  homeCareBundles?: {
    title: string;
    intro?: string;
    products: Array<{
      name: string;
      link: string;
      reason: string;
    }>;
  };
}

export interface ServiceCategoryData {
  slug: string;
  title: string;
  services: ServiceDetailData[];
}

export const serviceDetailData: ServiceCategoryData[] = [
  {
    slug: "smoothing",
    title: "Straight Up Smoothing Treatments",
    services: [
      {
        slug: "mid-length-straight-up-smoothing",
        title: "Mid-Length Straight Up Smoothing Treatment",
        tagline: "Natural hair smoothing that lasts for months",
        quickAnswer: "The Mid-Length Straight Up Smoothing treatment is a natural, eco-friendly hair smoothing service that turns frizzy hair into sleek, manageable results lasting 3–5 months. It includes deep cleansing, treatment application, heat activation, and professional blow-dry.",
        duration: "2h 20min",
        price: "A$ 324",
        description: "Turn frizzy, unmanageable hair into sleek, smooth hair with our mid-length Straight Up Smoothing treatment. This natural, eco-friendly treatment delivers salon-smooth results that last for months.",
        metaDescription: "Mid-length Straight Up Smoothing treatment in Bangor. Natural hair smoothing, 2h 20min, $324. Book your appointment with Jena at Hair Pinns.",
        whatsIncluded: [
          "Deep cleansing hair wash",
          "Natural smoothing treatment application",
          "Heat activation for lasting results",
          "Professional blow-dry and straighten",
          "Take-home hair mask to prolong results"
        ],
        whoItsFor: [
          "Anyone with frizzy or unmanageable mid-length hair",
          "Those wanting to reduce daily styling time",
          "People seeking a natural alternative to harsh chemicals",
          "Clients looking for long-lasting smoothness (3-5 months)"
        ],
        process: [
          {
            step: "Consultation & Cleanse",
            description: "We discuss your hair goals and thoroughly cleanse your hair to prep for the treatment."
          },
          {
            step: "Treatment Application",
            description: "The natural Straight Up formula is applied section by section, ensuring even coverage."
          },
          {
            step: "Seal & Style",
            description: "Heat is used to seal the treatment, followed by a professional blow-dry and straighten."
          }
        ],
        benefits: [
          "Eliminates frizz and flyaways",
          "Reduces blow-dry time by up to 70%",
          "Natural, eco-friendly ingredients",
          "Results last 3-5 months",
          "Hair feels soft, silky, and manageable",
          "Works on all hair types"
        ],
        faqs: [
          {
            question: "How long does the Straight Up Smoothing treatment last?",
            answer: "Typically 3-5 months depending on your hair type, maintenance routine, and how often you wash your hair. Using the take-home mask helps prolong results."
          },
          {
            question: "Can I colour my hair before or after this treatment?",
            answer: "Yes! We recommend colouring your hair at least one week before the smoothing treatment. You can also colour after, but wait at least 2 weeks."
          },
          {
            question: "Is this treatment safe for all hair types?",
            answer: "Absolutely! The Straight Up formula is natural and gentle, making it suitable for all hair types including colour-treated, fine, thick, or chemically-treated hair."
          },
          {
            question: "Will my hair be completely straight?",
            answer: "The treatment smooths and reduces frizz while maintaining your hair's natural body. It won't give you pin-straight hair like a relaxer, but it will be much more manageable and smooth."
          }
        ],
        relatedServices: [
          "long-thick-straight-up-smoothing",
          "straight-up-smoothing-teens",
          "superior-conditioning-treatment"
        ],
        homeCareBundles: {
          title: 'Keep your smoothing going for months at home',
          intro: "Sulphate-free aftercare is non-negotiable. Use this routine and you'll stretch the result to four to five months instead of two.",
          products: [
          { name: 'QIQI Bare Repair Oil', link: 'https://hairpinns.com/products/qiqi-bare-repair-oil', reason: 'Seals the cuticle after each wash. Five drops, mid-lengths to ends.' },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Daily finishing oil. Adds shine, fights humidity.' },
          { name: 'Pure Sacred Mask', link: 'https://hairpinns.com/products/pure-sacred-mask-hydrating-hair-treatment', reason: "Weekly deep hydration treatment. Use Sunday night, you'll feel the difference Monday." },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Non-negotiable before any heat tool. Sulphate-free aftercare means nothing if you fry it with a straightener.' }
          ]
        }
      },
      {
        slug: "long-thick-straight-up-smoothing",
        title: "Long/Thick Straight Up Smoothing Treatment",
        tagline: "Maximum smoothing power for long or thick hair",
        quickAnswer: "The Long/Thick Straight Up Smoothing treatment is designed for hair past shoulders or dense texture, delivering exceptional frizz reduction and lasting smoothness for 3–5 months. It uses extended application time and professional heat sealing for complete coverage.",
        duration: "2h 20min",
        price: "A$ 349",
        description: "For hair past your shoulders, or thick hair that eats a straightener in 20 minutes. Longer application time and full-heat coverage. Stays smooth for 3-5 months on most hair types — your morning routine drops to 'wash and walk out'.",
        metaDescription: "Long/thick hair Straight Up Smoothing in Bangor. Natural smoothing for thick or long hair, 2h 20min, $349. Book at Hair Pinns NSW.",
        whatsIncluded: [
          "Extended treatment time for thorough coverage",
          "Natural Straight Up smoothing formula",
          "Professional heat sealing process",
          "Luxury blow-dry and styling",
          "Premium take-home hair mask",
          "Aftercare guidance for best results"
        ],
        whoItsFor: [
          "Anyone with long hair (past shoulders)",
          "Those with thick, dense hair texture",
          "People with extremely frizzy or coarse hair",
          "Clients wanting maximum smoothing results"
        ],
        process: [
          {
            step: "Deep Cleanse",
            description: "A thorough cleansing removes all buildup, preparing your hair to absorb the treatment."
          },
          {
            step: "Strategic Application",
            description: "The treatment is applied in small sections to ensure every strand is covered, especially important for thick hair."
          },
          {
            step: "Heat Sealing & Styling",
            description: "Professional straightening seals in the treatment, followed by a beautiful blow-dry to show off the results."
          }
        ],
        benefits: [
          "Dramatic frizz reduction for thick hair",
          "Makes morning routine effortless",
          "Natural ingredients won't damage hair",
          "Lasts 3-5 months with proper care",
          "Leaves hair soft, shiny, and healthy",
          "Significant time-saving on daily styling"
        ],
        faqs: [
          {
            question: "Why is this treatment priced differently than mid-length?",
            answer: "Long or thick hair requires more product, more time, and more expertise to ensure every strand is properly treated. The price reflects the additional resources needed for beautiful results."
          },
          {
            question: "My hair is both long AND thick. Is this the right treatment?",
            answer: "Yes! This is specifically designed for hair that's long, thick, or both. We'll ensure complete coverage no matter how much hair you have."
          },
          {
            question: "Can I still tie my hair up after the treatment?",
            answer: "For the first 3 days, keep your hair down and avoid tying it up, using clips, or tucking behind your ears. After that, style as normal!"
          }
        ],
        relatedServices: [
          "mid-length-straight-up-smoothing",
          "long-hair-colour-package",
          "superior-conditioning-treatment"
        ],
        homeCareBundles: {
          title: 'Long and thick hair needs the full aftercare kit',
          intro: "Long thick hair drinks product. You'll get through more, but the math still wins. Salon smoothing plus this routine gives four to five months versus two months of just hoping.",
          products: [
          { name: 'QIQI Bare Repair Oil', link: 'https://hairpinns.com/products/qiqi-bare-repair-oil', reason: 'Seals the cuticle. Long hair needs more drops than mid-length, work it through evenly.' },
          { name: 'Juuce Super Soft Hydration Moisture Mask', link: 'https://hairpinns.com/products/juuce-super-soft-hydration-moisture-mask', reason: 'Weekly deep mask. Long hair loses moisture fastest at the ends, this puts it back.' },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Daily finishing oil. Sydney humidity test passed.' },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Heat protection is the difference between four months and ten weeks.' }
          ]
        }
      },
      {
        slug: "straight-up-smoothing-teens",
        title: "Straight Up Smoothing for Teens",
        tagline: "Perfect treatment to tame your teen's mane",
        quickAnswer: "Straight Up Smoothing for Teens is a gentle, natural smoothing treatment priced for ages 13–17, taming frizzy hair without harsh chemicals. Results last 3–5 months and reduce daily styling time for school.",
        duration: "2h 20min",
        price: "A$ 234",
        description: "A gentle, natural smoothing treatment specially priced for teens who want to manage frizzy hair without harsh chemicals. Perfect for school-age clients seeking easier, more manageable hair.",
        metaDescription: "Teen hair smoothing treatment Bangor. Natural frizz control for teens, 2h 20min, $234. Safe, gentle smoothing at Hair Pinns.",
        whatsIncluded: [
          "Teen-friendly consultation",
          "Gentle natural smoothing treatment",
          "Heat-activated sealing process",
          "Professional styling",
          "Take-home maintenance mask",
          "Tips for easy at-home care"
        ],
        whoItsFor: [
          "Teens aged 13-17 with frizzy hair",
          "Young clients wanting easier morning routines",
          "Parents seeking a safe, natural option",
          "Students preparing for formals or special events"
        ],
        process: [
          {
            step: "Friendly Consultation",
            description: "We chat about your hair goals and explain the whole process so you feel comfortable and excited."
          },
          {
            step: "Treatment Time",
            description: "The natural formula is applied while we chat about school, friends, or whatever you like! It's a relaxing experience."
          },
          {
            step: "Style & Go",
            description: "We finish with a beautiful blow-dry so you can see your smooth, gorgeous results immediately."
          }
        ],
        benefits: [
          "Faster morning routines before school",
          "Boosts confidence with smoother hair",
          "Natural, gentle ingredients",
          "Parents love the safety profile",
          "Results last through multiple school terms",
          "No harsh chemicals or strong fumes"
        ],
        faqs: [
          {
            question: "Is this treatment safe for teens?",
            answer: "Absolutely! The Straight Up formula is completely natural and eco-friendly with no harsh chemicals. It's perfectly safe for teens and we've treated countless young clients with fantastic results."
          },
          {
            question: "Will it damage my teenager's hair?",
            answer: "Not at all. In fact, teens often find their hair feels healthier after the treatment because it's enriched with natural oils and proteins."
          },
          {
            question: "How long before a school formal should we book this?",
            answer: "We recommend 1-2 weeks before the formal. This gives the treatment time to settle and your hair will be in perfect condition for styling on the big day."
          },
          {
            question: "Can my teen still play sports after the treatment?",
            answer: "Yes! After the first 3 days (when you should keep hair dry), your teen can return to all normal activities including swimming and sports."
          }
        ],
        relatedServices: [
          "high-school-formal-hairstyle",
          "mid-length-wash-cut-blowdry",
          "superior-conditioning-treatment"
        ],
        homeCareBundles: {
          title: 'Teen-friendly routine, parent-approved',
          intro: "I've tested everything I sell on my own teen clients and these are the four products that actually get used at home instead of sitting in the shower untouched.",
          products: [
          { name: 'QIQI Bare Repair Oil', link: 'https://hairpinns.com/products/qiqi-bare-repair-oil', reason: "A few drops after each wash. Teens love that it's not greasy and the bottle lasts." },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Daily smoothness. School mornings get easier.' },
          { name: 'Wet Brush Original Detangler', link: 'https://hairpinns.com/products/wet-brush-original-detangler', reason: 'Detangles wet hair without breaking. Teen hair is more fragile than people think.' },
          { name: 'Pure Precious Ends', link: 'https://hairpinns.com/products/pure-precious-ends-leave-in-treatment', reason: 'Leave-in for the ends. Stops the split-end cycle so cuts last longer between trims.' }
          ]
        }
      }
    ]
  },
  {
    slug: "foil-packages",
    title: "Foil Packages",
    services: [
      {
        slug: "full-head-foils-package",
        title: "Full Head of Foils Package",
        tagline: "Complete blonde transformation with cut & style",
        quickAnswer: "The Full Head of Foils package includes a full head of foil highlights, precision cut, and professional blow-dry for a complete blonde transformation. Typically takes 2h 45min and is ideal for dramatic lightening or all-over dimension.",
        duration: "2h 45min",
        price: "A$ 267",
        description: "Our signature blonde package combining a full head of foils, precision cut, and professional blow-dry. Transform your look with dimensional highlights that add depth, brightness, and that sun-kissed glow.",
        metaDescription: "Full head foils package Bangor. Blonde highlights with cut & blow-dry, 2h 45min, $267. Expert colour by Jena at Hair Pinns NSW.",
        whatsIncluded: [
          "Full head of foil highlights",
          "Custom colour consultation",
          "Precision style cut",
          "Professional blow-dry and styling",
          "Toner application if needed",
          "Aftercare advice and product recommendations"
        ],
        whoItsFor: [
          "Anyone wanting a dramatic blonde transformation",
          "Those seeking all-over dimension and brightness",
          "Clients who want a complete salon experience",
          "People looking to go significantly lighter"
        ],
        process: [
          {
            step: "Colour Consultation",
            description: "We discuss your desired blonde shade and create a custom plan for your hair."
          },
          {
            step: "Foiling & Processing",
            description: "Carefully placed foils throughout your entire head create beautiful dimensional colour."
          },
          {
            step: "Cut, Tone & Style",
            description: "After colour, we cut your hair to perfection, apply toner if needed, and style you to leave looking amazing."
          }
        ],
        benefits: [
          "Complete hair transformation in one visit",
          "Dimensional colour that looks natural",
          "Expertly placed highlights frame your face",
          "All-inclusive package saves time",
          "Professional colour-safe products used",
          "Leave with freshly cut and styled hair"
        ],
        faqs: [
          {
            question: "How often should I get a full head of foils?",
            answer: "Typically every 8-12 weeks depending on your natural colour and how fast your hair grows. Blondes usually need more frequent maintenance."
          },
          {
            question: "Will my hair be damaged?",
            answer: "With proper care and Jena's expert technique, damage is minimal. We use quality products and recommend a deep conditioning treatment to keep hair healthy."
          },
          {
            question: "Can I go from dark to blonde in one session?",
            answer: "It depends on your starting colour. Sometimes dramatic lightening needs multiple sessions to maintain hair health. We'll create a realistic plan during consultation."
          }
        ],
        relatedServices: [
          "half-head-foils-cut-blowdry",
          "long-hair-colour-package",
          "superior-conditioning-treatment"
        ],
        homeCareBundles: {
          title: 'Lock in your blonde at home',
          intro: 'Full head foils are an investment. The aftercare routine is what makes them last six to eight months instead of fading brassy in six weeks.',
          products: [
          { name: 'Pure Forever Blonde Shampoo', link: 'https://hairpinns.com/products/pure-forever-blonde-shampoo', reason: 'Use twice a week to neutralise brass. Not every wash, that turns hair purple.' },
          { name: 'Pure Forever Blonde Conditioner', link: 'https://hairpinns.com/products/pure-forever-blonde-conditioner', reason: 'The matching half. Always use the conditioner after the purple shampoo.' },
          { name: 'Juuce Bond Repair Shampoo', link: 'https://hairpinns.com/products/juuce-bond-repair-shampoo', reason: "Daily wash on the days you're not using purple. Rebuilds what the foil work broke." },
          { name: 'Juuce Solar Enz', link: 'https://hairpinns.com/products/juuce-protect-solar-enz', reason: 'UV protection leave-in. Without this, the sun pulls your blonde to brass in two weekends.' }
          ]
        }
      },
      {
        slug: "half-head-foils-cut-blowdry",
        title: "1/2 Head of Foils, Cut & Blow-dry",
        tagline: "Beautiful dimension with the perfect package",
        quickAnswer: "The 1/2 Head of Foils package combines face-framing highlights on the crown and top sections with a style cut and blow-dry. Perfect for maintaining existing blonde or adding subtle brightness in one 2h 15min appointment.",
        duration: "2h 15min",
        price: "A$ 237",
        description: "The Spice Up package combines half-head highlights with a style cut and blow-dry for a fresh, dimensional look. Perfect for maintaining brightness around the face or adding subtle highlights.",
        metaDescription: "Half head foils Bangor. Highlights with cut & blow-dry, 2h 15min, $237. Book your Spice Up package at Hair Pinns NSW.",
        whatsIncluded: [
          "1/2 head of strategically placed foils",
          "Colour consultation and formulation",
          "Precision style cut",
          "Relaxing shampoo and conditioning",
          "Professional blow-dry",
          "Colour care guidance"
        ],
        whoItsFor: [
          "Anyone wanting face-framing highlights",
          "Those maintaining existing blonde",
          "Clients seeking subtle brightness",
          "People wanting an all-in-one pampering session"
        ],
        process: [
          {
            step: "Strategic Planning",
            description: "We determine the best placement for foils to brighten your face and complement your features."
          },
          {
            step: "Highlight Application",
            description: "Foils are placed where they'll have maximum impact, usually around the face, crown, and top sections."
          },
          {
            step: "Cut & Finish",
            description: "Your hair is cut to enhance your style, then blow-dried to perfection so you leave feeling fabulous."
          }
        ],
        benefits: [
          "Lower maintenance than full head",
          "Face-framing brightness",
          "Perfect for subtle changes",
          "Complete service in one appointment",
          "Great for colour maintenance",
          "Natural-looking dimension"
        ],
        faqs: [
          {
            question: "What's the difference between half head and full head foils?",
            answer: "Half head focuses on the crown and face-framing areas, while full head covers your entire head. Half head is perfect for maintaining existing colour or adding subtle brightness."
          },
          {
            question: "Can I get a half head if I've never had highlights before?",
            answer: "Absolutely! Half head is a great starting point to try highlights without committing to a full head."
          }
        ],
        relatedServices: [
          "full-head-foils-package",
          "quarter-head-foils-cut-blowdry",
          "mid-length-colour-package"
        ],
        homeCareBundles: {
          title: 'Same routine as full head, fewer foils to maintain',
          intro: "Half head foils need the same aftercare attention as a full head. Use this routine and you'll stretch your gap between appointments by two to four weeks.",
          products: [
          { name: 'Pure Forever Blonde Shampoo & Conditioner', link: 'https://hairpinns.com/collections/pure-certified-organic-hair-care', reason: 'Twice-weekly purple shampoo and conditioner combo. Keeps tone cool.' },
          { name: 'Juuce Bond Repair Shampoo', link: 'https://hairpinns.com/products/juuce-bond-repair-shampoo', reason: 'Daily wash. Rebuilds bonds the foiling work broke.' },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Before every blow-dry or straightener. Non-negotiable on lightened hair.' },
          { name: 'Juuce Solar Enz', link: 'https://hairpinns.com/products/juuce-protect-solar-enz', reason: "UV defence so summer doesn't undo your colour appointment." }
          ]
        }
      },
      {
        slug: "quarter-head-foils-cut-blowdry",
        title: "1/4 Head Foils, Cut & Blow-dry",
        tagline: "Subtle enhancement for a fresh look",
        quickAnswer: "The 1/4 Head Foils package includes strategically placed highlights around the face and parting, plus a cut and blow-dry. Ideal for maintenance or subtle face-framing brightness in about 2h 15min.",
        duration: "2h 15min",
        price: "A$ 202",
        description: "Perfect for maintenance or adding just a touch of brightness, this package includes strategically placed quarter-head foils, a precision cut, and beautiful blow-dry.",
        metaDescription: "Quarter head foils Bangor. Subtle highlights with cut & blow-dry, 2h 15min, $202. Face-framing colour at Hair Pinns NSW.",
        whatsIncluded: [
          "1/4 head of precision foils",
          "Custom colour placement",
          "Professional haircut",
          "Relaxing wash and conditioning",
          "Styled blow-dry",
          "Maintenance advice"
        ],
        whoItsFor: [
          "Clients maintaining existing highlights",
          "Those wanting subtle face-framing brightness",
          "Anyone on a budget but wanting quality colour",
          "People with naturally light hair needing a touch-up"
        ],
        process: [
          {
            step: "Precision Placement",
            description: "We carefully select the most impactful areas for foils, typically around the face and parting."
          },
          {
            step: "Colour Development",
            description: "While your colour processes, you can relax with a magazine and a cuppa."
          },
          {
            step: "Cut & Style",
            description: "Fresh cut and blow-dry complete your transformation with a polished, put-together look."
          }
        ],
        benefits: [
          "Budget-friendly colour option",
          "Minimal maintenance required",
          "Quick refresh for existing colour",
          "Naturally brightens your face",
          "Complete package with cut included",
          "Less time commitment than larger services"
        ],
        faqs: [
          {
            question: "Is quarter head enough for a noticeable difference?",
            answer: "Yes! When placed strategically around the face and part, quarter head foils create beautiful brightness where it matters most."
          },
          {
            question: "How often should I get quarter head foils?",
            answer: "Every 10-14 weeks is typical, though it depends on your hair growth and natural colour."
          }
        ],
        relatedServices: [
          "half-head-foils-cut-blowdry",
          "toner",
          "short-hair-colour-package"
        ],
        homeCareBundles: {
          title: 'Quarter head is light maintenance, but still maintenance',
          intro: 'Quarter head foils need less aftercare than a full head, but you still want to protect what you paid for. These three are the core kit.',
          products: [
          { name: 'Pure Forever Blonde Shampoo & Conditioner', link: 'https://hairpinns.com/collections/pure-certified-organic-hair-care', reason: 'Once a week is enough for quarter head foils. Tones the brightened pieces.' },
          { name: 'Juuce Radiant Colour Shampoo', link: 'https://hairpinns.com/products/juuce-radiant-colour-shampoo', reason: 'Your daily wash. Locks in colour and slows fade.' },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Before every heat tool. Quarter head foil pieces fade fastest if you skip this.' }
          ]
        }
      }
    ]
  },
  {
    slug: "colouring-packages",
    title: "Colouring Packages",
    services: [
      {
        slug: "long-hair-colour-package",
        title: "Long Hair Colour Package",
        tagline: "Complete colour transformation for long locks",
        quickAnswer: "The Long Hair Colour Package includes regrowth or full colour, precision cut, deep conditioning, and blow-dry for hair past shoulders. A complete colour refresh in one 2h 30min appointment.",
        duration: "2h 30min",
        price: "A$ 205",
        description: "Freshen up your look with regrowth or full colour, plus a cut and blowdry for women with long hair. Enjoy a complete service designed especially for long-haired clients.",
        metaDescription: "Long hair colour package Bangor. Full colour or regrowth with cut & blow-dry, 2h 30min, $205. Transform your long hair at Hair Pinns.",
        whatsIncluded: [
          "Regrowth or full head colour",
          "Colour consultation and formulation",
          "Precision cut for long hair",
          "Deep conditioning treatment",
          "Professional blow-dry and styling",
          "Colour care recommendations"
        ],
        whoItsFor: [
          "Women with long hair past shoulders",
          "Those covering grey or changing colour",
          "Anyone wanting a complete refresh",
          "Clients maintaining existing colour"
        ],
        process: [
          {
            step: "Colour Consultation",
            description: "We discuss your colour goals and create the perfect shade for you."
          },
          {
            step: "Application & Processing",
            description: "Colour is carefully applied to regrowth or full head, depending on your needs."
          },
          {
            step: "Cut, Condition & Style",
            description: "Hair is cut, deeply conditioned, and blow-dried to perfection."
          }
        ],
        benefits: [
          "Complete colour service in one visit",
          "Professional colour-safe products",
          "Covers grey completely",
          "Long-lasting, vibrant results",
          "Leaves hair soft and shiny",
          "All-inclusive package"
        ],
        faqs: [
          {
            question: "How often should I colour my long hair?",
            answer: "Every 6-8 weeks for regrowth touch-ups, or 10-12 weeks for full colour refresh depending on your natural growth rate."
          },
          {
            question: "Will colouring damage my long hair?",
            answer: "With quality products and proper aftercare, damage is minimal. We include a deep conditioning treatment and recommend colour-safe products."
          }
        ],
        relatedServices: [
          "mid-length-colour-package",
          "long-thick-straight-up-smoothing",
          "superior-conditioning-treatment"
        ],
        homeCareBundles: {
          title: 'Long colour needs long-term protection',
          intro: 'Long hair holds a lot of colour and loses it fastest. The right wash routine doubles the time between top-ups.',
          products: [
          { name: 'Juuce Radiant Colour Shampoo', link: 'https://hairpinns.com/products/juuce-radiant-colour-shampoo', reason: 'Daily wash. Locks in colour, slows fade, smells incredible.' },
          { name: 'Juuce Radiant Colour Conditioner', link: 'https://hairpinns.com/products/juuce-radiant-colour-conditioner', reason: 'Matched conditioner. Always pair the two, not with anything else.' },
          { name: 'Pure Precious Ends', link: 'https://hairpinns.com/products/pure-precious-ends-leave-in-treatment', reason: 'Leave-in for long hair ends. Stops the split-end cycle so cuts last longer.' },
          { name: 'Pure Sacred Mask', link: 'https://hairpinns.com/products/pure-sacred-mask-hydrating-hair-treatment', reason: 'Weekly Sunday-night ritual. Colour-treated long hair drinks moisture.' }
          ]
        }
      },
      {
        slug: "mid-length-colour-package",
        title: "Mid-Length Colour Package",
        tagline: "Perfect colour for mid-length hair",
        quickAnswer: "The Mid-Length Colour Package combines regrowth or full colour with a style cut and blow-dry for shoulder-length hair. A complete colour refresh in one 2h 15min appointment.",
        duration: "2h 15min",
        price: "A$ 178",
        description: "Regrowth or full colour, cut and blowdry for mid length hair. A complete package that refreshes your colour and style in one appointment.",
        metaDescription: "Mid-length colour package Bangor. Regrowth or full colour with cut & blow-dry, 2h 15min, $178. Book at Hair Pinns NSW.",
        whatsIncluded: [
          "Regrowth or full colour application",
          "Custom colour matching",
          "Style cut",
          "Conditioning treatment",
          "Professional blow-dry",
          "Aftercare advice"
        ],
        whoItsFor: [
          "Anyone with shoulder-length hair",
          "Those maintaining current colour",
          "Clients covering grey roots",
          "People wanting a colour refresh"
        ],
        process: [
          {
            step: "Consultation",
            description: "We determine whether you need regrowth or full colour and select your perfect shade."
          },
          {
            step: "Colour Application",
            description: "Professional colour is applied to achieve even, beautiful results."
          },
          {
            step: "Finish & Style",
            description: "Fresh cut and blow-dry complete your transformation."
          }
        ],
        benefits: [
          "Great value all-in-one package",
          "Even colour coverage",
          "Fresh cut included",
          "Saves time with combined services",
          "Professional results",
          "Leaves hair healthy and shiny"
        ],
        faqs: [
          {
            question: "What's the difference between regrowth and full colour?",
            answer: "Regrowth covers new growth at the roots only. Full colour refreshes your entire head. We'll recommend which is best during consultation."
          },
          {
            question: "Can I change my colour completely?",
            answer: "Yes! During consultation we'll discuss the best approach for your desired colour, whether subtle or dramatic."
          }
        ],
        relatedServices: [
          "long-hair-colour-package",
          "short-hair-colour-package",
          "half-head-foils-cut-blowdry"
        ],
        homeCareBundles: {
          title: 'Mid-length colour routine',
          intro: 'Mid-length hair is the sweet spot. Easier to maintain than long, more product than short. This routine keeps your colour looking salon-fresh for weeks.',
          products: [
          { name: 'Juuce Radiant Colour Shampoo & Conditioner', link: 'https://hairpinns.com/collections/juuce-botanicals', reason: 'Daily routine. Always use the matching pair.' },
          { name: 'Pure Sacred Mask', link: 'https://hairpinns.com/products/pure-sacred-mask-hydrating-hair-treatment', reason: 'Weekly hydration mask. Colour-treated mid-length hair benefits hugely.' },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Daily finishing oil. Adds the shine that makes new colour look new.' }
          ]
        }
      },
      {
        slug: "short-hair-colour-package",
        title: "Short Hair Colour Package",
        tagline: "Quick colour refresh for short styles",
        quickAnswer: "The Short Hair Colour Package includes regrowth or full colour, precision cut, and styled finish for hair above shoulders. Ideal for pixie cuts, bobs, and short styles in about 2h 15min.",
        duration: "2h 15min",
        price: "A$ 184",
        description: "Regrowth or full colour cut and blowdry for short hair. Perfect for maintaining your short style with fresh, vibrant colour.",
        metaDescription: "Short hair colour package Bangor. Regrowth or full colour with cut & blow-dry, 2h 15min, $184. Quick colour at Hair Pinns.",
        whatsIncluded: [
          "Regrowth or full colour",
          "Colour consultation",
          "Precision short haircut",
          "Conditioning treatment",
          "Styled blow-dry or finish",
          "Product recommendations"
        ],
        whoItsFor: [
          "Anyone with short hair (above shoulders)",
          "Those maintaining a short style",
          "Clients wanting efficient colour service",
          "People with quick-growing greys"
        ],
        process: [
          {
            step: "Quick Consultation",
            description: "We assess your regrowth and discuss your colour needs."
          },
          {
            step: "Colour Application",
            description: "Efficient colour application for short hair ensures even coverage."
          },
          {
            step: "Cut & Style",
            description: "Precision cut and professional finish complete your look."
          }
        ],
        benefits: [
          "Perfect for short styles",
          "Less product needed",
          "Quick processing time",
          "Complete service package",
          "Refreshes cut and colour together",
          "Great value"
        ],
        faqs: [
          {
            question: "How often do I need to colour short hair?",
            answer: "Typically every 4-6 weeks as short hair shows regrowth more quickly, especially with lighter colours or grey coverage."
          },
          {
            question: "Is this suitable for pixie cuts?",
            answer: "Absolutely! This package is perfect for pixie, bob, and other short styles."
          }
        ],
        relatedServices: [
          "mid-length-colour-package",
          "quarter-head-foils-cut-blowdry",
          "short-wash-cut-blowdry"
        ],
        homeCareBundles: {
          title: 'Short colour, minimal maintenance, maximum vibrancy',
          intro: "Short colour-treated hair is the easiest to maintain, which is good because you're cutting it more often. Keep it simple, keep it consistent.",
          products: [
          { name: 'Juuce Radiant Colour Shampoo & Conditioner', link: 'https://hairpinns.com/collections/juuce-botanicals', reason: 'Daily routine. Locks in tone, slows fade.' },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Tiny amount on the ends after each blow-dry.' },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Short hair gets styled more. Heat protection matters even more.' }
          ]
        }
      }
    ]
  },
  {
    slug: "cut-packages",
    title: "Cut & Blow-dry Packages",
    services: [
      {
        slug: "long-hair-wash-cut-blowdry",
        title: "Long Hair Wash, Cut & Blow-dry",
        tagline: "Pampered experience for beautiful long hair",
        quickAnswer: "Long Hair Wash, Cut & Blow-dry includes a luxurious wash with scalp massage, precision cut, and professional blow-dry for hair past shoulders. The full refresh takes about 1h 15min.",
        duration: "1h 15min",
        price: "A$ 99",
        description: "The ultimate refresh for long hair. Enjoy a relaxing wash, precision cut, and professional blow-dry that leaves your long locks looking absolutely gorgeous.",
        metaDescription: "Long hair cut & blow-dry Bangor. Wash, precision cut, professional styling, 1h 15min, $99. Book at Hair Pinns NSW.",
        whatsIncluded: [
          "Luxurious hair wash with scalp massage",
          "Deep conditioning treatment",
          "Precision cut maintaining length or reshaping",
          "Professional blow-dry and styling",
          "Style advice for at-home maintenance"
        ],
        whoItsFor: [
          "Anyone with hair past shoulders",
          "Those wanting to maintain healthy long hair",
          "Clients needing regular trims",
          "People seeking a pampering experience"
        ],
        process: [
          {
            step: "Relaxing Wash",
            description: "Enjoy a thorough cleanse with scalp massage and conditioning."
          },
          {
            step: "Precision Cutting",
            description: "We carefully trim split ends or reshape your style while maintaining length."
          },
          {
            step: "Professional Styling",
            description: "Beautiful blow-dry that showcases your healthy, freshly cut hair."
          }
        ],
        benefits: [
          "Maintains long hair health",
          "Removes split ends",
          "Adds shape and movement",
          "Relaxing scalp massage included",
          "Professional styling tips",
          "Leave feeling pampered"
        ],
        faqs: [
          {
            question: "How much length will be cut?",
            answer: "That's entirely up to you! During consultation we'll discuss whether you want a trim, reshape, or more dramatic cut."
          },
          {
            question: "How often should I get my long hair cut?",
            answer: "Every 8-12 weeks to maintain health and prevent split ends from traveling up the hair shaft."
          }
        ],
        relatedServices: [
          "mid-length-wash-cut-blowdry",
          "long-hair-colour-package",
          "superior-conditioning-treatment"
        ],
        homeCareBundles: {
          title: 'Make this blow-dry last days, not hours',
          intro: 'A salon blow-dry should look fresh for three to four days. This take-home kit is what makes that possible.',
          products: [
          { name: 'Pure Lamellar Vitality Shampoo & Conditioner', link: 'https://hairpinns.com/collections/pure-certified-organic-hair-care', reason: 'Lightweight daily wash. My number one pick for any hair type.' },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Before any styling. Long hair is fragile at the ends, heat shield is mandatory.' },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Mid-lengths to ends. Smooths, shines, controls flyaways.' },
          { name: 'Pure Precious Ends', link: 'https://hairpinns.com/products/pure-precious-ends-leave-in-treatment', reason: 'Leave-in for the ends. Stops splits so your cut lasts ten weeks instead of six.' }
          ]
        }
      },
      {
        slug: "mid-length-wash-cut-blowdry",
        title: "Mid-Length Wash, Cut & Blow-dry",
        tagline: "Perfect trim and style for mid-length hair",
        quickAnswer: "Mid-Length Wash, Cut & Blow-dry includes cleansing shampoo, nourishing conditioner, style cut, and professional blow-dry for shoulder-length hair. A complete refresh in about 1 hour.",
        duration: "1h",
        price: "A$ 89",
        description: "Complete hair service for shoulder-length hair. Includes relaxing wash, precision cut, and beautiful blow-dry.",
        metaDescription: "Mid-length cut & blow-dry Bangor. Wash, cut, styling for shoulder-length hair, 1h, $89. Book at Hair Pinns.",
        whatsIncluded: [
          "Cleansing shampoo with massage",
          "Nourishing conditioner",
          "Style cut or trim",
          "Professional blow-dry",
          "Styling recommendations"
        ],
        whoItsFor: [
          "Anyone with shoulder-length hair",
          "Those maintaining a mid-length style",
          "Clients needing regular maintenance",
          "People wanting a refresh"
        ],
        process: [
          {
            step: "Wash & Condition",
            description: "Relaxing cleanse prepares your hair for cutting."
          },
          {
            step: "Precision Cut",
            description: "We shape your mid-length hair to perfection."
          },
          {
            step: "Style & Finish",
            description: "Beautiful blow-dry brings out the best in your new cut."
          }
        ],
        benefits: [
          "Maintains perfect mid-length",
          "Removes damaged ends",
          "Adds body and shape",
          "Quick yet thorough",
          "Great value service",
          "Professional results"
        ],
        faqs: [
          {
            question: "Can I change my style during this service?",
            answer: "Absolutely! We can discuss any style changes you'd like during the consultation before cutting."
          }
        ],
        relatedServices: [
          "long-hair-wash-cut-blowdry",
          "short-wash-cut-blowdry",
          "mid-length-colour-package"
        ],
        homeCareBundles: {
          title: 'Daily routine for fresh-cut mid-length',
          intro: 'Mid-length hair is the most versatile. Get the daily routine right and your cut keeps its shape for eight weeks easy.',
          products: [
          { name: 'Pure Lamellar Vitality Shampoo & Conditioner', link: 'https://hairpinns.com/collections/pure-certified-organic-hair-care', reason: 'Daily lightweight wash. Works for almost every hair type.' },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Before any heat tool. The single most underused product in most bathrooms.' },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Two pumps before blow-drying. Adds shine and stops frizz.' }
          ]
        }
      },
      {
        slug: "short-wash-cut-blowdry",
        title: "Short Wash, Cut & Blow-dry",
        tagline: "Keep your short style sharp and fresh",
        quickAnswer: "Short Wash, Cut & Blow-dry includes thorough wash, precision short haircut, and styled finish. Ideal for pixie cuts, bobs, and short styles. About 1 hour.",
        duration: "1h",
        price: "A$ 79",
        description: "Maintain your short hairstyle with a professional wash, precision cut, and styled finish.",
        metaDescription: "Short hair cut & blow-dry Bangor. Quick wash, precision cut, styling, 1h, $79. Maintain your short style at Hair Pinns.",
        whatsIncluded: [
          "Thorough hair wash",
          "Conditioning treatment",
          "Precision short haircut",
          "Styled blow-dry or finish",
          "Maintenance advice"
        ],
        whoItsFor: [
          "Anyone with short hair above shoulders",
          "Those with pixie cuts or bobs",
          "Clients needing frequent trims",
          "People wanting to maintain their shape"
        ],
        process: [
          {
            step: "Cleanse",
            description: "Quick, efficient wash prepares hair for cutting."
          },
          {
            step: "Precision Cutting",
            description: "We maintain or refine your short style shape."
          },
          {
            step: "Finish",
            description: "Professional styling showcases your fresh cut."
          }
        ],
        benefits: [
          "Maintains short style shape",
          "Quick turnaround time",
          "Professional precision",
          "Great for frequent trims",
          "Affordable maintenance",
          "Leave looking sharp"
        ],
        faqs: [
          {
            question: "How often should I get my short hair cut?",
            answer: "Every 4-6 weeks to maintain the shape and style of short haircuts."
          }
        ],
        relatedServices: [
          "mid-length-wash-cut-blowdry",
          "short-hair-colour-package",
          "kids-cut-blowdry-bundle"
        ],
        homeCareBundles: {
          title: 'Short hair routine, no fuss',
          intro: 'Short hair is low maintenance but you still want it looking fresh. Three products, two minutes a day.',
          products: [
          { name: 'Pure Lamellar Vitality Shampoo & Conditioner', link: 'https://hairpinns.com/collections/pure-certified-organic-hair-care', reason: "Lightweight daily wash. Doesn't weigh down short styles." },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Before any styling. Short hair gets styled often, heat shield is the difference between healthy and fried.' },
          { name: 'Tame Texture Wax Stick', link: 'https://hairpinns.com/products/tame-texture-wax-stick', reason: 'Finish stick for control on shorter styles. Tiny amount, big difference.' }
          ]
        }
      },
      {
        slug: "kids-cut-blowdry-bundle",
        title: "Kids Cut & Blow-dry Bundle",
        tagline: "Pamper your kids with a professional salon experience",
        quickAnswer: "The Kids Cut & Blow-dry Bundle includes deep cleanse shampoo, relaxing head massage, conditioner, haircut, and blow-dry. A kid-friendly salon experience in about 40 minutes.",
        duration: "40min",
        price: "A$ 54",
        description: "Pamper your kids with a deep cleanse shampoo, relaxing head massage and condition paired with a haircut and blowdry.",
        metaDescription: "Kids haircut & blow-dry Bangor. Fun salon experience with massage, cut, styling, 40min, $54. Hair Pinns NSW.",
        whatsIncluded: [
          "Deep cleanse shampoo",
          "Relaxing head massage",
          "Nourishing conditioner",
          "Age-appropriate haircut",
          "Fun blow-dry styling"
        ],
        whoItsFor: [
          "Kids who need regular haircuts",
          "Parents wanting a salon experience for children",
          "Kids preparing for special events",
          "Children who enjoy being pampered"
        ],
        process: [
          {
            step: "Fun Wash Time",
            description: "Gentle cleanse with scalp massage makes washing fun."
          },
          {
            step: "Kid-Friendly Cutting",
            description: "Patient, careful cutting while keeping kids comfortable."
          },
          {
            step: "Style & Smile",
            description: "Fun blow-dry that makes them feel special."
          }
        ],
        benefits: [
          "Kid-friendly environment",
          "Removes scalp buildup",
          "Knot-free smooth hair",
          "Teaches good hair care",
          "Professional results",
          "Makes haircuts enjoyable"
        ],
        faqs: [
          {
            question: "What age is this suitable for?",
            answer: "This package is perfect for kids of all ages who can sit comfortably in the salon chair."
          },
          {
            question: "My child gets nervous at the salon. Can you help?",
            answer: "Absolutely! Jena is experienced with kids and creates a calm, friendly environment. We go at your child's pace."
          }
        ],
        relatedServices: [
          "primary-formal-hairstyle",
          "high-school-formal-hairstyle",
          "kids-blowdry"
        ],
        homeCareBundles: {
          title: 'Make wash day easier for everyone',
          intro: 'Kids hair gets tangled fast and nobody enjoys morning brush fights. These three are the ones I send home with every kid client.',
          products: [
          { name: 'Wet Brush Kids Detangler', link: 'https://hairpinns.com/products/wet-brush-kids-detangler', reason: 'Detangles wet hair without breaking. The end of brush-time tears.' },
          { name: 'Juuce Knot Knotty Detangler', link: 'https://hairpinns.com/products/juuce-knot-knotty-detangler', reason: 'Spray-in detangler. Spritz it on wet or dry hair before the brush comes out.' },
          { name: 'Pure Precious Ends', link: 'https://hairpinns.com/products/pure-precious-ends-leave-in-treatment', reason: 'Leave-in for ends. Stops the split-end cycle that means cuts every six weeks.' }
          ]
        }
      }
    ]
  },
  {
    slug: "kids-formal",
    title: "Kids Formal Hairstyles",
    services: [
      {
        slug: "primary-formal-hairstyle",
        title: "Primary Formal Hairstyle",
        tagline: "Make their special day unforgettable",
        quickAnswer: "Primary Formal Hairstyle is professional styling for primary school formals. Curls, braids, or upstyles with strong-hold finish. Age-appropriate looks that last through the event, about 45 minutes.",
        duration: "45min",
        price: "A$ 59",
        description: "Beautiful formal styling for primary school events. We create age-appropriate, long-lasting styles that make kids feel special.",
        metaDescription: "Primary school formal hair Bangor. Kids formal hairstyling, 45min, $59. Special occasion hair at Hair Pinns NSW.",
        whatsIncluded: [
          "Style consultation with child and parent",
          "Hair preparation and styling",
          "Curls, braids, or upstyle as desired",
          "Accessories placement (if provided)",
          "Strong-hold finish for long-lasting style"
        ],
        whoItsFor: [
          "Kids attending primary school formals",
          "Special occasions like communions or parties",
          "Children wanting to feel grown-up",
          "Parents seeking professional styling"
        ],
        process: [
          {
            step: "Style Planning",
            description: "We discuss style ideas with you and your child to pick the perfect look."
          },
          {
            step: "Hair Preparation",
            description: "Hair is prepped and ready for styling with appropriate products."
          },
          {
            step: "Creating Magic",
            description: "Beautiful styling brings the chosen look to life."
          }
        ],
        benefits: [
          "Age-appropriate formal styles",
          "Lasts through the whole event",
          "Makes kids feel special",
          "Professional quality",
          "Parent-approved looks",
          "Photo-ready results"
        ],
        faqs: [
          {
            question: "Should we book a trial before the formal?",
            answer: "It's not essential for primary formals, but if your child has a very specific look in mind, a trial can be arranged."
          },
          {
            question: "Can we bring hair accessories?",
            answer: "Absolutely! Bring any ribbons, flowers, or clips you'd like incorporated into the style."
          },
          {
            question: "How long before the event should we book?",
            answer: "Aim to have hair done 1-2 hours before the event for best results."
          }
        ],
        relatedServices: [
          "high-school-formal-hairstyle",
          "kids-cut-blowdry-bundle",
          "custom-braided-hairstyle"
        ],
        homeCareBundles: {
          title: 'Hold the style without the crunch',
          intro: 'Formal hair has to last through dancing, photos, and a bus ride home. These three products do the work without making hair feel like a helmet.',
          products: [
          { name: 'Juuce Stuck Up Lacquer', link: 'https://hairpinns.com/products/juuce-stuck-up-lacquer', reason: 'Flexible hairspray that holds without crunch. Brushes out clean at the end of the night.' },
          { name: 'Wet Brush Original Detangler', link: 'https://hairpinns.com/products/wet-brush-original-detangler', reason: 'Brush out the style after the event without breaking hair.' },
          { name: 'Pure Precious Ends', link: 'https://hairpinns.com/products/pure-precious-ends-leave-in-treatment', reason: 'Leave-in on the ends the day before. Smooths and shines so up-styles look polished.' }
          ]
        }
      },
      {
        slug: "high-school-formal-hairstyle",
        title: "High School Formal Hairstyle",
        tagline: "Stunning formal hair for your special night",
        quickAnswer: "High School Formal Hairstyle includes consultation, professional prep, advanced styling (upstyle, curls, braids), and long-lasting hold. Stunning results that photograph beautifully. About 1 hour. Trial recommended.",
        duration: "1h",
        price: "A$ 69",
        description: "Sophisticated formal styling for high school formals and special events. We create stunning, long-lasting looks that photograph beautifully.",
        metaDescription: "High school formal hair Bangor. Teen formal hairstyling, upstyles, curls, 1h, $69. Book formal hair at Hair Pinns.",
        whatsIncluded: [
          "Detailed style consultation",
          "Professional hair preparation",
          "Advanced styling (upstyle, curls, braids)",
          "Accessory placement and finishing",
          "Long-lasting hold products",
          "Styling photos for memory"
        ],
        whoItsFor: [
          "High school students attending formals",
          "Teens going to special events",
          "Young adults wanting sophisticated styles",
          "Anyone seeking professional formal hair"
        ],
        process: [
          {
            step: "Detailed Consultation",
            description: "We look at inspiration photos and plan your dream formal hair."
          },
          {
            step: "Hair Prep & Base",
            description: "Hair is prepared with products that ensure long-lasting hold."
          },
          {
            step: "Creating Your Look",
            description: "Careful styling brings your vision to life with professional techniques."
          }
        ],
        benefits: [
          "Sophisticated, mature styling",
          "Lasts through dancing and photos",
          "Photograph beautifully",
          "Complementary to dress and makeup",
          "Professional techniques",
          "Confidence-boosting results"
        ],
        faqs: [
          {
            question: "Should I book a trial?",
            answer: "Highly recommended! A trial 1-2 weeks before ensures we perfect your look and you feel confident."
          },
          {
            question: "Can I bring inspiration photos?",
            answer: "Please do! Bring photos of styles you love so we can create something perfect for you."
          },
          {
            question: "Will my hair stay all night?",
            answer: "Yes! We use professional products and techniques to ensure your style stays perfect through the entire event."
          },
          {
            question: "When should I book for my formal?",
            answer: "Book as early as possible, especially during formal season (May-November). Last-minute bookings can be accommodated when possible."
          }
        ],
        relatedServices: [
          "straight-up-smoothing-teens",
          "primary-formal-hairstyle",
          "wedding-pp"
        ],
        homeCareBundles: {
          title: 'Formal-night kit that survives the dance floor',
          intro: 'School formals are five-hour events with a lot of movement. This kit holds the style and keeps hair healthy through it.',
          products: [
          { name: 'Juuce Stuck Up Lacquer', link: 'https://hairpinns.com/products/juuce-stuck-up-lacquer', reason: 'The hold without the crunch. Brushable, photo-friendly, no helmet hair.' },
          { name: 'Juuce Heat Shield', link: 'https://hairpinns.com/products/juuce-heat-shield', reason: 'Before any curling or straightening on formal day. Protect the colour you paid for.' },
          { name: 'Juuce Botanic Oil Serum', link: 'https://hairpinns.com/products/juuce-botanic-oil-serum', reason: 'Mid-lengths to ends after styling. Photo-ready shine.' },
          { name: 'Wet Brush Original Detangler', link: 'https://hairpinns.com/products/wet-brush-original-detangler', reason: "For the morning-after brush-out. Easier than you'd expect." }
          ]
        }
      }
    ]
  }
];
