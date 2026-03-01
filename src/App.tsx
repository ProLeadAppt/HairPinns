import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import TrackingInitializer from "./components/tracking/TrackingInitializer";
import TrackingScripts from "./components/tracking/TrackingScripts";
import GoogleTagManager from "./components/tracking/GoogleTagManager";
import ScrollTracker from "./components/analytics/ScrollTracker";
import { initCartAbandonmentMonitoring } from "@/lib/cartAbandonment";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import OrderConfirmation from "./pages/OrderConfirmation";
import Confirm from "./pages/Confirm";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SuburbPage from "./pages/SuburbPage";
import SuburbRedirect from "./pages/SuburbRedirect";
import LocationPage from "./pages/LocationPage";
import AreasIndex from "./pages/AreasIndex";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import DevCollections from "./pages/DevCollections";
import DevShopify from "./pages/DevShopify";
import Reviews from "./pages/Reviews";
import ReviewFeedback from "./pages/ReviewFeedback";
import ReviewGoogle from "./pages/ReviewGoogle";
import SearchResults from "./pages/SearchResults";
import ErrorBoundary, { ProductDetailErrorBoundary } from "./components/ErrorBoundary";

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
      <GoogleTagManager />
      <TrackingScripts />
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-KFH27CHQ"
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <ScrollToTop />
          <ScrollToTopButton />
          <TrackingInitializer />
          <ScrollTracker />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<ErrorBoundary><CollectionDetail /></ErrorBoundary>} />
          <Route path="/products/:handle" element={<ProductDetailErrorBoundary><ProductDetail /></ProductDetailErrorBoundary>} />
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
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/feedback" element={<ReviewFeedback />} />
          <Route path="/reviews/google" element={<ReviewGoogle />} />
          <Route path="/dev/collections" element={<DevCollections />} />
          <Route path="/dev/shopify" element={<DevShopify />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
