import type { ReactNode } from "react";

type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

const NOTIFICATION_RENDERER_EVENT = "hp:notification-intent";
let nextToastId = 0;
let sonnerPromise: Promise<typeof import("sonner").toast> | null = null;
let resolveNotificationRendererReady: () => void = () => undefined;
let notificationRendererIsReady = false;
let notificationRendererWasRequested = false;
const notificationRendererRequestListeners = new Set<() => void>();
const notificationRendererReady = new Promise<void>((resolve) => {
  resolveNotificationRendererReady = resolve;
});

const requestNotificationRenderer = () => {
  if (!notificationRendererWasRequested) {
    notificationRendererWasRequested = true;
    notificationRendererRequestListeners.forEach((listener) => listener());
  }
  if (typeof document !== "undefined") {
    document.dispatchEvent(new CustomEvent(NOTIFICATION_RENDERER_EVENT));
  }
};

const subscribeNotificationRendererRequest = (listener: () => void) => {
  notificationRendererRequestListeners.add(listener);
  return () => notificationRendererRequestListeners.delete(listener);
};

const wasNotificationRendererRequested = () => notificationRendererWasRequested;

const loadSonner = () => {
  sonnerPromise ??= import("sonner").then(({ toast }) => toast);
  return sonnerPromise;
};

const markNotificationRendererReady = () => {
  if (notificationRendererIsReady) return;
  notificationRendererIsReady = true;
  resolveNotificationRendererReady();
};

const withNotificationRenderer = async (
  operation: (sonnerToast: typeof import("sonner").toast) => void,
) => {
  requestNotificationRenderer();
  const sonnerToast = await loadSonner();
  await notificationRendererReady;
  operation(sonnerToast);
};

const createToastId = () => `hp-toast-${++nextToastId}`;

type NotificationTone = "success" | "warning";
type NotifyOptions = Omit<ToastOptions, "title" | "variant">;

const showToast = ({
  title,
  description,
  variant = "default",
  duration,
}: ToastOptions, id = createToastId(), tone: NotificationTone = "success") => {
  const message = title ?? (variant === "destructive" ? "Something went wrong" : "Success");

  void withNotificationRenderer((sonnerToast) => {
    const options = { description, duration, id };
    if (variant === "destructive") {
      sonnerToast.error(message, options);
    } else if (tone === "warning") {
      sonnerToast.warning(message, options);
    } else {
      sonnerToast.success(message, options);
    }
  });

  return id;
};

const dismissToast = (id?: string | number) => {
  void withNotificationRenderer((sonnerToast) => sonnerToast.dismiss(id));
};

function toast(options: ToastOptions) {
  let currentOptions = options;
  const id = showToast(options);

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (nextOptions: Partial<ToastOptions>) => {
      currentOptions = { ...currentOptions, ...nextOptions };
      return showToast(currentOptions, id);
    },
  };
}

const notify = {
  success: (message: ReactNode, options: NotifyOptions = {}) => showToast({ ...options, title: message }),
  error: (message: ReactNode, options: NotifyOptions = {}) => showToast({ ...options, title: message, variant: "destructive" }),
  warning: (message: ReactNode, options: NotifyOptions = {}) => showToast({ ...options, title: message }, undefined, "warning"),
  dismiss: dismissToast,
};

function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: dismissToast,
  };
}

export {
  NOTIFICATION_RENDERER_EVENT,
  markNotificationRendererReady,
  notify,
  subscribeNotificationRendererRequest,
  toast,
  useToast,
  wasNotificationRendererRequested,
};
