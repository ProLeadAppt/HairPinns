// Service detail data for dedicated service pages
// Each service gets rich content for SEO and conversion

export interface ServiceDetailData {
  slug: string;
  title: string;
  tagline: string;
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
        duration: "2h 20min",
        price: "A$ 324",
        description: "Transform frizzy, unmanageable hair into sleek, smooth perfection with our mid-length Straight Up Smoothing treatment. This natural, eco-friendly treatment delivers salon-smooth results that last for months.",
        metaDescription: "Mid-length Straight Up Smoothing treatment in Bangor. Natural hair smoothing, 2h 20min, $324. Book your transformation with Jena at Hair Pinns.",
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
        ]
      },
      {
        slug: "long-thick-straight-up-smoothing",
        title: "Long/Thick Straight Up Smoothing Treatment",
        tagline: "Maximum smoothing power for long or thick hair",
        duration: "2h 20min",
        price: "A$ 349",
        description: "Specially designed for long or thick hair, this premium Straight Up Smoothing treatment delivers exceptional smoothing results that transform your hair from unruly to beautifully manageable.",
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
            description: "Professional straightening seals in the treatment, followed by a beautiful blow-dry to showcase your transformation."
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
        ]
      },
      {
        slug: "straight-up-smoothing-teens",
        title: "Straight Up Smoothing for Teens",
        tagline: "Perfect treatment to tame your teen's mane",
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
        ]
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
        ]
      },
      {
        slug: "half-head-foils-cut-blowdry",
        title: "1/2 Head of Foils, Cut & Blow-dry",
        tagline: "Beautiful dimension with the perfect package",
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
            description: "Foils are placed where they'll have maximum impact—usually around the face, crown, and top sections."
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
        ]
      },
      {
        slug: "quarter-head-foils-cut-blowdry",
        title: "1/4 Head Foils, Cut & Blow-dry",
        tagline: "Subtle enhancement for a fresh look",
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
            description: "We carefully select the most impactful areas for foils—typically around the face and parting."
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
        ]
      }
    ]
  }
];
