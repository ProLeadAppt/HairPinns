import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { fetchShopify } from "@/lib/shopify";
import { notify } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const DevCollections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const query = `
          query {
            collections(first: 20) {
              nodes {
                id
                title
                handle
              }
            }
          }
        `;
        
        const data = await fetchShopify<any>(query);
        setCollections(data.collections.nodes);
        console.log("✅ Collections fetched:", data.collections.nodes);
      } catch (err: any) {
        console.error("❌ Failed to fetch collections:", err);
        setError(err.message || "Failed to fetch collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const copyHandle = (handle: string) => {
    navigator.clipboard.writeText(handle);
    notify.success(`Copied: ${handle}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Collections Debug | Dev Tools"
        description="Dev-only collections debug page."
        canonical="https://hairpinns.com/dev/collections"
        noIndex={true}
      />
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-h1-lg font-heading font-bold text-heading mb-4">
            Collections Debug
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-card p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Dev-only route</strong> — First 20 collections from Shopify
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-card border border-border rounded-card p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-card p-6">
            <p className="text-destructive font-semibold mb-2">Error Loading Collections</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-muted border border-border rounded-card p-6 text-center">
            <p className="text-muted-foreground">No collections found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-card border border-border rounded-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-heading font-semibold text-heading mb-1">
                      {collection.title}
                    </h3>
                    <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {collection.handle}
                    </code>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyHandle(collection.handle)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`/collections/${collection.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button variant="outline" asChild>
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DevCollections;
