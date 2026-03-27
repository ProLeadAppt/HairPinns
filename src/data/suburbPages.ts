// Suburb page data for service area landing pages

export interface SuburbData {
  slug: string;
  name: string;
  /** 1–2 sentence featured-snippet-style answer for Answer Optimization (AO) */
  quickAnswer?: string;
  driveTime: string;
  route: string;
  localNote: string;
  /** Local landmarks for GEO signals (e.g. Georges River, Royal National Park) */
  landmarks?: string[];
  /** Seasonal or local event references for hyperlocal SEO */
  seasonalNote?: string;
  /** Real customer story for this suburb (with permission) - Caleb Ulku authority marker */
  customerStory?: string;
  /** Specific project/transformation done for a client in this area (with permission) */
  projectExample?: string;
  intro: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  nearbySuburbs: string[]; // slugs of nearby suburbs for internal linking
}

export const suburbPages: Record<string, SuburbData> = {
  bangor: {
    slug: "bangor",
    name: "Bangor",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor, NSW, specializing in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Jena brings over 20 years of experience to every appointment, with services tailored to the Sutherland Shire's unique river-valley climate.",
    driveTime: "On-site",
    route: "We're located right here in Bangor",
    localNote: "As Bangor locals, we understand the unique climate challenges, river humidity mixed with coastal breeze, and tailor every service accordingly.",
    landmarks: ["Georges River", "Bangor Bypass", "Sutherland Shire"],
    seasonalNote: "Sutherland Shire summer humidity peaks in January-February. Our smoothing treatments are designed for these conditions.",
    intro: "Welcome to Hair Pinns, your boutique hair salon right here in Bangor, NSW. With over 20 years of experience, Jena specializes in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling designed for our local climate. As Bangor locals serving the Sutherland Shire, we understand exactly what your hair needs to look and feel amazing in our unique river-valley microclimate.",
    faqs: [
      {
        question: "Why is Hair Pinns the best choice in Bangor?",
        answer: "As Bangor locals with over 20 years of experience, we understand our unique microclimate, river humidity from the Georges River combined with coastal breeze. Our treatments are specifically designed for these conditions. We offer personalized, boutique service where you're never just a number. Every client receives a custom approach tailored to their hair type, lifestyle, and the challenges of living in the Sutherland Shire.",
      },
      {
        question: "How do I maintain my hair in Bangor's climate?",
        answer: "Bangor's river-valley location creates unique humidity patterns that require specific care. Use anti-humidity serums daily, especially in summer months. Our smoothing treatments seal the cuticle to protect against moisture absorption for 3–4 months. For colour-treated hair, UV protection is essential as the river reflects additional sunlight. We'll create a custom home care plan based on your specific needs and lifestyle.",
      },
      {
        question: "What makes your smoothing treatments different?",
        answer: "We use professional-grade formulas specifically chosen for Sydney's climate, not generic products. Our smoothing treatments are customized to your hair type. Fine hair gets lightweight formulas, while thick, coarse hair receives stronger treatments. The service includes thorough aftercare education and product recommendations. With 20+ years of experience, we know exactly how to achieve lasting results in humid conditions like ours in Bangor.",
      },
    ],
    nearbySuburbs: ["menai", "woronora", "heathcote"],
  },
  menai: {
    slug: "menai",
    name: "Menai",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Menai, Illawong, and the Sutherland Shire with Colour, Smoothing, and Cuts. Just 5-7 minutes from Menai via Menai Road.",
    driveTime: "5–7 minutes",
    route: "Menai Road",
    localNote: "The humidity from the Georges River can intensify frizz. Our smoothing treatments are designed for local conditions.",
    landmarks: ["Georges River", "Menai Marketplace", "Menai Road"],
    seasonalNote: "River humidity is highest in summer. Book a smoothing treatment before the humid season for lasting results.",
    intro: "Just minutes from Menai, Hair Pinns is your boutique hair salon specializing in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Jena brings over 20 years of experience to every appointment, with a focus on results that work with Sydney's coastal humidity. Whether you're after dimensional colour, frizz-taming smoothing, or a fresh cut, we'll help you leave feeling confident.",
    faqs: [
      {
        question: "How does Menai's humidity affect my hair?",
        answer: "Living near the Georges River means higher humidity levels, which can cause frizz and volume loss. We use professional smoothing treatments like Juuce and Aromaganic to seal the cuticle and protect your style. Regular treatments every 3–4 months help maintain smoothness, especially during Sydney's humid summer months.",
      },
      {
        question: "What's the best way to maintain blonde hair from Menai?",
        answer: "Sydney's mineral-rich water can cause brassiness in blonde hair. We recommend using purple shampoo 1–2 times per week and a hydrating treatment to counteract dryness. Our custom toning techniques ensure your blonde stays bright and balanced between appointments. Book a toning refresh every 6–8 weeks for optimal results.",
      },
      {
        question: "How long do smoothing treatments last in this area?",
        answer: "With proper aftercare, smoothing treatments typically last 3–4 months in Menai's climate. Avoid washing hair for 48 hours post-treatment, use sulfate-free products, and apply a leave-in treatment to extend results. We'll create a custom home care plan based on your hair type and lifestyle.",
      },
    ],
    nearbySuburbs: ["illawong", "bangor"],
  },
  illawong: {
    slug: "illawong",
    name: "Illawong",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Illawong and surrounding suburbs. Colour, Smoothing, and Cuts tailored to Sydney's climate, 8-10 minutes via Alfords Point Road and Menai Road.",
    driveTime: "8–10 minutes",
    route: "Alfords Point Road and Menai Road",
    localNote: "Illawong's riverside location means extra humidity, perfect for our anti-frizz smoothing treatments.",
    landmarks: ["Georges River", "Illawong Bay", "Alfords Point Bridge"],
    seasonalNote: "Riverside humidity peaks in summer. Our treatments seal the cuticle to combat frizz year-round.",
    intro: "Hair Pinns is your local salon serving Illawong and surrounding suburbs. We specialize in Colour & Blonding, Smoothing & Treatments, and precision Cuts & Styling tailored to Sydney's unique climate. With Jena's 20+ years of experience, you'll receive personalized service in a welcoming, boutique environment. From balayage to keratin treatments, we've got your hair goals covered.",
    faqs: [
      {
        question: "Why does my hair get so frizzy near the river?",
        answer: "Illawong's proximity to the Georges River creates high humidity, which causes hair cuticles to swell and frizz. Our smoothing treatments seal the cuticle to lock out moisture and keep your style smooth. We use professional-grade products designed specifically for humid climates, ensuring long-lasting results even on the most humid Sydney days.",
      },
      {
        question: "Can you fix brassy blonde hair from swimming?",
        answer: "Absolutely. Chlorine and Sydney's hard water can turn blonde hair brassy or green-tinted. We offer corrective toning and deep conditioning treatments to restore your blonde's vibrancy. For prevention, wet your hair with clean water before swimming and use a leave-in UV protectant. Regular toning appointments every 6–8 weeks keep brassiness at bay.",
      },
      {
        question: "What aftercare do you recommend for smoothing treatments?",
        answer: "After a smoothing treatment, avoid washing your hair for 48 hours and skip tying it up or using clips. Use sulfate-free shampoo and conditioner to preserve the treatment. Apply a heat protectant before styling, and avoid excessive heat. With proper care, your smoothing treatment will last 3–4 months, even in Illawong's humid climate.",
      },
    ],
    nearbySuburbs: ["menai", "alfords-point"],
  },
  "alfords-point": {
    slug: "alfords-point",
    name: "Alfords Point",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Alfords Point with Colour, Smoothing, and Cuts. Just 6–8 minutes via Alfords Point Road and ideal for Sydney's coastal humidity.",
    driveTime: "6–8 minutes",
    route: "Alfords Point Road",
    localNote: "The coastal breeze and river humidity make frizz control essential. Our treatments are proven to work.",
    landmarks: ["Georges River", "Alfords Point Bridge", "Woronora River"],
    seasonalNote: "Coastal breeze meets river humidity. Our smoothing treatments are formulated for this unique microclimate.",
    intro: "Located just minutes from Alfords Point, Hair Pinns is your go-to boutique salon for Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Jena's 20+ years of experience means you'll get personalized, professional service every visit. Whether you need a colour refresh, frizz-taming treatment, or a fresh cut, we understand the unique challenges of Sydney's climate and hair care.",
    faqs: [
      {
        question: "How do I manage frizz from the coastal breeze?",
        answer: "The combination of river humidity and coastal breeze in Alfords Point creates perfect conditions for frizz. Our smoothing treatments seal the hair cuticle to block moisture and maintain sleekness. We also recommend anti-humidity serums and leave-in conditioners for daily styling. Regular treatments every 3–4 months keep your hair manageable year-round.",
      },
      {
        question: "What's the best blonde maintenance routine?",
        answer: "Sydney's sun and mineral-rich water can quickly turn blonde brassy. Use a purple shampoo 1–2 times weekly and a hydrating mask once a week to maintain tone and moisture. Book a gloss or toner every 6–8 weeks to refresh your colour. We'll customize a blonde care plan based on your specific shade and lifestyle needs.",
      },
      {
        question: "Are smoothing treatments safe for coloured hair?",
        answer: "Yes! Our smoothing treatments are safe for colour-treated hair and won't strip your colour. In fact, they help seal the cuticle, which can make your colour last longer and appear more vibrant. We use gentle, professional formulas designed to work with coloured hair. Always book colour services at least 2 weeks before or after smoothing treatments for best results.",
      },
    ],
    nearbySuburbs: ["illawong", "bangor"],
  },
  woronora: {
    slug: "woronora",
    name: "Woronora",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Woronora with Colour, Smoothing, and Cuts. 10–12 minutes via Woronora Road, with treatments designed for the river valley's humidity.",
    driveTime: "10–12 minutes",
    route: "Woronora Road via Bangor",
    localNote: "Woronora's river valley traps moisture, making our anti-frizz treatments especially effective.",
    landmarks: ["Woronora River", "Royal National Park", "Woronora Dam"],
    seasonalNote: "River valley geography traps moisture. Our treatments are proven for Woronora's humidity.",
    intro: "Hair Pinns welcomes clients from Woronora to experience boutique hair care with over 20 years of expertise. We specialize in Colour & Blonding, Smoothing & Treatments, and precision Cuts & Styling designed for Sydney's unique climate. Jena's personalized approach ensures you leave with hair that looks and feels amazing, with results that last in even the most humid conditions.",
    faqs: [
      {
        question: "Why is Woronora so humid and how does it affect hair?",
        answer: "Woronora's river valley geography traps moisture, creating high humidity levels that cause frizz and limp styles. Our smoothing treatments are specifically formulated to combat this, sealing the hair cuticle and preventing moisture absorption. We also recommend humidity-resistant styling products and techniques tailored to your hair type for lasting results between salon visits.",
      },
      {
        question: "How often should I get my blonde hair toned?",
        answer: "In Sydney's climate, blonde hair typically needs toning every 6–8 weeks to maintain vibrancy and neutralize brassiness. If you swim frequently or spend time outdoors, you may need more frequent toning. We use custom-blended toners to match your desired shade perfectly. Between appointments, purple shampoo and UV protection help extend your colour.",
      },
      {
        question: "Can you help with heat-damaged hair?",
        answer: "Absolutely. Heat damage is common in Sydney's climate where styling tools are used to combat humidity. We offer deep conditioning treatments and bond-rebuilding services to restore hair health. Our smoothing treatments also reduce the need for daily heat styling, giving your hair a break. We'll assess your hair's condition and create a recovery plan.",
      },
    ],
    nearbySuburbs: ["sutherland", "bangor"],
  },
  sutherland: {
    slug: "sutherland",
    name: "Sutherland",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Sutherland with over 20 years of expertise in Colour, Smoothing, and Cuts. 8–10 minutes via Princes Highway.",
    driveTime: "8–10 minutes",
    route: "Princes Highway via Bangor",
    localNote: "Sutherland's hard water can cause buildup and brassiness. Our clarifying treatments restore shine.",
    landmarks: ["Sutherland Shire", "Princes Highway", "Sutherland Shire Council"],
    seasonalNote: "Sydney's mineral-rich water affects colour year-round. Our toning helps maintain blonde vibrancy.",
    intro: "Serving Sutherland with over 20 years of hair expertise, Hair Pinns is your boutique destination for Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Whether you're dealing with frizz, need a colour refresh, or want a fresh cut, Jena's personalized approach delivers results that work with your lifestyle and Sydney's climate. Experience professional hair care in a welcoming environment.",
    faqs: [
      {
        question: "How does Sutherland's water affect my hair?",
        answer: "Sutherland's mineral-rich water can cause product buildup, dullness, and brassiness in coloured hair. We recommend using a clarifying treatment once a month to remove buildup and restore shine. Our in-salon clarifying treatments deep-clean the hair and scalp, preparing your hair to better absorb conditioning treatments and colour services for optimal results.",
      },
      {
        question: "What's the best way to prevent blonde from going brassy?",
        answer: "Brassy blonde is often caused by mineral buildup, sun exposure, and oxidation. Use a chelating shampoo weekly to remove minerals, followed by purple shampoo to neutralize warmth. Apply a UV protectant spray before going outdoors. Professional toning every 6–8 weeks keeps your blonde cool and bright. We'll create a custom maintenance plan for your specific shade.",
      },
      {
        question: "How long does a smoothing treatment appointment take?",
        answer: "A full smoothing treatment typically takes 2–3 hours, depending on your hair length and thickness. This includes consultation, application, processing time, blow-dry, and flat-iron sealing. The results last 3–4 months with proper aftercare. We'll schedule your appointment to ensure you have plenty of time for the full service without feeling rushed.",
      },
    ],
    nearbySuburbs: ["woronora", "kirrawee"],
  },
  kirrawee: {
    slug: "kirrawee",
    name: "Kirrawee",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Kirrawee with Colour, Smoothing, and Cuts. 12–15 minutes via Princes Highway, with treatments designed for coastal air.",
    driveTime: "12–15 minutes",
    route: "Princes Highway",
    localNote: "Kirrawee's coastal air brings salt and humidity. Our treatments protect against both.",
    landmarks: ["Cronulla Beach", "Royal National Park", "Princes Highway"],
    seasonalNote: "Coastal salt air and summer humidity. Our treatments create a protective barrier for your hair.",
    intro: "Hair Pinns is proud to serve Kirrawee with boutique hair services including Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. With over 20 years of experience, Jena understands how to create beautiful, lasting results in Sydney's coastal climate. From balayage to keratin smoothing, we offer personalized service in a relaxed, professional environment.",
    faqs: [
      {
        question: "How does coastal air affect my hair in Kirrawee?",
        answer: "Coastal air brings both salt and humidity, which can dry out hair while also causing frizz. Our smoothing treatments seal moisture inside while blocking humidity from outside. We recommend using a leave-in conditioner with UV protection daily, and a deep conditioning mask weekly to counteract salt and sun damage. Regular trims every 6–8 weeks prevent split ends.",
      },
      {
        question: "Can you fix uneven colour from box dye?",
        answer: "Yes, we specialize in colour correction. Box dyes often result in uneven colour, brassiness, or damage. We'll assess your current colour and hair condition, then create a custom plan to get you to your desired shade safely. This may involve multiple sessions to preserve hair health. Always book a consultation before attempting colour correction at home.",
      },
      {
        question: "What's included in your smoothing treatment service?",
        answer: "Our smoothing treatment includes a thorough consultation, clarifying shampoo to remove buildup, application of professional smoothing formula, processing time, blow-dry, and flat-iron sealing. We'll also provide aftercare instructions and product recommendations. The service takes 2–3 hours and results last 3–4 months. Follow-up appointments can be booked online via Fresha.",
      },
    ],
    nearbySuburbs: ["sutherland", "gymea"],
  },
  kareela: {
    slug: "kareela",
    name: "Kareela",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Kareela with Colour, Smoothing, and Cuts. 10–12 minutes via President Avenue, with hydrating treatments for bushland surrounds.",
    driveTime: "10–12 minutes",
    route: "President Avenue via Bangor",
    localNote: "Kareela's bushland surrounds can mean extra dryness. Our hydrating treatments restore moisture.",
    landmarks: ["Kareela Reserve", "President Avenue", "Como West"],
    seasonalNote: "Bushland can be drier than coastal areas. Our hydrating treatments restore moisture balance.",
    intro: "Just a short drive from Kareela, Hair Pinns offers boutique hair expertise with over 20 years of experience. We specialize in Colour & Blonding, Smoothing & Treatments, and precision Cuts & Styling designed for your lifestyle and Sydney's climate. Jena's personalized approach ensures you receive the perfect service, whether you need a colour change, frizz control, or a fresh new look.",
    faqs: [
      {
        question: "Why does my hair feel so dry in Kareela?",
        answer: "Kareela's bushland environment can be drier than coastal areas, leading to dehydrated hair. We recommend deep conditioning treatments monthly and using a leave-in conditioner daily. Our in-salon hydrating treatments penetrate deeply to restore moisture balance. Avoid over-washing (2–3 times per week is ideal) and use lukewarm water instead of hot to prevent further dryness.",
      },
      {
        question: "How do I maintain my colour between appointments?",
        answer: "Use colour-safe, sulfate-free shampoo and conditioner to prevent fading. Wash hair in cool water and limit washing to 2–3 times per week. Apply a colour-protecting leave-in spray before heat styling. For blonde hair, use purple shampoo weekly to neutralize brassiness. Book a gloss treatment every 6–8 weeks to refresh vibrancy between full colour services.",
      },
      {
        question: "What's the difference between smoothing and straightening?",
        answer: "Smoothing treatments reduce frizz and volume while maintaining natural movement and texture. Straightening (like Japanese straightening) permanently alters hair structure for poker-straight results. Smoothing is gentler, lasts 3–4 months, and gives you flexible styling options. We'll recommend the best option based on your hair type, texture, and desired outcome during your consultation.",
      },
    ],
    nearbySuburbs: ["sutherland", "como"],
  },
  como: {
    slug: "como",
    name: "Como",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Como with Colour, Smoothing, and Cuts. 12–14 minutes via Princes Highway, with smoothing treatments proven for riverside humidity.",
    driveTime: "12–14 minutes",
    route: "Princes Highway",
    localNote: "Como's riverside location means high humidity. Our smoothing treatments are proven effective.",
    landmarks: ["Georges River", "Como Railway Bridge", "Como Pleasure Grounds"],
    seasonalNote: "Riverside humidity peaks in summer. Smoothing treatments last 3-4 months through the season.",
    intro: "Hair Pinns welcomes clients from Como to experience boutique hair care with a focus on Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. With over 20 years of expertise, Jena delivers personalized service that considers your hair's unique needs and Sydney's challenging climate. Whether you're battling frizz, seeking the perfect blonde, or ready for a style refresh, we're here to help.",
    faqs: [
      {
        question: "How do I combat frizz from Como's riverside humidity?",
        answer: "Como's riverside location creates high humidity levels that cause frizz. Our smoothing treatments seal the hair cuticle to block moisture and maintain sleekness for 3–4 months. Between treatments, use anti-humidity serums and avoid touching your hair throughout the day. Silk pillowcases also help reduce friction and frizz overnight. We'll customize a frizz-control routine for your hair type.",
      },
      {
        question: "What causes blonde hair to turn brassy in Sydney?",
        answer: "Brassiness is caused by mineral buildup from water, UV oxidation, and colour fading. Sydney's hard water accelerates this process. Use a chelating shampoo weekly to remove minerals, purple shampoo 1–2 times weekly to neutralize warmth, and UV protectant spray daily. Professional toning every 6–8 weeks keeps your blonde cool and vibrant. We use custom-blended toners for perfect results.",
      },
      {
        question: "Can I swim after a smoothing treatment?",
        answer: "Wait at least 48 hours before swimming after a smoothing treatment to allow the formula to fully set. Before swimming, wet your hair with clean water and apply a leave-in conditioner to create a barrier against chlorine. Rinse immediately after swimming and use a clarifying shampoo weekly to remove chlorine buildup. With proper care, your smoothing treatment will last the full 3–4 months.",
      },
    ],
    nearbySuburbs: ["kareela", "gymea"],
  },
  gymea: {
    slug: "gymea",
    name: "Gymea",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Gymea and the Sutherland Shire with Colour, Smoothing, and Cuts. 15–18 minutes via Princes Highway, with treatments that protect against coastal salt air.",
    driveTime: "15–18 minutes",
    route: "Princes Highway",
    localNote: "Gymea's coastal proximity means salt air and humidity. Our treatments protect your hair from both.",
    landmarks: ["Cronulla Beach", "Gymea Bay", "Sutherland Shire"],
    seasonalNote: "Beach season brings extra salt and sun. UV protectants and our treatments keep hair healthy.",
    intro: "Hair Pinns is your boutique hair salon serving Gymea and the Sutherland Shire with over 20 years of expertise. We specialize in Colour & Blonding, Smoothing & Treatments, and precision Cuts & Styling tailored to Sydney's coastal climate. Jena's personalized approach ensures you receive attentive service in a welcoming environment, with results that last through humidity, salt air, and sun exposure.",
    faqs: [
      {
        question: "How does coastal salt air damage hair in Gymea?",
        answer: "Salt air draws moisture out of hair, causing dryness, brittleness, and frizz. The salt also oxidizes colour, leading to fading and brassiness. Use a UV and salt protectant spray daily, and rinse hair with fresh water after beach visits. Deep conditioning treatments weekly restore moisture. Our smoothing treatments also create a protective barrier against environmental damage for 3–4 months.",
      },
      {
        question: "What's the best blonde shade for Sydney's climate?",
        answer: "Warmer, sun-kissed blondes tend to age more gracefully in Sydney's climate than cool, icy blondes. Balayage and dimensional colour with varied tones look more natural as they grow out and are more forgiving with brassiness. We'll customize a blonde shade that complements your skin tone and lifestyle while being low-maintenance between appointments. Toning every 6–8 weeks keeps it fresh.",
      },
      {
        question: "How do I know if I need a smoothing treatment?",
        answer: "If you spend more than 20 minutes styling your hair daily, struggle with frizz and flyaways, or your hair loses its style by midday, a smoothing treatment can help. It reduces styling time by 50%, makes hair more manageable, and provides lasting smoothness for 3–4 months. Book a consultation and we'll assess your hair and recommend the best treatment for your needs.",
      },
    ],
    nearbySuburbs: ["miranda", "como"],
  },
  miranda: {
    slug: "miranda",
    name: "Miranda",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Miranda with Colour, Smoothing, and Cuts. 15–18 minutes via Princes Highway, with all-day hold for busy lifestyles.",
    driveTime: "15–18 minutes",
    route: "Princes Highway",
    localNote: "Miranda's shopping district bustle means you need hair that lasts. Our treatments deliver all-day hold.",
    landmarks: ["Westfield Miranda", "Miranda Fair", "Sutherland Shire"],
    seasonalNote: "Busy lifestyles need hair that lasts. Our smoothing treatments reduce styling time and hold all day.",
    intro: "Located near Miranda, Hair Pinns offers boutique hair expertise with over 20 years of experience in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Jena understands the demands of busy lifestyles and creates hair that looks great from morning to evening. Whether you're shopping, working, or socializing, we'll ensure your hair stays polished and manageable all day long.",
    faqs: [
      {
        question: "How can I make my style last all day in Miranda?",
        answer: "Long-lasting styles require the right foundation. Our smoothing treatments reduce frizz and make hair more manageable, so your style holds better. Use volumizing mousse at the roots and a light hold hairspray to set your style. Avoid touching your hair throughout the day, which can disrupt the style. Silk pillowcases at night help preserve blow-dries for 2–3 days between washes.",
      },
      {
        question: "What's the best way to maintain keratin smoothing?",
        answer: "After a keratin treatment, wait 48 hours before washing and avoid tying hair up or using clips. Use sulfate-free shampoo and conditioner exclusively to prevent stripping the treatment. Apply a heat protectant before styling and avoid excessive heat. Wash hair only 2–3 times per week with lukewarm water. With proper care, keratin smoothing lasts 3–4 months in Sydney's climate.",
      },
      {
        question: "Can you match my current hair colour exactly?",
        answer: "Yes, we can match your current colour or recreate a shade from a photo. Bring reference images to your consultation so we can discuss your goals. We'll assess your current colour, hair condition, and history to create a custom formula. For the most accurate match, avoid washing your hair right before the appointment so we can see your true colour.",
      },
    ],
    nearbySuburbs: ["gymea", "kirrawee"],
  },
  engadine: {
    slug: "engadine",
    name: "Engadine",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Engadine with Colour, Smoothing, and Cuts. 10–12 minutes via Princes Highway via Heathcote, with hydrating treatments for bush surrounds.",
    driveTime: "10–12 minutes",
    route: "Princes Highway via Heathcote",
    localNote: "Engadine's bush surrounds can mean dryness and dust. Our hydrating treatments restore vitality.",
    landmarks: ["Royal National Park", "Heathcote Road", "Engadine wetlands"],
    seasonalNote: "Bushland dryness and dust. Our hydrating treatments and clarifying shampoos restore hair vitality.",
    intro: "Hair Pinns is your local boutique salon serving Engadine with over 20 years of expertise in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Jena's personalized approach delivers results that work with your lifestyle and Sydney's environment. Whether you're dealing with dry, damaged hair or seeking a fresh colour and cut, we'll help you achieve healthy, beautiful hair you'll love.",
    faqs: [
      {
        question: "How do I protect my hair from Engadine's dry conditions?",
        answer: "Engadine's bushland environment can be drier than coastal areas, leading to dehydrated, brittle hair. Use a deep conditioning mask weekly and a leave-in conditioner daily to lock in moisture. Avoid over-washing and use lukewarm water instead of hot. Our in-salon hydrating treatments penetrate deeply to restore moisture balance. Regular trims every 6–8 weeks prevent split ends from traveling up the hair shaft.",
      },
      {
        question: "What's the best way to refresh faded colour?",
        answer: "For a quick refresh between full colour services, book a gloss treatment. Glosses add shine, neutralize unwanted tones, and revive vibrancy in just 30–40 minutes. They're gentle on hair and can be customized to your desired tone. For more significant colour changes or coverage of greys, a full colour service is needed. We'll recommend the best option during your consultation based on your goals.",
      },
      {
        question: "How do smoothing treatments work in dry climates?",
        answer: "Smoothing treatments work well in dry climates by sealing the cuticle and locking moisture inside. Unlike humid areas where we fight moisture from outside, in drier areas we preserve internal moisture. The treatment creates a protective barrier that prevents environmental dryness from dehydrating your hair. Results last 3–4 months with proper sulfate-free aftercare and regular hydrating masks.",
      },
    ],
    nearbySuburbs: ["heathcote", "woronora"],
  },
  heathcote: {
    slug: "heathcote",
    name: "Heathcote",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Heathcote with Colour, Smoothing, and Cuts. Just 5–7 minutes via Princes Highway, with treatments designed for bushland conditions.",
    driveTime: "5–7 minutes",
    route: "Princes Highway",
    localNote: "Heathcote's bush setting means low humidity but dusty air. Our protective treatments seal your style.",
    landmarks: ["Royal National Park", "Heathcote National Park", "Princes Highway"],
    seasonalNote: "Gateway to Royal National Park. Our treatments protect hair from bushland dust and variable humidity.",
    intro: "Hair Pinns is your nearby boutique salon serving Heathcote with over 20 years of hair expertise. We specialize in Colour & Blonding, Smoothing & Treatments, and precision Cuts & Styling designed for your unique hair needs. Jena's personalized approach ensures you receive professional service in a welcoming environment, with results that withstand Sydney's diverse climate conditions from bush to coast.",
    faqs: [
      {
        question: "How does Heathcote's bushland air affect hair?",
        answer: "Heathcote's bushland environment typically has lower humidity than coastal areas, but dust and pollen can accumulate in hair, making it look dull and feel rough. Use a clarifying shampoo weekly to remove buildup and restore shine. Our smoothing treatments create a protective barrier that helps prevent dust adhesion while keeping hair sleek and manageable for 3–4 months. Regular deep conditioning maintains moisture levels.",
      },
      {
        question: "What colour services do you offer?",
        answer: "We offer full colour services including root touch-ups, all-over colour, balayage, foil highlights, colour correction, toning, and glossing. Each service includes a consultation to assess your hair and discuss your goals. We use professional-grade products that minimize damage while delivering vibrant, long-lasting colour. Custom colour formulation ensures your shade is unique to you and complements your skin tone perfectly.",
      },
      {
        question: "How far in advance should I book my appointment?",
        answer: "We recommend booking 2–4 weeks in advance for colour services and smoothing treatments, especially for weekends and school holidays. For cuts or simple services, 1–2 weeks is usually sufficient. If you need an urgent appointment, call us directly and we'll do our best to accommodate you. You can book easily online via Fresha or call the salon during business hours.",
      },
    ],
    nearbySuburbs: ["engadine", "bangor"],
  },
  cronulla: {
    slug: "cronulla",
    name: "Cronulla",
    quickAnswer: "Hair Pinns serves Cronulla with colour, smoothing and cuts, just 20-25 minutes inland in Bangor. We specialise in beach hair care: restoring sun and salt damage, maintaining blonde brightness, and keratin smoothing for coastal frizz.",
    driveTime: "20–25 minutes",
    route: "Kingsway, Taren Point Road",
    localNote: "Beach and salt exposure can dry and damage hair. Our bond repair and smoothing treatments restore and protect.",
    landmarks: ["Cronulla Beach", "Royal National Park", "Sutherland Shire"],
    seasonalNote: "Summer sun and salt intensify damage. Book a deep conditioning or bond repair before beach season.",
    intro: "Hair Pinns serves Cronulla with colour, smoothing and cuts, just 20-25 minutes inland in Bangor. We specialise in beach hair care: restoring sun and salt damage, maintaining blonde brightness, and keratin smoothing for coastal frizz. Whether you need blonde foiling, deep conditioning, or a fresh cut, Jena delivers boutique care with over 20 years of experience. Easy parking, honest advice. Book online via Fresha or text for a quote.",
    faqs: [
      {
        question: "How far is Hair Pinns from Cronulla?",
        answer: "About 20–25 minutes via Kingsway and Taren Point Road. Free parking at the salon. No city traffic, easy drive from Cronulla and the beaches.",
      },
      {
        question: "Can you fix beach-damaged hair?",
        answer: "Yes. We use bond repair treatments (Juuce, Olaplex) and deep conditioning to restore sun and salt damage. Regular treatments plus at-home care with sulphate-free products and UV protectant keep beach hair healthy and bright.",
      },
      {
        question: "What's the best way to protect blonde hair from the beach?",
        answer: "Use a UV protectant spray before sun exposure, purple shampoo 1–2 times weekly to combat brassiness, and a weekly hydrating mask. Our smoothing treatments also create a barrier that helps protect against environmental damage for 3–4 months.",
      },
    ],
    nearbySuburbs: ["miranda", "gymea", "sutherland"],
  },
  sydney: {
    slug: "sydney",
    name: "Sydney",
    quickAnswer: "Hair Pinns serves Sydney with colour, blonding, keratin smoothing and precision cuts. Just 35–45 minutes from the CBD, our Bangor salon offers boutique care without city prices.",
    driveTime: "35–45 minutes",
    route: "M1 south",
    localNote: "Skip the city salon markup. Same premium quality, easier parking, personalised care.",
    landmarks: ["Sydney CBD", "M1 Motorway", "Sutherland Shire"],
    seasonalNote: "Sydney humidity peaks in summer. Our smoothing treatments are designed for these conditions.",
    intro: "Hair Pinns serves Sydney with colour, blonding, keratin smoothing and precision cuts. Just 35–45 minutes from the CBD, our Bangor salon offers boutique care without city prices. Whether you're after dimensional balayage, frizz-taming smoothing treatments, or a fresh cut that works with Sydney's humidity, Jena brings over 20 years of experience to every appointment. Book online 24/7 or text for a personalised quote.",
    faqs: [
      {
        question: "How far is Hair Pinns from Sydney CBD?",
        answer: "About 35–45 minutes south via M1. Easy parking, no city stress. Many Sydney clients make the drive for boutique care at better value.",
      },
      {
        question: "Do you do keratin smoothing?",
        answer: "Yes! Our smoothing treatments last 3–5 months and are perfect for Sydney's humidity. We use professional-grade formulas tailored to your hair type.",
      },
      {
        question: "Can I book online?",
        answer: "Yes, book 24/7 via Fresha. You'll get instant confirmation. You can also text +61 468 093 991 for a personalised quote or to ask questions.",
      },
    ],
    nearbySuburbs: ["miranda", "sutherland", "gymea"],
  },
};

export const getAllSuburbSlugs = (): string[] => {
  return Object.keys(suburbPages);
};

export const getSuburbData = (slug: string): SuburbData | undefined => {
  return suburbPages[slug];
};
