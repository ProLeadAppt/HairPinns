import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import { CheckCircle2, Package, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostPurchaseModule from "@/components/conversion/PostPurchaseModule";
import { pixelTracking } from "@/lib/pixelTracking";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

interface OrderItem {
  title: string;
  id: string;
  quantity: number;
  price: number;
}

interface OrderData {
  order_id: string;
  subtotal: number;
  total: number;
  currency: string;
  items: OrderItem[];
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [orderTracked, setOrderTracked] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Try to get order data from multiple sources
    const getOrderData = (): OrderData | null => {
      // Priority 1: URL search params
      const orderId = searchParams.get("order_id") || searchParams.get("orderId");
      
      if (orderId) {
        // Try to get order details from URL params
        const subtotal = parseFloat(searchParams.get("subtotal") || "0");
        const total = parseFloat(searchParams.get("total") || "0");
        const currency = searchParams.get("currency") || "AUD";
        
        // Try to parse items from JSON if provided
        let items: OrderItem[] = [];
        const itemsParam = searchParams.get("items");
        if (itemsParam) {
          try {
            items = JSON.parse(decodeURIComponent(itemsParam));
          } catch (e) {
            console.error("Failed to parse items:", e);
          }
        }

        return {
          order_id: orderId,
          subtotal,
          total,
          currency,
          items,
        };
      }

      // Priority 2: dataLayer (for Google Tag Manager integration)
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        const dataLayer = (window as any).dataLayer;
        
        // Find most recent purchase event
        for (let i = dataLayer.length - 1; i >= 0; i--) {
          const event = dataLayer[i];
          if (event.event === 'purchase' || event.ecommerce?.purchase) {
            const purchase = event.ecommerce?.purchase || event;
            
            return {
              order_id: purchase.transaction_id || purchase.order_id || '',
              subtotal: parseFloat(purchase.subtotal || purchase.value || '0'),
              total: parseFloat(purchase.total || purchase.value || '0'),
              currency: purchase.currency || 'AUD',
              items: purchase.items?.map((item: any) => ({
                title: item.name || item.title || '',
                id: item.id || item.product_id || '',
                quantity: parseInt(item.quantity || '1'),
                price: parseFloat(item.price || '0'),
              })) || [],
            };
          }
        }
      }

      // Priority 3: sessionStorage (if stored by checkout process)
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const storedOrder = sessionStorage.getItem('last_order');
        if (storedOrder) {
          try {
            return JSON.parse(storedOrder);
          } catch (e) {
            console.error("Failed to parse stored order:", e);
          }
        }
      }

      return null;
    };

    const order = getOrderData();
    
    if (order && order.order_id && !orderTracked) {
      setOrderData(order);
      
      // Fire client-side purchase event (non-blocking)
      const trackPurchase = async () => {
        try {
          const { hpCapture } = await import("@/lib/hpCapture");
          
          await hpCapture.trackEvent("purchase_client", {
            order_id: order.order_id,
            subtotal: order.subtotal,
            total: order.total,
            currency: order.currency,
            items: order.items,
            item_count: order.items.reduce((sum, item) => sum + item.quantity, 0),
          });

          // Track purchase pixels (NO PII)
          pixelTracking.trackPurchase({
            orderId: order.order_id,
            items: order.items.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
            total: order.total,
            currency: order.currency,
          });
          
          console.log("[Order Confirmation] Purchase tracked:", order.order_id);
        } catch (error) {
          console.error("[Order Confirmation] Failed to track purchase:", error);
        }
      };

      trackPurchase();
      setOrderTracked(true);
    }
  }, [searchParams, orderTracked]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Order Confirmed - Hair Pinns</title>
        <meta name="description" content="Your Hair Pinns order has been confirmed. Thank you for your purchase!" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="flex-grow">
        <Section className="py-xl">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[hsl(var(--success-bg))] rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-[hsl(var(--success-fg))]" />
              </div>
              <h1 className="text-h1-lg font-heading text-heading mb-3">
                Order Confirmed!
              </h1>
              <p className="text-lg text-foreground">
                Thank you for your purchase. We'll send you a confirmation email shortly.
              </p>
            </div>

            {/* Order Details */}
            {orderData && (
              <div className="bg-muted/30 rounded-card p-8 mb-8 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                    <p className="text-h3 font-heading text-heading">{orderData.order_id}</p>
                  </div>
                  <Package className="w-8 h-8 text-brand-500" />
                </div>

                {orderData.items.length > 0 && (
                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <p className="text-sm font-semibold text-heading">Order Items</p>
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  {orderData.subtotal > 0 && orderData.subtotal !== orderData.total && (
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span>${orderData.subtotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-h3 font-heading text-heading pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${orderData.total.toFixed(2)} {orderData.currency}</span>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-accent/10 border border-accent/20 rounded-card p-6 mb-8 text-left">
              <h2 className="text-h3 font-heading text-heading mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                What happens next?
              </h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>You'll receive a confirmation email within 5 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>We'll send tracking information once your order ships</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Most orders ship within 1-2 business days</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = "/collections"}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  trackBookingClick("order_confirmation", "/order-confirmation");
                  window.open(BOOK_URL, "_blank");
                }}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {BOOK_CTA_LABEL}
              </Button>
            </div>

            {/* Post-Purchase Module */}
            <PostPurchaseModule />

            {/* Support */}
            <p className="text-sm text-muted-foreground mt-8">
              Questions about your order?{" "}
              <a href="/contact" className="text-brand-500 hover:underline">
                Contact us
              </a>{" "}
              or call{" "}
              <a href="tel:+61295550123" className="text-brand-500 hover:underline">
                (02) 9555 0123
              </a>
            </p>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
