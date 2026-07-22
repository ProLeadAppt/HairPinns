import { beforeEach, describe, expect, it, vi } from "vitest";

const sonner = vi.hoisted(() => ({
  success: vi.fn(() => "success-toast"),
  error: vi.fn(() => "error-toast"),
  dismiss: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: sonner,
}));

import { toast, useToast } from "./use-toast";

describe("legacy toast compatibility adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("routes default notifications to Sonner success without changing the message", () => {
    toast({ title: "Success!", description: "Your guide is on its way." });

    expect(sonner.success).toHaveBeenCalledWith("Success!", {
      description: "Your guide is on its way.",
      duration: undefined,
      id: undefined,
    });
    expect(sonner.error).not.toHaveBeenCalled();
  });

  it("routes destructive notifications to Sonner error", () => {
    toast({
      title: "Submission Error",
      description: "Please try again.",
      variant: "destructive",
    });

    expect(sonner.error).toHaveBeenCalledWith("Submission Error", {
      description: "Please try again.",
      duration: undefined,
      id: undefined,
    });
    expect(sonner.success).not.toHaveBeenCalled();
  });

  it("keeps dismiss behavior and merges partial updates on the returned toast handle", () => {
    const handle = toast({
      title: "Could not submit",
      description: "Please wait",
      variant: "destructive",
      duration: 8_000,
    });

    handle.dismiss();
    handle.update({ description: "Please try again" });

    expect(sonner.dismiss).toHaveBeenCalledWith("error-toast");
    expect(sonner.error).toHaveBeenLastCalledWith("Could not submit", {
      description: "Please try again",
      duration: 8_000,
      id: "error-toast",
    });
  });

  it("keeps the useToast dismiss facade available to existing callers", () => {
    useToast().dismiss("toast-42");
    expect(sonner.dismiss).toHaveBeenCalledWith("toast-42");
  });
});
