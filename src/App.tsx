import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import TrackingInitializer from "./components/tracking/TrackingInitializer";
import TrackingScripts from "./components/tracking/TrackingScripts";
import ScrollTracker from "./components/analytics/ScrollTracker";
import { initCartAbandonmentMonitoring } from "@/lib/cartAbandonment";
import ErrorBoundary, { ProductDetailErrorBoundary } from "./components/ErrorBoundary";

// Homepage loads eagerly so the most common landing page is instant.
import Index from "./pages/Index";

// All other routes are lazy-loaded to shrink the initial bundle.
// Prerendered HTML is already served statically, so the JS chunk only
// needs to download when the user navigates client-side.
const Collections = lazy(() => import("./pages/Collections"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Confirm = lazy(() => import("./pages/Confirm"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const SuburbPage = lazy(() => import("./pages/SuburbPage"));
const SuburbRedirect = lazy(() => import("./pages/SuburbRedirect"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const AreasIndex = lazy(() => import("./pages/AreasIndex"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DevCollections = lazy(() => import("./pages/DevCollections"));
const DevShopify = lazy(() => import("./pages/DevShopify"));
const Reviews = lazy(() => import("./pages/Reviews"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Glossary = lazy(() => import("./pages/Glossary"));
const ReviewFeedback = lazy(() => import("./pages/ReviewFeedback"));
const ReviewGoogle = lazy(() => import("./pages/ReviewGoogle"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ServerError = lazy(() => import("./pages/ServerError"));

// Fallback while a lazy route chunk is downloading.
const RouteFallback = () => (
  <div className="min-h-screen bg-background" aria-label="Loading" />
);

// Wrapper components that reset ErrorBoundary on route change
const CollectionRoute = () => {
  const { slug } = useParams();
  return (
    <ErrorBoundary key={slug}>
      <CollectionDetail />
    </ErrorBoundary>
  );
};

const ProductRoute = () => {
  const { handle } = useParams();
  return (
    <ProductDetailErrorBoundary key={handle}>
      <ProductDetail />
    </ProductDetailErrorBoundary>
  );
};

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Initialize cart abandonment monitoring (non-blocking)
    try {
      initCartAbandonmentMonitoring();
    } catch (error) {
      console.warn('[App] Failed to initialize cart abandonment monitoring:', error);
    }
  }, []);

  return (
    <>
      <TrackingScripts />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <ScrollToTop />
          <ScrollToTopButton />
          <TrackingInitializer />
          <ScrollTracker />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:slug" element={<CollectionRoute />} />
              <Route path="/products/:handle" element={<ProductRoute />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:categorySlug/:serviceSlug" element={<ServiceDetail />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/confirm" element={<Confirm />} />
              <Route path="/near/:suburb" element={<SuburbPage />} />
              <Route path="/suburbs/:suburb" element={<SuburbRedirect />} />
              <Route path="/areas" element={<AreasIndex />} />
              <Route path="/areas/:slug" element={<LocationPage />} />
              <Route path="/policies/shipping" element={<Shipping />} />
              <Route path="/policies/returns" element={<Returns />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/feedback" element={<ReviewFeedback />} />
              <Route path="/reviews/google" element={<ReviewGoogle />} />
              <Route path="/dev/collections" element={<DevCollections />} />
              <Route path="/dev/shopify" element={<DevShopify />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
