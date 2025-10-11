import { Phone, MessageCircle, Calendar, Sparkles, Wind, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const FeatureStrip = () => {
  const openWebchat = () => {
    console.log('🔵 FeatureStrip openWebchat called');
    
    // Track the interaction
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'isabella',
        action: 'chat_opened',
        location: 'feature_strip'
      });
    }

    const attemptOpen = () => {
      // Try direct window methods
      if ((window as any).ChatWidget) {
        console.log('✅ Found ChatWidget');
        (window as any).ChatWidget.open();
        return true;
      }

      if (window.LeadConnector?.openWidget) {
        console.log('✅ Found LeadConnector.openWidget');
        window.LeadConnector.openWidget();
        return true;
      }

      // Find chat widget elements
      const selectors = [
        'div[id*="chat-widget"]',
        'div[class*="chat-widget"]',
        'iframe[src*="leadconnectorhq"]',
        '[data-chat-bubble]',
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          const element = elements[0];
          if (element.tagName !== 'IFRAME') {
            (element as HTMLElement).click();
            return true;
          }
        }
      }
      return false;
    };

    if (attemptOpen()) {
      console.log('✅ Widget opened');
      return;
    }

    setTimeout(() => {
      if (attemptOpen()) {
        console.log('✅ Widget opened on retry');
      } else {
        console.error('❌ Could not open chat widget');
        alert('Chat widget is loading. Please try again in a moment.');
      }
    }, 500);
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
      <section className="py-12 md:py-16" style={{ 
        contentVisibility: "auto",
        background: 'linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-600)) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-h2-lg mb-3" style={{ color: '#FFFFFF' }}>
              🎯 Get Expert Help, Instantly
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Not sure which service is right for you? Our AI experts are available 24/7 to answer questions, explain treatments, and help you book with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
            <div className="rounded-card p-6 text-center" style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto" style={{
                background: 'rgba(255, 255, 255, 0.25)'
              }}>
                <Phone className="w-7 h-7" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                📞 Call Sam
              </h3>
              <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Instant answers over the phone, anytime day or night
              </p>
              <Button
                asChild
                size="sm"
                className="font-semibold"
                style={{ 
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  color: 'hsl(var(--brand-500))'
                }}
              >
                <a href="tel:+61468020624" onClick={trackPhoneClick}>
                  Call Now
                </a>
              </Button>
            </div>

            <div className="rounded-card p-6 text-center" style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto" style={{
                background: 'rgba(255, 255, 255, 0.25)'
              }}>
                <MessageCircle className="w-7 h-7" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                💬 Chat with Isabella
              </h3>
              <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Quick chat for service info, pricing & recommendations
              </p>
              <Button
                size="sm"
                onClick={openWebchat}
                className="font-semibold"
                style={{ 
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  color: 'hsl(var(--brand-500))'
                }}
              >
                Start Chat
              </Button>
            </div>

            <div className="rounded-card p-6 text-center" style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto" style={{
                background: 'rgba(255, 255, 255, 0.25)'
              }}>
                <Calendar className="w-7 h-7" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                📅 Book Direct
              </h3>
              <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Already know what you need? Book instantly via Fresha
              </p>
              <Button
                asChild
                size="sm"
                className="font-semibold"
                style={{ 
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  color: 'hsl(var(--brand-500))'
                }}
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
              <div className="text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>24/7</div>
              <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Always Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>&lt;30s</div>
              <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Instant Answers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>100%</div>
              <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Personalized</div>
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
