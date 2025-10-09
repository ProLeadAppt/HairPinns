// Location page data for service area landing pages under /areas/

export interface LocationData {
  slug: string;
  name: string;
  postcode: string;
  driveTime: string;
  route: string;
  heroSubtitle: string;
  whyChoose: {
    title: string;
    description: string;
  }[];
  localTips: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  nearbyLocations: string[]; // slugs for internal linking
}

export const locationPages: Record<string, LocationData> = {
  sydney: {
    slug: "sydney",
    name: "Sydney",
    postcode: "2000",
    driveTime: "35–45 minutes",
    route: "A1/M1 via Airport and Southern Cross Drive",
    heroSubtitle: "Expert colour, smoothing & styling near Sydney. Boutique care, salon-quality at home.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Best times: Mid-morning or early afternoon avoids peak city traffic.",
      "Free parking at our Bangor salon—no meters or time limits.",
      "Popular with city clients: smoothing treatments for humid commutes.",
      "Text us for quick quotes—we respond within hours, not days."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Sydney?",
        answer: "We're approximately 35–45 minutes south of Sydney CBD via the M1 motorway. Our Bangor salon offers easy parking and a relaxed atmosphere—perfect for escaping the city rush while getting expert hair care."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! We specialize in keratin smoothing treatments that tame frizz, add shine and cut blow-dry time. Results typically last 3–5 months depending on your hair. We use premium formulas like Juuce and Aromaganic for healthy, glossy results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely. We create beautiful braided styles for formals, weddings, and special events. From boho braids to elegant updos, we'll customize the look to suit your dress and personal style. Book 2–3 weeks ahead for popular dates."
      },
      {
        question: "What products do you use?",
        answer: "We use salon-only premium brands including Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas deliver superior results and are gentler on hair than supermarket brands. All products are available for purchase to maintain your salon results at home."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our standard hours are Tuesday–Friday 9am–5pm and Saturday 8am–3pm. For special occasions or urgent appointments, text Jena on +61 468 020 624 and we'll do our best to accommodate you outside regular hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "The best way is to text a photo of your current hair to +61 468 020 624 along with your goals. Jena will respond with a detailed quote including timing and pricing. You can also book a free consultation via Fresha to discuss in person."
      }
    ],
    nearbyLocations: ["padstow", "cronulla", "miranda", "caringbah", "sutherland", "engadine"]
  },
  como: {
    slug: "como",
    name: "Como",
    postcode: "2226",
    driveTime: "12–15 minutes",
    route: "Princes Highway south",
    heroSubtitle: "Expert colour, smoothing & styling near Como. Boutique care with riverside charm.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Best days: Weekday mornings avoid school run traffic along Princes Hwy.",
      "Easy riverside drive—scenic route via Como bridge.",
      "Popular with Como locals: keratin smoothing for humid riverside climate.",
      "Text us for quotes—response within 2–4 hours guaranteed."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Como?",
        answer: "Just 12–15 minutes south via Princes Highway. Easy drive with free parking at our Bangor salon. Many Como clients visit us regularly for the boutique atmosphere and expert care."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are perfect for Como's riverside humidity. They reduce frizz, add shine, and last 3–5 months. We customize the treatment strength to your hair type for natural-looking, manageable results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Yes—we create stunning braided styles for all occasions. From intricate formal updos to relaxed boho braids, we'll design the perfect look. Book 2–3 weeks ahead for peak formal season (especially spring)."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon-only brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for Australian conditions and deliver superior results. We'll recommend the right products for your hair type to use at home."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm, Sat 8am–3pm. For special occasions or tight schedules, text +61 468 020 624 and we'll try to accommodate after-hours appointments when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and your colour goals to +61 468 020 624. Jena will provide a detailed quote with timing and pricing, usually within a few hours. Free in-person consultations are also available via Fresha."
      }
    ],
    nearbyLocations: ["oyster-bay", "jannali", "sutherland", "gymea", "miranda", "kareela"]
  },
  gymea: {
    slug: "gymea",
    name: "Gymea",
    postcode: "2227",
    driveTime: "10–12 minutes",
    route: "Gymea Bay Road to Princes Highway",
    heroSubtitle: "Expert colour, smoothing & styling near Gymea. Boutique care, exceptional results.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Best route: Gymea Bay Rd to Princes Hwy—10 mins door-to-door.",
      "Avoid Saturday peak: book 8–10am or after 1pm for easier parking.",
      "Popular in Gymea: blonde foiling and balayage for beachy looks.",
      "Quick callbacks—text us and we'll respond same day."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Gymea?",
        answer: "Only 10–12 minutes via Gymea Bay Road and Princes Highway. Free parking at our Bangor salon makes it stress-free. We're a favorite with Gymea clients for our personalized service and local expertise."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Keratin smoothing is one of our most popular services. It tames frizz, reduces styling time, and lasts 3–5 months. Perfect for Gymea's coastal climate. We use premium formulas for healthy, shiny results without damage."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from classic French braids to intricate boho updos. We'll work with you to create the perfect look for your event. Book ahead during formal season for best availability."
      },
      {
        question: "What products do you use?",
        answer: "We use only premium salon brands: Olaplex for bond repair, K18 for damage reversal, Moroccan Oil for hydration, plus Juuce and Aromaganic for colour and smoothing. All products available to purchase for home maintenance."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special requests or urgent appointments, text Jena directly on +61 468 020 624 and we'll try to accommodate you."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Easiest way: text a photo of your current hair to +61 468 020 624 with your goals. You'll get a detailed quote (including time and price) usually within hours. Or book a free consultation on Fresha to discuss in person."
      }
    ],
    nearbyLocations: ["miranda", "kirrawee", "sylvania", "como", "jannali", "caringbah"]
  },
  menai: {
    slug: "menai",
    name: "Menai",
    postcode: "2234",
    driveTime: "5–8 minutes",
    route: "Menai Road direct",
    heroSubtitle: "Expert colour, smoothing & styling near Menai. Local boutique care you'll love.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Super quick—5 mins via Menai Rd makes us your local salon.",
      "Georges River humidity? Our smoothing treatments are designed for it.",
      "Popular: blonde specialists and keratin smoothing.",
      "Same-day text responses—fast, friendly, no pressure."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Menai?",
        answer: "We're practically neighbors! Just 5–8 minutes via Menai Road. Many Menai clients treat us as their local salon thanks to the quick drive and free parking at our Bangor location."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes—it's one of our signature services! Perfect for Menai's river humidity. Keratin smoothing reduces frizz, cuts styling time in half, and lasts 3–5 months. We use premium formulas tailored to your hair type for natural movement and shine."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Yes! We love creating beautiful braided styles for formals and special events. From romantic side braids to elegant crown braids, we'll customize the look to suit you. Book 2–3 weeks ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only the best: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These salon-exclusive brands are designed for Australian conditions and deliver healthier, longer-lasting results than supermarket products. Available for purchase in-salon."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or scheduling conflicts, text +61 468 020 624 and we'll do our best to fit you in outside regular hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and desired result to +61 468 020 624. Jena will respond with a detailed quote including time required and pricing. Alternatively, book a free consultation via Fresha to discuss in person."
      }
    ],
    nearbyLocations: ["bangor", "illawong", "alfords-point", "barden-ridge", "sutherland", "lucas-heights"]
  },
  bangor: {
    slug: "bangor",
    name: "Bangor",
    postcode: "2234",
    driveTime: "On-site",
    route: "We're located right here in Bangor",
    heroSubtitle: "Your local boutique hair salon—expert colour, smoothing & styling.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Right here in Bangor with free parking."
      }
    ],
    localTips: [
      "We're your local salon—no travel needed!",
      "Free parking right at the door—no meters or time limits.",
      "Know the river-valley humidity? So do we. Treatments designed for local climate.",
      "Text us anytime—quick, friendly service for Bangor locals."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Bangor?",
        answer: "We're right here in Bangor! Located at 60 Goorgool Road with free parking. As locals, we understand Bangor's unique river-valley climate and tailor every service to work with our humid conditions."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes—it's our specialty! Living in Bangor means dealing with Georges River humidity. Our keratin smoothing treatments seal the cuticle against moisture, reducing frizz and cutting styling time for 3–5 months. Perfect for our local climate."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create stunning braided styles for formals, weddings, and events. From boho braids to elegant updos, we'll design the perfect look. Popular with Bangor High and local schools—book early during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands only: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for Australian conditions and won't strip or damage your hair. All available for purchase to maintain salon results at home."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. As locals, we understand sometimes you need flexibility. Text Jena on +61 468 020 624 for special requests and we'll do our best to accommodate."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo to +61 468 020 624 with your colour goals and Jena will provide a detailed quote with timing and pricing. Or book a free consultation via Fresha. As locals, many Bangor clients just drop by for a quick chat too!"
      }
    ],
    nearbyLocations: ["menai", "woronora", "barden-ridge", "illawong", "heathcote", "alfords-point"]
  },
  jannali: {
    slug: "jannali",
    name: "Jannali",
    postcode: "2226",
    driveTime: "15–18 minutes",
    route: "President Avenue to Princes Highway",
    heroSubtitle: "Expert colour, smoothing & styling near Jannali. Premium care, local convenience.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Quick drive via President Ave—15 mins door-to-door.",
      "Best times: mid-morning or early afternoon avoids peak traffic.",
      "Popular with Jannali clients: blonde foiling and smoothing treatments.",
      "Fast text responses—usually within 2–4 hours."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Jannali?",
        answer: "About 15–18 minutes via President Avenue and Princes Highway. Free parking at our Bangor salon makes the drive stress-free. We're a popular choice for Jannali clients wanting boutique service without city prices."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are perfect for managing frizz in Sutherland Shire's humid climate. Results last 3–5 months and dramatically reduce styling time. We customize the treatment to your hair type for natural movement and shine."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely—we specialize in formal braided styles! From classic to contemporary, we'll create a look that complements your dress and personal style. Book 2–3 weeks ahead, especially during spring formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands including Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas deliver superior results and are gentler on hair than supermarket brands. All available for purchase to maintain your salon look at home."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or scheduling needs, text +61 468 020 624 and we'll try to fit you in outside regular hours when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a current hair photo to +61 468 020 624 along with your goals. You'll receive a detailed quote including timing and pricing, typically within a few hours. Or book a free consultation via Fresha for an in-person assessment."
      }
    ],
    nearbyLocations: ["como", "oyster-bay", "sutherland", "gymea", "kareela", "miranda"]
  },
  kareela: {
    slug: "kareela",
    name: "Kareela",
    postcode: "2232",
    driveTime: "10–12 minutes",
    route: "President Avenue to Bangor",
    heroSubtitle: "Expert colour, smoothing & styling near Kareela. Boutique care, stunning results.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Easy 10-min drive via President Ave—practically local.",
      "Bushland climate means dryness—our hydrating treatments restore moisture.",
      "Popular services: blonde specialists and deep conditioning.",
      "Same-day text responses guaranteed—no waiting days for quotes."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Kareela?",
        answer: "Just 10–12 minutes via President Avenue. Close enough to be your local salon with free parking and a relaxed atmosphere. Many Kareela clients love the boutique experience and expert care."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Keratin smoothing is one of our signature services. It tames frizz, adds shine, and lasts 3–5 months. Perfect for Kareela's drier bushland climate where hair can get parched. We use premium formulas for healthy, manageable results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Yes—we create beautiful braided styles for all special occasions. From romantic boho braids to sleek formal updos, we'll design the perfect look to match your style and outfit. Book ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional-grade formulas are designed for Australian conditions and deliver superior, longer-lasting results. All available for purchase in-salon."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For urgent appointments or special occasions, text Jena on +61 468 020 624 and we'll do our best to accommodate you outside standard hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and desired look to +61 468 020 624. Jena will respond with a detailed quote including timing and pricing, usually same-day. Free consultations also available via Fresha."
      }
    ],
    nearbyLocations: ["sutherland", "como", "jannali", "miranda", "kirrawee", "oyster-bay"]
  },
  miranda: {
    slug: "miranda",
    name: "Miranda",
    postcode: "2228",
    driveTime: "15–20 minutes",
    route: "Kingsway to Princes Highway",
    heroSubtitle: "Expert colour, smoothing & styling near Miranda. Boutique alternative to mall salons.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Escape the mall—boutique experience, 15 mins south.",
      "Free parking vs Westfield madness—stress-free visits.",
      "Popular: colour corrections and smoothing treatments.",
      "Text for quotes—personal service, not mall rush."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Miranda?",
        answer: "About 15–20 minutes south via Kingsway and Princes Highway. Free parking at our Bangor salon—no Westfield stress! We're a favorite for Miranda clients seeking boutique service and personalized attention."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are expertly applied to reduce frizz, add shine, and cut styling time. Results last 3–5 months. We use premium formulas customized to your hair type for natural movement without damage."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from intricate updos to flowing boho braids. We'll work with you to create the perfect look for your event. Book 2–3 weeks ahead during formal season for best availability."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands only: Olaplex for bond repair, K18 for damage reversal, Moroccan Oil for hydration, plus Juuce and Aromaganic. These professional formulas deliver superior results. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special requests or tight schedules, text +61 468 020 624 and we'll try to accommodate after-hours appointments when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair to +61 468 020 624 with your goals. You'll get a detailed quote with timing and pricing, usually within hours. Or book a free consultation on Fresha to discuss in person."
      }
    ],
    nearbyLocations: ["caringbah", "gymea", "sutherland", "kirrawee", "sylvania", "cronulla"]
  },
  padstow: {
    slug: "padstow",
    name: "Padstow",
    postcode: "2211",
    driveTime: "30–35 minutes",
    route: "M5 to M1 south",
    heroSubtitle: "Expert colour, smoothing & styling near Padstow. Worth the drive for boutique care.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Best route: M5 to M1 south—30 mins easy motorway driving.",
      "Mid-morning appointments avoid peak traffic both ways.",
      "Worth the drive: boutique service vs chain salon experience.",
      "Text for quotes—we respond fast with detailed pricing."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Padstow?",
        answer: "About 30–35 minutes via M5 and M1 south. Easy motorway drive with free parking at our Bangor salon. Many Padstow clients love the boutique atmosphere and personalized care worth the drive."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes—it's one of our most popular services! Keratin smoothing reduces frizz, adds incredible shine, and lasts 3–5 months. We use premium formulas tailored to your hair type for healthy, manageable results without compromising movement."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create stunning braided styles for formals, weddings, and special events. From classic to contemporary, we'll customize the look to suit you. Book 2–3 weeks ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for Australian conditions and deliver healthier, longer-lasting results. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or scheduling conflicts, text +61 468 020 624 and we'll do our best to fit you in outside regular hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and your colour goals to +61 468 020 624. Jena will provide a detailed quote including time and pricing, typically within a few hours. Free consultations also available via Fresha."
      }
    ],
    nearbyLocations: ["sydney", "cronulla", "miranda", "caringbah", "sutherland", "menai"]
  },
  cronulla: {
    slug: "cronulla",
    name: "Cronulla",
    postcode: "2230",
    driveTime: "20–25 minutes",
    route: "Kingsway to Taren Point Road",
    heroSubtitle: "Expert colour, smoothing & styling near Cronulla. Beachy vibes, salon-quality results.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "20-min drive inland via Kingsway—easy escape from beach crowds.",
      "Salt and sun damage? We specialize in restoring beach hair.",
      "Popular: blonde maintenance and hydrating treatments.",
      "Text for quotes—we know beach hair needs special care."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Cronulla?",
        answer: "About 20–25 minutes via Kingsway and Taren Point Road. Free parking at our Bangor salon makes the drive easy. We're popular with Cronulla clients for our expertise with sun and salt-damaged beach hair."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Perfect for managing beachy texture and salt damage. Our keratin smoothing treatments seal the cuticle, reduce frizz, and add shine for 3–5 months. Especially effective for Cronulla's coastal climate and active beach lifestyle."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create beautiful braided styles from casual beach braids to elegant formal updos. Perfect for Cronulla's laid-back vibe or special occasions. Book 2–3 weeks ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for Australian coastal conditions—perfect for protecting against sun, salt, and chlorine damage. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special requests or urgent appointments, text +61 468 020 624 and we'll try to accommodate you outside regular hours when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo to +61 468 020 624 with your goals—especially helpful for assessing sun damage and brassiness from beach exposure. You'll get a detailed quote with timing and pricing, usually within hours."
      }
    ],
    nearbyLocations: ["caringbah", "miranda", "woolooware", "burraneer", "sylvania", "gymea"]
  },
  illawong: {
    slug: "illawong",
    name: "Illawong",
    postcode: "2234",
    driveTime: "8–10 minutes",
    route: "Alfords Point Road to Menai Road",
    heroSubtitle: "Expert colour, smoothing & styling near Illawong. Local care, riverside charm.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Super local—8 mins via Alfords Point Rd.",
      "Riverside humidity? Our treatments are designed for it.",
      "Popular: smoothing treatments and blonde specialists.",
      "Quick text responses—friendly, local service."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Illawong?",
        answer: "Just 8–10 minutes via Alfords Point Road and Menai Road. Close enough to be your local salon with free parking. Many Illawong clients treat us as their neighborhood hair experts."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Illawong's riverside location means high humidity—our keratin smoothing treatments are perfect for combating frizz. They last 3–5 months and dramatically reduce styling time while adding incredible shine."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from elegant updos to romantic side braids. We'll create the perfect look for your special occasion. Book 2–3 weeks ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for humid Australian conditions and deliver superior results. All available for purchase to maintain your salon look."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or scheduling needs, text +61 468 020 624 and we'll do our best to accommodate you outside standard hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair to +61 468 020 624 with your goals. Jena will respond with a detailed quote including timing and pricing, typically same-day. Or book a free consultation via Fresha."
      }
    ],
    nearbyLocations: ["menai", "alfords-point", "bangor", "barden-ridge", "lucas-heights", "woronora"]
  },
  kirrawee: {
    slug: "kirrawee",
    name: "Kirrawee",
    postcode: "2232",
    driveTime: "12–15 minutes",
    route: "Princes Highway south",
    heroSubtitle: "Expert colour, smoothing & styling near Kirrawee. Coastal care, boutique service.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Easy 12-min drive via Princes Hwy.",
      "Coastal air needs special care—our treatments protect hair.",
      "Popular: blonde foiling and smoothing for humid climate.",
      "Fast text responses—personal service guaranteed."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Kirrawee?",
        answer: "About 12–15 minutes south via Princes Highway. Free parking at our Bangor salon. We're a favorite with Kirrawee clients for our coastal climate expertise and personalized boutique service."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are perfect for Kirrawee's coastal climate. They reduce frizz from salt air and humidity, add shine, and last 3–5 months. We customize the treatment to your hair type for natural movement."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create stunning braided styles for all occasions—from intricate formal updos to relaxed boho braids. We'll design the perfect look to match your style and outfit. Book ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional-grade formulas are designed for Australian coastal conditions—protecting against salt, sun, and humidity. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or urgent needs, text +61 468 020 624 and we'll try to accommodate you outside regular hours when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and goals to +61 468 020 624. You'll receive a detailed quote with timing and pricing, usually within a few hours. Free consultations also available via Fresha."
      }
    ],
    nearbyLocations: ["sutherland", "gymea", "miranda", "sylvania", "caringbah", "kareela"]
  },
  sylvania: {
    slug: "sylvania",
    name: "Sylvania",
    postcode: "2224",
    driveTime: "18–22 minutes",
    route: "Port Hacking Road to Princes Highway",
    heroSubtitle: "Expert colour, smoothing & styling near Sylvania. Boutique care worth the drive.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "20-min drive via Port Hacking Rd—scenic bushland route.",
      "Mid-morning bookings avoid peak traffic.",
      "Popular: colour corrections and smoothing treatments.",
      "Text for quotes—detailed pricing, no surprises."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Sylvania?",
        answer: "About 18–22 minutes via Port Hacking Road and Princes Highway. Scenic drive with free parking at our Bangor salon. Many Sylvania clients love the boutique experience and expert care worth the trip."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Keratin smoothing is one of our signature services. Perfect for managing frizz in Sutherland Shire's humidity. Results last 3–5 months and dramatically reduce styling time. We use premium formulas for healthy, shiny results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from classic French braids to contemporary boho updos. We'll work with you to create the perfect look for your event. Book 2–3 weeks ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex for bond repair, K18 for damage reversal, Moroccan Oil for hydration, plus Juuce and Aromaganic. These professional formulas deliver superior, longer-lasting results. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special requests or tight schedules, text +61 468 020 624 and we'll do our best to fit you in outside regular hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair to +61 468 020 624 with your colour goals. Jena will respond with a detailed quote including timing and pricing, usually within hours. Or book a free consultation on Fresha."
      }
    ],
    nearbyLocations: ["miranda", "gymea", "kirrawee", "caringbah", "cronulla", "oyster-bay"]
  },
  caringbah: {
    slug: "caringbah",
    name: "Caringbah",
    postcode: "2229",
    driveTime: "15–20 minutes",
    route: "Taren Point Road to Princes Highway",
    heroSubtitle: "Expert colour, smoothing & styling near Caringbah. Boutique alternative to mall chains.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "15-min drive—boutique experience vs mall salon rush.",
      "Free parking vs shopping center stress.",
      "Popular: blonde specialists and smoothing treatments.",
      "Personal service—text us for immediate responses."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Caringbah?",
        answer: "About 15–20 minutes via Taren Point Road and Princes Highway. Free parking at our Bangor salon—no mall hassle! We're a favorite for Caringbah clients seeking boutique service and personalized attention over chain salons."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are expertly applied to reduce frizz, add shine, and cut styling time in half. Results last 3–5 months. We use premium formulas customized to your hair type for natural movement and incredible results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create beautiful braided styles for formals and special events—from romantic side braids to intricate crown braids. We'll customize the look to suit your style and dress. Book 2–3 weeks ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands only: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional-grade formulas are designed for Australian conditions and deliver healthier, longer-lasting results. All available for purchase in-salon."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or scheduling conflicts, text +61 468 020 624 and we'll try to accommodate after-hours appointments when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair to +61 468 020 624 with your goals. You'll get a detailed quote with timing and pricing, usually within hours. Or book a free consultation via Fresha to discuss in person."
      }
    ],
    nearbyLocations: ["cronulla", "miranda", "gymea", "sutherland", "woolooware", "sylvania"]
  },
  "oyster-bay": {
    slug: "oyster-bay",
    name: "Oyster Bay",
    postcode: "2225",
    driveTime: "15–18 minutes",
    route: "Como West Road to Princes Highway",
    heroSubtitle: "Expert colour, smoothing & styling near Oyster Bay. Riverside boutique care.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Scenic 15-min riverside drive via Como West Rd.",
      "Riverside humidity? We specialize in anti-frizz treatments.",
      "Popular: smoothing and blonde maintenance.",
      "Quick text responses—friendly local service."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Oyster Bay?",
        answer: "About 15–18 minutes via Como West Road and Princes Highway. Scenic riverside drive with free parking at our Bangor salon. We're popular with Oyster Bay clients for our humid climate expertise."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Perfect for Oyster Bay's riverside humidity. Our keratin smoothing treatments seal the cuticle against moisture, reducing frizz and adding shine for 3–5 months. We customize the treatment to your hair type for natural movement."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create stunning braided styles for all occasions—from elegant formal updos to relaxed boho braids. We'll work with you to design the perfect look. Book 2–3 weeks ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for Australian humid conditions and deliver superior results. All available for purchase to maintain your salon look."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or urgent appointments, text +61 468 020 624 and we'll do our best to accommodate you outside standard hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and goals to +61 468 020 624. Jena will respond with a detailed quote including timing and pricing, typically within a few hours. Free consultations also available via Fresha."
      }
    ],
    nearbyLocations: ["como", "jannali", "sylvania", "kareela", "gymea", "miranda"]
  },
  sutherland: {
    slug: "sutherland",
    name: "Sutherland",
    postcode: "2232",
    driveTime: "8–10 minutes",
    route: "Princes Highway direct",
    heroSubtitle: "Expert colour, smoothing & styling near Sutherland. Your local boutique salon.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Super quick—8 mins via Princes Hwy makes us practically local.",
      "Hard water issues? Our clarifying treatments restore shine.",
      "Popular: colour corrections and smoothing treatments.",
      "Same-day text responses—fast, personal service."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Sutherland?",
        answer: "Just 8–10 minutes south via Princes Highway. Close enough to be your local salon with free parking and boutique service. Many Sutherland clients love the personalized care and expert results."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are one of our signature services. They tame frizz, add incredible shine, and last 3–5 months. Perfect for Sutherland Shire's climate. We use premium formulas for healthy, manageable results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from classic to contemporary. We'll create the perfect look to complement your dress and personal style. Book 2–3 weeks ahead, especially during spring formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas deliver superior results and are gentler on hair than supermarket brands. All available for purchase in-salon."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special requests or scheduling conflicts, text +61 468 020 624 and we'll do our best to fit you in outside regular hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair to +61 468 020 624 with your colour goals. Jena will provide a detailed quote including timing and pricing, usually within a few hours. Or book a free consultation via Fresha."
      }
    ],
    nearbyLocations: ["woronora", "kirrawee", "kareela", "menai", "miranda", "gymea"]
  },
  "barden-ridge": {
    slug: "barden-ridge",
    name: "Barden Ridge",
    postcode: "2234",
    driveTime: "5–7 minutes",
    route: "Local roads via Bangor",
    heroSubtitle: "Expert colour, smoothing & styling near Barden Ridge. Your neighborhood salon.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Right next door with free parking."
      }
    ],
    localTips: [
      "Super local—5 mins makes us your neighborhood salon.",
      "Bushland dryness? Our hydrating treatments restore moisture.",
      "Popular: cuts, colour, and deep conditioning.",
      "Text anytime—quick responses from your local salon."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Barden Ridge?",
        answer: "Just 5–7 minutes via local roads. We're practically your neighborhood salon! Free parking and a relaxed atmosphere. As locals, we understand the area's unique bushland climate and hair care needs."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are perfect for managing frizz and adding shine. They last 3–5 months and dramatically reduce styling time. We use premium formulas customized to your hair type for natural, healthy results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create beautiful braided styles for all special occasions—from elegant formal updos to romantic side braids. We'll design the perfect look for your event. Book ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands only: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional-grade formulas are designed for Australian conditions and deliver superior results. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. As your local salon, we're flexible for special occasions. Text +61 468 020 624 and we'll do our best to accommodate you."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo to +61 468 020 624 with your goals. As locals, we can often pop by for a quick consultation too! You'll get a detailed quote with timing and pricing, typically within hours."
      }
    ],
    nearbyLocations: ["bangor", "menai", "illawong", "lucas-heights", "heathcote", "woronora"]
  },
  "alfords-point": {
    slug: "alfords-point",
    name: "Alfords Point",
    postcode: "2234",
    driveTime: "6–8 minutes",
    route: "Alfords Point Road direct",
    heroSubtitle: "Expert colour, smoothing & styling near Alfords Point. Riverside boutique care.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Quick 6-min drive via Alfords Point Rd.",
      "Riverside breeze meets humidity—our treatments handle both.",
      "Popular: smoothing and blonde specialists.",
      "Fast text responses—local, friendly service."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Alfords Point?",
        answer: "Just 6–8 minutes via Alfords Point Road. Super close with free parking at our Bangor salon. We're a favorite with Alfords Point clients for our riverside climate expertise and boutique service."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Perfect for Alfords Point's riverside humidity. Our keratin smoothing treatments seal the cuticle to reduce frizz and add shine for 3–5 months. We customize the treatment to your hair type for natural movement and health."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from intricate updos to flowing boho braids. We'll work with you to create the perfect look for your special occasion. Book 2–3 weeks ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for humid Australian conditions and deliver superior, longer-lasting results. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or urgent needs, text +61 468 020 624 and we'll try to accommodate you outside regular hours when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and goals to +61 468 020 624. Jena will respond with a detailed quote including timing and pricing, typically same-day. Free consultations also available via Fresha."
      }
    ],
    nearbyLocations: ["illawong", "menai", "bangor", "barden-ridge", "lucas-heights", "padstow"]
  },
  woronora: {
    slug: "woronora",
    name: "Woronora",
    postcode: "2232",
    driveTime: "10–12 minutes",
    route: "Woronora Road via Bangor",
    heroSubtitle: "Expert colour, smoothing & styling near Woronora. Valley care, boutique results.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Scenic 10-min drive via Woronora Rd through bushland.",
      "Valley humidity traps moisture—our treatments seal it out.",
      "Popular: smoothing treatments and heat damage repair.",
      "Text for quotes—we understand valley climate challenges."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Woronora?",
        answer: "About 10–12 minutes via Woronora Road through scenic bushland. Free parking at our Bangor salon. We're popular with Woronora clients for our understanding of the valley's unique humid microclimate."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Essential for Woronora's valley humidity. Our keratin smoothing treatments seal the hair cuticle against moisture, preventing frizz for 3–5 months. We use premium formulas tailored to your hair type for natural movement and shine."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create stunning braided styles for formals and special events—from elegant updos to romantic braids. We'll customize the look to suit your style and dress. Book 2–3 weeks ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are specifically designed for humid Australian conditions—perfect for Woronora's valley climate. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or tight schedules, text +61 468 020 624 and we'll do our best to fit you in outside regular hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair to +61 468 020 624 with your colour goals. Jena will provide a detailed quote including timing and pricing, usually within a few hours. Or book a free consultation on Fresha."
      }
    ],
    nearbyLocations: ["sutherland", "bangor", "heathcote", "engadine", "como-west", "kirrawee"]
  },
  heathcote: {
    slug: "heathcote",
    name: "Heathcote",
    postcode: "2233",
    driveTime: "12–15 minutes",
    route: "Heathcote Road to Bangor",
    heroSubtitle: "Expert colour, smoothing & styling near Heathcote. Bushland beauty, salon care.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Easy 12-min drive via Heathcote Rd through bushland.",
      "Drier bushland climate—our hydrating treatments restore balance.",
      "Popular: colour services and deep conditioning.",
      "Text for quotes—we respond fast with detailed info."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Heathcote?",
        answer: "About 12–15 minutes via Heathcote Road. Scenic bushland drive with free parking at our Bangor salon. We're popular with Heathcote clients for our expertise with drier bushland hair care needs."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments reduce frizz, add shine, and last 3–5 months. Even in Heathcote's drier bushland climate, smoothing helps manage texture and reduces daily styling time. We customize the treatment to your hair type."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create beautiful braided styles for all occasions—from classic formal updos to contemporary boho braids. We'll design the perfect look for your event. Book 2–3 weeks ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for Australian bushland conditions—adding hydration while protecting hair health. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or scheduling needs, text +61 468 020 624 and we'll try to accommodate you outside regular hours when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and colour goals to +61 468 020 624. Jena will respond with a detailed quote including timing and pricing, typically within a few hours. Free consultations also available via Fresha."
      }
    ],
    nearbyLocations: ["engadine", "woronora", "bangor", "waterfall", "royal-national-park", "sutherland"]
  },
  engadine: {
    slug: "engadine",
    name: "Engadine",
    postcode: "2233",
    driveTime: "10–12 minutes",
    route: "Princes Highway north",
    heroSubtitle: "Expert colour, smoothing & styling near Engadine. Local boutique, expert results.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Quick 10-min drive north via Princes Hwy.",
      "Mix of bushland and coastal—our treatments adapt to both.",
      "Popular: smoothing treatments and colour services.",
      "Same-day text responses—fast, personal service."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Engadine?",
        answer: "Just 10–12 minutes north via Princes Highway. Easy drive with free parking at our Bangor salon. We're a favorite with Engadine clients for our boutique service and climate-adapted treatments."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments are perfect for Engadine's mixed bushland-coastal climate. They tame frizz, add shine, and last 3–5 months. We use premium formulas customized to your hair type for healthy, manageable results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from intricate updos to relaxed boho braids. We'll work with you to create the perfect look for your special occasion. Book 2–3 weeks ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for Australian conditions—protecting against humidity, sun, and environmental stress. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or urgent appointments, text +61 468 020 624 and we'll do our best to accommodate you outside standard hours."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair to +61 468 020 624 with your goals. Jena will respond with a detailed quote including timing and pricing, usually within a few hours. Or book a free consultation via Fresha."
      }
    ],
    nearbyLocations: ["heathcote", "woronora", "loftus", "sutherland", "lucas-heights", "bangor"]
  },
  "como-west": {
    slug: "como-west",
    name: "Como West",
    postcode: "2226",
    driveTime: "12–14 minutes",
    route: "Como West Road to Bangor",
    heroSubtitle: "Expert colour, smoothing & styling near Como West. Riverside boutique care.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Scenic 12-min drive via Como West Rd.",
      "River proximity means humidity—our smoothing treatments excel here.",
      "Popular: smoothing and blonde maintenance.",
      "Quick text responses—friendly, local expertise."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Como West?",
        answer: "About 12–14 minutes via Como West Road. Scenic riverside drive with free parking at our Bangor salon. We're popular with Como West clients for our riverside humidity expertise and boutique service."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Essential for Como West's riverside humidity. Our keratin smoothing treatments seal the hair cuticle against moisture, reducing frizz and adding shine for 3–5 months. We customize the treatment to your hair type for natural, healthy results."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We create stunning braided styles for all occasions—from elegant formal updos to romantic side braids. We'll design the perfect look to suit your style. Book 2–3 weeks ahead during peak formal season."
      },
      {
        question: "What products do you use?",
        answer: "Only premium salon brands: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional formulas are designed for humid Australian conditions—perfect for Como West's riverside climate. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Standard hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special occasions or scheduling conflicts, text +61 468 020 624 and we'll try to accommodate you outside regular hours when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and goals to +61 468 020 624. Jena will respond with a detailed quote including timing and pricing, typically within a few hours. Free consultations also available via Fresha."
      }
    ],
    nearbyLocations: ["como", "oyster-bay", "woronora", "jannali", "bonnet-bay", "sutherland"]
  },
  "woronora-heights": {
    slug: "woronora-heights",
    name: "Woronora Heights",
    postcode: "2233",
    driveTime: "12–15 minutes",
    route: "Woronora Heights Road to Bangor",
    heroSubtitle: "Expert colour, smoothing & styling near Woronora Heights. Elevated care, boutique results.",
    whyChoose: [
      {
        title: "Honest Care",
        description: "No up-selling. Advice that fits your hair & budget."
      },
      {
        title: "Premium Products",
        description: "Olaplex, K18, Moroccan Oil—healthy, glossy results."
      },
      {
        title: "Local & Easy",
        description: "Bangor base, quick callbacks, parking made simple."
      }
    ],
    localTips: [
      "Easy 12-min drive via Woronora Heights Rd.",
      "Elevated position creates unique climate—we adapt treatments.",
      "Popular: smoothing and colour correction services.",
      "Text for quotes—fast, detailed responses guaranteed."
    ],
    faqs: [
      {
        question: "How far is Hair Pinns from Woronora Heights?",
        answer: "About 12–15 minutes via Woronora Heights Road. Easy drive with free parking at our Bangor salon. We're a favorite with Woronora Heights clients for our personalized service and climate expertise."
      },
      {
        question: "Do you do keratin/'Straight Up' smoothing?",
        answer: "Yes! Our keratin smoothing treatments reduce frizz, add incredible shine, and last 3–5 months. Perfect for Woronora Heights' unique elevated climate. We use premium formulas customized to your hair type for natural movement and health."
      },
      {
        question: "Can I book braids for formals?",
        answer: "Absolutely! We specialize in formal braided styles—from classic French braids to contemporary boho updos. We'll create the perfect look for your special occasion. Book 2–3 weeks ahead during formal season."
      },
      {
        question: "What products do you use?",
        answer: "Premium salon brands only: Olaplex, K18, Moroccan Oil, Juuce, and Aromaganic. These professional-grade formulas are designed for Australian conditions and deliver superior, longer-lasting results. All available for purchase."
      },
      {
        question: "Do you offer after-hours or late nights?",
        answer: "Our regular hours are Tue–Fri 9am–5pm and Sat 8am–3pm. For special requests or urgent needs, text +61 468 020 624 and we'll try to accommodate you outside regular hours when possible."
      },
      {
        question: "How do I get a colour quote?",
        answer: "Text a photo of your current hair and colour goals to +61 468 020 624. Jena will provide a detailed quote including timing and pricing, typically within hours. Or book a free consultation via Fresha."
      }
    ],
    nearbyLocations: ["woronora", "sutherland", "engadine", "heathcote", "bangor", "como"]
  }
};

export const getAllLocationSlugs = (): string[] => {
  return Object.keys(locationPages);
};

export const getLocationData = (slug: string): LocationData | undefined => {
  return locationPages[slug];
};