import type { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

const showToast = ({
  title,
  description,
  variant = "default",
  duration,
}: ToastOptions, id?: string | number) => {
  const message = title ?? (variant === "destructive" ? "Something went wrong" : "Success");
  const options = { description, duration, id };

  return variant === "destructive"
    ? sonnerToast.error(message, options)
    : sonnerToast.success(message, options);
};

function toast(options: ToastOptions) {
  let currentOptions = options;
  const id = showToast(options);

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (nextOptions: Partial<ToastOptions>) => {
      currentOptions = { ...currentOptions, ...nextOptions };
      return showToast(currentOptions, id);
    },
  };
}

function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  };
}

export { useToast, toast };
