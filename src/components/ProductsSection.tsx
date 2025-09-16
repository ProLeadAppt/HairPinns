import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";

const featuredProducts = [
  {
    name: "Olaplex Bond Building Treatment",
    category: "Hair Treatment",
    price: "$45",
    rating: 5,
    description: "Rebuilds broken bonds to strengthen and protect hair during chemical treatments.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
  },
  {
    name: "Kevin Murphy Session Spray",
    category: "Styling",
    price: "$38",
    rating: 5,
    description: "Flexible hold hairspray that provides texture and grip for effortless styling.",
    image: "https://images.unsplash.com/photo-1563395181-fdf2e283ba99?w=400&h=400&fit=crop",
  },
  {
    name: "Moroccan Oil Treatment",
    category: "Leave-in Treatment",
    price: "$42",
    rating: 5,
    description: "Nourishing treatment that adds shine, smoothness, and reduces drying time.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
  },
];

const ProductsSection = () => {
  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Professional Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your salon experience home with our carefully curated selection 
            of professional-grade hair care products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth border-border overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={`${product.name} professional hair care product`}
                  className="w-full h-full object-cover hover:scale-105 transition-smooth"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-rose-gold font-medium">{product.category}</span>
                  <div className="flex">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-rose-gold text-rose-gold" />
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">{product.price}</span>
                  <Button 
                    variant="rose-gold" 
                    size="sm"
                    onClick={() => window.open('https://shopify.com', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            variant="rose-gold-outline" 
            size="lg"
            onClick={() => window.open('https://shopify.com', '_blank')}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;