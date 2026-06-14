import { Phone, MessageCircle, Calendar, Sparkles, Wind, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { toast } from "@/hooks/use-toast";

const FeatureStrip = () => {
  const guideToBubble = () => {
    // Track the interaction
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'isabella',
        action: 'chat_bubble_prompted',
        location: 'feature_strip'
      });
    }

    // Try to visually highlight the chat bubble if present
    const selectors = [
      'div[id*="chat-widget"]',
      'div[class*="chat-widget"]',
      '[data-chat-bubble]',
      'button[aria-label*="chat"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (element && element.tagName !== 'IFRAME') {
        element.style.outline = '3px solid rgba(255,255,255,0.9)';
        element.style.outlineOffset = '3px';
        element.style.transition = 'outline-color 300ms ease';
        setTimeout(() => {
          element.style.outline = '';
          element.style.outlineOffset = '';
        }, 2500);
        break;
      }
    }

    // Show toast notification
    toast({
      title: "Open the chat",
      description: "Tap the chat bubble at the bottom-right to start chatting with Isabella.",
    });
  };

  const trackPhoneClick = () => {
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'sam',
        action: 'phone_clicked',
        location: 'feature_strip'
      });
    }
  };

  const services = [
    {
      icon: Sparkles,
      title: "Colour & Blonding",
      anchor: "colour",
      description: "Full head foils, highlights, toning"
    },
    {
      icon: Wind,
      title: "Smoothing & Treatments",
      anchor: "treatments",
      description: "Keratin, deep conditioning"
    },
    {
      icon: Scissors,
      title: "Cuts & Styling",
      anchor: "cuts",
      description: "Precision cuts for all hair types"
    }
  ];

  return (
    <>
      {/* AI Agents Focus Section */}
      <section className="py-12 md:py-16" style={{ 
        contentVisibility: "auto",
        background: 'linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-600)) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-h2-lg mb-3 text-primary-foreground">
              🎯 Get Expert Help, Instantly
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-primary-foreground/90">
              Not sure which service is right for you? Our AI experts are available 24/7 to answer questions, explain treatments, and help you book with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
            {/* Call Sam Card */}
            <div className="glass-card bg-card rounded-card p-6 text-center border border-border shadow-md transition-all hover:scale-105">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ background: 'hsl(var(--accent))' }}
              >
                <Phone className="w-7 h-7" style={{ color: 'hsl(var(--brand-500))' }} />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2 text-heading">
                📞 Call Sam
              </h3>
              <p className="mb-4 text-sm text-text">
                Instant answers over the phone, anytime day or night
              </p>
              <Button 
                asChild
                size="sm" 
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full"
              >
                <a 
                  href="tel:+61468093991"
                  onClick={trackPhoneClick}
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              </Button>
            </div>

            {/* Chat with Isabella Card */}
            <div className="glass-card bg-card rounded-card p-6 text-center border border-border shadow-md transition-all hover:scale-105">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ background: 'hsl(var(--accent))' }}
              >
                <MessageCircle className="w-7 h-7" style={{ color: 'hsl(var(--brand-500))' }} />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2 text-heading">
                💬 Chat with Isabella
              </h3>
              <p className="mb-4 text-sm text-text">
                Quick chat for service info, pricing & recommendations
              </p>
              <Button 
                size="sm" 
                onClick={guideToBubble}
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full"
              >
                <MessageCircle className="w-4 h-4" />
                Start Chat
              </Button>
            </div>

            {/* Book Direct Card */}
            <div className="glass-card bg-card rounded-card p-6 text-center border border-border shadow-md transition-all hover:scale-105">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ background: 'hsl(var(--accent))' }}
              >
                <Calendar className="w-7 h-7" style={{ color: 'hsl(var(--brand-500))' }} />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2 text-heading">
                📅 Book Direct
              </h3>
              <p className="mb-4 text-sm text-text">
                Already know what you need? Book instantly via Fresha
              </p>
              <Button 
                asChild
                size="sm" 
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full"
              >
                <a 
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("feature_strip", "/")}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold mb-1 text-primary-foreground">24/7</div>
              <div className="text-sm text-primary-foreground/90">Always Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-primary-foreground">&lt;5s</div>
              <div className="text-sm text-primary-foreground/90">Instant Answers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-primary-foreground">100%</div>
              <div className="text-sm text-primary-foreground/90">Personalized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Services Section */}
      <section className="bg-accent py-12 md:py-16" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-heading text-h2-lg mb-3">
              Our Salon Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert hair care in Bangor, Sutherland Shire
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link 
                  key={index}
                  to={`/services#${service.anchor}`}
                  className="group bg-card border border-border rounded-card p-6 hover:shadow-lg transition-all duration-base text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-brand-500 text-primary-foreground rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-base">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-heading group-hover:text-brand-500 transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

// Type declarations
declare global {
  interface Window {
    LeadConnector?: {
      openWidget: () => void;
    };
    hpCapture?: (event: string, data: Record<string, any>) => void;
  }
}

export default FeatureStrip;
