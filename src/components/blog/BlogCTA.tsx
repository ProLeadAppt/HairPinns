import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface BlogCTAProps {
  type: "call-jena" | "chat-isabella" | "service" | "product" | "booking";
  servicePath?: string;
  productPath?: string;
  customText?: string;
}

const actionClass = "flex min-h-12 items-center justify-between gap-5 bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-copper))] hover:no-underline";
const secondaryClass = "flex min-h-12 items-center justify-between gap-5 border border-[hsl(var(--after-hours-cream)/0.34)] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:border-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-copper))] hover:no-underline";

const BlogCTA = ({ type, servicePath, productPath, customText }: BlogCTAProps) => {
  const guideToBubble = () => {
    window.hpCapture?.("ai_agent_interaction", { agent: "isabella", action: "chat_bubble_prompted", location: "blog_cta" });
    const selectors = ['div[id*="chat-widget"]', 'div[class*="chat-widget"]', "[data-chat-bubble]", 'button[aria-label*="chat"]'];
    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (element && element.tagName !== "IFRAME") {
        element.style.outline = "2px solid hsl(var(--after-hours-copper))";
        element.style.outlineOffset = "4px";
        window.setTimeout(() => {
          element.style.outline = "";
          element.style.outlineOffset = "";
        }, 2500);
        break;
      }
    }
    toast({ title: "Chat with Isabella", description: "Use the chat bubble at the bottom-right to start." });
  };

  const trackPhoneClick = () => window.hpCapture?.("ai_agent_interaction", { agent: "jena", action: "phone_clicked", location: "blog_cta" });

  let title = customText || "Need a closer look?";
  let body = "Bring the question to Jena for practical advice based on your hair, routine, and goals.";
  let actions: React.ReactNode = null;

  if (type === "call-jena") {
    title = customText || "Questions about this service?";
    actions = <a href={BUSINESS_NAP.phone.tel} onClick={trackPhoneClick} className={actionClass}>Call Jena: {BUSINESS_NAP.phone.display}<span aria-hidden="true">↗</span></a>;
  } else if (type === "chat-isabella") {
    title = customText || "Want a quick answer?";
    body = "Isabella can help with product recommendations and booking questions at any time.";
    actions = <button type="button" onClick={guideToBubble} className={actionClass}>Chat with Isabella<span aria-hidden="true">→</span></button>;
  } else if (type === "service" && servicePath) {
    title = customText || "Considering this service?";
    actions = (
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to={servicePath} className={actionClass}>View service details<span aria-hidden="true">→</span></Link>
        <a href={BUSINESS_NAP.phone.tel} onClick={trackPhoneClick} className={secondaryClass}>Call to book<span aria-hidden="true">↗</span></a>
      </div>
    );
  } else if (type === "product" && productPath) {
    title = customText || "From Jena’s shelf";
    body = "Professional hair care selected in the salon and shipped Australia-wide.";
    actions = <a href={productPath} target="_blank" rel="noopener noreferrer" className={actionClass}>Shop the recommendation<span aria-hidden="true">↗</span></a>;
  } else if (type === "booking") {
    title = customText || "Want to try these products?";
    body = "See live salon times in Fresha or browse Jena’s professional shelf online.";
    actions = <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("blog_cta", window.location.pathname)} className={actionClass}>Book with Jena<span aria-hidden="true">↗</span></a>;
  }

  if (!actions) return null;

  return (
    <aside className="my-16 bg-[hsl(var(--after-hours-plum))] px-5 py-9 text-[hsl(var(--after-hours-cream))] sm:px-8 sm:py-10" aria-label="Next step">
      <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">A useful next step</p>
      <h2 className="mt-4 max-w-[14ch] font-heading text-[clamp(2.2rem,5vw,3.7rem)] font-normal leading-[0.96] tracking-[-0.04em] text-[hsl(var(--after-hours-cream))]">{title}</h2>
      <p className="mt-5 max-w-[42rem] text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.7)]">{body}</p>
      <div className="mt-7 border-t border-[hsl(var(--after-hours-cream)/0.24)] pt-6">{actions}</div>
    </aside>
  );
};

declare global {
  interface Window {
    hpCapture?: (event: string, data: Record<string, any>) => void;
  }
}

export default BlogCTA;
