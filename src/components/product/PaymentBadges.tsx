import { CreditCard, Wallet } from "lucide-react";

interface PaymentBadgesProps {
  className?: string;
  variant?: "inline" | "stacked";
}

export default function PaymentBadges({ className = "", variant = "inline" }: PaymentBadgesProps) {
  return (
    <div className={`flex items-center gap-4 ${variant === "stacked" ? "flex-col items-start" : ""} ${className}`}>
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
        <span className="text-xs">Available</span>
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
        <span className="font-medium">ZipPay</span>
        <span className="text-xs">Available</span>
      </a>
    </div>
  );
}

