import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConsentRowProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  id?: string;
}

const ConsentRow = ({ 
  checked, 
  onCheckedChange, 
  required = false,
  id = "consent_marketing" 
}: ConsentRowProps) => {
  return (
    <>
      {/* Honeypot field - hidden from users, should remain empty */}
      <input
        type="text"
        name="company"
        autoComplete="off"
        tabIndex={-1}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Consent checkbox */}
      <div className="flex items-start gap-3 py-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          required={required}
          className="mt-1"
        />
        <Label
          htmlFor={id}
          className="text-sm text-foreground leading-relaxed cursor-pointer"
        >
          I agree to receive updates from Hair Pinns. I can unsubscribe anytime.{" "}
          <Link 
            to="/privacy" 
            className="text-brand-500 hover:text-brand-600 underline"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </Link>
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
    </>
  );
};

export default ConsentRow;
