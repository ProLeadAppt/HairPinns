// Location page data matching Google Business Profile suburbs exactly

export interface LocationData {
  slug: string;
  name: string;
  fullName: string; // As appears on GMB
  postcode: string;
  driveTime: string;
  localIntro: string;
  /** Short pull-quote from Jena — round-robin assigned at build time so every suburb page is unique. */
  jenaTip?: string;
  popularServices: string[]; // 3 feature chips
  faqs: {
    question: string;
    answer: string;
  }[];
  nearbyLocations: string[]; // slugs for internal linking
}

export const locationPages: Record<string, LocationData> = {
  "como-2226": {
    slug: "como-2226",
    name: "Como",
    fullName: "Como NSW 2226, Australia",
    postcode: "2226",
    driveTime: "12–15 minutes",
    localIntro: "Hair Pinns is your local salon for Como, just 12-15 minutes away in Bangor. We understand riverside humidity and tailor every colour, smoothing treatment and cut to work with our local climate. From natural full head foils to keratin smoothing that lasts months, Jena's boutique salon delivers personalised care without the rush. Easy parking, flexible hours, and honest advice. Book online or text for a quote today.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How do I manage frizz from Como's riverside humidity?", answer: "Keratin smoothing seals cuticles, blocks moisture for 3–5 months." },
      { question: "What causes blonde to turn brassy?", answer: "Minerals, sun, oxidation. Use purple shampoo and UV protectant." },
      { question: "How long does smoothing take?", answer: "2–3 hours depending on length. Results last 3–5 months." },
      { question: "Can I colour before smoothing?", answer: "Yes, colour at least 1 week before smoothing treatment." }
    ],
    nearbyLocations: ["oyster-bay-2225", "jannali-2226", "sutherland-2232", "gymea-2227"]
  },
  "gymea-2227": {
    slug: "gymea-2227",
    name: "Gymea",
    fullName: "Gymea NSW 2227, Australia",
    postcode: "2227",
    driveTime: "10–12 minutes",
    localIntro: "Just 10 minutes from Gymea, Hair Pinns specialises in dimensional colour, keratin smoothing and precision cuts designed for coastal living. Jena's boutique salon in Bangor offers one-on-one care tailored to your hair type and Sydney's unique climate. Whether you need beach-blonde maintenance, frizz control, or a fresh style, we deliver professional results with honest advice and easy parking. Book online via Fresha or text for a quote.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How do I maintain blonde in Gymea?", answer: "Purple shampoo 1–2× weekly, hydrating mask, toner every 6–8 weeks." },
      { question: "Does coastal air damage hair?", answer: "Salt and humidity can dry/frizz hair. Use leave-in conditioner + UV spray." },
      { question: "Is smoothing safe for coloured hair?", answer: "Yes! Smoothing seals colour and makes it last longer." },
      { question: "How often should I get a cut?", answer: "Every 6–8 weeks to prevent split ends and maintain shape." }
    ],
    nearbyLocations: ["miranda-2228", "kirrawee-2232", "sylvania-2224", "como-2226"]
  },
  "menai-2234": {
    slug: "menai-2234",
    name: "Menai",
    fullName: "Menai NSW 2234, Australia",
    postcode: "2234",
    driveTime: "5–8 minutes",
    localIntro: "Hair Pinns is practically local for Menai, just 5-8 minutes away in Bangor. We specialise in colour, blonding, keratin smoothing and cuts tailored to the Georges River humidity. Whether you're after sun-kissed full head foils, anti-frizz smoothing that lasts months, or a precision cut, Jena brings experience behind the chair since 2009 to every appointment. Easy parking, honest advice, and boutique care. Book online 24/7 or text for a personalised quote.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How does Menai's humidity affect my hair?", answer: "Riverside humidity causes frizz. Smoothing treatments seal cuticles for 3–5 months." },
      { question: "Best way to maintain blonde from Menai?", answer: "Purple shampoo 1–2× weekly, toner every 6–8 weeks, UV protectant." },
      { question: "How long do smoothing treatments last?", answer: "3–4 months with proper aftercare. Use sulfate-free products." },
      { question: "Can I get a colour quote?", answer: "Text a photo to 0416 037 663 for detailed quote." }
    ],
    nearbyLocations: ["bangor-2234", "illawong-2234", "alfords-point-2234", "sutherland-2232"]
  },
  "bangor-2234": {
    slug: "bangor-2234",
    name: "Bangor",
    fullName: "Bangor NSW 2234, Australia",
    postcode: "2234",
    driveTime: "On-site",
    localIntro: "Hair Pinns is your local Bangor salon, right here at 60 Goorgool Road. We understand the river-valley humidity and tailor every service (colour, smoothing, cuts) to work with our unique microclimate. Whether you need dimensional blonde, keratin smoothing that lasts months, or a fresh precision cut, Jena's boutique salon delivers personalised care backed by experience behind the chair since 2009. Easy parking, flexible hours, honest advice. Book online or text 0416 037 663 for a quote.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "Why choose Hair Pinns in Bangor?", answer: "Hair Pinns has operated in Bangor since 2009 and offers colour, smoothing, cuts, and styling from 60 Goorgool Road." },
      { question: "How do I maintain hair in Bangor's climate?", answer: "Anti-humidity serums daily, smoothing treatments every 3–4 months seal cuticles." },
      { question: "What makes your smoothing different?", answer: "Professional formulas customized to your hair type for lasting results." },
      { question: "Can I drop by for a consultation?", answer: "Yes! Or book free consultation via Fresha or text for quote." }
    ],
    nearbyLocations: ["menai-2234", "barden-ridge-2234", "illawong-2234", "alfords-point-2234"]
  },
  "jannali-2226": {
    slug: "jannali-2226",
    name: "Jannali",
    fullName: "Jannali NSW 2226, Australia",
    postcode: "2226",
    driveTime: "15–18 minutes",
    localIntro: "Hair Pinns serves Jannali with colour, blonding, smoothing and cuts from its Bangor salon. Jena offers one-on-one care backed by experience behind the chair since 2009. Whether you need blonde maintenance or a style refresh, check the current service menu and availability through Fresha.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How far from Jannali?", answer: "15–18 minutes via President Ave and Princes Highway. Free parking." },
      { question: "Do you do keratin smoothing?", answer: "Yes! Perfect for Sutherland Shire humidity. Lasts 3–5 months." },
      { question: "Can I book for formals?", answer: "Yes! Book 2–3 weeks ahead for formal styles and updos." },
      { question: "What brands do you use?", answer: "Premium only: Olaplex, K18, Moroccan Oil, Juuce, Aromaganic." }
    ],
    nearbyLocations: ["como-2226", "oyster-bay-2225", "sutherland-2232", "gymea-2227"]
  },
  "kareela-2232": {
    slug: "kareela-2232",
    name: "Kareela",
    fullName: "Kareela NSW 2232, Australia",
    postcode: "2232",
    driveTime: "10–12 minutes",
    localIntro: "Hair Pinns serves Kareela clients from its Bangor salon with colour, smoothing, cuts, and styling. Jena delivers personalised care backed by experience behind the chair since 2009. Check the current service menu and availability through Fresha, or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "Why does my hair feel dry in Kareela?", answer: "Bushland environment. Deep condition monthly, use leave-in conditioner daily." },
      { question: "How do I maintain colour between appointments?", answer: "Sulfate-free products, cool water, colour-protecting spray, gloss every 6–8 weeks." },
      { question: "Smoothing vs straightening?", answer: "Smoothing reduces frizz, keeps movement. Straightening is permanent, poker-straight." },
      { question: "Can I get a quote first?", answer: "Text a photo to 0416 037 663 for detailed pricing." }
    ],
    nearbyLocations: ["sutherland-2232", "como-2226", "jannali-2226", "miranda-2228"]
  },
  "miranda-2228": {
    slug: "miranda-2228",
    name: "Miranda",
    fullName: "Miranda NSW 2228, Australia",
    postcode: "2228",
    driveTime: "15–20 minutes",
    localIntro: "Hair Pinns offers Miranda clients a Bangor-based option for colour, smoothing, cuts, and styling. Jena has worked behind the chair since 2009 and provides personalised service from 60 Goorgool Road. Check the current menu through Fresha or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How far from Miranda?", answer: "15–20 minutes south via Kingsway and Princes Highway. Free parking." },
      { question: "Do you do colour corrections?", answer: "Yes! We specialise in fixing box dye and uneven colour." },
      { question: "Is smoothing safe for all hair?", answer: "Yes! Our formulas work on all types including colour-treated hair." },
      { question: "Can I book same week?", answer: "Text 0416 037 663 and we'll fit you in when possible." }
    ],
    nearbyLocations: ["caringbah-2229", "gymea-2227", "sutherland-2232", "kirrawee-2232"]
  },
  "padstow-2211": {
    slug: "padstow-2211",
    name: "Padstow",
    fullName: "Padstow NSW 2211, Australia",
    postcode: "2211",
    driveTime: "30–35 minutes",
    localIntro: "Hair Pinns welcomes Padstow clients for boutique colour, smoothing and cuts worth the 30-minute drive to Bangor. We specialise in dimensional colour, keratin smoothing that lasts months, and precision cuts tailored to your lifestyle. Jena's one-on-one approach means personalised care, honest advice, and results you'll love. Easy motorway access via M5 to M1, free parking, premium products. Book online or text 0416 037 663 for a quote.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "Is the drive from Padstow worth it?", answer: "Yes! Boutique service, personalised care, no chain salon rush." },
      { question: "Best route from Padstow?", answer: "M5 to M1 south, 30 mins easy motorway driving." },
      { question: "Do you do keratin?", answer: "Yes! Reduces frizz, adds shine, lasts 3–5 months." },
      { question: "Can I get a quote?", answer: "Text photo to 0416 037 663 for detailed quote and timing." }
    ],
    nearbyLocations: ["cronulla-2230", "miranda-2228", "caringbah-2229"]
  },
  "cronulla-2230": {
    slug: "cronulla-2230",
    name: "Cronulla",
    fullName: "Cronulla NSW 2230, Australia",
    postcode: "2230",
    driveTime: "20–25 minutes",
    localIntro: "Hair Pinns serves Cronulla clients from its Bangor salon with colour, smoothing, cuts, and styling. Whether you need blonde foiling, conditioning care, or a fresh cut, Jena brings experience behind the chair since 2009. Check the current service menu and availability through Fresha.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How far from Cronulla?", answer: "20–25 minutes via Kingsway and Taren Point Road. Free parking." },
      { question: "Can you fix beach-damaged hair?", answer: "Yes! Deep conditioning and bond repair restore sun/salt damage." },
      { question: "Best way to protect beach hair?", answer: "UV protectant spray, weekly mask, chelating shampoo for chlorine." },
      { question: "Do you do smoothing for beachy texture?", answer: "Yes! Smoothing tames frizz while keeping natural movement." }
    ],
    nearbyLocations: ["caringbah-2229", "miranda-2228", "sylvania-2224", "gymea-2227"]
  },
  "illawong-2234": {
    slug: "illawong-2234",
    name: "Illawong",
    fullName: "Illawong NSW 2234, Australia",
    postcode: "2234",
    driveTime: "8–10 minutes",
    localIntro: "Hair Pinns serves Illawong clients from its Bangor salon with colour, smoothing, cuts, and styling. Jena delivers one-on-one care backed by experience behind the chair since 2009. Check the current service menu through Fresha or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "Why does my hair get frizzy near the river?", answer: "High humidity swells cuticles. Smoothing treatments seal them for 3–5 months." },
      { question: "Can you fix brassy blonde from swimming?", answer: "Yes! Corrective toning and deep conditioning restore vibrancy." },
      { question: "What aftercare for smoothing?", answer: "No washing 48hrs, sulfate-free products, heat protectant. Lasts 3–4 months." },
      { question: "How do I book?", answer: "Book online via Fresha or text 0416 037 663." }
    ],
    nearbyLocations: ["menai-2234", "alfords-point-2234", "bangor-2234", "barden-ridge-2234"]
  },
  "kirrawee-2232": {
    slug: "kirrawee-2232",
    name: "Kirrawee",
    fullName: "Kirrawee NSW 2232, Australia",
    postcode: "2232",
    driveTime: "12–15 minutes",
    localIntro: "Hair Pinns serves Kirrawee clients from its Bangor salon with colour, smoothing, cuts, and styling. Jena delivers personalised care backed by experience behind the chair since 2009. Check the current service menu through Fresha or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How does coastal air affect Kirrawee hair?", answer: "Salt and humidity dry/frizz hair. Use leave-in conditioner + UV protection." },
      { question: "Can you fix uneven box dye?", answer: "Yes! Colour correction may take multiple sessions for hair health." },
      { question: "What's included in smoothing?", answer: "Clarifying wash, formula application, blow-dry, flat-iron seal, aftercare advice." },
      { question: "How long does smoothing take?", answer: "2–3 hours depending on length. Results last 3–4 months." }
    ],
    nearbyLocations: ["sutherland-2232", "gymea-2227", "miranda-2228", "sylvania-2224"]
  },
  "sylvania-2224": {
    slug: "sylvania-2224",
    name: "Sylvania",
    fullName: "Sylvania NSW 2224, Australia",
    postcode: "2224",
    driveTime: "18–22 minutes",
    localIntro: "Hair Pinns serves Sylvania with boutique colour, smoothing and cuts, worth the scenic 20-minute drive to Bangor. We specialise in dimensional colour, keratin smoothing for frizz control, and precision cuts tailored to Sutherland Shire's climate. Jena's one-on-one approach means personalised care, honest advice, and premium products (Olaplex, K18, Moroccan Oil). Easy parking, flexible hours. Book online via Fresha or text for a quote.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How far from Sylvania?", answer: "18–22 minutes via Port Hacking Road. Scenic drive, free parking." },
      { question: "Do you do colour corrections?", answer: "Yes! We specialize in fixing brassiness and uneven colour." },
      { question: "Is keratin smoothing safe?", answer: "Yes! Natural formulas, customized to your hair type." },
      { question: "Can I book after hours?", answer: "Text 0416 037 663 for special requests outside regular hours." }
    ],
    nearbyLocations: ["miranda-2228", "gymea-2227", "kirrawee-2232", "caringbah-2229"]
  },
  "caringbah-2229": {
    slug: "caringbah-2229",
    name: "Caringbah",
    fullName: "Caringbah NSW 2229, Australia",
    postcode: "2229",
    driveTime: "15–20 minutes",
    localIntro: "Hair Pinns offers Caringbah clients a Bangor-based option for colour, smoothing, cuts, and styling. Jena brings experience behind the chair since 2009 to each appointment. Check the current service menu through Fresha or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How far from Caringbah?", answer: "15–20 minutes via Taren Point Road. Free parking, no mall stress." },
      { question: "Do you do keratin?", answer: "Yes! Reduces frizz, adds shine, lasts 3–5 months." },
      { question: "Can I book for events?", answer: "Yes! Braids, updos, blowouts for formals and weddings." },
      { question: "What products do you sell?", answer: "Olaplex, K18, Moroccan Oil, Juuce, Aromaganic, all salon-exclusive." }
    ],
    nearbyLocations: ["cronulla-2230", "miranda-2228", "gymea-2227", "sutherland-2232"]
  },
  "oyster-bay-2225": {
    slug: "oyster-bay-2225",
    name: "Oyster Bay",
    fullName: "Oyster Bay NSW 2225, Australia",
    postcode: "2225",
    driveTime: "15–18 minutes",
    localIntro: "Hair Pinns serves Oyster Bay clients from its Bangor salon with colour, smoothing, cuts, and styling. Jena delivers one-on-one care backed by experience behind the chair since 2009. Check the current service menu through Fresha or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How far from Oyster Bay?", answer: "15–18 minutes via Como West Road. Scenic riverside drive." },
      { question: "Do you do smoothing?", answer: "Yes! Perfect for riverside humidity. Lasts 3–5 months." },
      { question: "Can I book for formals?", answer: "Yes! Updos, braids, blowouts. Book 2–3 weeks ahead." },
      { question: "What brands do you use?", answer: "Premium only: Olaplex, K18, Moroccan Oil, Juuce, Aromaganic." }
    ],
    nearbyLocations: ["como-2226", "jannali-2226", "sylvania-2224", "kareela-2232"]
  },
  "sutherland-2232": {
    slug: "sutherland-2232",
    name: "Sutherland",
    fullName: "Sutherland NSW 2232, Australia",
    postcode: "2232",
    driveTime: "8–10 minutes",
    localIntro: "Hair Pinns serves Sutherland clients from its Bangor salon with colour, smoothing, cuts, and styling. Jena delivers personalised care backed by experience behind the chair since 2009. Check the current service menu and availability through Fresha.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How does Sutherland's water affect hair?", answer: "Mineral buildup causes dullness. Use clarifying treatment monthly." },
      { question: "How do I prevent brassy blonde?", answer: "Chelating shampoo weekly, purple shampoo, UV spray, tone every 6–8 weeks." },
      { question: "How long does smoothing take?", answer: "2–3 hours depending on length. Results last 3–4 months." },
      { question: "Can I get a quote?", answer: "Text photo to 0416 037 663 for detailed pricing." }
    ],
    nearbyLocations: ["kirrawee-2232", "kareela-2232", "menai-2234", "miranda-2228"]
  },
  "barden-ridge-2234": {
    slug: "barden-ridge-2234",
    name: "Barden Ridge",
    fullName: "Barden Ridge NSW 2234, Australia",
    postcode: "2234",
    driveTime: "5–7 minutes",
    localIntro: "Hair Pinns serves Barden Ridge clients from its Bangor salon with colour, smoothing, cuts, and styling. Jena delivers one-on-one care backed by experience behind the chair since 2009. Check the current service menu through Fresha or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How far from Barden Ridge?", answer: "Just 5-7 minutes. We're practically your neighborhood salon!" },
      { question: "Why does bushland make hair dry?", answer: "Drier climate dehydrates hair. Deep condition monthly, use leave-in daily." },
      { question: "Do you do smoothing?", answer: "Yes! Reduces frizz, adds shine, lasts 3–5 months." },
      { question: "Can I drop by for a chat?", answer: "Yes! Or text 0416 037 663 for quick quote." }
    ],
    nearbyLocations: ["bangor-2234", "menai-2234", "illawong-2234", "alfords-point-2234"]
  },
  "alfords-point-2234": {
    slug: "alfords-point-2234",
    name: "Alfords Point",
    fullName: "Alfords Point NSW 2234, Australia",
    postcode: "2234",
    driveTime: "6–8 minutes",
    localIntro: "Hair Pinns serves Alfords Point clients from its Bangor salon with colour, smoothing, cuts, and styling. Jena delivers personalised care backed by experience behind the chair since 2009. Check the current service menu through Fresha or text 0416 037 663 for help choosing a service.",
    popularServices: ["Colour & Blonding", "Keratin/Straight Up Smoothing", "Cuts & Styling"],
    faqs: [
      { question: "How do I manage frizz from coastal breeze?", answer: "Smoothing treatments seal cuticles. Use anti-humidity serums daily." },
      { question: "What's best for blonde maintenance?", answer: "Purple shampoo 1–2× weekly, hydrating mask, toner every 6–8 weeks." },
      { question: "Is smoothing safe for coloured hair?", answer: "Yes! It seals colour and makes it last longer." },
      { question: "How do I book?", answer: "Online via Fresha or text 0416 037 663." }
    ],
    nearbyLocations: ["illawong-2234", "menai-2234", "bangor-2234", "barden-ridge-2234"]
  }
};

