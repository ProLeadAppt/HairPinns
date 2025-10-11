import { Phone, MessageCircle, Calendar, Sparkles, Wind, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const FeatureStrip = () => {
  const openWebchat = () => {
    // Track the interaction
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'isabella',
        action: 'chat_opened',
        location: 'feature_strip'
      });
    }

    // Method 1: Try LeadConnector's official API
    if (window.LeadConnector?.openWidget) {
      window.LeadConnector.openWidget();
      return;
    }

    // Method 2: Try to find and click the chat bubble
    const selectors = [
      '[data-chat-widget-button]',
      '.chat-widget-button',
      '#chat-widget-container button',
      '[class*="chat-bubble"]',
      '[class*="ChatBubble"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).click();
        return;
      }
    }

    // Method 3: Dispatch custom event
    window.dispatchEvent(new CustomEvent('openChatWidget'));
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
      description: "Balayage, highlights, toning"
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
      <section className="bg-gradient-to-br from-brand-500 to-brand-600 py-12 md:py-16" style={{ contentVisibility: "auto" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-white text-h2-lg mb-3">
              🎯 Get Expert Help, Instantly
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Not sure which service is right for you? Our AI experts are available 24/7 to answer questions, explain treatments, and help you book with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-6 text-center">
              <div className="w-14 h-14 bg-white/20 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-white mb-2">
                📞 Call Sam
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Instant answers over the phone, anytime day or night
              </p>
              <Button
                asChild
                size="sm"
                className="bg-white text-brand-500 hover:bg-white/90 font-semibold"
                style={{ borderRadius: '999px' }}
              >
                <a href="tel:+61468020624" onClick={trackPhoneClick}>
                  Call Now
                </a>
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-6 text-center">
              <div className="w-14 h-14 bg-white/20 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-white mb-2">
                💬 Chat with Isabella
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Quick chat for service info, pricing & recommendations
              </p>
              <Button
                size="sm"
                onClick={openWebchat}
                className="bg-white text-brand-500 hover:bg-white/90 font-semibold"
                style={{ borderRadius: '999px' }}
              >
                Start Chat
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-6 text-center">
              <div className="w-14 h-14 bg-white/20 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-white mb-2">
                📅 Book Direct
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Already know what you need? Book instantly via Fresha
              </p>
              <Button
                asChild
                size="sm"
                className="bg-white text-brand-500 hover:bg-white/90 font-semibold"
                style={{ borderRadius: '999px' }}
              >
                <a 
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("feature_strip", "/")}
                >
                  Book Now
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-white/80">Always Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">&lt;30s</div>
              <div className="text-sm text-white/80">Instant Answers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/80">Personalized</div>
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
