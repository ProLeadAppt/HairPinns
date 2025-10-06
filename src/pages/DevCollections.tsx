import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCollections } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const DevCollections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getAllCollections(20);
        setCollections(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const copyHandle = (handle: string) => {
    navigator.clipboard.writeText(handle);
    toast.success(`Copied: ${handle}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dev: Collections Debug | Hair Pinns</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-destructive/10 border border-destructive rounded-card p-4 mb-8">
          <p className="text-sm font-semibold text-destructive">
            🚧 Dev-Only Route — This page is for debugging collection handles.
          </p>
        </div>

        <h1 className="text-h1-lg font-heading font-bold text-heading mb-2">
          Collections Debug
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          First 20 collections from Shopify Storefront API. Copy the exact handle for internal links.
        </p>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Fetching collections...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-card p-6 text-center">
            <p className="text-destructive font-semibold mb-2">Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && collections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No collections found.</p>
          </div>
        )}

        {!loading && !error && collections.length > 0 && (
          <div className="space-y-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-heading font-semibold text-heading mb-1 truncate">
                      {collection.title}
                    </h2>
                    <code className="text-sm text-brand-500 font-mono bg-muted px-2 py-1 rounded">
                      {collection.handle}
                    </code>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyHandle(collection.handle)}
                      className="gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <Link to={`/collections/${collection.handle}`}>
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DevCollections;
