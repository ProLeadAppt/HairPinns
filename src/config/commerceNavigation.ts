export interface CommerceDestination {
  name: string;
  shortName: string;
  handle: string;
  href: string;
  description: string;
  image: string;
}

export const SHOP_BY_CONCERN: CommerceDestination[] = [
  {
    name: "Frizz Control",
    shortName: "Frizz",
    handle: "frizz-free-must-haves",
    href: "/collections/frizz-free-must-haves",
    description: "Smoothing care for humidity, flyaways and rough ends.",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/DAA9BE23-75CA-4B08-8C44-F572D7EA7DB9.jpg?v=1747084029",
  },
  {
    name: "Heat Protection",
    shortName: "Heat",
    handle: "heat-protection",
    href: "/collections/heat-protection",
    description: "Protection for blow-dries, hot tools and summer sun.",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-042.jpg?v=1744250283",
  },
  {
    name: "Blonde Care",
    shortName: "Blonde",
    handle: "blonde-bombshells",
    href: "/collections/blonde-bombshells",
    description: "Purple care, repair and shine for lighter hair.",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-057.jpg?v=1744178135",
  },
  {
    name: "Volume & Fine Hair",
    shortName: "Volume",
    handle: "pump-up-the-volume",
    href: "/collections/pump-up-the-volume",
    description: "Lightweight care for body, lift and fuller-looking hair.",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-067.jpg?v=1744178179",
  },
  {
    name: "Curly Hair",
    shortName: "Curls",
    handle: "curly-girlys",
    href: "/collections/curly-girlys",
    description: "Moisture and definition for waves, curls and coils.",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-011.jpg?v=1744178942",
  },
];

export const FEATURED_BRANDS = [
  { name: "Juuce", href: "/collections/juuce-botanicals" },
  { name: "QIQI", href: "/collections/qiqi" },
  { name: "Pure Organic", href: "/collections/pure-certified-organic-hair-care" },
  { name: "Wet Brush", href: "/collections/wet-brush-detanglers" },
] as const;
