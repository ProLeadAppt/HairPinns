import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingBag } from "lucide-react";
import Badge from "@/components/design-system/Badge";

const ProductDetail = () => {
  const { handle } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/collections" className="hover:text-foreground transition-colors">Collections</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground">Product</span>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-muted rounded-card overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <Badge variant="accent" className="mb-4">Professional Grade</Badge>
              <h1 className="text-h1-lg font-heading text-heading mb-4">
                Product Name
              </h1>
              <p className="text-2xl font-semibold text-brand-500 mb-6">$45.00</p>
              
              <p className="text-foreground mb-6 leading-relaxed">
                Premium hair care product designed for professional results at home. 
                Formulated with natural ingredients to nourish and protect your hair.
              </p>

              <div className="mb-8">
                <h3 className="font-semibold text-heading mb-3">Key Benefits:</h3>
                <ul className="space-y-2 text-foreground">
                  <li>• Deeply nourishes and hydrates</li>
                  <li>• Repairs damage and split ends</li>
                  <li>• Adds shine and smoothness</li>
                  <li>• Color-safe formula</li>
                </ul>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full mb-4"
                onClick={() => window.open('https://shopify.com', '_blank')}
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
