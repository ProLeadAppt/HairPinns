import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary to catch render errors and display a friendly fallback.
 * Prevents blank screens when ProductDetail, CollectionDetail, or other
 * components throw uncaught errors.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-heading mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t load this page. Please try again or browse our collections.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="primary">
                  <Link to="/collections">Browse Collections</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Product-specific Error Boundary - shows "Product not found" instead of generic error.
 * Use for ProductDetail so users get a helpful message when something throws.
 */
export class ProductDetailErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ProductDetailErrorBoundary caught:", error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-heading mb-2">Product not found</h2>
              <p className="text-muted-foreground mb-6">
                This product doesn&apos;t exist or may have been removed from our store.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="primary">
                  <Link to="/collections">Browse Collections</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/search">Search Products</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Silent Error Boundary - catches errors and renders nothing.
 * Use around optional sections (e.g. recommendations) so the main page still displays.
 */
export class SilentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("SilentErrorBoundary caught (section hidden):", error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default ErrorBoundary;
