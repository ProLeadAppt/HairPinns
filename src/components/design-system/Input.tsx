import { cn } from "@/lib/utils";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  variant?: "default" | "outline" | "filled";
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  variant = "default",
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const variants = {
    default: "border-input bg-background",
    outline: "border-2 border-border bg-background focus:border-accent-color",
    filled: "border-transparent bg-muted focus:bg-background focus:border-accent-color",
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </Label>
      )}
      <UIInput
        ref={ref}
        id={inputId}
        className={cn(
          variants[variant],
          "transition-colors duration-fast",
          error && "border-destructive focus:border-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-sm text-muted-foreground">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;