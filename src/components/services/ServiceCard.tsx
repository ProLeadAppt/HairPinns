import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

interface ServiceCardProps {
  service: {
    name: string;
    description?: string;
    duration: string;
    services_count?: string;
    price_aud: string;
  };
  category: string;
}

export const ServiceCard = ({ service, category }: ServiceCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const hasDescription = service.description && service.description.trim().length > 0;
  const isLongDescription = hasDescription && service.description!.length > 150;
  const showExpandToggle = hasDescription && isLongDescription;

  return (
    <div className="bg-surface rounded-card p-5 md:p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-within:shadow-lg" 
         style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Top row: Name + Price */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl font-semibold text-heading leading-tight flex-1">
          {service.name}
        </h3>
        {service.price_aud && (
          <span className="bg-brand-500 text-white text-sm font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            {service.price_aud}
          </span>
        )}
      </div>

      {/* Description */}
      {hasDescription && (
        <div className="text-text text-sm leading-relaxed">
          <p className={!expanded && isLongDescription ? "line-clamp-3" : ""}>
            {service.description}
          </p>
          {showExpandToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-brand-500 text-sm font-medium mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
            >
              {expanded ? "Less" : "More"}
            </button>
          )}
        </div>
      )}

      {/* Meta chips */}
      {(service.duration || service.services_count) && (
        <div className="flex items-center gap-2 flex-wrap">
          {service.duration && (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-[#EDE7F1]" style={{ color: 'hsl(var(--muted))' }}>
              <Clock className="w-3.5 h-3.5" />
              {service.duration}
            </span>
          )}
          {service.services_count && (
            <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full border border-[#EDE7F1]" style={{ color: 'hsl(var(--muted))' }}>
              {service.services_count}
            </span>
          )}
        </div>
      )}

      {/* Action button */}
      <Button
        asChild
        className="w-full mt-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-btn"
      >
        <a
          href={`${BOOK_URL}?utm_source=site&utm_medium=services&utm_campaign=book`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBookingClick("service_card", `/services#${category}`)}
        >
          Book on Fresha
        </a>
      </Button>
    </div>
  );
};
