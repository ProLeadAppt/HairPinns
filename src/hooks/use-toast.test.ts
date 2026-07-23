import { beforeEach, describe, expect, it, vi } from "vitest";

const sonner = vi.hoisted(() => ({
  success: vi.fn(() => "success-toast"),
  error: vi.fn(() => "error-toast"),
  warning: vi.fn(() => "warning-toast"),
  dismiss: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: sonner,
}));

let adapter: typeof import("./use-toast");

describe("legacy toast compatibility adapter", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    adapter = await import("./use-toast");
  });

  it("queues notification delivery until the renderer is ready and notifies App subscribers", async () => {
    const listener = vi.fn();
    const unsubscribe = adapter.subscribeNotificationRendererRequest(listener);

    const id = adapter.notify.success("Queued notification");

    expect(id).toMatch(/^hp-toast-\d+$/);
    expect(adapter.wasNotificationRendererRequested()).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    expect(sonner.success).not.toHaveBeenCalled();

    adapter.markNotificationRendererReady();
    await vi.waitFor(() => {
      expect(sonner.success).toHaveBeenCalledWith("Queued notification", {
        description: undefined,
        duration: undefined,
        id,
      });
    });
    unsubscribe();
  });

  it("returns a stable id immediately and routes default notifications without changing the message", async () => {
    adapter.markNotificationRendererReady();
    const handle = adapter.toast({ title: "Success!", description: "Your guide is on its way." });

    expect(handle.id).toMatch(/^hp-toast-\d+$/);
    await vi.waitFor(() => {
      expect(sonner.success).toHaveBeenCalledWith("Success!", {
        description: "Your guide is on its way.",
        duration: undefined,
        id: handle.id,
      });
    });
    expect(sonner.error).not.toHaveBeenCalled();
  });

  it("routes destructive notifications to Sonner error", async () => {
    adapter.markNotificationRendererReady();
    const handle = adapter.toast({
      title: "Submission Error",
      description: "Please try again.",
      variant: "destructive",
    });

    await vi.waitFor(() => {
      expect(sonner.error).toHaveBeenCalledWith("Submission Error", {
        description: "Please try again.",
        duration: undefined,
        id: handle.id,
      });
    });
    expect(sonner.success).not.toHaveBeenCalled();
  });

  it("preserves warning notifications and Sonner options", async () => {
    adapter.markNotificationRendererReady();
    const id = adapter.notify.warning("Using native cart fallback...", {
      description: "Redirecting",
      duration: 2_000,
    });

    await vi.waitFor(() => {
      expect(sonner.warning).toHaveBeenCalledWith("Using native cart fallback...", {
        description: "Redirecting",
        duration: 2_000,
        id,
      });
    });
  });

  it("keeps dismiss behavior and merges partial updates on the returned toast handle", async () => {
    adapter.markNotificationRendererReady();
    const handle = adapter.toast({
      title: "Could not submit",
      description: "Please wait",
      variant: "destructive",
      duration: 8_000,
    });

    handle.dismiss();
    handle.update({ description: "Please try again" });

    await vi.waitFor(() => {
      expect(sonner.dismiss).toHaveBeenCalledWith(handle.id);
      expect(sonner.error).toHaveBeenLastCalledWith("Could not submit", {
        description: "Please try again",
        duration: 8_000,
        id: handle.id,
      });
    });
  });

  it("keeps the useToast dismiss facade available to existing callers", async () => {
    adapter.markNotificationRendererReady();
    adapter.useToast().dismiss("toast-42");
    await vi.waitFor(() => expect(sonner.dismiss).toHaveBeenCalledWith("toast-42"));
  });
});
