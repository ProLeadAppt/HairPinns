import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchShopify, cartCreate } from "@/lib/shopify";
import { Copy, ShoppingCart, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ShopInfo {
  name: string;
  primaryDomain: { url: string };
}

interface Collection {
  title: string;
  handle: string;
}

interface TestProduct {
  title: string;
  handle: string;
  firstVariantId: string;
}

const DevShopify = () => {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [testProduct, setTestProduct] = useState<TestProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testingBuy, setTestingBuy] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query 1: Shop info and collections
        const shopQuery = `
          query {
            shop {
              name
              primaryDomain {
                url
              }
            }
            collections(first: 10) {
              nodes {
                title
                handle
              }
            }
          }
        `;

        const shopData = await fetchShopify<any>(shopQuery);
        setShopInfo(shopData.shop);
        setCollections(shopData.collections.nodes);

        // Query 2: Get a test product (first available product)
        const productQuery = `
          query {
            products(first: 1, query: "available_for_sale:true") {
              edges {
                node {
                  title
                  handle
                  variants(first: 1) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const productData = await fetchShopify<any>(productQuery);
        const firstProduct = productData.products.edges[0]?.node;
        
        if (firstProduct) {
          const firstVariant = firstProduct.variants.edges[0]?.node;
          setTestProduct({
            title: firstProduct.title,
            handle: firstProduct.handle,
            firstVariantId: firstVariant.id,
          });
        }
      } catch (err: any) {
        console.error("❌ Dev page fetch error:", err);
        setError(err.message || "Failed to fetch Shopify data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTestBuy = async () => {
    if (!testProduct) return;

    setTestingBuy(true);
    console.log("🧪 Testing buy with variant:", testProduct.firstVariantId);

    try {
      // Call cartCreate
      const cart = await cartCreate([
        { merchandiseId: testProduct.firstVariantId, quantity: 1 },
      ]);

      console.log("✅ Cart created:", cart);

      // Check if checkoutUrl exists
      if (cart.checkoutUrl) {
        console.log("✅ Redirecting to checkout:", cart.checkoutUrl);
        toast.success("Cart created! Redirecting to checkout...");
        setTimeout(() => {
          window.location.href = cart.checkoutUrl;
        }, 1000);
      } else {
        // Fallback to native cart URL
        const cleanVariantId = testProduct.firstVariantId.split("/").pop();
        const fallbackUrl = `https://hairpinns.com/cart/${cleanVariantId}:1`;
        console.warn("⚠️ No checkoutUrl, using fallback:", fallbackUrl);
        toast.warning("Using native cart fallback...");
        setTimeout(() => {
          window.location.href = fallbackUrl;
        }, 1000);
      }
    } catch (err: any) {
      console.error("❌ Test buy error:", err);
      toast.error(`Test buy failed: ${err.message}`);
    } finally {
      setTestingBuy(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${label}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dev: Shopify Debug | Hair Pinns</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warning Banner */}
        <div className="bg-destructive/10 border border-destructive rounded-card p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              🚧 Dev-Only Route — Shopify Integration Test Page
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This page tests Shopify Storefront API queries and checkout flow.
            </p>
          </div>
        </div>

        <h1 className="text-h1-lg font-heading font-bold text-heading mb-2">
          Shopify Debug Console
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Shop info, collections, and test buy functionality.
        </p>

        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-card p-6 text-center">
            <p className="text-destructive font-semibold mb-2">Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {/* Shop Info */}
            <section className="bg-card border border-border rounded-card p-6">
              <h2 className="text-xl font-heading font-semibold text-heading mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-brand-500" />
                Shop Information
              </h2>
              {shopInfo && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Shop Name</p>
                    <p className="text-lg font-semibold text-heading">{shopInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Primary Domain</p>
                    <a
                      href={shopInfo.primaryDomain.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:text-brand-600 underline"
                    >
                      {shopInfo.primaryDomain.url}
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* Collections */}
            <section className="bg-card border border-border rounded-card p-6">
              <h2 className="text-xl font-heading font-semibold text-heading mb-4 flex items-center gap-2">
                <Copy className="w-5 h-5 text-brand-500" />
                Collections ({collections.length}/10)
              </h2>
              <div className="space-y-2">
                {collections.map((collection) => (
                  <div
                    key={collection.handle}
                    className="flex items-center justify-between p-3 bg-muted rounded-card hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-heading truncate">
                        {collection.title}
                      </p>
                      <code className="text-xs text-brand-500 font-mono">
                        {collection.handle}
                      </code>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(collection.handle, collection.handle)}
                        className="gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link to={`/collections/${collection.handle}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Test Buy */}
            {testProduct && (
              <section className="bg-card border border-border rounded-card p-6">
                <h2 className="text-xl font-heading font-semibold text-heading mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-brand-500" />
                  Test Buy Flow
                </h2>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-card">
                    <p className="text-sm text-muted-foreground mb-2">Test Product</p>
                    <p className="font-semibold text-heading mb-1">{testProduct.title}</p>
                    <code className="text-xs text-brand-500 font-mono block mb-3">
                      Handle: {testProduct.handle}
                    </code>
                    <p className="text-sm text-muted-foreground mb-1">First Variant ID</p>
                    <code className="text-xs text-foreground font-mono bg-background px-2 py-1 rounded break-all block">
                      {testProduct.firstVariantId}
                    </code>
                  </div>

                  <div className="bg-accent border border-border p-4 rounded-card">
                    <p className="text-sm font-semibold text-heading mb-2">Test Flow:</p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Call <code className="text-xs bg-muted px-1 rounded">cartCreate([...])</code></li>
                      <li>If <code className="text-xs bg-muted px-1 rounded">cart.checkoutUrl</code> exists → redirect</li>
                      <li>If missing → fallback to <code className="text-xs bg-muted px-1 rounded">hairpinns.com/cart/...</code></li>
                      <li>Log errors to console</li>
                    </ol>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleTestBuy}
                    disabled={testingBuy}
                    className="w-full"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {testingBuy ? "Creating Cart..." : "Test Buy (Creates Real Cart)"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    ⚠️ This creates a real cart and redirects to checkout
                  </p>
                </div>
              </section>
            )}
          </div>
        )}

        <div className="mt-12 text-center space-x-3">
          <Button asChild variant="outline">
            <Link to="/">← Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dev/collections">View Collections Debug</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DevShopify;
