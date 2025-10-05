import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye, Check } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const ProductSpotlight = () => {
  const products = [
    {
      slug: "hydrate-restore-pack",
      title: "Hydrate & Restore Pack",
      price: "$89.00",
      image: "/placeholder.svg",
      bullets: [
        "For dry, damaged hair",
        "Shampoo, conditioner & treatment",
        "Save $25 vs buying separately"
      ]
    },
    {
      slug: "blonde-brilliance-set",
      title: "Blonde Brilliance Set",
      price: "$95.00",
      image: "/placeholder.svg",
      bullets: [
        "Tone & brighten blonde hair",
        "Purple shampoo, mask & oil",
        "Save $30 on this bundle"
      ]
    },
    {
      slug: "ultimate-styling-trio",
      title: "Ultimate Styling Trio",
      price: "$75.00",
      image: "/placeholder.svg",
      bullets: [
        "Salon-quality styling at home",
        "Heat protectant, cream & spray",
        "Perfect gift for hair lovers"
      ]
    },
    {
      slug: "curl-care-collection",
      title: "Curl Care Collection",
      price: "$82.00",
      image: "/placeholder.svg",
      bullets: [
        "Define & nourish curls",
        "Curl cream, gel & leave-in",
        "Save $22 in this pack"
      ]
    },
    {
      slug: "color-protect-bundle",
      title: "Color Protect Bundle",
      price: "$88.00",
      image: "/placeholder.svg",
      bullets: [
        "Extend your color vibrancy",
        "Shampoo, conditioner & serum",
        "Professional salon formula"
      ]
    },
    {
      slug: "scalp-wellness-set",
      title: "Scalp Wellness Set",
      price: "$72.00",
      image: "/placeholder.svg",
      bullets: [
        "Healthy scalp, healthy hair",
        "Scrub, treatment & tonic",
        "Great for all hair types"
      ]
    },
    {
      slug: "volume-boost-pack",
      title: "Volume Boost Pack",
      price: "$79.00",
      image: "/placeholder.svg",
      bullets: [
        "Lift & body for fine hair",
        "Volumizing shampoo, spray & powder",
        "Save $20 vs individual items"
      ]
    },
    {
      slug: "smooth-sleek-set",
      title: "Smooth & Sleek Set",
      price: "$92.00",
      image: "/placeholder.svg",
      bullets: [
        "Frizz control & shine",
        "Smoothing shampoo, serum & cream",
        "Salon-quality results at home"
      ]
    }
  ];

  return (
    <Section className="content-visibility-auto">
      <SectionHeader 
        title="Christmas Gift Packs"
        subtitle="Curated hair care bundles — perfect for gifting or treating yourself"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ containIntrinsicSize: "0 2000px" }}>
        {products.map((product) => (
          <div 
            key={product.slug}
            className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base group"
          >
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
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-heading font-semibold text-heading mb-2">
                {product.title}
              </h3>
              <p className="text-2xl font-bold text-brand-500 mb-4">
                {product.price}
              </p>
              
              <ul className="space-y-2 mb-6">
                {product.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-2">
                <Link to={`/products/${product.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Pack
                  </Button>
                </Link>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    console.log("Reserve clicked:", product.slug);
                    // Deep link to Shopify or Fresha booking
                  }}
                >
                  Reserve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/collections/christmas-gift-packs">
          <Button variant="accent" size="lg">
            View All Gift Packs
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default ProductSpotlight;