/**
 * Jena's product tips — round-robin assigned to each suburb page at module load.
 * Different order per page = different unique copy on every page = unique LSEO signal.
 * Tips reference actual best-selling products so each has a soft cross-sell hook.
 */
const JENA_PRODUCT_TIPS: string[] = [
  "If your blonde's gone brassy in the sun, my go-to is the Aromaganics Blonde Shampoo once a week. Tones without drying.",
  "For coastal humidity, I send every [Suburb] client home with a QIQI Bare Repair Oil. 3 drops through damp hair, that's it.",
  "Straight Up Smoothing holds up to 12 weeks in coastal air. If you're tired of fighting the straightener, ask me about it.",
  "Juuce Daily Indulge is my ride-or-die for aftercare. A small amount on damp hair, blowdry, you're done.",
  "Walnut Scrub once a fortnight clears the buildup that flattens your colour. Most clients don't know about this one.",
  "Heat Shield is non-negotiable in summer. Australian UV will fry your ends if you skip it. Two sprays before blowdry.",
  "If you're between smoothing appointments, use a sulfate-free shampoo. Regular shampoo strips the treatment in half the time.",
  "Curly girls — the Aromaganics Curl Duo is what I keep behind the chair. Cleansing without the crunch.",
];

/**
 * Assign a unique Jena tip to each suburb by hashing the slug — same suburb always gets the same tip,
 * but every suburb gets a different one (mostly — 8 tips across ~30 suburbs means 3-4 share a tip,
 * which is fine because the LSEO signal comes from the surrounding copy being suburb-specific).
 */
(function assignJenaTips(): void {
  const slugs = Object.keys(locationPages);
  slugs.forEach((slug, idx) => {
    const page = locationPages[slug];
    if (!page) return;
    const tipIdx = (idx * 7 + slug.charCodeAt(0)) % JENA_PRODUCT_TIPS.length;
    page.jenaTip = JENA_PRODUCT_TIPS[tipIdx]?.replace("[Suburb]", page.name) || "";
  });
})();

export const getAllLocationSlugs = (): string[] => {
  return Object.keys(locationPages);
};

export const getLocationData = (slug: string): LocationData | undefined => {
  return locationPages[slug];
};