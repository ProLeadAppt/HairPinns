export interface Review {
  id: string;
  author: string;
  rating: 5;
  date: string;
  text: string;
  verified?: boolean;
  location?: string;
  service?: string;
}

export const googleReviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    date: "2025-01-10",
    text: "Jena transformed my blonde hair! Best full head foils I've ever had. She really understands colour and took time to explain the process. The salon is beautiful and relaxing. Highly recommend!",
    verified: true,
    location: "Menai",
    service: "Full Head Foils"
  },
  {
    id: "2",
    author: "Emma T.",
    rating: 5,
    date: "2025-01-08",
    text: "Finally found a hairdresser who gets my curly hair! The keratin smoothing has completely changed my morning routine. No more frizz even in humid weather. Worth every cent.",
    verified: true,
    location: "Bangor",
    service: "Keratin Smoothing"
  },
  {
    id: "3",
    author: "Jessica L.",
    rating: 5,
    date: "2025-01-05",
    text: "Incredible service and attention to detail. Jena spent time understanding exactly what I wanted and delivered beyond expectations. The salon is spotless and the vibe is so relaxed.",
    verified: true,
    location: "Illawong",
    service: "Cut & Colour"
  },
  {
    id: "4",
    author: "Rachel K.",
    rating: 5,
    date: "2024-12-28",
    text: "Best toner I've ever had! My blonde stays bright for weeks. Jena knows exactly how to keep brass away. She's honest about what will and won't work, no upselling, just great advice.",
    verified: true,
    location: "Menai",
    service: "Toner & Gloss"
  },
  {
    id: "5",
    author: "Amy P.",
    rating: 5,
    date: "2024-12-20",
    text: "Love my new cut! Jena really listened to what I wanted and made suggestions that suited my face shape perfectly. My hair is so much easier to style now. Can't wait for my next appointment!",
    verified: true,
    location: "Bangor",
    service: "Cut & Style"
  },
  {
    id: "6",
    author: "Michelle D.",
    rating: 5,
    date: "2024-12-15",
    text: "The Olaplex treatment saved my over-processed hair! Jena took the time to assess the damage and create a repair plan. Three sessions later and my hair feels like silk again. So grateful!",
    verified: true,
    location: "Illawong",
    service: "Olaplex Treatment"
  },
  {
    id: "7",
    author: "Kate S.",
    rating: 5,
    date: "2024-12-10",
    text: "Friendly, professional, and skilled. Jena makes you feel welcome and comfortable. My highlights look natural and blend beautifully. The products she recommended have made a huge difference too.",
    verified: true,
    location: "Bangor",
    service: "Highlights"
  },
  {
    id: "8",
    author: "Lisa H.",
    rating: 5,
    date: "2024-12-05",
    text: "I've been coming to Hair Pinns for 2 years and wouldn't go anywhere else. Jena is consistent, reliable, and genuinely cares about hair health. The salon is always clean and welcoming.",
    verified: true,
    location: "Menai",
    service: "Regular Client"
  }
];

export const productReviews: Record<string, Review[]> = {
  "hydrate-restore-pack": [
    {
      id: "p1",
      author: "Sophie R.",
      rating: 5,
      date: "2025-01-12",
      text: "This pack completely transformed my dry, damaged hair in one week. The deep treatment is incredible, my hair feels like silk. Worth every dollar!",
      verified: true
    },
    {
      id: "p2",
      author: "Natalie B.",
      rating: 5,
      date: "2025-01-08",
      text: "Love this bundle! The shampoo smells amazing and doesn't strip my colour. My hair is so much healthier since I started using these products.",
      verified: true
    },
    {
      id: "p3",
      author: "Claire M.",
      rating: 5,
      date: "2025-01-03",
      text: "Best hair care products I've used. My hair was breaking constantly but after using this system for a month, I can see new growth and the ends are so much stronger.",
      verified: true
    }
  ],
  "blonde-pack": [
    {
      id: "p4",
      author: "Hannah W.",
      rating: 5,
      date: "2025-01-11",
      text: "Finally found a purple shampoo that doesn't turn my hair gray! This pack keeps my blonde bright between salon visits. The oil is a game-changer too.",
      verified: true
    },
    {
      id: "p5",
      author: "Olivia J.",
      rating: 5,
      date: "2025-01-06",
      text: "My blonde has never looked better. The mask is so hydrating and the purple shampoo actually works without drying out my hair. Can't live without these!",
      verified: true
    }
  ]
};

export const averageRating = 4.9;
// Hair Pinns Google Business Profile review count (used in AggregateRating
// schema across LocalBusiness, Service, Product, and Store schemas — keep in
// sync with the number surfaced to humans on the homepage FAQ and Reviews page).
export const totalReviews = 762;
export const googleReviewsUrl = "https://search.google.com/local/writereview?placeid=ChIJs9xoWku_EmsRo264WfJGtg4";
