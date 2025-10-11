import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const AIAgentsCTA = () => {
  const openWebchat = () => {
    // Track the interaction first
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'isabella',
        action: 'chat_opened',
        location: 'hero_cta'
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
      'iframe[src*="leadconnectorhq"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        if (element.tagName === 'IFRAME') {
          // If it's an iframe, try to click elements inside it
          try {
            const iframeDoc = (element as HTMLIFrameElement).contentDocument;
            const button = iframeDoc?.querySelector('button');
            if (button) {
              button.click();
              return;
            }
          } catch (e) {
            // Cross-origin restriction, try next method
            continue;
          }
        } else {
          (element as HTMLElement).click();
          return;
        }
      }
    }

    // Method 3: Dispatch a custom event that the widget might listen to
    window.dispatchEvent(new CustomEvent('openChatWidget'));
    
    // Method 4: Try window.openChatWidget if it exists
    if (typeof (window as any).openChatWidget === 'function') {
      (window as any).openChatWidget();
    }
  };

  const trackPhoneClick = () => {
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'sam',
        action: 'phone_clicked',
        location: 'hero_cta'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Now Indicator */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-3 h-3 bg-[hsl(var(--success))] rounded-full animate-breathing"></div>
          <div className="absolute inset-0 w-3 h-3 bg-[hsl(var(--success))] rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="text-sm font-semibold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
          AI Agents Available 24/7
        </span>
      </div>

      {/* Main CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 no-link-color">
        {/* PRIMARY: Chat with Isabella */}
        <Button 
          size="lg" 
          onClick={openWebchat}
          className="w-full sm:w-auto font-bold transition-all hover:bg-[#F5F5F7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8B4A8B] [&_*]:!text-[#2A2230]" 
          style={{
            background: '#FFFFFF',
            color: '#2A2230',
            borderRadius: '999px',
            padding: '0.95rem 1.4rem',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
            border: 'none'
          }}
        >
          <MessageCircle className="w-5 h-5" style={{ color: '#2A2230' }} />
          <span style={{ color: '#2A2230' }}>Chat with Isabella</span>
        </Button>

        {/* SECONDARY: Call Sam */}
        <Button 
          asChild
          size="lg" 
          className="w-full sm:w-auto bg-[#8B4A8B] hover:bg-[#7A4079] text-white font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50" 
          style={{
            borderRadius: '999px',
            padding: '0.95rem 1.4rem',
            boxShadow: '0 8px 20px rgba(139, 74, 139, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <a 
            href="tel:+61468020624"
            onClick={trackPhoneClick}
            className="flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Call Sam Now
          </a>
        </Button>
      </div>

      {/* Book Direct Option */}
      <div className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
        <span>Already know what you need?</span>
        <a 
          href={BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBookingClick("hero_home_ai_cta", "/")}
          className="inline-flex items-center gap-1 font-semibold hover:underline transition-all"
          style={{ color: 'rgba(255, 255, 255, 0.95)' }}
        >
          <Calendar className="w-4 h-4" />
          Book Direct
        </a>
      </div>

      {/* Trust Elements */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            &lt;30s
          </div>
          <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Response Time
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            24/7
          </div>
          <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Always Available
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            100%
          </div>
          <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Expert Answers
          </div>
        </div>
      </div>
    </div>
  );
};

// Type declarations for global objects
declare global {
  interface Window {
    LeadConnector?: {
      openWidget: () => void;
    };
    hpCapture?: (event: string, data: Record<string, any>) => void;
  }
}

export default AIAgentsCTA;
