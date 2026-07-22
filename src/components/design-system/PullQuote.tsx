import { cn } from "@/lib/utils";

/**
 * PullQuote — large italic Playfair editorial quote with a subtle rose-gold
 * ornament above. Use as a 1-per-page editorial beat, never in-line.
 *
 *   <PullQuote attribution="Jena · Hair Pinns">
 *     I only stock products I actually use on my clients.
 *   </PullQuote>
 */
interface PullQuoteProps {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
  /** Render inside a gold-soft band. Default true. */
  banded?: boolean;
}

const PullQuote = ({
  children,
  attribution,
  className,
  banded = true,
}: PullQuoteProps) => {
  const Wrapper = banded ? "div" : "figure";
  return (
    <Wrapper
      className={cn(
        banded && "bg-gold-soft section-rhythm-lg",
        className
      )}
    >
      <blockquote className="pull-quote">
        {children}
        {attribution && (
          <cite className="pull-quote-attribution not-italic">
            — {attribution}
          </cite>
        )}
      </blockquote>
    </Wrapper>
  );
};

export default PullQuote;
