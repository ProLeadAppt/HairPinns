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
  "bangor": {
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
  "menai": {
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
  "illawong": {
    slug: "illawong",
    name: "Illawong",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Illawong and surrounding suburbs. Colour, Smoothing, and Cuts tailored to Sydney's climate, 8-10 minutes via Alfords Point Road and Menai Road.",
    driveTime: "8–10 minutes",
    route: "Alfords Point Road and Menai Road",
    localNote: "Illawong's riverside location means extra humidity, perfect for our anti-frizz smoothing treatments.",
    landmarks: ["Georges River", "Illawong Bay", "Alfords Point Bridge"],
    seasonalNote: "Riverside humidity peaks in summer. Our treatments seal the cuticle to combat frizz year-round.",
    intro: "Hair Pinns is your local salon serving Illawong and surrounding suburbs. We specialize in Colour & Blonding, Smoothing & Treatments, and precision Cuts & Styling tailored to Sydney's unique climate. With Jena's 20+ years of experience, you'll receive personalized service in a welcoming, boutique environment. From full head foils to keratin treatments, we've got your hair goals covered.",
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
  "woronora": {
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
  "sutherland": {
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
  "kirrawee": {
    slug: "kirrawee",
    name: "Kirrawee",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Kirrawee with Colour, Smoothing, and Cuts. 12–15 minutes via Princes Highway, with treatments designed for coastal air.",
    driveTime: "12–15 minutes",
    route: "Princes Highway",
    localNote: "Kirrawee's coastal air brings salt and humidity. Our treatments protect against both.",
    landmarks: ["Cronulla Beach", "Royal National Park", "Princes Highway"],
    seasonalNote: "Coastal salt air and summer humidity. Our treatments create a protective barrier for your hair.",
    intro: "Hair Pinns is proud to serve Kirrawee with boutique hair services including Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. With over 20 years of experience, Jena understands how to create beautiful, lasting results in Sydney's coastal climate. From full head foils to keratin smoothing, we offer personalized service in a relaxed, professional environment.",
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
  "kareela": {
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
  "como": {
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
  "gymea": {
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
        answer: "Warmer, sun-kissed blondes tend to age more gracefully in Sydney's climate than cool, icy blondes. Dimensional full head foils with varied tones look more natural as they grow out and are more forgiving with brassiness. We'll customize a blonde shade that complements your skin tone and lifestyle while being low-maintenance between appointments. Toning every 6–8 weeks keeps it fresh.",
      },
      {
        question: "How do I know if I need a smoothing treatment?",
        answer: "If you spend more than 20 minutes styling your hair daily, struggle with frizz and flyaways, or your hair loses its style by midday, a smoothing treatment can help. It reduces styling time by 50%, makes hair more manageable, and provides lasting smoothness for 3–4 months. Book a consultation and we'll assess your hair and recommend the best treatment for your needs.",
      },
    ],
    nearbySuburbs: ["miranda", "como"],
  },
  "miranda": {
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
  "engadine": {
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
  "heathcote": {
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
        answer: "We offer full colour services including root touch-ups, all-over colour, full head foils, half head foils, quarter head foils, colour correction, toning, and glossing. Each service includes a consultation to assess your hair and discuss your goals. We use professional-grade products that minimize damage while delivering vibrant, long-lasting colour. Custom colour formulation ensures your shade is unique to you and complements your skin tone perfectly.",
      },
      {
        question: "How far in advance should I book my appointment?",
        answer: "We recommend booking 2–4 weeks in advance for colour services and smoothing treatments, especially for weekends and school holidays. For cuts or simple services, 1–2 weeks is usually sufficient. If you need an urgent appointment, call us directly and we'll do our best to accommodate you. You can book easily online via Fresha or call the salon during business hours.",
      },
    ],
    nearbySuburbs: ["engadine", "bangor"],
  },
  "cronulla": {
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
  "sydney": {
    slug: "sydney",
    name: "Sydney",
    quickAnswer: "Hair Pinns serves Sydney with colour, blonding, keratin smoothing and precision cuts. Just 35–45 minutes from the CBD, our Bangor salon offers boutique care without city prices.",
    driveTime: "35–45 minutes",
    route: "M1 south",
    localNote: "Skip the city salon markup. Same premium quality, easier parking, personalised care.",
    landmarks: ["Sydney CBD", "M1 Motorway", "Sutherland Shire"],
    seasonalNote: "Sydney humidity peaks in summer. Our smoothing treatments are designed for these conditions.",
    intro: "Hair Pinns serves Sydney with colour, blonding, keratin smoothing and precision cuts. Just 35–45 minutes from the CBD, our Bangor salon offers boutique care without city prices. Whether you're after dimensional full head foils, frizz-taming smoothing treatments, or a fresh cut that works with Sydney's humidity, Jena brings over 20 years of experience to every appointment. Book online 24/7 or text for a personalised quote.",
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
        answer: "Yes, book 24/7 via Fresha. You'll get instant confirmation. You can also text 0416 037 663 for a personalised quote or to ask questions.",
      },
    ],
    nearbySuburbs: ["miranda", "sutherland", "gymea"],
  },
  "barden-ridge": {
    slug: "barden-ridge",
    name: "Barden Ridge",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Barden Ridge with Colour, Smoothing and Cuts. Just 5–8 minutes via Old Illawarra Road, with services tailored to bushland-edge living and Sutherland Shire humidity.",
    driveTime: "5–8 minutes",
    route: "Old Illawarra Road",
    localNote: "Barden Ridge sits on the bushland edge — dry winds in winter, river humidity in summer. Both extremes need different care, and we tune each appointment to the season you're booking in.",
    landmarks: ["Heathcote Road", "Bangor State Forest", "Old Illawarra Road"],
    seasonalNote: "Bushland-edge suburbs hit colder mornings in winter — hydration treatments are particularly worth booking through May–August.",
    intro: "Hair Pinns is a quick 5–8 minute drive from Barden Ridge, with Jena's 20+ years of experience behind every appointment. We cover the full range of colour, blonding, Straight Up smoothing, foils and cuts — and because Barden Ridge sits right on the bushland fringe with a different climate profile to the riverside suburbs, we tailor recommendations to your specific routine. Easy parking, honest advice, no upselling.",
    faqs: [
      {
        question: "How do I keep my hair healthy through Sydney winters in Barden Ridge?",
        answer: "Bushland-edge suburbs like Barden Ridge run cooler and drier than the river-belt suburbs, which can leave hair brittle and static-prone in winter. We recommend a hydration mask weekly (Juuce Super Soft Hydration is a salon favourite), plus a leave-in conditioner like Juuce Botanic Oil Serum to lock in moisture between washes. If you colour or blonde, book a gloss or toner every 6–8 weeks — winter dryness exaggerates brassiness fast.",
      },
      {
        question: "Is it worth driving to Bangor for hair when there are closer options?",
        answer: "Most of our Barden Ridge regulars say yes — the drive is under 10 minutes and what you get in return is consultation time, real expertise, and a salon that's not running you through on a 30-minute clock. We don't upsell, we tell you what your hair actually needs, and we stock the products we personally use on clients. Easier parking than the bigger Miranda salons too.",
      },
      {
        question: "Can I book a colour and smoothing in one visit?",
        answer: "Best practice is to space colour and smoothing at least a week apart — colour needs to settle into the cuticle before a smoothing treatment seals it. We're happy to plan a two-visit schedule that gets both done with the right gap, and our pricing for the combo is the same as booking each service separately. Text us or book the colour first on Fresha and we'll handle the smoothing booking from there.",
      },
    ],
    nearbySuburbs: ["menai", "bangor", "illawong"],
  },
  "caringbah": {
    slug: "caringbah",
    name: "Caringbah",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Caringbah with Colour, Smoothing and Cuts. About 15–18 minutes via The Kingsway, with the personalised service you don't get at a busy Westfield-area salon.",
    driveTime: "15–18 minutes",
    route: "The Kingsway via Box Road",
    localNote: "Caringbah locals tell us they make the drive to escape the rushed feel of busier Shire-centre salons. We're boutique, one-stylist, and time is built into every appointment.",
    landmarks: ["Caringbah Station", "Westfield Miranda", "The Kingsway"],
    seasonalNote: "Caringbah's proximity to Botany Bay means heavier salt air than the inland suburbs — that adds dryness on top of summer humidity, so layered hydration matters.",
    intro: "Hair Pinns is about 15–18 minutes from Caringbah via The Kingsway, with Jena bringing over 20 years of hairdressing experience to every appointment. We cover colour and blonding, Straight Up smoothing treatments, foils, cuts and kids/formal styling. If you've been bouncing between bigger Caringbah and Miranda salons looking for someone who'll actually listen, give us a try — boutique service, honest advice, easy parking.",
    faqs: [
      {
        question: "What makes a boutique salon in Bangor different from the bigger Caringbah salons?",
        answer: "Time. We see one client at a time, so consultations don't get rushed, colour gets the development minutes it actually needs, and Jena can adjust the approach during the appointment based on how your hair is responding. You're not handed off between three stylists. That's the main reason Caringbah clients make the drive — and it's why so many of them book the same Saturday slot every six weeks.",
      },
      {
        question: "Can you fix a colour I'm not happy with?",
        answer: "Yes, colour correction is one of Jena's specialisations. Bring a clear photo of where you are now and where you want to be, and we'll quote honestly — including whether it's a one-visit fix or needs to be staged over multiple sessions. We don't promise miracles, but with 20+ years of correction work we can usually get there safely. Text 0416 037 663 with photos for the fastest quote.",
      },
      {
        question: "How do I maintain my hair in Caringbah's salt-air climate?",
        answer: "Salt air is gentle on volume but harsh on moisture — your hair will feel drier than friends a few suburbs inland. Use a hydrating mask weekly (Juuce Super Soft Hydration is our most-recommended), a leave-in oil like Juuce Botanic Oil Serum, and rinse with fresh water as soon as you can after the beach. For blonde, the salt accelerates brassiness — a purple shampoo once a week plus a toner every 6–8 weeks holds it back.",
      },
    ],
    nearbySuburbs: ["miranda", "sutherland", "cronulla"],
  },
  "jannali": {
    slug: "jannali",
    name: "Jannali",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Jannali with Colour, Smoothing and Cuts. About 10–12 minutes via the Princes Highway, ideal for clients who want time and personal care over a rushed appointment.",
    driveTime: "10–12 minutes",
    route: "Princes Highway via Como Bridge",
    localNote: "Jannali sits in the Georges River valley — humidity is on the higher side, especially in summer, which is where our smoothing treatments earn their keep.",
    landmarks: ["Jannali Station", "Jannali Oval", "Princes Highway"],
    seasonalNote: "The Georges River valley traps humidity from December through February. Booking a smoothing treatment in October–November keeps you frizz-free across the worst of summer.",
    intro: "Hair Pinns is about 10–12 minutes from Jannali via the Princes Highway. Jena specialises in colour and blonding, Straight Up smoothing treatments, foils, and precision cuts — every service backed by 20+ years of professional experience. The Georges River valley brings its own humidity profile, and we tailor every treatment to that. Book online 24/7 through Fresha or text for a personalised quote.",
    faqs: [
      {
        question: "Why is smoothing so popular with Jannali clients?",
        answer: "The Georges River valley funnels humidity from late spring through early autumn. Even hair that behaves perfectly in winter starts frizzing by November. Our Straight Up smoothing treatments seal the cuticle and hold against humidity for 8–12 weeks. Booking in October means you stay smooth through Christmas; booking in February holds you to autumn. The teen pricing is also popular for school-age clients wanting a fix before formal season.",
      },
      {
        question: "Do you offer school formal styling for Jannali high schools?",
        answer: "Yes — Jena does formal hair for primary and high school formals across the Shire, including Jannali area schools. Book at least 4–6 weeks ahead during peak formal season (October–November is busiest). Bring a photo of the style you'd like and we'll do a quick test run if there's time. Hair Pinns also stocks the at-home products needed to keep the style holding through the night.",
      },
      {
        question: "What's the best home shampoo and conditioner for colour-treated hair?",
        answer: "Our most-recommended duo for coloured hair is the Juuce Miracle Smooth shampoo and conditioner — gentle on colour, controls frizz, and works across most hair types. For blondes specifically, the Pure Forever Blonde shampoo and conditioner keep tones cool. Both are sulphate-free, which is the single biggest thing you can do at home to make colour last longer. All in stock with Australia-wide shipping at hairpinns.com.",
      },
    ],
    nearbySuburbs: ["como", "sutherland", "kirrawee"],
  },
  "oyster-bay": {
    slug: "oyster-bay",
    name: "Oyster Bay",
    quickAnswer: "Hair Pinns is a boutique hair salon in Bangor serving Oyster Bay with Colour, Smoothing and Cuts. About 12–15 minutes via Como Road and Princes Highway, with services tuned for waterfront-suburb humidity.",
    driveTime: "12–15 minutes",
    route: "Como Road via Princes Highway",
    localNote: "Oyster Bay is a quiet leafy peninsula off the Georges River — beautiful to live in, but the river air keeps humidity higher than the western Shire suburbs.",
    landmarks: ["Georges River", "Oyster Bay Reserve", "Oyster Bay Peninsula"],
    seasonalNote: "Waterfront peninsulas hold humidity year-round. Smoothing treatments are worth booking even in cooler months — the moisture in the air doesn't drop the way it does inland.",
    intro: "Hair Pinns is around 12–15 minutes from Oyster Bay via Como Road and the Princes Highway. Jena's 20+ years of professional experience means every appointment gets the time and attention it needs — colour, blonding, Straight Up smoothing, foils, cuts. Living on the peninsula brings constant river humidity, and we tune every treatment recommendation to that reality. Easy parking, no upselling, honest advice.",
    faqs: [
      {
        question: "Does waterfront living really change how I should care for my hair?",
        answer: "Yes — and Oyster Bay is a good example. Peninsulas trap humidity from both sides, so unlike inland suburbs your hair almost never gets the dry phase that lets a blow-dry hold all day. Anti-humidity styling products help, but the bigger win is sealing the cuticle with a smoothing treatment. Our regular Oyster Bay clients book one every 3–4 months and the difference to their daily routine is significant.",
      },
      {
        question: "What's the best leave-in product for hair near the water?",
        answer: "Juuce Botanic Oil Serum is our top pick for waterfront-suburb hair — it locks in moisture, smooths frizz, and adds shine without weighing fine hair down. A few drops through mid-lengths and ends after every wash. For thicker hair, Juuce Solar Enz adds UV protection on top, useful when you're out on the water or in the garden. Both stocked at hairpinns.com with Australia-wide shipping.",
      },
      {
        question: "Is colour worth the upkeep if I'm in the water often?",
        answer: "Yes — full head foils are our most popular colour service for water-heavy lifestyles because regrowth is clean and easy to maintain. You can go 6–8 weeks between appointments with a toner refresh in between, and we'll customise the placement so the lighter pieces frame your face while the back stays lower-maintenance. Our sulphate-free aftercare range extends the life of your colour in chlorine and river water. Text 0416 037 663 with a photo for a quote.",
      },
    ],
    nearbySuburbs: ["como", "sylvania", "gymea"],
  },
  "padstow": {
    slug: "padstow",
    name: "Padstow",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Padstow with Colour, Smoothing and Cuts. About 12–15 minutes via Henry Lawson Drive across the river, with the personal service of a one-stylist studio.",
    driveTime: "12–15 minutes",
    route: "Henry Lawson Drive across Alfords Point Bridge",
    localNote: "Padstow is just across the Georges River from us, easy run via Henry Lawson Drive and the Alfords Point Bridge. Many of our Padstow regulars say the drive's actually faster than fighting Padstow traffic for a closer salon.",
    landmarks: ["Padstow Station", "Henry Lawson Drive", "Alfords Point Bridge"],
    seasonalNote: "Padstow sits on the northern bank of the Georges River — similar humidity profile to Bangor, with summer being the toughest period for fine and colour-treated hair.",
    intro: "Hair Pinns is a 12–15 minute drive from Padstow via Henry Lawson Drive and the Alfords Point Bridge. Jena has 20+ years of hairdressing experience and covers the full range — colour, blonding, Straight Up smoothing, foils, cuts, kids and formal styling. Many Padstow clients tell us the drive is faster than the local traffic, and you get a boutique salon experience at the end of it. Book online 24/7 or text for a quote.",
    faqs: [
      {
        question: "Is it really faster to drive to Bangor than to a Padstow salon?",
        answer: "For a lot of our Padstow regulars, yes. Henry Lawson Drive moves well outside peak hour and the Alfords Point Bridge crossing is usually only a couple of minutes. The catch is timing — avoid 8–9am and 5–6pm and you'll do it in 12 minutes. We have easy parking right at the salon, which alone saves you the 10 minutes of circling that Padstow shopping precinct often costs.",
      },
      {
        question: "Can you do colour for an event with short notice?",
        answer: "Same-week colour bookings are usually possible if you can come Tuesday, Thursday or Friday. Same-day is harder but worth a text to 0416 037 663 — we can often slot in a toner or gloss refresh. For full-head colour ahead of an event, give us at least 5–7 days so the colour has time to settle properly. We don't recommend major colour changes within 48 hours of an important event.",
      },
      {
        question: "Do you sell hair care products I can pick up after my appointment?",
        answer: "Yes — Hair Pinns retails the full range of products Jena uses in-salon. Pure Lamellar Vitality, Juuce shampoos and treatments, Pure Forever Blonde, Wet Brush detanglers — all stocked. You can take them home after your appointment or order anytime through hairpinns.com with Australia-wide shipping. Jena's recommendations are based on what she's actually used on your hair, not a generic upsell.",
      },
    ],
    nearbySuburbs: ["alfords-point", "illawong", "menai"],
  },
  "sylvania": {
    slug: "sylvania",
    name: "Sylvania",
    quickAnswer: "Hair Pinns is a boutique salon in Bangor serving Sylvania with Colour, Smoothing and Cuts. About 12–15 minutes via the Princes Highway, with the personal-stylist experience you don't get at the busier Westfield-area salons.",
    driveTime: "12–15 minutes",
    route: "Princes Highway via Como",
    localNote: "Sylvania (and Sylvania Waters) sit right on the Georges River — high humidity year-round, particularly hard on fine or colour-treated hair without proper aftercare.",
    landmarks: ["Tom Uglys Bridge", "Sylvania Waters", "Princes Highway"],
    seasonalNote: "Sylvania Waters and the canal estates hold humidity even on cool days. A monthly hydrating treatment plus a quality leave-in does more here than in drier suburbs.",
    intro: "Hair Pinns is about 12–15 minutes from Sylvania via the Princes Highway. With 20+ years of professional experience, Jena specialises in colour and blonding, Straight Up smoothing treatments, foils, cuts and kids/formal styling. The waterway-heavy geography of Sylvania means humidity is a near-constant — we'll talk through which products and treatments actually move the needle for your routine. Easy parking, honest pricing, no upselling.",
    faqs: [
      {
        question: "Why does my hair feel different in Sylvania than other Sydney suburbs?",
        answer: "Sylvania (especially Sylvania Waters) is more humid than most Shire suburbs because of the canal estates and proximity to the Georges River mouth. Hair that's perfectly behaved at work can fall apart on the walk to the car at home. The fix is a combination — a smoothing treatment to seal the cuticle, an anti-humidity leave-in like Juuce Botanic Oil Serum for daily styling, and a hydration mask once a week. Most Sylvania clients see real change within the first cycle.",
      },
      {
        question: "Are smoothing treatments safe if I'm in the pool a lot?",
        answer: "Yes, with two caveats. First, wait at least 2 weeks after a fresh smoothing treatment before getting back in chlorinated water — it lets the treatment fully cure. Second, always wet your hair with clean water before swimming (it stops the chlorine being absorbed) and use a clarifying-but-gentle shampoo after. Done right, smoothing actually protects pool-frequent hair from the damage chlorine usually causes.",
      },
      {
        question: "Can I get a colour quote without coming in for a consultation?",
        answer: "Yes — text a clear photo of your hair in natural light to 0416 037 663, plus a photo of the result you're after. Jena will reply with a price range and let you know if it's a one-visit job or needs to be staged. We don't quote without seeing the hair because too much depends on starting condition, but the photo + text method works well and saves you a trip if the price isn't right.",
      },
    ],
    nearbySuburbs: ["miranda", "gymea", "oyster-bay"],
  },
};

export const getAllSuburbSlugs = (): string[] => {
  return Object.keys(suburbPages);
};

export const getSuburbData = (slug: string): SuburbData | undefined => {
  return suburbPages[slug];
};
