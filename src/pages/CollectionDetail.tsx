import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExitIntentModal from "@/components/conversion/ExitIntentModal";
import TrustStrip from "@/components/conversion/TrustStrip";
import ProductBadges from "@/components/conversion/ProductBadges";
import { getOGImage } from "@/lib/sitemap";

const CollectionDetail = () => {
  const { handle } = useParams();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("best-sellers");

  // Collection metadata (would come from Shopify)
  const collectionData = {
    "christmas-gift-packs": {
      title: "Christmas Gift Packs",
      description: "Give the gift of beautiful hair this holiday season. Our curated Christmas gift packs combine salon-quality products in luxe bundles that solve specific hair concerns. Each set is thoughtfully paired to deliver professional results at home, beautifully packaged and ready to gift.",
    },
    "hair-care": {
      title: "Hair Care",
      description: "Build your perfect hair care routine with professional-grade shampoos, conditioners and leave-ins. Every product is selected for performance and compatibility with salon color treatments. From daily cleansing to intensive hydration, find formulas that work as hard as you do.",
    },
    "treatments": {
      title: "Treatments & Masks",
      description: "Transform damaged, dull or over-processed hair with intensive repair treatments. These deep-conditioning masks and bond-building treatments deliver visible results in one use, restoring strength, shine and manageability. Professional formulas for at-home use.",
    },
    "styling": {
      title: "Styling Products",
      description: "Achieve salon-worthy results at home with our curated styling range. From heat protection to finishing sprays, these professional products give you control, hold and shine without the stiffness. Perfect for all hair types and styling techniques.",
    },
  };

  const collection = collectionData[handle as keyof typeof collectionData] || collectionData["christmas-gift-packs"];

  // Hair goals filter options
  const hairGoals = [
    { value: "frizz", label: "Frizz Control" },
    { value: "blonde", label: "Blonde Care" },
    { value: "volume", label: "Volume" },
    { value: "repair", label: "Repair & Strengthen" },
  ];

  // Dummy products (replace with Shopify API)
  const products = [
    {
      id: 1,
      title: "Hydrate & Restore Pack",
      price: 89.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 47,
      isBestSeller: true,
      goals: ["repair"],
      stock: 3, // Low stock
      soldLast24h: 15, // Fast moving
      bullets: ["For dry, damaged hair", "Shampoo, conditioner & treatment", "Save $25 vs buying separately"],
    },
    {
      id: 2,
      title: "Blonde Brilliance Set",
      price: 95.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 38,
      isBestSeller: true,
      goals: ["blonde"],
      bullets: ["Tone & brighten blonde hair", "Purple shampoo, mask & oil", "Save $30 on this bundle"],
    },
    {
      id: 3,
      title: "Ultimate Styling Trio",
      price: 75.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 52,
      isBestSeller: true,
      goals: ["frizz"],
      bullets: ["Salon-quality styling at home", "Heat protectant, cream & spray", "Perfect gift for hair lovers"],
    },
    {
      id: 4,
      title: "Volume Boost Pack",
      price: 79.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 31,
      isBestSeller: false,
      goals: ["volume"],
      bullets: ["Lift & body for fine hair", "Volumizing shampoo, spray & powder", "Save $20 vs individual items"],
    },
    {
      id: 5,
      title: "Curl Care Collection",
      price: 82.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 29,
      isBestSeller: false,
      goals: ["frizz", "repair"],
      bullets: ["Define & nourish curls", "Curl cream, gel & leave-in", "Save $22 in this pack"],
    },
    {
      id: 6,
      title: "Color Protect Bundle",
      price: 88.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 44,
      isBestSeller: false,
      goals: ["repair"],
      bullets: ["Extend your color vibrancy", "Shampoo, conditioner & serum", "Professional salon formula"],
    },
    {
      id: 7,
      title: "Smooth & Sleek Set",
      price: 92.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 36,
      isBestSeller: false,
      goals: ["frizz"],
      bullets: ["Frizz control & shine", "Smoothing shampoo, serum & cream", "Salon-quality results at home"],
    },
    {
      id: 8,
      title: "Scalp Wellness Set",
      price: 72.00,
      image: "/placeholder.svg",
      rating: 5,
      reviewCount: 25,
      isBestSeller: false,
      goals: ["repair"],
      bullets: ["Healthy scalp, healthy hair", "Scrub, treatment & tonic", "Great for all hair types"],
    },
  ];

  // Filter logic
  const filteredProducts = products
    .filter((p) => {
      if (selectedGoals.length === 0) return true;
      return selectedGoals.some((goal) => p.goals.includes(goal));
    })
    .filter((p) => {
      if (priceRange === "all") return true;
      if (priceRange === "under-80") return p.price < 80;
      if (priceRange === "80-90") return p.price >= 80 && p.price <= 90;
      if (priceRange === "over-90") return p.price > 90;
      return true;
    });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "best-sellers") {
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return b.reviewCount - a.reviewCount;
    }
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  // Inject review badge every 3 items
  const productsWithBadges = sortedProducts.map((product, index) => ({
    ...product,
    showReviewBadge: (index + 1) % 3 === 0,
  }));

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{collection.title} | Hair Care Products | Hair Pinns</title>
        <meta 
          name="description" 
          content={`${collection.description.substring(0, 155)}`}
        />
        <link rel="canonical" href={`https://hairpinns.com/collections/${handle}`} />
        <meta property="og:title" content={`${collection.title} | Hair Pinns`} />
        <meta property="og:description" content={collection.description.substring(0, 155)} />
        <meta property="og:url" content={`https://hairpinns.com/collections/${handle}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOGImage('collection')} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="en-AU" href={`https://hairpinns.com/collections/${handle}`} />
      </Helmet>
      <Header />
      
      {/* Trust Strip */}
      <TrustStrip />
      
      {/* Exit Intent Modal */}
      <ExitIntentModal enabled={true} />
      
      <main>
        {/* Collection Header */}
        <section className="bg-accent py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
              {collection.title}
            </h1>
            <p className="text-lg text-foreground max-w-3xl leading-relaxed">
              {collection.description}
            </p>
          </div>
        </section>

        {/* Filters & Sort */}
        <section className="border-b border-border bg-card sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Hair Goals */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-foreground self-center mr-2">
                  Hair Goals:
                </span>
                {hairGoals.map((goal) => (
                  <Button
                    key={goal.value}
                    variant={selectedGoals.includes(goal.value) ? "primary" : "outline"}
                    size="sm"
                    onClick={() => toggleGoal(goal.value)}
                  >
                    {goal.label}
                    {selectedGoals.includes(goal.value) && <Check className="w-3 h-3 ml-1" />}
                  </Button>
                ))}
              </div>

              {/* Price & Sort */}
              <div className="flex gap-3 flex-wrap">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-80">Under $80</SelectItem>
                    <SelectItem value="80-90">$80 - $90</SelectItem>
                    <SelectItem value="over-90">Over $90</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best-sellers">Best Sellers</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsWithBadges.map((product) => (
                <div key={product.id} className="space-y-4">
                  <article className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-all duration-base group">
                    {/* Image */}
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                        loading="lazy"
                        width="600"
                        height="600"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {product.isBestSeller && (
                        <Badge
                          variant="default"
                          className="absolute top-3 left-3"
                        >
                          Best Seller
                        </Badge>
                      )}
                      {/* Product Badges (low stock, fast moving) */}
                      <div className="absolute top-3 right-3">
                        <ProductBadges
                          stock={product.stock}
                          soldLast24h={product.soldLast24h}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(product.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 text-[hsl(var(--star-color))] fill-current"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>

                      <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                        {product.title}
                      </h3>

                      <p className="text-2xl font-bold text-brand-500 mb-4">
                        ${product.price.toFixed(2)}
                      </p>

                      {/* Bullets */}
                      <ul className="space-y-2 mb-6">
                        {product.bullets.map((bullet, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Pack
                        </Button>
                        <Button variant="primary" size="sm" className="flex-1">
                          Reserve
                        </Button>
                      </div>
                    </div>
                  </article>

                  {/* Review Badge */}
                  {product.showReviewBadge && (
                    <div className="bg-accent border border-border rounded-card p-4 text-center">
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-[hsl(var(--star-color))] fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-heading mb-1">
                        4.9★ Average Rating
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From {product.reviewCount}+ verified customers
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No products match your filters. Try adjusting your selection.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* How to Choose FAQ */}
        <section className="bg-muted py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-lg font-heading font-bold text-heading mb-8 text-center">
              How to Choose
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card border border-border rounded-card px-6">
                <AccordionTrigger className="text-left font-semibold text-heading hover:text-brand-500">
                  Which pack is best for damaged or color-treated hair?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  The <strong>Hydrate & Restore Pack</strong> and <strong>Color Protect Bundle</strong> are specifically formulated for compromised hair. Both include bond-building treatments that repair damage from heat styling, chemical processing, and environmental stress. If you have blonde hair, choose the <strong>Blonde Brilliance Set</strong> for purple-toning benefits plus deep hydration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border border-border rounded-card px-6">
                <AccordionTrigger className="text-left font-semibold text-heading hover:text-brand-500">
                  How do I know if I need volume or smoothing products?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  If your hair is fine, flat, or lacks body, choose the <strong>Volume Boost Pack</strong> with lightweight formulas that lift at the roots. For thick, frizzy, or coarse hair that needs control, the <strong>Smooth & Sleek Set</strong> uses smoothing serums and anti-humidity technology. If you're unsure, book a free consult with Jena for personalized recommendations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card border border-border rounded-card px-6">
                <AccordionTrigger className="text-left font-semibold text-heading hover:text-brand-500">
                  Can I use these products if I don't have color-treated hair?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  Absolutely! All our packs work beautifully on natural, virgin hair. Color-safe formulas are sulfate-free and gentle, making them ideal for anyone seeking healthier hair. The <strong>Scalp Wellness Set</strong> is particularly great for all hair types as it focuses on scalp health, which is the foundation of strong, beautiful hair.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center mt-8">
              <p className="text-foreground mb-4">
                Still not sure? We're here to help.
              </p>
              <a 
                href="https://www.fresha.com/book-now/hair-pinns-example"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  Book Free Consultation
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionDetail;
