import { CreditCard, Wallet, ShieldCheck } from "lucide-react";

interface PaymentBadgesProps {
  className?: string;
  variant?: "inline" | "stacked";
  compact?: boolean;
}

export default function PaymentBadges({ className = "", variant = "inline", compact = false }: PaymentBadgesProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
        <span>Visa</span>
        <span className="text-border">|</span>
        <span>Mastercard</span>
        <span className="text-border">|</span>
        <span>Afterpay</span>
        <span className="text-border">|</span>
        <span>Zip</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 flex-wrap ${variant === "stacked" ? "flex-col items-start" : ""} ${className}`}>
      {/* Secure Payment */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="w-5 h-5 text-green-600" />
        <span className="font-medium">Visa / Mastercard</span>
      </div>

      {/* Afterpay Badge */}
      <a
        href="https://www.afterpay.com/en-AU/support/what-is-afterpay"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Learn more about Afterpay"
      >
        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">Afterpay</span>
      </a>

      {/* ZipPay Badge */}
      <a
        href="https://zip.co/au/how-it-works"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Learn more about ZipPay"
      >
        <div className="w-6 h-6 bg-[#0A1F44] rounded flex items-center justify-center">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">Zip</span>
      </a>
    </div>
  );
}

